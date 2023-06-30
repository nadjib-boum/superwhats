import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import Spinner from "../spinner";

import SuccessAnimation from "../SuccessAnimation";
import useStore from "../../store";
import { Button } from "../ui/button";
import useFetch from "../../hooks/useFetch";
import useEventSource from "../../hooks/useEventSource";

const AuthStep: React.FC = () => {
  const { isAuthDone, setIsAuthDone, setIsFormStarted } = useStore();
  const [QR, setQR] = useState<string>("");
  const [connectionError, setConnectionError] = useState<boolean>(false);
  const {
    isSuccess: isInitSuccess,
    isError: isInitError,
    error: initError,
  } = useFetch("/whatsapp/init");
  const {
    trigger,
    data: authData,
    isMessaging,
    isError: isAuthError,
  } = useEventSource("/whatsapp/auth");

  // is init done
  useEffect(() => {
    if (isInitSuccess) {
      trigger();
    }
  }, [isInitSuccess]);

  // is auth start
  useEffect(() => {
    if (authData.msg == "QR_GENERATED") {
      setQR(authData.qr);
    }
    if (authData.msg == "AUTH_SUCCEED") {
      setIsAuthDone(true);
      setQR("{}");
    }
  }, [isMessaging, authData.msg]);

  useEffect(() => {
    if (isInitError) {
      if (initError.msg === "APP_ALREADY_INITIALIZED") {
        setIsFormStarted(true);
      } else {
        setConnectionError(true);
      }
    }
  }, [isInitError]);

  return (
    <>
      <div className="absolute z-10 left-0 top-0 h-full w-full flex flex-col justify-center items-center gap-5 bg-white">
        {!QR && !isInitError && <Spinner />}
        {isAuthError && (
          <span className="text-lg text-gray-950">authentication failed</span>
        )}
        {connectionError && (
          <span className="text-lg text-gray-950">connection failed</span>
        )}
        {!isInitError && !isAuthError && !isAuthDone && QR && (
          <>
            <h1 className="text-center text-xl">Scan QR To Authentciate</h1>
            <QRCode value={QR} />
          </>
        )}
        {!isInitError && !isAuthError && isAuthDone && (
          <>
            <SuccessAnimation />
            <span className="text-2xl login-success__span">
              Login Successfull
            </span>
            <Button
              className="mt-8"
              onClick={() =>
                useStore.setState((state) => ({
                  ...state,
                  isFormStarted: true,
                }))
              }
            >
              Start
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default AuthStep;
