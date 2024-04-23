"use client"

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user.validation";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/validations/uploadthing.validation";
import { createUpdateUserData } from "@/lib/backend-actions/user-actions";
import { Pen } from "lucide-react";
interface UserProfileFormProps {
    user: {
        id: string,
        _id: string,
        username: string,
        email: string,
        name: string,
        image: string,
        weight: string,
        hasPaid: boolean,
    },
    btnTitle: string;
}
const UserProfileForm = ({
    user,
    btnTitle,
}: UserProfileFormProps) => {
    const router = useRouter();
    const pathname = usePathname()
    const [files, setFiles] = useState<File[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const { startUpload } = useUploadThing("media");
    const form = useForm<z.infer<typeof UserValidation>>({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            username: user.username || "",
            name: user.name || "",
            profile_photo: user.image || "",
            weight: user.weight || "",

        },

    })
    const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
    ) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFiles(Array.from(e.target.files));

            if (!file.type.includes("image")) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || "";
                fieldChange(imageDataUrl);
            };

            fileReader.readAsDataURL(file);
        }
    }

    const onSubmit = async (values: z.infer<typeof UserValidation>) => {
        setIsCreating(true);
        const blob = values.profile_photo;

        const hasImageChanged = isBase64Image(blob);
        if (hasImageChanged) {
            const imgRes = await startUpload(files);

            if (imgRes && imgRes[0].fileUrl) {
                values.profile_photo = imgRes[0].fileUrl;
            }
        }
        await createUpdateUserData({
            userId: user.id,
            email: user.email,
            name: values.name,
            username: values.username,
            image: values.profile_photo,
            onboarded: true,
            path: pathname,
            weight: values.weight,
            hasPaid: false,
            hasPaidWorkspace: false,
        })
        setIsCreating(false);
        if (pathname === "/profile/edit") {
            router.back();
        } else {
            if (!user.hasPaid) {
                router.push("/apppayment");
            } else {
                router.push("/personal-dashboard");
            }
        }
    }
    return (
        <Form {...form}>
            <form
                className='rounded-lg flex flex-col gap-7 lg:border lg:p-4'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name='profile_photo'
                    render={({ field }) => (
                        <FormItem className='flex'>
                            <FormLabel className="relative">
                                {field.value ? (
                                    <div className="relative h-14 w-14">
                                        <Image
                                            src={field.value}
                                            alt='profile_icon'
                                            width={96}
                                            height={96}
                                            priority
                                            className='rounded-full object-contain'
                                        />
                                    </div>
                                ) : (
                                    <Image
                                        src='/assets/profile.svg'
                                        alt='profile_icon'
                                        width={24}
                                        height={24}
                                        className='object-contain'
                                    />
                                )}
                                <span className="absolute -right-4 -bottom-2 z-[9999] rounded-full  backdrop-blur-sm h-8 w-8 flex items-center justify-center">
                                    <Pen className="h-5 w-4  " />
                                </span>
                            </FormLabel>
                            <FormControl className='flex-1 text-base-semibold text-gray-200 border-2 border-red-500'>
                                <Input
                                    type='file'
                                    accept='image/*'
                                    placeholder='Add profile photo'
                                    className='border text-bold placeholder:text-red-400 text-background opacity-0'
                                    onChange={(e) => handleImage(e, field.onChange)}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem className='flex w-full flex-col gap-0.5'>
                                <FormLabel className='font-medium text-md'>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type='text'
                                        className=' font-normal'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                <div className="flex flex-col lg:flex-row gap-7">

                    <FormField
                        control={form.control}
                        name='username'
                        render={({ field }) => (
                            <FormItem className='flex w-full flex-col gap-0.5'>
                                <FormLabel className='font-medium text-md'>
                                    Username
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type='text'
                                        className=' font-normal'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                <FormField
                    control={form.control}
                    name='weight'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-0.5'>
                            <FormLabel className='font-medium text-md'>
                                Body Weight (kg) 
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='string'
                                    className='text-2xl font-normal'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                </div>

                <Button type='submit' className="py-7">
                    {
                        isCreating ? (
                            <span className='animate-spin -ml-1 mr-3 h-5 w-5 rounded-full border-b-2 border-white border-opacity-25'></span>
                        ) : (
                            <span className="font-bold text-xl py-4">{btnTitle}</span>
                        )
                    }
                </Button>
            </form>
        </Form>
    )
}

export default UserProfileForm