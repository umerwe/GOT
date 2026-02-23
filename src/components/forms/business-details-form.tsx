"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessDetailsSchema, type BusinessDetailsValues } from "@/validations/business";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegisterBusiness } from "@/hooks/useBusiness";

export function BusinessDetailsForm() {
    const { mutate } = useRegisterBusiness();

    const {
        register,
        handleSubmit,
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
            latitude: 33.6844,
            longitude: 73.0479,
        },
    });

    const onSubmit = (data: BusinessDetailsValues) => {
        const finalData = {
            ...data,
            latitude: 33.6844,
            longitude: 73.0479,
        };

        mutate(finalData);
    };

    return (
        <div className="w-full bg-white p-6">
            {/* Header Section */}
            <div className="mb-3">
                <h2 className="text-xl font-bold text-gray-900">Business details</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <Input
                        id="first_name"
                        label="First Name"
                        placeholder="Enter first name"
                        {...register("first_name")}
                        error={errors.first_name?.message}
                    />

                    <Input
                        id="last_name"
                        label="Last Name"
                        placeholder="Enter last name"
                        {...register("last_name")}
                        error={errors.last_name?.message}
                    />

                    <Input
                        id="phone"
                        label="Phone"
                        placeholder="+923345483806"
                        {...register("phone")}
                        error={errors.phone?.message}
                    />

                    <Input
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="user@gmail.com"
                        {...register("email")}
                        error={errors.email?.message}
                    />

                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="********"
                        {...register("password")}
                        error={errors.password?.message}
                    />

                    <div className="md:col-span-2">
                        <Input
                            id="address"
                            label="Address"
                            placeholder="Business Address"
                            {...register("address")}
                            error={errors.address?.message}
                        />
                    </div>
                </div>

                {/* Hidden fields for coordinates - registered as numbers */}
                <input type="hidden" {...register("latitude", { valueAsNumber: true })} />
                <input type="hidden" {...register("longitude", { valueAsNumber: true })} />

                {/* Action Button */}
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        variant="default"
                        className="font-semibold h-[42px]"
                    >
                        Submit
                    </Button>
                    {/* <Button
                        type="button"
                        variant="default"
                        className="h-[42px] font-semibold"
                    >
                        Continue to verification
                    </Button> */}
                </div>
            </form>
        </div>
    );
}