import { CheckIcon, ChecksIcon, XIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

export const successToast = (message: string, doubleCheck = false) => {
  toast.success(message, {
    icon: doubleCheck ? (
      <ChecksIcon weight="bold" className="size-full" />
    ) : (
      <CheckIcon weight="bold" className="size-full" />
    ),
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    icon: <XIcon weight="bold" className="size-full" />,
  });
};
