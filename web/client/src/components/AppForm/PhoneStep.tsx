import { useEffect, useState, type ChangeEvent, useCallback } from "react";
import UploadIcon from "../UploadIcon";
import { getFileExtension } from "../../helpers/string";
import useStore from "../../store";

type InputErrors = {
  extensionError?: boolean;
};

const PhoneStep: React.FC = () => {
  const { phoneListFileName, currentStep, completedSteps } = useStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputErrors, setInputErrors] = useState<InputErrors>({});
  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputErrors({});
      const file = event.target.files![0];
      const fileExtension = getFileExtension(file.name);
      if (fileExtension !== "csv") {
        setInputErrors({ ...inputErrors, extensionError: true });
        return;
      }
      setSelectedFile(file);
      useStore.setState((state) => ({
        ...state,
        phoneListFileName: selectedFile?.name,
        isNextStepAvailable: true,
        appFormData: {
          ...state.appFormData,
          phoneFile: file,
        },
      }));
      completedSteps.add(currentStep);
    },
    []
  );

  useEffect(() => {
    if (selectedFile) {
      useStore.setState((state) => ({
        ...state,
        phoneListFileName: selectedFile?.name,
      }));
    }
  }, [selectedFile]);

  return (
    <div>
      <span className="text-xl block text-center pt-8">
        Upload Phone List (.csv)
      </span>
      <div className="flex justify-center items-center h-[350px]">
        <label
          htmlFor="phoneFile"
          className="flex flex-col items-center gap-1 cursor-pointer"
        >
          <span className="d rounded-full border-2 border-gray-700 p-4 hover:bg-gray-200">
            <UploadIcon />
          </span>
          {phoneListFileName ? (
            <span className="py-1">{phoneListFileName}</span>
          ) : (
            <span className="py-1">{selectedFile?.name}</span>
          )}
          {inputErrors.extensionError && (
            <span className="text-red-600">File extension must be .csv</span>
          )}
        </label>
        <input
          type="file"
          name="phoneFile"
          id="phoneFile"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default PhoneStep;
