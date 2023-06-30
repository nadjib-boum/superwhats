import { useState } from "react";

export const useFileReader = () => {
  const [fileContent, setFileContent] = useState<string>("");

  const readFile = (file: File): void => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result;
      setFileContent(content as string);
    };

    reader.readAsText(file);
  };

  return [fileContent, readFile] as const;
};
