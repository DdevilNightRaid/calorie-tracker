import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import User from '@/lib/models/user.model';
import { connectToDatabase } from '@/lib/mongoose';
import Consumption from '@/lib/models/consumption.model';
export const GET = async () => {
    const user = await currentUser();
    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const currentDate = new Date();

    // Get the current date in the format "YYYY-MM-DD"
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    try {
        connectToDatabase();

        const userConsumptionData = await Consumption.findOne({ userId: user.id,  trackedDate: formattedDate});
        const packagedData = {
            id: userConsumptionData?._id,
            userId: userConsumptionData?.userId,
            water: userConsumptionData?.water,
            consumedcalories: userConsumptionData?.consumedcalories,
            burnedcalories: userConsumptionData?.burnedcalories,
            createdAt: userConsumptionData?.createdAt,
            trackedDate: userConsumptionData?.trackedDate,
        }
        console.log("===============")
        console.log("api: Get /api/(data)/todayconsumption : ")
        console.log("Today consumption data: ")
        console.log(packagedData);
        console.log("===============")
        return new NextResponse(JSON.stringify(packagedData), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
export const PUT = async (req: NextRequest) => {
    const data = await req.json();
    const user = await currentUser();
    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        connectToDatabase();
        console.log("inside PUT, checking dataExists")
        const dataExits = await Consumption.findOne({ userId: user.id, trackedDate: data.todayDate})
        console.log("Data exists: ", dataExits)
        if(dataExits){
            console.log("Data exists was true")
            switch (data.datatype) {
                case "water":
                    const userWaterConsumptionData = await Consumption.updateOne(
                        { 
                            id: data.id,
                            userId: data.userId,
                            trackedDate: data.trackedDate,
                        },
                        {
                            water: data.water,
                        }
                    );
                    break;
            
                case "calorie":
                    const userCalorieConsumptionData = await Consumption.updateOne(
                        { 
                            id: data.id,
                            userId: data.userId,
                            trackedDate: data.trackedDate,
                        },
                        {
                            water: data.water,
                        }
                    );
                    break;
            
                default:
                    break;
            }
        } else {
            const userConsumptionData = await Consumption.create(
                {
                    userId: user.id,
                    water: data.water,
                    consumedcalories: data.consumedcalories,
                    burnedcalories: data.burnedcalories,
                    trackedDate: data.todayDate,
                }
            );
            console.log("===============")
            console.log("api: Put /api/(data)/todayconsumption : ")
            console.log("Created new data inside else")
            console.log(userConsumptionData);
            console.log("===============")
        }

        return new NextResponse(JSON.stringify("packagedData done"), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}