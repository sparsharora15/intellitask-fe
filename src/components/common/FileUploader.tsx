import { CloudUpload } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface FileUploaderProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  dragActive: boolean;
  setDragActive: React.Dispatch<React.SetStateAction<boolean>>;
  accept?: string;
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
  dragActiveStyle?: string;
  dragInactiveStyle?: string;
  disabled : boolean
}

const FileUploader: React.FC<FileUploaderProps> = ({
  files,
  setFiles,
  dragActive,
  setDragActive,
  accept = "",
  multiple = true,
  disabled = false,
  onFilesChange,
  dragActiveStyle = "border-blue-500",
  dragInactiveStyle = "border-gray-200",
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      onFilesChange?.([...files, ...newFiles]);
    }
  };

  const handleClick = (): void => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      onFilesChange?.([...files, ...newFiles]);
    }
  };

  const handleRemove = (index: number): void => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };
  return (
    <div>
      <div
        className={`h-[15vh] border-2 border-dashed ${
          dragActive ? dragActiveStyle : dragInactiveStyle
        } rounded-lg justify-center flex gap-2 p-6 items-center cursor-pointer`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <CloudUpload className="text-[#9CA3AF] w-8" />
        <span className="text-sm font-medium text-gray-500">Drag File</span>
        <Input
          type="file"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
        />
      </div>
      {files.length > 0 && (
        <div className="mt-4 text-sm space-y-2">
          <Label className="text-sm font-medium">Selected Files:</Label>
          <ul className=" flex gap-2 flex-col">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex gap-2 justify-between items-center"
              >
                <p>{file.name}</p>
                <Button
                  type="button"
                  className="border px-2 py-1"
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
