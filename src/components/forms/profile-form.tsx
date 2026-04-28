"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "@/components/custom/MyImage"
import { useGetProfile, useUpdateProfile } from "@/hooks/useProfile"
import { useChangePassword } from "@/hooks/useAuth"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { capitalizeWords } from "@/utils/capitalizeWords"
import AuthGuard from "@/common/auth-guard"
import SkeletonLoader from "@/common/skeleton-loader"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"

interface ProfileForm {
    name: string
    email: string
    phone: string
    address: string
}

interface ChangePasswordForm {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

export default function ProfilePage() {
    const { data, isLoading } = useGetProfile()
    const updateProfile = useUpdateProfile()
    const changePassword = useChangePassword()

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isAddressOpen, setIsAddressOpen] = useState(false)
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { register, handleSubmit, reset } = useForm<ProfileForm>({
        defaultValues: {
            name: data?.name || "",
            email: data?.email || "",
            phone: data?.phoneNumber || "",
            address: data?.address || "",
        },
    })

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPassword,
        watch,
        formState: { errors: passwordErrors },
    } = useForm<ChangePasswordForm>()

    const newPassword = watch("newPassword")

    const onSubmit = async (values: ProfileForm) => {
        const formData = new FormData()
        formData.append("name", values.name)
        formData.append("email", values.email)
        formData.append("phone", values.phone)
        formData.append("address", values.address) // Sending address as text

        if (selectedFile) {
            formData.append("profile_image", selectedFile)
        }
        updateProfile.mutate(formData, {
            onSuccess: () => {
                setIsEditOpen(false)
                setIsAddressOpen(false)
                setSelectedFile(null)
                reset(values)
            },
        })
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const formData = new FormData()
            formData.append("name", data?.name || "")
            formData.append("email", data?.email || "")
            formData.append("phone", data?.phoneNumber || "")
            formData.append("address", data?.address || "")
            formData.append("profile_image", file)
            updateProfile.mutate(formData)
        }
    }

    const openEditDialog = () => {
        reset({
            name: data?.name || "",
            email: data?.email || "",
            phone: data?.phoneNumber || "",
            address: data?.address || "",
        })
        setSelectedFile(null)
        setIsEditOpen(true)
    }

    const openAddressDialog = () => {
        reset({
            name: data?.name || "",
            email: data?.email || "",
            phone: data?.phoneNumber || "",
            address: data?.address || "",
        })
        setIsAddressOpen(true)
    }

    const openChangePasswordDialog = () => {
        resetPassword()
        setIsChangePasswordOpen(true)
    }

    const onPasswordSubmit = async (values: ChangePasswordForm) => {
        changePassword.mutate(
            { oldPassword: values.oldPassword, newPassword: values.newPassword },
            {
                onSuccess: () => {
                    setIsChangePasswordOpen(false)
                },
            }
        )
    }

    return (
        <AuthGuard>
            <div>
                <h2 className="text-[20px] mb-[18px] h-[40px] py-[7px] leading-[26px]">Dashboard</h2>

                <div className="bg-white p-[18px] sm:p-[30px] pb-[116px]">
                    <div className="">
                        <div className="flex flex-col space-y-6">
                            {isLoading ? (
                                <SkeletonLoader type="profile" />
                            ) : (
                                <>
                                    <div className="flex flex-col items-start space-y-4">
                                        <h3 className="text-sm text-[#000000] capitalize tracking-tight">Profile Image</h3>
                                        <div className="space-y-3">
                                            <div className="w-[48px] h-[48px] rounded-full overflow-hidden border-2 border-white shadow-sm">
                                                <Image
                                                    src={data?.profile_image || "/fallback.png?height=96&width=96&query=profile"}
                                                    alt="profile-image"
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col space-y-[20px] text-sm">
                                                <p className="text-[#A2A6B0] text-xs">Upload jpg/png, maximum 1024 wide</p>
                                                <div className="flex space-x-4">
                                                    <label className="text-[#C17C00] hover:text-hover font-normal text-[14px] cursor-pointer">
                                                        Upload
                                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Card className="bg-white rounded-none border-[3px] border-[#EAEAEA] max-w-[662px]">
                                        <CardContent className="px-[15px] sm:px-[40px] py-[30px] grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <h3 className="text-sm text-[#000000] mb-[20px]">Contact Information</h3>
                                                <div className="text-gray-600 space-y-1 text-sm">
                                                    <p className="text-[#5E5E5E] font-normal">{capitalizeWords(data?.name)}</p>
                                                    <p className="text-[#5E5E5E] font-normal">{data?.email}</p>
                                                    <p className="text-[#5E5E5E] font-normal">{data?.phoneNumber}</p>
                                                </div>
                                                <div className="flex space-x-4 text-sm font-semibold mt-[10px]">
                                                    <button onClick={openEditDialog} className="text-[#C17C00] cursor-pointer hover:text-hover">
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={openChangePasswordDialog}
                                                        className="text-[#C17C00] hover:text-hover cursor-pointer"
                                                    >
                                                        Change Password
                                                    </button>
                                                </div>
                                            </div>
                                           <div className="space-y-[20px]">
                                                        <h3 className="text-sm text-[#000000]">Default Address</h3>
                                                        <p className="text-[#5E5E5E] text-[14px] font-normal">
                                                            {data?.address || "No address provided."}
                                                        </p>
                                                        <button onClick={openAddressDialog} className="text-[#C17C00] cursor-pointer hover:text-hover font-semibold text-[14px]">
                                                            Edit Address
                                                        </button>
                                                    </div>
                                        </CardContent>
                                    </Card>
                                </>
                            )}
                        </div>

                        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Contact Information</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div>
                                        <Label>Name</Label>
                                        <Input {...register("name")} />
                                    </div>
                                    <div>
                                        <Label>Email</Label>
                                        <Input type="email" {...register("email")} />
                                    </div>
                                    <div>
                                        <Label>Phone</Label>
                                        <Input {...register("phone")} />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="bg-transparent"
                                            onClick={() => setIsEditOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={updateProfile.isPending}>
                                            {updateProfile.isPending ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isAddressOpen} onOpenChange={setIsAddressOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Address</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div>
                                        <Label>Address</Label>
                                        <Input {...register("address")} placeholder="Enter your full address" />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="bg-transparent"
                                            onClick={() => setIsAddressOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={updateProfile.isPending}>
                                            {updateProfile.isPending ? "Updating..." : "Update Address"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Change Password</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                                    <div>
                                        <Label>Old Password</Label>
                                        <div className="relative">
                                            <Input
                                                type={showOldPassword ? "text" : "password"}
                                                placeholder="Enter old password"
                                                {...registerPassword("oldPassword", {
                                                    required: "Old password is required",
                                                })}
                                                className={`rounded-none ${passwordErrors.oldPassword ? 'border-red-500' : ''}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowOldPassword(!showOldPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {passwordErrors.oldPassword && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {passwordErrors.oldPassword.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label>New Password</Label>
                                        <div className="relative">
                                            <Input
                                                type={showNewPassword ? "text" : "password"}
                                                placeholder="Enter new password"
                                                {...registerPassword("newPassword", {
                                                    required: "New password is required",
                                                    minLength: {
                                                        value: 8,
                                                        message: "Password must be at least 8 characters long",
                                                    },
                                                })}
                                                className={`rounded-none ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {passwordErrors.newPassword && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {passwordErrors.newPassword.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label>Confirm New Password</Label>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm new password"
                                                {...registerPassword("confirmPassword", {
                                                    required: "Please confirm your new password",
                                                    validate: (value) =>
                                                        value === newPassword || "Passwords do not match",
                                                })}
                                                className={`rounded-none ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {passwordErrors.confirmPassword && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {passwordErrors.confirmPassword.message}
                                            </p>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="bg-transparent w-auto"
                                            onClick={() => setIsChangePasswordOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={changePassword.isPending}>
                                            {changePassword.isPending ? "Changing..." : "Submit"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </AuthGuard>
    )
}