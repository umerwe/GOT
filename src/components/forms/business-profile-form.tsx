"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessProfileSchema, type BusinessProfileValues } from "@/validations/business";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetProfile, useUpdateProfile } from "@/hooks/useProfile";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import MyImage from "../custom/MyImage";

function ReadOnlyField({ label, value, className }: { label: string; value: string; className?: string }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {label}
            </span>
            <span className={`text-sm text-gray-900 font-medium capitalize ${className}`}>
                {value || "—"}
            </span>
        </div>
    );
}

export default function BusinessProfileForm() {
    const { data } = useGetProfile();
    const { mutate, isPending } = useUpdateProfile();

    const [open, setOpen] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<BusinessProfileValues>({
        resolver: zodResolver(businessProfileSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            phone: "",
            address: "",
            latitude: 0,
            longitude: 0,
        },
    });

    useEffect(() => {
        if (data) {
            reset({
                first_name: data.first_name || "",
                last_name: data.last_name || "",
                phone: data.phoneNumber || "",
                address: data.address || "",
                latitude: data.latitude || 0,
                longitude: data.longitude || 0,
            });
            if (data.logo) {
                setLogoPreview(data.logo);
            }
        }
    }, [data, reset]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const onSubmit = (formData: BusinessProfileValues) => {
        const payload = new FormData();

        payload.append("first_name", formData.first_name);
        payload.append("last_name", formData.last_name);
        payload.append("phone", formData.phone);
        payload.append("address", formData.address);
        // Append coordinates to the FormData
        payload.append("latitude", String(formData.latitude));
        payload.append("longitude", String(formData.longitude));

        if (logoFile) {
            payload.append("profile_image", logoFile);
        }

        mutate(payload);
        setOpen(false);
    };

    return (
        <div className="w-full bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Business Information</h2>
            </div>

            {/* Read-only display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-6">
                <ReadOnlyField label="First Name" value={data?.first_name || ""} />
                <ReadOnlyField label="Last Name" value={data?.last_name || ""} />
                <ReadOnlyField label="Phone" value={data?.phoneNumber || ""} />
                <ReadOnlyField label="Email" value={data?.email || ""} className="normal-case" />
                <div className="md:col-span-2">
                    <ReadOnlyField label="Address" value={data?.address || ""} className="normal-case" />
                </div>
            </div>

            <div className="flex pt-2">
                <Button
                    type="button"
                    variant="default"
                    className="font-semibold h-[42px] px-8"
                    onClick={() => setOpen(true)}
                >
                    Edit Profile
                </Button>
            </div>

            {/* Edit Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[650px] mt-20 gap-0 p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-xl font-bold">
                            Edit Business Information
                        </DialogTitle>
                    </DialogHeader>

                    {/* scrollable area if map makes it too tall */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-6 -mt-4 space-y-4 max-h-[85vh] overflow-y-auto"
                    >
                        {/* Logo Upload Section - Keep as is */}
                        <div className="flex flex-col gap-1.5">
                             <span className="text-sm font-medium text-gray-700">Business Logo</span>
                             <div className="flex items-center gap-4 p-4 rounded-lg border border-dashed border-gray-300 bg-gray-50">
                                <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white overflow-hidden shrink-0 cursor-pointer hover:border-gray-400 transition-colors"
                                     onClick={() => fileInputRef.current?.click()}>
                                    <MyImage src={logoPreview || ""} alt="Logo preview" width={64} height={64} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium text-gray-700">{logoPreview ? "Logo selected" : "Upload your business logo"}</p>
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs font-medium text-gray-800 border border-gray-300 px-3 py-1.5 bg-white">Change</button>
                                </div>
                             </div>
                             <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                        </div>

                        {/* Name and Phone Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input id="first_name" label="First Name" {...register("first_name")} error={errors.first_name?.message} />
                            <Input id="last_name" label="Last Name" {...register("last_name")} error={errors.last_name?.message} />
                            <div className="md:col-span-2">
                                <Input id="phone" label="Phone" {...register("phone")} error={errors.phone?.message} />
                            </div>
                        </div>

                        {/* Integrated Map Component for Address */}
                        {/* <div className="md:col-span-2 space-y-2">
                            <BusinessLocationInput
                                setValue={setValue} 
                                errors={errors} 
                                isPending={isPending} 
                            />
                        </div> */}

                        <div className="flex justify-end mt-8">
                            <Button
                                type="submit"
                                className="w-full md:w-auto px-10"
                                disabled={isPending}
                            >
                                {isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}