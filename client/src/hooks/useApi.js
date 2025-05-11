import { useState, useCallback } from "react";
import api from "../services/api";

const useApi = (endpoint, method = "GET") => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(
    async (params = {}, customHeaders = {}) => {
      try {
        setLoading(true);
        setError(null);

        let response;
        const config = {
          headers: customHeaders,
        };

        switch (method.toUpperCase()) {
          case "GET":
            response = await api.get(endpoint, { params, ...config });
            break;
          case "POST":
            response = await api.post(endpoint, params, config);
            break;
          case "PUT":
            response = await api.put(endpoint, params, config);
            break;
          case "DELETE":
            response = await api.delete(endpoint, { data: params, ...config });
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        setData(response.data);
        setLoading(false);
        return response.data;
      } catch (err) {
        setError(err.response?.data || { message: err.message });
        setLoading(false);
        throw err;
      }
    },
    [endpoint, method]
  );

  return {
    data,
    loading,
    error,
    callApi,
  };
};

export default useApi;
