import React from 'react'
import { currentUser } from '@clerk/nextjs/server';
import { fetchUserData } from '@/lib/backend-actions/user-actions';
import { redirect } from 'next/navigation';
import UserProfileForm from '@/components/forms/UserProfileForm';

const page = async () => {
    const user = await currentUser()
    if (!user) return redirect("/sign-up");
    const userDataFromDb = await fetchUserData(user.id)
    console.log(userDataFromDb)
    if (userDataFromDb?.onboarded) return redirect("/dashboard");
    const userData = {
        id: user.id,
        _id: userDataFromDb?._id,
        username: userDataFromDb ? userDataFromDb.username : user.username,
        email: user.emailAddresses[0].emailAddress,
        name: userDataFromDb ? userDataFromDb.name : user.firstName,
        image: userDataFromDb ? userDataFromDb.image : user.imageUrl,
        weight: userDataFromDb ? (userDataFromDb.weight).toString() : "",
        hasPaid: userDataFromDb ? userDataFromDb.hasPaid : false,
    }
    return (
        <section className='w-full min-h-screen flex flex-col justify-center gap-7 p-2'>
            <header>
                <h2 className='font-medium text-xl md:text-3xl'>Let's get you started</h2>
            </header>
            <main className='flex flex-col items-center w-full border-t-2 pt-7'>
                <UserProfileForm
                    user={userData}
                    btnTitle="Start Measuring"
                />
            </main>
        </section>
    )
}

export default page