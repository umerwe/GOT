"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useGetProfile, useUpdateProfile } from "@/hooks/useProfile"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { capitalizeWords } from "@/utils/capitalizeWords"
import AuthGuard from "@/common/auth-guard"
import SkeletonLoader from "@/common/skeleton-loader"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface ProfileForm {
    name: string
    email: string
    phone: string
}

export default function ProfilePage() {
    const { data, isLoading } = useGetProfile()
    const updateProfile = useUpdateProfile()

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const { register, handleSubmit, reset } = useForm<ProfileForm>({
        defaultValues: {
            name: data?.name || "",
            email: data?.email || "",
            phone: data?.phoneNumber || "",
        },
    })

    const onSubmit = async (values: ProfileForm) => {
        const formData = new FormData()
        formData.append("name", values.name)
        formData.append("email", values.email)
        formData.append("phone", values.phone)
        if (selectedFile) {
            formData.append("profile_image", selectedFile)
        }
        updateProfile.mutate(formData, {
            onSuccess: () => {
                setIsEditOpen(false)
                setSelectedFile(null)
                reset(values)
            },
        })
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            // Automatically submit when image is chosen
            const formData = new FormData()
            formData.append("name", data?.name || "")
            formData.append("email", data?.email || "")
            formData.append("phone", data?.phoneNumber || "")
            formData.append("profile_image", file)
            updateProfile.mutate(formData)
        }
    }

    const handleRemoveImage = () => {
        // Implement logic to remove profile image via API call
        // For now, we can just reset the selected file and notify user
        setSelectedFile(null);
        alert("Image removal logic needs to be implemented.");
    }


    const openEditDialog = () => {
        reset({
            name: data?.name || "",
            email: data?.email || "",
            phone: data?.phoneNumber || "",
        })
        setSelectedFile(null)
        setIsEditOpen(true)
    }


    return (
        <AuthGuard>
            <div>
                <h2 className="text-[20px] mb-[18px] h-[40px] py-[7px] leading-[26px]">Dashboard</h2>

                <div className="bg-white p-[30px] pb-[116px]">
                    <div className="">
                        {/* --- Header --- */}
                        <div className="flex flex-col space-y-6">
                            {isLoading ? (
                                <SkeletonLoader type="profile" />
                            ) : (
                                <>
                                    {/* --- Profile Image Section --- */}
                                    <div className="flex flex-col items-start space-y-4">
                                        <h3 className="text-sm text-[#000000] capitalize tracking-tight">Profile Image</h3>
                                        <div className="space-y-3">
                                            <div className="w-[48px] h-[48px] rounded-full overflow-hidden border-2 border-white shadow-sm">
                                                <Image
                                                    src={data?.profile_image || "/placeholder.svg?height=96&width=96&query=profile"}
                                                    alt="profile-image"
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col space-y-[20px] text-sm">
                                                <p className="text-[#A2A6B0] text-xs">Upload jpg/png, maximum 1024 wide</p>
                                                <div className="flex space-x-4">
                                                    <button
                                                        onClick={handleRemoveImage}
                                                        className="text-[#C17C00] hover:text-hover font-medium text-[14px]"
                                                    >
                                                        Remove
                                                    </button>
                                                    <label className="text-[#C17C00] hover:text-hover font-normal text-[14px] cursor-pointer">
                                                        Upload
                                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- Contact Info & Newsletters Card --- */}
                                    <Card className="bg-white rounded-none border-[3px] border-[#EAEAEA] max-w-[662px]">
                                        <CardContent className="px-[40px] py-[30px] grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <h3 className="text-sm text-[#000000] mb-[20px]">Contact Information</h3>
                                                <div className="text-gray-600 space-y-1 text-sm">
                                                    <p className="text-[#5E5E5E] font-normal">{capitalizeWords(data?.name)}</p>
                                                    <p className="text-[#5E5E5E] font-normal">{data?.email}</p>
                                                    <p className="text-[#5E5E5E] font-normal">{data?.phoneNumber}</p>
                                                </div>
                                                <div className="flex space-x-4 text-sm font-semibold mt-[10px]">
                                                    <button onClick={openEditDialog} className="text-[#C17C00] hover:text-hover">
                                                        Edit
                                                    </button>
                                                    <Link href="#">
                                                        <span className="text-[#C17C00] hover:text-hover cursor-pointer">Change Password</span>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="space-y-[20px]">
                                                <h3 className="text-sm text-[#000000]">Newsletters</h3>
                                                <p className="text-gray-600 text-sm">You don&apos;t subscribe to our newsletter.</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* --- Addresses Card --- */}
                                    <Card className="bg-white rounded-none border-[3px] border-[#EAEAEA] max-w-[662px]">
                                        <CardContent className="px-[40px] py-[30px] grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-[20px]">
                                                <h3 className="text-sm text-[#000000]">Default Billing Address</h3>
                                                <p className="text-[#5E5E5E] text-[14px] font-normal">House #24, Street 5, Islamabad.</p>
                                                <button className="text-[#C17C00] hover:text-hover font-semibold text-[14px]">
                                                    Edit Address
                                                </button>
                                            </div>
                                            <div className="space-y-[20px]">
                                                <h3 className="text-sm text-[#000000]">Default Shipping Address</h3>
                                                <p className="text-[#5E5E5E] text-[14px] font-normal">221-B, Block L, Islamabad.</p>
                                                <button className="text-[#C17C00] hover:text-hover font-semibold text-[14px]">
                                                    Edit Address
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            )}
                        </div>

                        {/* Edit Profile Dialog */}
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
                    </div>
                </div>
            </div>
        </AuthGuard>
    )
}