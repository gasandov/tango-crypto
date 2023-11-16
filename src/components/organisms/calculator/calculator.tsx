import Dropdown from "components/atoms/dropdown";
import Input from "components/atoms/input";
import { useEffect, useState, type ChangeEvent } from "react";
import API from "services/api/instance";

const Calculator = () => {
  const [apiError, setAPIError] = useState("");
  const [tickersMap, setTickersMap] = useState({});
  const [values, setValues] = useState({ fsym: 0, tsyms: 0 });
  const [symbols, setSymbols] = useState({
    fsym: "",
    tsyms: "",
  });

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
        tsyms: response[symbols.tsyms],
      }));
    }

    if (!symbols.fsym || !symbols.tsyms) return;
    if (symbols.fsym === symbols.tsyms) return;
    if (values.fsym === 0) return;

    getPrice();
  }, [symbols.fsym, symbols.tsyms, values.fsym]);

  return (
    <div className="w-full min-w-min max-w-sm h-72 rounded-xl border border-zinc-500 shadow-md bg-neutral-100">
      <div className="flex flex-col h-full justify-center gap-y-4 items-center">
        <div className="flex gap-x-2">
          <Input
            name="fsym"
            min={0}
            onChange={handleInputChange}
            type="number"
            value={values.fsym}
          />
          <Dropdown
            name="fsym"
            onChange={handleSelectChange}
            options={Object.values(tickersMap)}
            value={symbols.fsym}
          />
        </div>
        <div className="flex gap-x-2">
          <Input name="tsyms" readOnly type="number" value={values.tsyms} />
          <Dropdown
            name="tsyms"
            onChange={handleSelectChange}
            options={Object.values(tickersMap)}
            value={symbols.tsyms}
          />
        </div>
        {!!apiError && <p className="text-red-500">{apiError}</p>}
      </div>
    </div>
  );
};

export default Calculator;
