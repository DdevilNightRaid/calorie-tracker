"use client"
import React, { Dispatch, useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FastFood, Fruit, HardDrinks, LunchAndDinner, Snacks, SoftDrinks } from '@/constants/fooddb/food.db'
import { UserConsumptionData } from '@/constants/types/user.type'
import { Flame, Plus } from 'lucide-react'
import AnimatedButton from '@/components/buttons/AnimatedButton'
interface CalorieCountProps {
    userId: string;
    formattedDate: string;
    userTodayConsumptionData: UserConsumptionData | undefined;
    setAdded: Dispatch<React.SetStateAction<boolean>>
}
type addCalorieProps = {
    mealName: string,
    calorieCount: number,
}
const CalorieCount = ({
    userId,
    formattedDate,
    userTodayConsumptionData,
    setAdded
}: CalorieCountProps) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const addCalorie = async ({ mealName, calorieCount }: addCalorieProps) => {
        setAdded(true)
        const calorieData = {
            datatype: "calorie",
            water: userTodayConsumptionData?.water == undefined ? 1 : userTodayConsumptionData.water + 1,
            todayDate: formattedDate,
            userId: userId,
            consumedcalories: userTodayConsumptionData?.consumedcalories == undefined ? 0 : userTodayConsumptionData.consumedcalories + calorieCount,
            burnedcalories: userTodayConsumptionData?.burnedcalories == undefined ? 0 : userTodayConsumptionData.burnedcalories,
            trackedDate: userTodayConsumptionData?.trackedDate == undefined ? formattedDate : userTodayConsumptionData.trackedDate,
        };
        setOpen(false)
        try {
            await fetch('/api/consumption', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(calorieData)
            });
        } catch (error: any) {
            setError(error.message);
        }
        setAdded(false)

    }
    return (
        <div className='flex flex-row lg:justify-between items-center gap-14 lg:w-[50rem] border p-4 rounded-lg'>
            <h2 className='text-xs font-medium lg:text-3xl lg:font-bold'>Today's Calorie Consumption</h2>
            <div className='flex items-end'>
                <div className='flex flex-col items-center gap-4'>
                    <Flame className='h-20 w-20 text-red-500' />
                    <h4 className='font-bold text-4xl'>{userTodayConsumptionData?.consumedcalories}</h4>
                </div>
                <Dialog>
                    <DialogTrigger>
                        <button
                            onClick={() => setOpen(true)}
                        >
                            <AnimatedButton>
                                <Plus className='h-4 w-4 font-bold text-slate-900' />
                            </AnimatedButton>
                        </button>
                    </DialogTrigger>
                    {
                        open && (
                            <DialogContent className=''>
                                <Command className="rounded-lg bg-transparent">
                                    <CommandInput placeholder="Type a command or search..." />
                                    <CommandList>
                                        <ScrollArea className='h-[300px]'>
                                            <CommandEmpty>No results found.</CommandEmpty>
                                            <CommandGroup heading="Lunch / Dinner" >
                                                <ScrollArea className='h-[10rem]'>
                                                    {
                                                        LunchAndDinner.map((mealItem) => (
                                                            <CommandItem
                                                                key={mealItem.id}
                                                                onSelect={() => addCalorie({ mealName: mealItem.name, calorieCount: mealItem.calorieCount })}
                                                                className='flex items-center justify-between'
                                                            >
                                                                <div className='flex items-center'>
                                                                    <Image
                                                                        src={mealItem.image}
                                                                        alt={mealItem.name}
                                                                        height={24}
                                                                        width={24}
                                                                        className="object-contain mr-2"
                                                                    />
                                                                    <span>{mealItem.name}</span>
                                                                </div>
                                                                <Button className='py-1 px-2 h-7 text-slate-700 bg-transparent text-xs font-medium'>↵  Enter</Button>
                                                            </CommandItem >
                                                        ))
                                                    }
                                                </ScrollArea>

                                            </CommandGroup>
                                            <CommandSeparator />
                                            <CommandGroup heading="Fast Food">
                                                <ScrollArea className='h-[10rem]'>
                                                    {
                                                        FastFood.map((mealItem) => (
                                                            <CommandItem
                                                                key={mealItem.id}
                                                                onSelect={() => addCalorie({ mealName: mealItem.name, calorieCount: mealItem.calorieCount })}
                                                                className='flex items-center justify-between'
                                                            >
                                                                <div className='flex items-center'>
                                                                    <Image
                                                                        src={mealItem.image}
                                                                        alt={mealItem.name}
                                                                        height={24}
                                                                        width={24}
                                                                        className="object-contain mr-2"
                                                                    />
                                                                    <span>{mealItem.name}</span>
                                                                </div>
                                                                <Button className='py-1 px-2 h-7 text-slate-700 bg-transparent text-xs font-medium'>↵  Enter</Button>
                                                            </CommandItem >
                                                        ))
                                                    }
                                                </ScrollArea>
                                            </CommandGroup>
                                            <CommandSeparator />
                                            <CommandGroup heading="Soft Drinks">
                                                <ScrollArea className='h-[10rem]'>
                                                    {
                                                        SoftDrinks.map((mealItem) => (
                                                            <CommandItem
                                                                key={mealItem.id}
                                                                onSelect={() => addCalorie({ mealName: mealItem.name, calorieCount: mealItem.calorieCount })}
                                                                className='flex items-center justify-between'
                                                            >
                                                                <div className='flex items-center'>
                                                                    <Image
                                                                        src={mealItem.image}
                                                                        alt={mealItem.name}
                                                                        height={24}
                                                                        width={24}
                                                                        className="object-contain mr-2"
                                                                    />
                                                                    <span>{mealItem.name}</span>
                                                                </div>
                                                                <Button className='py-1 px-2 h-7 text-slate-700 bg-transparent text-xs font-medium'>↵  Enter</Button>
                                                            </CommandItem >
                                                        ))
                                                    }
                                                </ScrollArea>
                                            </CommandGroup>
                                            <CommandSeparator />
                                            <CommandGroup heading="Fruits">
                                                <ScrollArea className='h-[10rem]'>
                                                    {
                                                        Fruit.map((mealItem) => (
                                                            <CommandItem
                                                                key={mealItem.id}
                                                                onSelect={() => addCalorie({ mealName: mealItem.name, calorieCount: mealItem.calorieCount })}
                                                                className='flex items-center justify-between'
                                                            >
                                                                <div className='flex items-center'>
                                                                    <Image
                                                                        src={mealItem.image}
                                                                        alt={mealItem.name}
                                                                        height={24}
                                                                        width={24}
                                                                        className="object-contain mr-2"
                                                                    />
                                                                    <span>{mealItem.name}</span>
                                                                </div>
                                                                <Button className='py-1 px-2 h-7 text-slate-700 bg-transparent text-xs font-medium'>↵  Enter</Button>
                                                            </CommandItem >
                                                        ))
                                                    }
                                                </ScrollArea>
                                            </CommandGroup>
                                            <CommandSeparator />
                                            <CommandGroup heading="Snacks">
                                                <ScrollArea className='h-[10rem]'>
                                                    {
                                                        Snacks.map((mealItem) => (
                                                            <CommandItem
                                                                key={mealItem.id}
                                                                onSelect={() => addCalorie({ mealName: mealItem.name, calorieCount: mealItem.calorieCount })}
                                                                className='flex items-center justify-between'
                                                            >
                                                                <div className='flex items-center'>
                                                                    <Image
                                                                        src={mealItem.image}
                                                                        alt={mealItem.name}
                                                                        height={24}
                                                                        width={24}
                                                                        className="object-contain mr-2"
                                                                    />
                                                                    <span>{mealItem.name}</span>
                                                                </div>
                                                                <Button className='py-1 px-2 h-7 text-slate-700 bg-transparent text-xs font-medium'>↵  Enter</Button>
                                                            </CommandItem >
                                                        ))
                                                    }
                                                </ScrollArea>
                                            </CommandGroup>
                                            <CommandSeparator />
                                            <CommandGroup heading="Hard Drinks">
                                                <ScrollArea className='h-[10rem]'>
                                                    {
                                                        HardDrinks.map((mealItem) => (
                                                            <CommandItem
                                                                key={mealItem.id}
                                                                onSelect={() => addCalorie({ mealName: mealItem.name, calorieCount: mealItem.calorieCount })}
                                                                className='flex items-center justify-between'
                                                            >
                                                                <div className='flex items-center'>
                                                                    <Image
                                                                        src={mealItem.image}
                                                                        alt={mealItem.name}
                                                                        height={24}
                                                                        width={24}
                                                                        className="object-contain mr-2"
                                                                    />
                                                                    <span>{mealItem.name}</span>
                                                                </div>
                                                                <Button className='py-1 px-2 h-7 text-slate-700 bg-transparent text-xs font-medium'>↵  Enter</Button>
                                                            </CommandItem >
                                                        ))
                                                    }
                                                </ScrollArea>
                                            </CommandGroup>
                                        </ScrollArea>
                                    </CommandList>
                                </Command>
                            </DialogContent>
                        )
                    }
                </Dialog>
            </div>
        </div>
    )
}

export default CalorieCount