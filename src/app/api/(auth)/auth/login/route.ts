import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials } from '@/utils/validateCredentials';
import { signAppToken } from '@/utils/Jwt';
import { Users } from '@/utils/Types';
import { dbConnect } from '@/database/database';
import bcrypt from 'bcryptjs';

interface LoginRequestBody {
  phoneNumber?: string;
  email?: string;
  password?: string;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { phoneNumber, email, password }: LoginRequestBody = await req.json();


    if (!phoneNumber && !(email && password)) {
      return NextResponse.json(
        { status: 404, error: 'Either phone number or email and password required' },

      );
    }


    const user = await validateCredentials(phoneNumber || email!) as unknown as Users | null;
    if (!user) {
      return NextResponse.json(
        { status: 404, error: phoneNumber ? 'Invalid phone number' : 'Invalid credentials' },

      );
    }


    if (email && password) {
      const isPasswordValid = await bcrypt.compare(password, user.password || '');
      if (!isPasswordValid) {
        return NextResponse.json({ status: 401, error: 'Invalid credentials' });
      }
    }


    if ((user.role === 'admin' || user.role === 'dantasurakshaks') && user.status === 'pending') {
      const token = await signAppToken({
        id: user._id.toString(),
        phoneNumber: user.phoneNumber,
        email: user.email,
        name: user.name,
        role: 'user',
      });

      return NextResponse.json({
        status: 200,
        message: 'Logged in with limited user access',
        token,
        user: {
          id: user._id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
          role: 'user',
          status: user.status
        },
      });
    }


    const token = await signAppToken({
      id: user._id.toString(),
      phoneNumber: user.phoneNumber,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      status: 200,
      message: `${user.name} logged in successfully!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
        email: user.email,
        status: user.status
      },
    },);

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { status: 500, error: 'Server error.' },

      );
    }

  }
}