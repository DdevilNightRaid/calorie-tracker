import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import User from '@/lib/models/user.model';
import { connectToDatabase } from '@/lib/mongoose';
export const GET = async () => {
    const user = await currentUser();
    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    try {
        connectToDatabase();

        const userData = await User.findOne({ id: user.id });
        const packagedData = {
            id: userData?.id,
            username: userData?.username,
            email: userData?.email,
            name: userData?.name,
            image: userData?.image,
            onboarded: userData?.onboarded,
            isVerified: userData?.isVerified,
            consumption: userData?.consumption,
            weight: userData?.weight,
            streak: userData?.streak,
            hasPaid: userData?.hasPaid,
        }

        if (!userData) {
            return new NextResponse("User not found", { status: 404 });
        }

        return new NextResponse(JSON.stringify(packagedData), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}