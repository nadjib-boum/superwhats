// @ts-nocheck
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import ProgressCircle from "../progressCircle";
import { PauseCircle, PlayCircle } from "lucide-react";
import useStore from "../../store";
import usePost from "../../hooks/usePost";

type ControlProps = {
  isProgressFinish: boolean;
};

const Control: React.FC<ControlProps> = ({ isProgressFinish }) => {
  const size = 34;
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const { post: pause, isSuccess: isPauseSuccess } = usePost(
    "/whatsapp/message/pause"
  );
  const { post: play, isSuccess: isPlaySuccess } = usePost(
    "/whatsapp/message/play"
  );
  useEffect(() => {
    setIsPaused(true);
  }, [isPauseSuccess]);
  useEffect(() => {
    setIsPaused(false);
  }, [isPlaySuccess]);
  if (isProgressFinish) {
    return <PlayCircle size={size} className="cursor-pointer" />;
  }
  return (
    <div>
      {isPaused ? (
        <PlayCircle size={size} className="cursor-pointer" onClick={play} />
      ) : (
        <PauseCircle size={size} className="cursor-pointer" onClick={pause} />
      )}
    </div>
  );
};

const Progress: React.FC = () => {
  const { progress, setCurrentStep, setProgress } = useStore();
  const { post: cancel, isSuccess: isCancelSuccess } = usePost(
    "/whatsapp/message/cancel"
  );
  const cancelSending = () => {
    cancel();
  };

  const resetApp = () => {
    setCurrentStep(0);
    setProgress(0);
    useStore.setState((state) => ({
      ...state,
      completedSteps: new Set(),
      phoneListFileName: "",
      templateFileName: "",
      appFormData: {
        phoneFile: "",
        templateFile: "",
        minDelay: 1,
        maxDelay: 2,
      },
    }));
  };

  useEffect(() => {
    if (isCancelSuccess) {
      resetApp();
    }
  }, [isCancelSuccess]);
  return (
    <div>
      <span className="text-xl block text-center pt-8">Messaging Progress</span>
      <div className="flex flex-col justify-center items-center h-[350px] gap-7">
        <ProgressCircle
          progress={progress}
          trackWidth={5}
          indicatorWidth={10}
        />
        <Control isProgressFinish={progress === 100} />
        {progress < 100 && (
          <Button
            type="button"
            size={"sm"}
            className="block mx-auto"
            onClick={cancelSending}
          >
            cancel
          </Button>
        )}
        {progress === 100 && (
          <Button
            type="button"
            size={"sm"}
            className="block mx-auto"
            onClick={resetApp}
          >
            reset
          </Button>
        )}
      </div>
    </div>
  );
};

export default Progress;
