import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

import { FC } from "react";
import { Icons } from "./icons";

interface SuccessDialogProps {
  isOpen?: boolean;
  title?: string;
  icon?: string;
  className?: string;
}

export const SuccessDialog: FC<SuccessDialogProps> = ({ 
    isOpen = false, 
    title = "Success",
    className 
  }) => {
    
    return (
      <Dialog open={isOpen}>
        <DialogContent className={cn("max-w-[250px] bg-white rounded-[10px]", className)}>
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <div className="flex flex-col items-center justify-center p-6">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Icons.check className="h-[58px] w-[58px] text-green-600" />
            </div>
            <div className="text-lg font-semibold">{title}</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };