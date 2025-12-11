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
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto px-2">
                    {/* --- Header --- */}
                    <div className="flex flex-col space-y-6">
                        {isLoading ? (
                            <SkeletonLoader type="profile" />
                        ) : (
                            <>
                                {/* --- Profile Image Section --- */}
                                <div className="flex flex-col items-start space-y-4">
                                    <h2 className="text-2xl font-bold text-gray-900 capitalize tracking-tight">Profile Image</h2>
                                    <div className="space-y-3">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                            <Image
                                                src={data?.profile_image || "/placeholder.svg?height=96&width=96&query=profile"}
                                                alt="profile-image"
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-2 text-sm">
                                            <p className="text-gray-500">Upload jpg/png, maximum 1024 wide</p>
                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={handleRemoveImage}
                                                    className="text-solid hover:text-hover font-semibold"
                                                >
                                                    Remove
                                                </button>
                                                <label className="text-solid hover:text-hover font-semibold cursor-pointer">
                                                    Upload
                                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* --- Contact Info & Newsletters Card --- */}
                                <Card className="bg-white shadow-sm border-gray-200">
                                    <CardContent className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
                                            <div className="text-gray-600 space-y-1">
                                                <p className="text-gray-900 font-medium">{capitalizeWords(data?.name)}</p>
                                                <p>{data?.email}</p>
                                                <p>{data?.phoneNumber}</p>
                                            </div>
                                            <div className="flex space-x-4 text-sm font-semibold">
                                                <button onClick={openEditDialog} className="text-solid hover:text-hover">
                                                    Edit
                                                </button>
                                                <Link href="#">
                                                    <span className="text-solid hover:text-hover cursor-pointer">Change Password</span>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold text-gray-900">Newsletters</h3>
                                            <p className="text-gray-600">You don&apos;t subscribe to our newsletter.</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* --- Addresses Card --- */}
                                <Card className="bg-white shadow-sm border-gray-200">
                                    <CardContent className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold text-gray-900">Default Billing Address</h3>
                                            <p className="text-gray-600">House #24, Street 5, Islamabad.</p>
                                            <button className="text-sm font-semibold text-solid hover:text-hover">
                                                Edit Address
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold text-gray-900">Default Shipping Address</h3>
                                            <p className="text-gray-600">221-B, Block L, Islamabad.</p>
                                            <button className="text-sm font-semibold text-solid hover:text-hover">
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
        </AuthGuard>
    )
}