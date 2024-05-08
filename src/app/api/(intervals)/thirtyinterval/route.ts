import { sendEmail } from '@/lib/sendmail';
import { NextResponse } from 'next/server';
export async function GET() {
    const bodyText = `
        <h1>Water?.</h1>
        <p>Time to drink some water.</p>
    `
    await sendEmail({
        subject: "Water Update ⏳",
        body: bodyText,
        receiver: 'ddevil70707@gmail.com'
    })
    return new NextResponse(JSON.stringify({"message": "it works"}))    
}