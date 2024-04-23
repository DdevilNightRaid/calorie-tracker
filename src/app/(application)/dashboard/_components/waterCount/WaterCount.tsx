"use client"
import AnimatedButton from '@/components/buttons/AnimatedButton';
import { Button } from '@/components/ui/button';
import { UserConsumptionData, UserData } from '@/constants/types/user.type';
import { useUser } from '@clerk/nextjs';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React, { Dispatch, useEffect, useState } from 'react';
import { Sparkline } from '@mantine/charts';
interface WaterCountProps {
    userId: string;
    formattedDate: string;
    userConsumptionData: UserConsumptionData[];
    userTodayConsumptionData: UserConsumptionData | undefined;
    setAdded: Dispatch<React.SetStateAction<boolean>>;
}
const WaterCount = ({
    userId,
    formattedDate,
    userConsumptionData,
    userTodayConsumptionData,
    setAdded,
}: WaterCountProps) => {
    const [error, setError] = useState<string | null>(null);

    const addWater = async () => {
        setAdded(true)
        const waterData = {
            datatype: "water",
            water: userTodayConsumptionData?.water == undefined ? 1 : userTodayConsumptionData.water + 1,
            todayDate: formattedDate,
            userId: userId,
            consumedcalories: userTodayConsumptionData?.consumedcalories == undefined ? 0 : userTodayConsumptionData.consumedcalories,
            burnedcalories: userTodayConsumptionData?.burnedcalories == undefined ? 0 : userTodayConsumptionData.burnedcalories,
            trackedDate: userTodayConsumptionData?.trackedDate == undefined ? formattedDate : userTodayConsumptionData.trackedDate,
        };
        await fetch('/api/consumption', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(waterData)
        });
        setAdded(false)
    };
    const decreaseWater = async () => {
        setAdded(true)
        const waterData = {
            datatype: "water",
            water: userTodayConsumptionData?.water == undefined ? 0 : userTodayConsumptionData.water - 1,
            todayDate: formattedDate,
            userId: userId,
            consumedcalories: userTodayConsumptionData?.consumedcalories == undefined ? 0 : userTodayConsumptionData.consumedcalories,
            burnedcalories: userTodayConsumptionData?.burnedcalories == undefined ? 0 : userTodayConsumptionData.burnedcalories,
            trackedDate: userTodayConsumptionData?.trackedDate == undefined ? formattedDate : userTodayConsumptionData.trackedDate,
        };
        try {
            await fetch('/api/consumption', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(waterData)
            });
        } catch (error: any) {
            setError(error.message);
        }
        setAdded(false)
    };
    const waterData: number[] = userConsumptionData.map(item => item.water);
    if (waterData.length > 0) console.log(waterData)
    return (
        <div className='flex flex-row items-center lg:justify-between lg:w-[50rem] gap-14 border p-4 rounded-lg'>
            <div className='flex flex-col justify-center'>
                <h1 className='text-xs lg:text-3xl font-medium lg:font-bold'>Your Today's Water Consumption</h1>
                {
                    waterData.length > 0 && (
                        <Sparkline
                            w={200}
                            h={60}
                            data={waterData}
                            curveType="linear"
                            color="blue"
                            fillOpacity={0.3}
                            strokeWidth={1}
                            trendColors={{ positive: 'teal.6', negative: 'red.6', neutral: 'gray.5' }}
                        />
                    )
                }
            </div>
            <div className='flex items-center lg:items-end'>
                <Button
                    onClick={decreaseWater}
                    className="bg-transparent flex items-center border lg:border-none hover:bg-transparent m-0 p-0 h-0 lg:h-10 lg:px-4 lg:py-2"
                >
                    <Minus className='h-4 w-4 font-bold text-slate-900' />
                </Button>
                <div className='flex flex-col items-center gap-4'>
                    <Image
                        src="/assets/items/drinks/glass-of-water.svg"
                        alt="glass of water"
                        height={80}
                        width={80}
                    />
                    <h3 className='font-bold lg:text-4xl'>{userTodayConsumptionData?.water ? userTodayConsumptionData.water : 0}</h3>
                </div>
                <button
                    onClick={addWater}
                >
                    <AnimatedButton
                       className='p-0 lg:px-4 lg:py-2'
                    >
                        <Plus className='h-4 w-4 font-bold text-slate-900' />
                    </AnimatedButton>
                </button>
            </div>
        </div>
    )
}

export default WaterCount