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
    try {
        connectToDatabase();

        const userConsumptionData = await Consumption.findOne({ userId: user.id });
        const packagedData = {
            id: userConsumptionData?._id,
            userId: userConsumptionData?.userId,
            water: userConsumptionData?.water,
            consumedcalories: userConsumptionData?.consumedcalories,
            burnedcalories: userConsumptionData?.burnedcalories,
            createdAt: userConsumptionData?.createdAt,
            trackedDate: userConsumptionData?.trackedDate,
        }

        // if (!userData) {
        //     return new NextResponse("User not found", { status: 404 });
        // }

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
        if(dataExits !== null){
            console.log("Data exists was true")
            switch (data.datatype) {
                case "water":
                    const userWaterConsumptionData = await Consumption.updateOne(
                        { 
                            // id: data.id,
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
                            consumedcalories: data.consumedcalories,
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
            await User.findOneAndUpdate({ id: user.id }, {
                $push: { consumption: userConsumptionData._id },
            });
            console.log("===============")
            console.log("api: Put /api/(data)/consumption : ")
            console.log("I got the following data: ", data)
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