import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import User from "@/models/User";
interface OTPRequestBody {
    phoneNumber: string;
    channels?: string[];
    otpLength?: number;
    expiry?: number;
    action?: 'login' | 'register';
}
interface OTPRequestBody {
    phoneNumber: string;
    channels?: string[];
    otpLength?: number;
    expiry?: number;
    action?: 'login' | 'register';
}
export async function POST(request: NextRequest) {
    try {
        const { phoneNumber, channels = ['SMS'], otpLength = 6, expiry = 7200, action = 'login' } =
            await request.json() as OTPRequestBody;
        await dbConnect()
        if (action === 'login') {
            const user = await User.findOne({ phoneNumber });
            if (!user) {
                return NextResponse.json(
                    { status: 404, error: 'Phone number not registered' },
                );
            }
        }
        if (action === 'register') {
            const existingUser = await User.findOne({ phoneNumber });
            if (existingUser) {
                return NextResponse.json(
                    { status: 409, error: 'Phone number already registered' },
                    { status: 409 }
                );
            }
        }
        const otplessUrl = process.env.NEXT_PUBLIC_OTPLESS_URL;
        const clientId = process.env.NEXT_PUBLIC_OTPLESS_C_ID;
        const clientSecret = process.env.NEXT_PUBLIC_OTPLESS_C_SEC;
        if (!otplessUrl || !clientId || !clientSecret) {
            return NextResponse.json(
                { status: 500, error: 'Missing environment configuration' },
                { status: 500 }
            );
        }
        const response = await fetch(`${otplessUrl}/auth/v1/initiate/otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                clientId,
                clientSecret,
            },
            body: JSON.stringify({
                phoneNumber,
                channels,
                otpLength,
                expiry,
            }),
        });
        const result = await response.json();
        return NextResponse.json({
            ...result,
            action
        });
    } catch (error) {
        if(error instanceof Error){
            return NextResponse.json(
                { status: 500, error: 'Internal server issue' },
            );
        }
    }
}