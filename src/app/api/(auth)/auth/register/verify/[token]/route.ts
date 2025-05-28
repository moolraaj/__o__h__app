
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import User from '@/models/User';
import { dbConnect } from '@/database/database';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, email, password, phoneNumber } = (await req.json()) as RegisterBody;
    if (!name || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { status: 400, error: 'All fields (name, email, password, phoneNumber) are required.' },

      );
    }
    const preUser = await User.findOne({ phoneNumber });
    if (!preUser || !preUser.isPhoneVerified) {
      return NextResponse.json(
        { status: 400, error: 'You must verify your phone before registering.' },

      );
    }
    const emailInUse = await User.findOne({ email });
    if (emailInUse) {
      return NextResponse.json(
        { status: 400, error: 'Email already in use.' },

      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    preUser.name = name;
    preUser.email = email;
    preUser.password = hashedPassword;
    preUser.status = 'approved';
    await preUser.save();
    return NextResponse.json(
      { status: 201, message: 'Registration complete', userId: preUser._id },
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { status: 500, error: 'Server error during registration.' },
      );
    }
  }
}
