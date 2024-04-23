"use client"
import AnimatedButton from '@/components/buttons/AnimatedButton';
import { Button } from '@/components/ui/button';
import { UserConsumptionData, UserData } from '@/constants/types/user.type';
import { useUser } from '@clerk/nextjs';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface WaterCountProps {
    userId: string;
    formattedDate: string;
}
const WaterCount = ({ userId, formattedDate }: WaterCountProps) => {
    const [userTodayConsumptionData, setUserTodayConsumptionData] = useState<UserConsumptionData>(); // Initialize with empty array
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        const fetchTodayUserData = async () => {
            try {
                const response = await fetch('/api/todayconsumption');
                const data = await response.json();
                setUserTodayConsumptionData({
                    id: data.id,
                    userId: data.userId,
                    water: data.water,
                    consumedcalories: data.consumedcalories,
                    burnedcalories: data.burnedcalories,
                    trackedDate: data.todayDate,
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodayUserData();
    }, [added]);

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

    return (
        <div className='flex flex-col lg:flex-row items-center lg:justify-between lg:w-[50rem] gap-14 border p-4 rounded-lg'>
            <h1 className='lg:text-3xl font-bold'>Your Today's Water Consumption</h1>
            <div className='flex items-end'>

                <Button 
                onClick={decreaseWater}
                className="bg-transparent hover:bg-transparent"
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
                    <h3 className='font-bold text-4xl'>{userTodayConsumptionData?.water ? userTodayConsumptionData.water : 0}</h3>
                </div>
                <button
                    onClick={addWater}
                >
                    <AnimatedButton>
                        <Plus className='h-4 w-4 font-bold text-slate-900' />
                    </AnimatedButton>
                </button>
            </div>
        </div>
    )
}

export default WaterCount