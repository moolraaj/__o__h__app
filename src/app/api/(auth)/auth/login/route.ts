// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/database/database';
import User from '@/models/User';
import { signAppToken } from '@/utils/Jwt';

interface LoginRequestBody {
  phoneNumber?: string;
  email?: string;
  password?: string;
}

export async function POST(req: NextRequest) {
  try {
    // 1) Connect
    await dbConnect();

    // 2) Parse payload
    const { phoneNumber, email, password } = (await req.json()) as LoginRequestBody;

    // 3) Require either phone OR email+password
    if (!phoneNumber && !(email && password)) {
      return NextResponse.json(
        { status: 400, error: 'Provide phoneNumber or email and password.' },
        { status: 400 }
      );
    }

    // 4) Lookup user directly in MongoDB
    let user = null;
    if (phoneNumber) {
      user = await User.findOne({ phoneNumber }).lean();
    } else {
      user = await User.findOne({ email }).lean();
    }

    if (!user) {
      return NextResponse.json(
        {
          status: 404,
          error: phoneNumber ? 'Invalid phone number.' : 'Invalid credentials.',
        },
        { status: 404 }
      );
    }

    // 5) Enforce phone-verification
    if (!user.isPhoneVerified) {
      return NextResponse.json(
        { status: 403, error: 'Please verify your phone before logging in.' },
        { status: 403 }
      );
    }

    // 6) If email+password, verify password
    if (email && password) {
      const isValid = await bcrypt.compare(password, user.password || '');
      if (!isValid) {
        return NextResponse.json(
          { status: 401, error: 'Invalid credentials.' },
          { status: 401 }
        );
      }
    }

    // 7) Limited-access logic
    if (
      (user.role === 'admin' || user.role === 'dantasurakshaks') &&
      user.status === 'pending'
    ) {
      const token = signAppToken({
        id: user._id.toString(),
        phoneNumber: user.phoneNumber,
        email: user.email,
        name: user.name,
        role: 'user',
      });
      return NextResponse.json(
        {
          status: 200,
          message: 'Logged in with limited user access.',
          token,
          user: {
            id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            email: user.email,
            role: 'user',
            status: user.status,
          },
        },
        { status: 200 }
      );
    }

    // 8) Full-access login
    const token = signAppToken({
      id: user._id.toString(),
      phoneNumber: user.phoneNumber,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json(
      {
        status: 200,
        message: `${user.name} logged in successfully!`,
        token,
        user: {
          id: user._id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if(error instanceof Error){
      return NextResponse.json(
        { status: 500, error: 'Server error.' },
        { status: 500 }
      );
    }
  }
}
