import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials } from '@/utils/validateCredentials';
import { signAppToken } from '@/utils/Jwt';
import { Users } from '@/utils/Types';
import { dbConnect } from '@/database/database';

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const { phoneNumber } = await req.json();
    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }

    const user = await validateCredentials(phoneNumber) as unknown as Users;      
    if (!user) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 404 });
    }
    
    // Check if user has privileged role but status is pending
    if ((user.role === 'admin' || user.role === 'dantasurakshaks') && user.status === 'pending') {
      // Create token with default 'user' role instead of their actual role
      const token = await signAppToken({
        id: user._id.toString(),
        phoneNumber: user.phoneNumber,
        name: user.name,
        role: 'user', // Force user role until approved
      });

      return NextResponse.json(
        {
          error: 'Your account is pending approval. Please wait for admin approval.',
          message: 'Logged in with limited user access',
          token,
          user: { 
            id: user._id, 
            name: user.name, 
            phoneNumber: user.phoneNumber, 
            role: 'user', // Return user role in response
            status: user.status 
          },
        },
        { status: 200 },
      );
    }

    // Normal login for approved users or regular users
    const token = await signAppToken({
      id: user._id.toString(),
      phoneNumber: user.phoneNumber,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json(
      {
        message: `${user.name} logged in successfully!`,
        token,
        user: { 
          id: user._id, 
          name: user.name, 
          phoneNumber: user.phoneNumber, 
          role: user.role,
          status: user.status 
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Server error.' },
      { status: 500 }
    );
  }
}