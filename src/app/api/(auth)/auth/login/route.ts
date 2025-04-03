import { dbConnect } from '@/database/database';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber } = await req.json();

    // Validate input
    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Please provide valid credentials' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the user by phone number
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return NextResponse.json(
        { error: 'Please provide valid phone number' },
        { status: 409 }
      );
    }
 
    let finalRole = user.role;
    if ((user.role === 'admin' || user.role === 'dantasurakshaks') && user.status !== 'approved') {
      finalRole = 'user';
    }

   
    return NextResponse.json(
      {
        message: 'Logged in successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: Number(user.phoneNumber),
          role: finalRole,
          status: user.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
