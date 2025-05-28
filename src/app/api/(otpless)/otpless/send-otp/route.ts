import { dbConnect } from '@/database/database';
import User from '@/models/User';
import { initiateOtp } from '@/utils/Constants';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    await dbConnect();
    const { phoneNumber } = await req.json();
    const user = await User.findOne({ phoneNumber });
    if (user) {
        const result = await initiateOtp(phoneNumber);
        return NextResponse.json({ type: 'login', ...result });
    } else {
        const result = await initiateOtp(phoneNumber);
        return NextResponse.json({ type: 'register', ...result });
    }
}
