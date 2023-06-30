import { useState, useEffect } from "react";

const useFetch = (endpoint: string) => {
  const [data, setData] = useState<any>({});
  const [error, setError] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isAborted, setIsAborted] = useState<boolean>(false);

  useEffect(() => {
    const abortController = new AbortController();
    fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
      signal: abortController.signal,
    } as any)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            throw new Error(JSON.stringify(errorData));
          });
        }
        return res.json();
      })
      .then((data) => {
        setIsSuccess(true);
        setData(data);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          setIsAborted(true);
        } else {
          setIsError(true);
          setError(JSON.parse(/\{.*\}/.exec(err)?.toString()!));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      abortController.abort();
    };
  }, [endpoint]);
  return { data, error, isLoading, isSuccess, isError, isAborted };
};

export default useFetch;
