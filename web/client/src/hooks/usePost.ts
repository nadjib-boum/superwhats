import { useState, useCallback } from "react";

const usePost = (endpoint: string) => {
  const [data, setData] = useState({});
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const post = useCallback(
    (body?: FormData) => {
      setData({});
      setError({});
      setIsLoading(false);
      setIsSuccess(false);
      setIsError(false);
      fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        method: "POST",
        body,
      })
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        })
        .then((data) => {
          setIsSuccess(true);
          setData(data);
        })
        .catch((err) => {
          setIsError(true);
          setError(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [endpoint]
  );
  return { post, data, error, isLoading, isSuccess, isError };
};

export default usePost;
