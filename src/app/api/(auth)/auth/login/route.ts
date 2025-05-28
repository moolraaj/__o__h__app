 
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
 
import { validateCredentials } from '@/utils/validateCredentials';
import { signAppToken } from '@/utils/Jwt';
import { Users } from '@/utils/Types';
import { dbConnect } from '@/database/database';

interface LoginRequestBody {
  phoneNumber?: string;
  email?: string;
  password?: string;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { phoneNumber, email, password } = (await req.json()) as LoginRequestBody;
    if (!phoneNumber && !(email && password)) {
      return NextResponse.json(
        { status: 400, error: 'Provide phoneNumber or email and password.' },
     
      );
    }
    let user: Users | null = null;
    if (phoneNumber) {
      user = (await validateCredentials(phoneNumber)) as unknown as Users;
    } else {
      user = (await validateCredentials(email!)) as unknown as Users;
    }

    if (!user) {
      return NextResponse.json(
        { status: 404, error: phoneNumber ? 'Invalid phone number.' : 'Invalid credentials.' },
      
      );
    }
    if (!user.isPhoneVerified) {
      return NextResponse.json(
        { status: 403, error: 'Please verify your phone before logging in.' },
        { status: 403 }
      );
    }
    if (email && password) {
      const isValid = await bcrypt.compare(password, user.password || '');
      if (!isValid) {
        return NextResponse.json(
          { status: 401, error: 'Invalid credentials.' },
        
        );
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
       
      );
    }
    const token = await signAppToken({
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
    );

  } catch (error) {
    if(error instanceof Error){
      return NextResponse.json(
        { status: 500, error: 'Server error.' },
      );
    }
 
  }
}
