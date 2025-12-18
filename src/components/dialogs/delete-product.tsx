"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface DeleteProductDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

export function DeleteProductDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  isPending,
}: DeleteProductDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          This action cannot be undone. This will permanently delete your advertisement.
        </p>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button
            variant="outline"
            className="sm:flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="sm:flex-1"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}