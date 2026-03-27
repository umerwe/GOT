"use client";

import React from "react";
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

export function BusinessDetailsForm() {
    const { mutate, isPending } = useRegisterBusiness();

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
            address: "",
            latitude: undefined,
            longitude: undefined,
        },
    });

    const onSubmit = (data: BusinessDetailsValues) => {
        mutate(data);
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

                    {/* UAE-only Phone Input */}
                    <div className="relative w-full">
                        <Label>
                            Phone
                        </Label>
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <PhoneInput
                                    {...field}
                                    country="ae"
                                    onlyCountries={["ae"]}
                                    disableDropdown
                                    disableCountryCode={false}
                                    inputClass={cn(
                                        "!w-full !h-[48px] !text-sm !bg-white",
                                        "!border-[2px] !border-[#C7CBD2] !rounded-none",
                                        "!shadow-xs !transition-[color,box-shadow] !outline-none",
                                        "!pl-[48px] !pr-3",
                                        "focus-visible:!ring-[1px] focus-visible:!ring-gray-500 focus-visible:!border-gray-500",
                                        errors.phone && "!border-destructive"
                                    )}
                                    buttonClass={cn(
                                        "!h-[48px] !border-[2px]  !bg-white !rounded-none",
                                        errors.phone && "!border-destructive"
                                    )}
                                    containerClass="!w-full"
                                    onChange={(value) => field.onChange("+" + value)}
                                />
                            )}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1.5">{errors.phone.message}</p>
                        )}
                    </div>

                    <Input id="email" label="Email" type="email" {...register("email")} error={errors.email?.message} />
                    <Input id="password" label="Password" type="password" {...register("password")} error={errors.password?.message} />

                    <div className="md:col-span-2">
                        <BusinessLocationInput
                            setValue={setValue}
                            errors={errors}
                            isPending={isPending}
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="submit" className="font-semibold h-[42px]" disabled={isPending}>
                        {isPending ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </form>
        </div>
    );
}