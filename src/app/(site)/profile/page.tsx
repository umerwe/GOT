"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Edit } from "lucide-react"
import { useUpdateProfile } from "@/hooks/useProfile"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { capitalizeWords } from "@/utils/capitalizeWords"
import AuthGuard from "@/common/auth-guard"
import SkeletonLoader from "@/common/skeleton-loader"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import AdsTable from "@/components/current-ads"

interface ProfileForm {
  name: string
  email: string
  phone: string
}

const getProfile = async () => {
  const { data } = await api.get("/user-detail")
  return data.data
}

export default function ProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  })
  const updateProfile = useUpdateProfile()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [selectedStatus, setSelectedStatus] = useState<"pending" | "approved" | "rejected" | "expired">("pending")

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
    if (file) setSelectedFile(file)
  }

  return (
    <AuthGuard>
      <div className="bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h3 className="text-lg font-semibold text-gray-900">Manage Your Profile</h3>
          <p className="text-gray-600 mb-4">Edit your profile information and manage your ads.</p>

          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 py-6 px-4">
            {isLoading ? (
              <SkeletonLoader type="profile" />
            ) : (
              <>
                <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={data?.profile_image || "/placeholder.svg?height=96&width=96&query=profile"}
                    alt="profile-image"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center sm:text-left mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">{capitalizeWords(data?.name)}</h2>
                  <p className="text-gray-600">{data?.email}</p>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-transparent"
                    onClick={() => {
                      reset({
                        name: data?.name || "",
                        email: data?.email || "",
                        phone: data?.phoneNumber || "",
                      })
                      setSelectedFile(null)
                      setIsEditOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex space-x-6 mb-7 border-b border-gray-200">
            {["pending", "approved", "rejected", "expired"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status as "pending" | "approved" | "rejected" | "expired")}
                className={`pb-2 text-sm font-medium ${selectedStatus === status
                  ? "border-b-2 border-solid text-solid"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Ads Table */}
          <AdsTable selectedStatus={selectedStatus} />
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
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
              <div>
                <Label>Profile Image</Label>
                <Input type="file" accept="image/*" onChange={handleImageChange} />
                {selectedFile && <p className="text-sm text-gray-600 mt-1">Selected: {selectedFile.name}</p>}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="w-30 bg-transparent"
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
    </AuthGuard>
  )
}
