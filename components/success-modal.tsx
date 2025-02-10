import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { FC } from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";

interface SuccessDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  icon?: string;
  className?: string;
}

export const SuccessDialog: FC<SuccessDialogProps> = ({ 
    isOpen = false, 
    onClose,
    title = "Success",
    className 
  }) => {
    
    return (
      <Dialog open={isOpen}>
        <DialogContent className={cn("max-w-[300px] bg-white rounded-[10px]", className)}>
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <div className="flex flex-col items-center justify-center p-2">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Icons.check className="h-[58px] w-[58px] text-green-600" />
            </div>
            <div className="text-lg font-medium text-center">{title}</div>
          </div>
          <Button 
            onClick={onClose} 
            className="px-4 py-2 bg-dci-blue text-white rounded-[40px]"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  };