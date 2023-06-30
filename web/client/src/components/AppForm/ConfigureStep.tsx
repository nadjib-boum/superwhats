import { ChangeEvent, useCallback, useEffect } from "react";
import useStore from "../../store";
import { Input } from "../ui/input";

const ConfigureStep: React.FC = () => {
  const {
    appFormData: { minDelay, maxDelay },
  } = useStore();
  const setMinTime = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (+e.target.value < 1) return;
      useStore.setState((state) => ({
        ...state,
        appFormData: {
          ...state.appFormData,
          minDelay: +e.target.value,
        },
      }));
    },
    [minDelay]
  );
  const setMaxTime = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      useStore.setState((state) => ({
        ...state,
        appFormData: {
          ...state.appFormData,
          maxDelay: +e.target.value,
        },
      }));
    },
    [maxDelay]
  );

  return (
    <div>
      <span className="text-xl block text-center pt-8">Configure Sending</span>
      <div className="flex flex-col justify-center items-center h-[350px] gap-5">
        <div className="">
          <label className="text-sm block mb-2">Min Delay Time (Seconds)</label>
          <Input type="number" min={1} value={minDelay} onChange={setMinTime} />
        </div>
        <div className="">
          <label className="text-sm block mb-2">Max Delay Time (Seconds)</label>
          <Input type="number" value={maxDelay} onChange={setMaxTime} />
        </div>
      </div>
    </div>
  );
};

export default ConfigureStep;
//
