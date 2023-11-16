import { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Chart = () => {
  const ws = useRef<WebSocket | null>(null);
  const [tickerData, setTickerData] = useState({ btc: [], eth: [] });

  useEffect(() => {
    ws.current = new WebSocket(
      `${import.meta.env.VITE_API_BASE_WEBSOCKET_URL}?api_key=${
        import.meta.env.VITE_API_KEY
      }`
    );

    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({
          action: "SubAdd",
          subs: ["5~CCCAGG~BTC~USD", "5~CCCAGG~ETH~USD"],
        })
      );
    };

    ws.current.onclose = () => {
      socket?.send(
        JSON.stringify({
          action: "SubRemove",
          subs: ["5~CCCAGG~BTC~USD", "5~CCCAGG~ETH~USD"],
        })
      );
    };

    ws.current.onmessage = (e) => {
      console.log("e: ", e);
      const data = JSON.parse(e.data);

      if (data.TYPE !== "5") return;

      const price = +data.PRICE.toFixed(2);
      const coin: "btc" | "eth" = data.FROMSYMBOL.toLowerCase();
      const [now] = new Date().toLocaleTimeString().split(" ");

      setTickerData((prev) => ({
        ...prev,
        [coin]: [
          ...prev[coin],
          {
            name: now.replace(/\:/g, ""),
            price,
          },
        ],
      }));
    };

    const socket = ws.current;

    return () => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket?.send(
          JSON.stringify({
            action: "SubRemove",
            subs: ["5~CCCAGG~BTC~USD", "5~CCCAGG~ETH~USD"],
          })
        );
        socket?.close();
      }
    };
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%" className="text-white">
      <LineChart
        width={600}
        height={300}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis type="number" dataKey="name" domain={["auto", "auto"]} />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          data={tickerData.btc}
          dataKey="price"
          name="BTC"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          data={tickerData.eth}
          dataKey="price"
          name="ETH"
          stroke="#82ca9d"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
