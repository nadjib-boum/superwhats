import { type ChangeEvent, useState, useEffect } from "react";
import UploadIcon from "../UploadIcon";
import useStore from "../../store";
import { getFileExtension } from "../../helpers/string";
type InputErrors = {
  extensionError?: boolean;
};

const UploadMedia: React.FC = () => {
  const { mediaName, currentStep, completedSteps } = useStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputErrors, setInputErrors] = useState<InputErrors>({});

  useEffect(() => {
    completedSteps.add(currentStep);
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputErrors({});
    const file = event.target.files![0];
    const fileExtension = getFileExtension(file.name);
    if (!["png", "jpg", "jpeg", "gif", "svg"].includes(fileExtension)) {
      setInputErrors({ ...inputErrors, extensionError: true });
      return;
    }

    setSelectedFile(file);
    useStore.setState((state) => ({
      ...state,
      mediaName: selectedFile?.name,
      appFormData: {
        ...state.appFormData,
        mediaFile: file,
      },
    }));
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
      <span className="text-xl block text-center pt-8">Upload Image</span>
      <div className="flex justify-center items-center h-[350px]">
        <label
          htmlFor="phoneFile"
          className="flex flex-col items-center gap-1 cursor-pointer"
        >
          <span className="d rounded-full border-2 border-gray-700 p-4 hover:bg-gray-200">
            <UploadIcon />
          </span>
          {mediaName ? (
            <span className="py-1">{mediaName}</span>
          ) : (
            <span className="py-1">{selectedFile?.name}</span>
          )}
          {inputErrors.extensionError && (
            <span className="text-red-600">Invalid Image Extenstion</span>
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

export default UploadMedia;
