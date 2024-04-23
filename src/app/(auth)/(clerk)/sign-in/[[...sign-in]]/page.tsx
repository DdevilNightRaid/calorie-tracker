import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex h-screen items-center justify-center">
            <SignUp path="/sign-in"  forceRedirectUrl={"/onboarding"}/>
        </div>
    )
}