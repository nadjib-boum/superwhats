import { useState, type ChangeEvent, useEffect } from "react";
import UploadIcon from "../UploadIcon";
import { getFileExtension } from "../../helpers/string";
import useStore from "../../store";
type InputErrors = {
  extensionError?: boolean;
};

const TemplateStep: React.FC = () => {
  const { templateFileName, currentStep, completedSteps } = useStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputErrors, setInputErrors] = useState<InputErrors>({});
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputErrors({});
    const file = event.target.files![0];
    const fileExtension = getFileExtension(file.name);
    if (fileExtension !== "txt") {
      setInputErrors({ ...inputErrors, extensionError: true });
      return;
    }

    setSelectedFile(file);
    useStore.setState((state) => ({
      ...state,
      templateFileName: selectedFile?.name,
      isNextStepAvailable: true,
      appFormData: {
        ...state.appFormData,
        templateFile: file,
      },
    }));
    completedSteps.add(currentStep);
  };

  useEffect(() => {
    if (selectedFile) {
      useStore.setState((state) => ({
        ...state,
        templateFileName: selectedFile?.name,
      }));
    }
  }, [selectedFile]);

  return (
    <div>
      <span className="text-xl block text-center pt-8">
        Upload Template (.txt)
      </span>
      <div className="flex justify-center items-center h-[350px]">
        <label
          htmlFor="phoneFile"
          className="flex flex-col items-center gap-1 cursor-pointer"
        >
          <span className="d rounded-full border-2 border-gray-700 p-4 hover:bg-gray-200">
            <UploadIcon />
          </span>
          {templateFileName ? (
            <span className="py-1">{templateFileName}</span>
          ) : (
            <span className="py-1">{selectedFile?.name}</span>
          )}
          {inputErrors.extensionError && (
            <span className="text-red-600">File extension must be .txt</span>
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

export default TemplateStep;
