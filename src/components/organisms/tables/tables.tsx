import Table from "components/atoms/table";
import { useEffect, useRef, useState } from "react";
import API from "services/api/instance";

type TickerData = {
  date: string;
  USD: number;
  EUR: number;
  BTC?: number;
};

type HistoricalData = {
  btc: TickerData[];
  eth: TickerData[];
};

const Tables = () => {
  const [_, setAPIError] = useState("");
  const getter = useRef<NodeJS.Timeout | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData>({
    btc: [],
    eth: [],
  });

  useEffect(() => {
    async function getCryptoData() {
      const response = await (
        await API({
          method: "GET",
          url: "pricemulti?fsyms=BTC,ETH&tsyms=USD,EUR,BTC",
        })
      ).json();

      if (response.Response === "Error") {
        setAPIError(response.Message);
        return;
      }

      setHistoricalData((prev) => ({
        btc: [
          ...prev.btc,
          {
            date: new Date().toUTCString(),
            USD: response.BTC.USD,
            EUR: response.BTC.EUR,
          },
        ],
        eth: [
          ...prev.eth,
          {
            date: new Date().toUTCString(),
            USD: response.ETH.USD,
            EUR: response.ETH.EUR,
            BTC: response.ETH.BTC,
          },
        ],
      }));
    }

    getter.current = setInterval(() => {
      getCryptoData();
    }, 10000);

    return () => {
      clearInterval(getter.current as NodeJS.Timeout);
    };
  }, []);

  return (
    <div className="my-6 px-4 m-auto flex justify-center flex-col gap-y-6 lg:flex-row lg:gap-x-4 lg:max-h-96 lg:overflow-auto">
      <Table
        className="text-white table-auto w-full"
        name="BTC"
        headers={["Time", "USD", "EUR"]}
        content={historicalData.btc as any}
      />
      <Table
        className="text-white table-auto w-full"
        name="ETH"
        headers={["Time", "USD", "EUR", "BTC"]}
        content={historicalData.eth as any}
      />
    </div>
  );
};

export default Tables;
