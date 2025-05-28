 
import { dbConnect } from '@/database/database';
import User from '@/models/User';
import { verifyOtp } from '@/utils/Constants';
import { NextRequest, NextResponse } from 'next/server';
 

export async function POST(req: NextRequest) {
  await dbConnect();
  const { requestId, otp, phoneNumber } = await req.json();

 
  const result = await verifyOtp(requestId, otp);
 

 
  if (result.status !== 'OK') {
 
    return NextResponse.json(
      { error: result.message || 'Invalid or expired OTP' },
      { status: 400 }
    );
  }

   
  const user = await User.findOneAndUpdate(
    { phoneNumber },
    { isPhoneVerified: true },
    { new: true }
  );
  return NextResponse.json({ message: 'Phone verified', user });
}
