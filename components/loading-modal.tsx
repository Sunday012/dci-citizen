import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LoadingDialogProps {
  isOpen?: boolean;
  title?: string;
  className?: string;
}

export const LoadingDialog: React.FC<LoadingDialogProps> = ({
  isOpen = false,
  title = "Processing",
  className,
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        className={cn("max-w-[250px] bg-white rounded-[10px]", className)}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="flex flex-col items-center justify-center">
          <Image src="/images/loader.gif" alt="loader" width={58} height={58} />
          <div className="mt-4 text-lg text-center font-medium w-full text-dci-dark">
            {title}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
