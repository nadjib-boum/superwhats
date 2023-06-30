import { memo } from "react";
import { Upload } from "lucide-react";
const UploadIcon = memo(() => {
  return <Upload size={42} strokeWidth={2} />;
});

export default UploadIcon;
