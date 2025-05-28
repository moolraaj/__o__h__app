// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/database/database';
import User from '@/models/User';

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export async function POST(req: NextRequest) {
  try {
    // —————————————————————————————
    // 1) Connect to MongoDB
    // —————————————————————————————
    await dbConnect();

    // —————————————————————————————
    // 2) Parse & validate input
    // —————————————————————————————
    const { name, email, password, phoneNumber } =
      (await req.json()) as RegisterRequestBody;

    if (!name || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { error: 'All fields (name, email, password, phoneNumber) are required.' },
        { status: 400 }
      );
    }

    // —————————————————————————————
    // 3) Ensure phone has been OTP-verified
    // —————————————————————————————
    const preUser = await User.findOne({ phoneNumber });
    if (!preUser || !preUser.isPhoneVerified) {
      return NextResponse.json(
        { error: 'You must verify your phone before registering.' },
        { status: 400 }
      );
    }

    // —————————————————————————————
    // 4) Prevent duplicate email
    // —————————————————————————————
    const emailTaken = await User.findOne({ email });
    if (emailTaken) {
      return NextResponse.json(
        { error: 'Email already in use.' },
        { status: 400 }
      );
    }

    // —————————————————————————————
    // 5) Hash password & populate existing stub
    // —————————————————————————————
    const hashed = await bcrypt.hash(password, 12);
    preUser.name = name;
    preUser.email = email;
    preUser.password = hashed;
    preUser.status = 'approved';       // your default
    // leave role, isVerified (email), isPhoneVerified as-is
    await preUser.save();

    // —————————————————————————————
    // 6) Success
    // —————————————————————————————
    return NextResponse.json(
      { message: 'Registration complete', userId: preUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Server error during registration.' },
      { status: 500 }
    );
  }
}
