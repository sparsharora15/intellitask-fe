import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import Loader from "./Loader";

interface ConfirmPopupProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
  cancelLabel: string;
  actionLabel: string;
  loading: boolean;
  onAction: () => void;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  isOpen,
  setIsOpen,
  title,
  description,
  cancelLabel,
  actionLabel,
  onAction,
  loading,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <Button
            className="gap-2 flex"
            disabled={loading}
            variant={"default"}
            onClick={onAction}
          >
            {actionLabel} {loading && <Loader />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmPopup;
