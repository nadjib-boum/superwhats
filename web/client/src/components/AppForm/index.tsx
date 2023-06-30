import { useCallback, type FormEvent, useEffect } from "react";
import AuthStep from "./AuthStep";
import PhoneStep from "./PhoneStep";
import TemplateStep from "./TemplateStep";
import UploadMedia from "./UploadMedia";
import ConfigureStep from "./ConfigureStep";
import Progress from "./progress";
import { Button } from "../ui/button";
import useStore from "../../store";
import { useMultiStepForm } from "../../hooks/useMultiStepForm";
import usePost from "../../hooks/usePost";
import useEventSource from "../../hooks/useEventSource";

const AppForm: React.FC = () => {
  const {
    isFormStarted,
    completedSteps,
    appFormData: { phoneFile, templateFile, mediaFile, minDelay, maxDelay },
    setProgress,
  } = useStore();

  const { back, next, step, isFirstStep, isLastStep, currentStep } =
    useMultiStepForm([
      <PhoneStep />,
      <TemplateStep />,
      <UploadMedia />,
      <ConfigureStep />,
      <Progress />,
    ]);

  const { post, isSuccess } = usePost("/whatsapp/message/init");

  const {
    trigger,
    data: msgData,
    eventSteps,
  } = useEventSource("/whatsapp/message");

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("minDelay", `${minDelay}`);
      formData.append("maxDelay", `${maxDelay}`);
      formData.append("files", phoneFile);
      formData.append("files", templateFile);
      if (mediaFile) {
        formData.append("files", mediaFile);
      }
      post(formData);
      setProgress(0);
      next();
    },
    [phoneFile, templateFile, minDelay, maxDelay, currentStep]
  );

  useEffect(() => {
    if (isSuccess) {
      trigger();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (msgData.totalMessages) {
      const { currentMessage, totalMessages } = msgData;
      setProgress(Math.ceil(((currentMessage + 1) / totalMessages) * 100));
    }
  }, [eventSteps]);

  return (
    <div
      className="app-form w-[700px] max-w-[700px] rounded-md relative"
      style={{ backgroundColor: "#fff" }}
    >
      <form onSubmit={handleSubmit} className="h-[500px]">
        {isFormStarted && (
          <>
            <div>{step}</div>
            <div className="overflow-hidden px-14 py-6">
              {!isFirstStep && !isLastStep && (
                <Button
                  onClick={back}
                  variant={"outline"}
                  type="button"
                  className="float-left"
                >
                  Back
                </Button>
              )}
              {currentStep < 2 && (
                <Button
                  onClick={next}
                  type="button"
                  className={`float-right`}
                  disabled={!completedSteps.has(currentStep)}
                >
                  Next
                </Button>
              )}
              {currentStep == 2 && (
                <Button onClick={next} type="button" className={`float-right`}>
                  Next
                </Button>
              )}
              {!isLastStep && currentStep > 2 && (
                <Button type="submit" className="float-right">
                  Send
                </Button>
              )}
            </div>
          </>
        )}
      </form>
      {!isFormStarted && <AuthStep />}
    </div>
  );
};

export default AppForm;
