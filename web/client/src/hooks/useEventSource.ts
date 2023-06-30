import { useCallback, useState } from "react";

function useEventSource(endpoint: string) {
  const [data, setData] = useState<any>({});
  const [error, setError] = useState<any>({});
  const [eventSteps, setEventSteps] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const trigger = useCallback(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}${endpoint}`
    );

    eventSource.addEventListener("open", () => {
      setIsOpen(true);
    });

    eventSource.addEventListener("error", (error: any) => {
      setError(error);
      setIsError(true);
    });

    eventSource.addEventListener("message", (event) => {
      if (event.data.trim() == "SSE_END") {
        eventSource.close();
        setIsClosed(true);
        return;
      }
      if (!isMessaging) {
        setIsMessaging(true);
      }
      setEventSteps((steps) => steps + 1);
      setData(JSON.parse(event.data));
    });

    return () => {
      eventSource.close();
      setIsClosed(true);
    };
  }, [endpoint]);

  return {
    trigger,
    data,
    error,
    isOpen,
    isMessaging,
    isError,
    isClosed,
    eventSteps,
  };
}

export default useEventSource;
