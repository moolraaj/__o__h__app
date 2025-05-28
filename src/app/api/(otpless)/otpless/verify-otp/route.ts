import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import User from "@/models/User";
export async function POST(request: NextRequest) {
    const { requestId, otp, phoneNumber, flowType } = await request.json();
    const otplessUrl = process.env.NEXT_PUBLIC_OTPLESS_URL;
    const clientId = process.env.NEXT_PUBLIC_OTPLESS_C_ID;
    const clientSecret = process.env.NEXT_PUBLIC_OTPLESS_C_SEC;
    if (!otplessUrl || !clientId || !clientSecret) {
        return NextResponse.json(
            { status: 500, error: "Missing environment configuration" },
            
        );
    }

    try {
        const response = await fetch(`${otplessUrl}/auth/v1/verify/otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                clientId,
                clientSecret,
            },
            body: JSON.stringify({ requestId, otp }),
        });
        const result = await response.json();
        if (result.success) {
            await dbConnect();
            if (flowType === 'register') {
                return NextResponse.json({
                    ...result,
                    phoneVerified: true,
                    phoneNumber,
                    flowType
                });
            }
            if (flowType === 'login') {
                const user = await User.findOne({ phoneNumber });
                if (!user) {
                    return NextResponse.json(
                        {
                            success: false,
                            error: "Phone number not registered"
                        },

                    );
                }
                return NextResponse.json({
                    ...result,
                    userExists: true,
                    flowType
                });
            }
        }
        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { status: 500, error: "Internal server issue" },
            );
        }
    }
}