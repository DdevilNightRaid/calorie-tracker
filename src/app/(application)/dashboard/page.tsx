"use client"
import { UserConsumptionData, UserData } from '@/constants/types/user.type';
import { UserButton, useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import CalorieCount from './_components/calorieCount/CalorieCount';
import WaterCount from './_components/waterCount/WaterCount';

const Page = () => {
    const { user } = useUser();
    const [userData, setUserData] = useState<UserData>(); // Initialize with empty object
    const [userConsumptionData, setUserConsumptionData] = useState<UserConsumptionData[]>([]); // Initialize with empty array
    const [userTodayConsumptionData, setUserTodayConsumptionData] = useState<UserConsumptionData>(); // Initialize with empty array
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [onClient, setOnClient] = useState(false);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        setOnClient(true);
    }, []);

    useEffect(() => {
        setIsLoading(true);

        const fetchData = async () => {
            try {
                const response = await fetch('/api/user');
                const data = await response.json();
                setUserData(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/consumption');
                const data = await response.json();
                console.log("data: ", data)
                // setUserConsumptionData([{
                //     id: data.id,
                //     userId: data.userId,
                //     water: data.water,
                //     consumedcalories: data.consumedcalories,
                //     burnedcalories: data.burnedcalories,
                //     trackedDate: data.todayDate,
                // }]);
                setUserConsumptionData(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
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
        fetchData();
        fetchUserData();
    }, [onClient, added]);

    if (!user || !userData) return null;
    if (!onClient) return null;
    if (!userData.onboarded) redirect('/onboarding'); // Redirect to onboarding page

    // Create a new Date object to get the current date and time
    const currentDate = new Date();

    // Get the current date in the format "YYYY-MM-DD"
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return (
        <div className='min-h-screen flex flex-col gap-2 items-center'>
            <nav className='w-full p-2 border-b mb-7 flex items-center justify-between'>
                <h1 className='font-medium text-lg md:text-2xl'>Dashboard</h1>
                <div className='flex items-center gap-4'>
                    <span>{formattedDate}</span>
                    <UserButton />
                </div>
            </nav>
            <WaterCount
                userId={user.id}
                formattedDate={formattedDate}
                userTodayConsumptionData={userTodayConsumptionData}
                setAdded={setAdded}
                userConsumptionData={userConsumptionData}
                />
            <CalorieCount
                userId={user.id}
                formattedDate={formattedDate}
                userTodayConsumptionData={userTodayConsumptionData}
                setAdded={setAdded}
            />
        </div>
    );
};

export default Page;