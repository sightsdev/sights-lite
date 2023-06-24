// useApi.js
import { useEffect, useState } from "react";
import { CancelablePromise } from "./api";

const useApi = <T>(call: CancelablePromise<T>) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);

  const fetchApi = () => {
    call
      .then((response) => {
        return response;
      })
      .then((json) => {
        console.log(json);
        setLoading(false);
        setData(json);
      });
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return { loading, data };
};

export default useApi;