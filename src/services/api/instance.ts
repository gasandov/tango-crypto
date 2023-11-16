interface Props {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  data?: any;
}

const API = ({ data, method, url }: Props) =>
  fetch(`${import.meta.env.VITE_API_BASE_URL}/${url}`, {
    method,
    headers: {
      Authorization: `Apikey ${import.meta.env.VITE_API_KEY}`,
      "Content-Type": "application/json",
    },
    ...(method !== "GET" && { body: JSON.stringify(data) }),
  });

export default API;
