import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from '@/database/database';
import { validateCredentials } from '@/utils/validateCredentials';  
interface OTPRequestBody {
    phoneNumber: string;
    channels?: string[];
    otpLength?: number;
    expiry?: number;
}
export async function POST(request: NextRequest) {
    try {
        const { phoneNumber, channels = ['SMS'], otpLength = 6, expiry = 7200 } =
            (await request.json()) as OTPRequestBody;
        if (!phoneNumber) {
            return NextResponse.json(
                { error: 'Phone number required' },
                { status: 400 }
            );
        }
        await dbConnect();
        const user = await validateCredentials(phoneNumber);
        if (!user) {
            return NextResponse.json(
                { error: 'This phone number is not registered.' },
                { status: 404 }
            );
        }
        const otplessUrl = process.env.NEXT_PUBLIC_OTPLESS_URL!;
        const clientId = process.env.NEXT_PUBLIC_OTPLESS_C_ID!;
        const clientSecret = process.env.NEXT_PUBLIC_OTPLESS_C_SEC!;
        if (!otplessUrl || !clientId || !clientSecret) {
            return NextResponse.json(
                { error: 'Missing OTP provider configuration.' },
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
            body: JSON.stringify({ phoneNumber, channels, otpLength, expiry }),
        });
        const result = await response.json();
        console.log('OTP provider response:', result);
        return NextResponse.json(result, { status: response.status });
    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json(
                { error: 'Internal server error.' },
            );
        }
    }
}
