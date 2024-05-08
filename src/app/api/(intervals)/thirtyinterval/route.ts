import { NextResponse } from 'next/server';
export function GET() {
    return new NextResponse(JSON.stringify({"message": "it works"}))    
}