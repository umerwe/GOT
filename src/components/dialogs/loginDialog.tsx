"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  variant?: "login" | "confirm"
  redirectPath?: string
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title = "Login Required",
  description = "Please login to continue",
  confirmText = "Login",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "confirm",
  redirectPath,
}: ConfirmDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm?.();
    if (variant !== "login") {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" className="rounded-none w-20" onClick={handleCancel}>
            {cancelText}
          </Button>
          {variant === "login" && redirectPath ? (
            <Link href={redirectPath}>
              <Button variant="default" className="text-white rounded-none w-20">{confirmText}</Button>
            </Link>
          ) : (
            <Button variant="default" className="text-white rounded-none w-20" onClick={handleConfirm}>
              {confirmText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}