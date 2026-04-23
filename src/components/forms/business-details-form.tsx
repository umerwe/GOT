"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessDetailsSchema, type BusinessDetailsValues } from "@/validations/business";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegisterBusiness } from "@/hooks/useBusiness";
import { BusinessLocationInput } from "../business-location-input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react"; // Import Icons

export function BusinessDetailsForm() {
    const { mutate, isPending } = useRegisterBusiness();
    
    // Visibility States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<BusinessDetailsValues>({
        resolver: zodResolver(businessDetailsSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            password: "",
            confirm_password: "",
            address: "",
            latitude: undefined,
            longitude: undefined,
        },
    });

    const onSubmit = (data: BusinessDetailsValues) => {
        const payload = {
            display_name: `${data.first_name} ${data.last_name}`.trim(),
            contact_number: data.phone,
            lat: data.latitude,
            lng: data.longitude,
            email: data.email,
            password: data.password, // Only send original password
            address: data.address,
        };

        mutate(payload);
    };

    return (
        <div className="w-full bg-white p-6">
            <div className="mb-3">
                <h2 className="text-xl font-bold text-gray-900">Business details</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <Input id="first_name" label="First Name" {...register("first_name")} error={errors.first_name?.message} />
                    <Input id="last_name" label="Last Name" {...register("last_name")} error={errors.last_name?.message} />

                    <div className="relative w-full">
                        <Label>Phone</Label>
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <PhoneInput
                                    {...field}
                                    country="ae"
                                    onlyCountries={["ae"]}
                                    disableDropdown
                                    inputClass={cn(
                                        "!w-full !h-[48px] !text-sm !bg-white !border-[2px] !border-[#C7CBD2] !rounded-none",
                                        errors.phone && "!border-destructive"
                                    )}
                                    buttonClass={cn("!h-[48px] !border-[2px] !bg-white !rounded-none", errors.phone && "!border-destructive")}
                                    containerClass="!w-full"
                                    onChange={(value) => field.onChange("+" + value)}
                                />
                            )}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1.5">{errors.phone.message}</p>}
                    </div>

                    <Input id="email" label="Email" type="email" {...register("email")} error={errors.email?.message} />

                    {/* Password Field */}
                    <div className="space-y-[4px]">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                className={cn("rounded-none", errors.password ? "border-red-500" : "")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-600 text-[14px] mt-[4px]">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-[4px]">
                        <Label htmlFor="confirm_password">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="confirm_password"
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirm_password")}
                                className={cn("rounded-none", errors.confirm_password ? "border-red-500" : "")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.confirm_password && (
                            <p className="text-red-600 text-[14px] mt-[4px]">{errors.confirm_password.message}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <BusinessLocationInput
                            setValue={setValue}
                            errors={errors}
                            isPending={isPending}
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="submit" className="font-semibold h-[42px] w-full md:w-auto px-12 rounded-none bg-black hover:bg-gray-800" disabled={isPending}>
                        {isPending ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </form>
        </div>
    );
}