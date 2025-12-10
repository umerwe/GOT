"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  redirectPath?: string
}

export default function LoginDialog({
  open,
  onOpenChange,
  title = "Login Required",
  description = "You must be logged in to perform this action.",
  redirectPath = "/auth/login",
}: LoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Link href={redirectPath}>
            <Button variant="default">Login</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}