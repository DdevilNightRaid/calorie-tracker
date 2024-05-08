import { NextResponse } from 'next/server';
export function GET() {
    const notification = new Notification("Water Time", {
        body: "Time to drink some water!",
        icon: "/assets/items/drinks/glass-of-water.svg",
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        tag: "water-notification",
        renotify: true,
        silent: false,
    })
    return new NextResponse(JSON.stringify({"message": "it works"}))    
}