import InputGroups from "components/molecules/input-groups";
import { useEffect, useState, type ChangeEvent } from "react";
import API from "services/api/instance";
import { useDebounce } from "use-debounce";

const Calculator = () => {
  const [apiError, setAPIError] = useState("");
  const [tickersMap, setTickersMap] = useState({});
  const [values, setValues] = useState({ fsym: 0, tsyms: 0 });
  const [symbols, setSymbols] = useState({
    fsym: "",
    tsyms: "",
  });

  const [debouncedPrice] = useDebounce(values.fsym, 1000);

  function handleSelectChange(e: ChangeEvent<HTMLSelectElement>) {
    setSymbols((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    async function getTickers() {
      const response = await (
        await API({
          method: "GET",
          url: "blockchain/list",
        })
      ).json();

      if (response?.Response === "Error") {
        setAPIError(response.Message);
        return;
      }

      setTickersMap({
        USD: { id: 1, symbol: "USD", partner_symbol: "USD" },
        EUR: { id: 2, symbol: "EUR", partner_symbol: "EUR" },
        ...response.Data,
      });
    }

    getTickers();
  }, []);

  useEffect(() => {
    async function getPrice() {
      const response = await (
        await API({
          method: "GET",
          url: `price?fsym=${symbols.fsym}&tsyms=${symbols.tsyms}`,
        })
      ).json();

      if (response?.Response === "Error") {
        setAPIError(response.Message);
        return;
      }

      setAPIError("");

      setValues((prev) => ({
        ...prev,
        tsyms: response[symbols.tsyms] * debouncedPrice,
      }));
    }

    if (!symbols.fsym || !symbols.tsyms) return;
    if (symbols.fsym === symbols.tsyms) return;
    if (debouncedPrice === 0) return;

    getPrice();
  }, [symbols.fsym, symbols.tsyms, debouncedPrice]);

  return (
    <div className="w-full lg:max-w-sm h-72 rounded-xl border border-slate-700 shadow-md">
      <div className="flex flex-col h-full justify-center gap-y-4 items-center">
        <div className="flex gap-x-2">
          <InputGroups
            input={{
              className:
                "block w-full rounded-md border-0 py-1.5 pl-7 pr-24 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
              id: "fsym",
              name: "fsym",
              min: 0,
              onChange: handleInputChange,
              placeholder: "0.00",
              type: "number",
              value: values.fsym,
            }}
            isCurrency
            label="Price"
            select={{
              className:
                "h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm",
              id: "fsym",
              name: "fsym",
              onChange: handleSelectChange,
              options: Object.values(tickersMap),
              value: symbols.fsym,
            }}
          />
        </div>
        <div className="flex gap-x-2">
          <InputGroups
            input={{
              className:
                "block w-full rounded-md border-0 py-1.5 pl-7 pr-24 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
              id: "tsyms",
              name: "tsyms",
              readOnly: true,
              value: values.tsyms,
            }}
            isCurrency
            label="Conversion"
            select={{
              className:
                "h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm",
              id: "tsyms",
              name: "tsyms",
              onChange: handleSelectChange,
              options: Object.values(tickersMap),
              value: symbols.tsyms,
            }}
          />
        </div>
        {!!apiError && <p className="text-red-500 text-center">{apiError}</p>}
      </div>
    </div>
  );
};

export default Calculator;
