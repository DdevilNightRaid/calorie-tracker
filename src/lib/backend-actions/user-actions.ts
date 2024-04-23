"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model"
import { connectToDatabase } from "../mongoose";
export async function fetchUserData(userId: string){
    try {
        connectToDatabase(); // Connect to the database

        const userData = await User.findOne({ id: userId });
        console.log("userData: ", userData)
       
        return userData;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error; // Rethrow the error for handling elsewhere
    }
}

interface createUpdateUserDataProps{
    userId: string;
    email: string;
    name: string;
    username: string;
    image: string;
    onboarded: boolean;
    path: string;
    weight: string;
    hasPaid: boolean;
    hasPaidWorkspace: boolean;
}
export async function createUpdateUserData({
    userId,
    email,
    name,
    username,
    image,
    onboarded,
    path,
    weight,
    hasPaid,
    hasPaidWorkspace,
}: createUpdateUserDataProps){
    try{
        connectToDatabase()
        await User.findOneAndUpdate(
            { id: userId },
            {
                id: userId,
                email: email,
                username: username.toLocaleLowerCase(),
                name: name,
                image: image,
                onboarded: onboarded,
                streak: 0,
                weight: weight,
                hasPaid,
                hasPaidWorkspace,
            },
            {
                upsert: true,
            }
        );
        if(path === "/profile/edit"){
            revalidatePath(path)
        }
    } catch (error) {
        console.error("Got and error:")
        console.error(error)
    }

}