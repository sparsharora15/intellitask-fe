import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ArrowDownToLine } from "lucide-react";
import { Label } from "../ui/label";
// @ts-ignore
import ReactQuill from "react-quill";
import CustomSelect from "../common/CustomSelect";
import FileUploader from "../common/FileUploader";
import CustomDatePicker from "../common/DatePicker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Loader from "../common/Loader";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

interface InputField {
  id: string;
  label: string;
  defaultValue?: string;
  type?:
    | "text"
    | "select"
    | "creatable-select"
    | "file"
    | "date"
    | "radio"
    | "status"
    | "askAiButton"
    | null
    | string;
  placeholder?: string;
  isRichText?: boolean;
  isMulti?: boolean;
  options?: { value: string; label: string }[];
  radioOptions?: { value: string; label: string }[];
  isClearable?: boolean;
  isFileUploader?: boolean;
  isDatePicker?: boolean;
}

interface InputDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description?: string;
  inputFields: InputField[];
  formMethods: any;
  onSubmit?: (data: any) => void;
  submitLabel: string;
  loading?: boolean;
  popUpType?: "edit" | "add" | "view";
  hadleClose?: (ele: boolean) => void;
  askAiLoading?: boolean;
  askAiButtonClick?: () => void;
  removeAttachments?: (key: any) => void;
  getByIdLoading?: boolean;
}

const InputDialog: React.FC<InputDialogProps> = ({
  isOpen,
  hadleClose,
  title,
  inputFields,
  formMethods,
  onSubmit,
  submitLabel,
  loading,
  askAiLoading = false,
  popUpType = "add",
  getByIdLoading = true,
  askAiButtonClick = () => {},
  removeAttachments = () => {},
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    watch,
    formState: { errors },
  } = formMethods;

  const handleFilesChange = (newFiles: File[]) => {
    // console.log("Selected files:", newFiles);
    setValue("files", newFiles);
  };

  const [dragActive, setDragActive] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [serverFiles, setServerFiles] = useState<any[]>([]);

  const handleEditorChange = (content: string) => {
    setValue("description", content);
  };
  const handleDateChange = (newdate: Date | undefined) => {
    // console.log(newdate);
    setValue("dueDate", newdate);
  };
  useEffect(() => {
    if (!isOpen) {
      setFiles([]);
    }
  }, [isOpen]);
  const renderField = (field: InputField) => {
    switch (true) {
      case field.isRichText || field.type === "askAiButton":
        return (
          <div className="">
            {field.type !== "askAiButton" && (
              <Controller
                name={field.id}
                control={control}
                render={({ field: { onBlur, value, ref } }) => (
                  <div className="mb-8">
                    <ReactQuill
                      style={{
                        borderRadius: "calc(var(--radius) - 2px)",
                        width: "100%",
                      }}
                      theme="snow"
                      readOnly={popUpType === "view" ? true : false}
                      value={value}
                      onChange={handleEditorChange}
                      onBlur={onBlur}
                      ref={ref}
                      placeholder={field.placeholder || ""}
                      className="h-36 rounded-md mb-10"
                    />
                    {popUpType !== "view" && errors[field.id] && (
                      <p className="text-red-500 text-sm mt-1">
                        {typeof errors[field.id] === "string"
                          ? errors[field.id]
                          : (errors[field.id] as any)?.message}
                      </p>
                    )}
                  </div>
                )}
              />
            )}

            {field.type === "askAiButton" && popUpType !== "view" ? (
              <Controller
                name={field.id}
                control={control}
                render={({  }) => (
                  <Button
                    disabled={askAiLoading}
                    className="mt-[-18px] w-max flex gap-2"
                    onClick={() => askAiButtonClick()}
                  >
                    Ask Ai {askAiLoading && <Loader />}
                  </Button>
                )}
              />
            ) : (
              <></>
            )}
          </div>
        );
      case field.type === "select" || field.type === "creatable-select":
        return (
          <>
            <div>
              <Controller
                name={field.id}
                control={control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <CustomSelect
                    closeMenuOnSelect={true}
                    isMulti={field.isMulti}
                    options={field.options || []}
                    isClearable={field.isClearable}
                    isCreateable={field.type === "creatable-select"}
                    className="col-span-3"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    disable={popUpType === "view" ? true : false}
                    ref={ref}
                    placeholder={field.placeholder || ""}
                    borderColor="#e5e7eb"
                  />
                )}
              />
              {popUpType !== "view" && errors[field.id] && (
                <p className="text-red-500 text-sm mt-1">
                  {typeof errors[field.id] === "string"
                    ? errors[field.id]
                    : (errors[field.id] as any)?.message}
                </p>
              )}
              {field.label === "taskStatus" && (
                <p className="text-sm text-gray-500">
                  You can create your own status by typing in the box
                </p>
              )}
            </div>
          </>
        );
      case field.isFileUploader:
        return (
          <>
            <div>
              <FileUploader
                files={files}
                setFiles={setFiles}
                dragActive={dragActive}
                setDragActive={setDragActive}
                onFilesChange={handleFilesChange}
                accept=""
                disabled={popUpType === "view" ? true : false}
                multiple={true}
                dragActiveStyle="border-green-500"
                dragInactiveStyle="border-gray-200"
              />
              {popUpType !== "view" && errors[field.id] && (
                <p className="text-red-500 text-sm mt-1">
                  {typeof errors[field.id] === "string"
                    ? errors[field.id]
                    : (errors[field.id] as any)?.message}
                </p>
              )}
            </div>
          </>
        );
      case field.type === "date":
        return (
          <>
            <div>
              <Controller
                name={field.id}
                control={control}
                render={({ field: { value } }) => (
                  <CustomDatePicker
                    selectedDate={value}
                    onChange={handleDateChange}
                    disabled={popUpType === "view" ? true : false}
                  />
                )}
              />
              {popUpType !== "view" && errors[field.id] && (
                <p className="text-red-500 text-sm mt-1">
                  {typeof errors[field.id] === "string"
                    ? errors[field.id]
                    : (errors[field.id] as any)?.message}
                </p>
              )}
            </div>
          </>
        );
      case field.type === "radio":
        return (
          <>
            <div>
              <Controller
                name={field.id}
                control={control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <RadioGroup
                    value={value}
                    onValueChange={(value) => onChange(value)}
                    onBlur={onBlur}
                    className={`flex flex-row gap-2 `}
                    disabled={popUpType === "view" ? true : false}
                  >
                    {field.radioOptions?.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`r-${option.value}`}
                          ref={ref}
                        />
                        <Label htmlFor={`r-${option.value}`}>
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
              {popUpType !== "view" && errors[field.id] && (
                <p className="text-red-500 text-sm mt-1">
                  {typeof errors[field.id] === "string"
                    ? errors[field.id]
                    : (errors[field.id] as any)?.message}
                </p>
              )}
            </div>
          </>
        );
      case field.type === "askAiButton":
        return <></>;

      default:
        return (
          <>
            <div>
              <Controller
                name={field.id}
                control={control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    id={field.id}
                    type={field.type || "text"}
                    value={value || ""}
                    onChange={onChange}
                    onBlur={onBlur}
                    ref={ref}
                    placeholder={field.placeholder || ""}
                    className="col-span-3"
                    disabled={popUpType === "view" ? true : false}
                  />
                )}
              />
              {popUpType !== "view" && errors[field.id] && (
                <p className="text-red-500 text-sm mt-1">
                  {typeof errors[field.id] === "string"
                    ? errors[field.id]
                    : (errors[field.id] as any)?.message}
                </p>
              )}
            </div>
          </>
        );
    }
  };
  useEffect(() => {
    if (!getByIdLoading) {
      // console.log("data");
      setServerFiles(getValues("files") ?? []);
    }
  }, [getValues("files"), getByIdLoading]);
  useEffect(() => {
    const subscription = watch(() => {
      setServerFiles(getValues("files") ?? []);
    });
    return () => subscription.unsubscribe();
  }, [watch, errors]);

  useEffect(() => {
    trigger();
  }, [trigger]);
  return (
    <Dialog open={isOpen} onOpenChange={hadleClose}>
      <DialogContent
        className="sm:max-w-[50%] max-h-[90vh] overflow-y-scroll"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {popUpType === "add" || !getByIdLoading ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              {Array.isArray(inputFields) && inputFields.length > 0 ? (
                inputFields.map((field) => (
                  <div key={field.id} className="flex flex-col gap-4">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    {renderField(field)}
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>

            <div className="flex flex-wrap gap-2 ">
              {popUpType !== "add" &&
                !getByIdLoading &&
                serverFiles.map((file: any) => {
                  return (
                    <>
                      <Link
                        target="_blank"
                        to={file.url}
                        className="flex flex-col gap-1 max-w-[4rem] max-h-[4rem]"
                      >
                        <div className="relative w-[3rem] h-[3rem] border bg-slate-50 flex justify-center items-center rounded-md cursor-pointer">
                          <ArrowDownToLine />
                          <X
                            className={`top-[-12px] right-[-10px] w-[18px] absolute ${popUpType === "view" ? "cursor-not-allowed":"cursor-pointer"}`}
                            onClick={() => {
                              if (popUpType !== "view") removeAttachments(file);
                            }}
                          />
                        </div>
                        <p className="text-[10px] truncate">
                          {file.fileName ?? ""}
                        </p>
                      </Link>
                    </>
                  );
                })}
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  (popUpType === "add" && Object.keys(errors).length > 0) ||
                  loading
                }
              >
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <>
            <div className="flex items-center justify-center  h-[90vh]">
              <Loader color="black" />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InputDialog;
