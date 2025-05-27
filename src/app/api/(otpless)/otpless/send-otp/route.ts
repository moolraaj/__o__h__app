
import { NextRequest, NextResponse } from "next/server";
import { validateCredentials } from "@/utils/validateCredentials";
import { dbConnect } from "@/database/database";

interface OTPRequestBody {
    phoneNumber: string;
    channels?: string[];
    otpLength?: number;
    expiry?: number;
}
export async function POST(request: NextRequest) {
    try {
        const { phoneNumber, channels = ["SMS"], otpLength = 6, expiry = 7200 } =
            (await request.json()) as OTPRequestBody;

        if (!phoneNumber) {
            return NextResponse.json(
                { status: 400, error: "Phone number required" },

            );
        }
        await dbConnect();
        const user = (await validateCredentials(phoneNumber));
        if (!user) {
            return NextResponse.json(
                { status: 404, error: "Please create an account first" },

            );
        }
        const otplessUrl = process.env.NEXT_PUBLIC_OTPLESS_URL!;
        const clientId = process.env.NEXT_PUBLIC_OTPLESS_C_ID!;
        const clientSecret = process.env.NEXT_PUBLIC_OTPLESS_C_SEC!;
        if (!otplessUrl || !clientId || !clientSecret) {
            return NextResponse.json(
                { status: 500, error: "Missing OTP service configuration" },

            );
        }

        const resp = await fetch(`${otplessUrl}/auth/v1/initiate/otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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

        const result = await resp.json();
        return NextResponse.json(result, { status: resp.status });
    } catch (err) {

        if (err instanceof Error) {
            return NextResponse.json(
                { status: 500, error: "Internal server error" },

            );
        }
    }
}
