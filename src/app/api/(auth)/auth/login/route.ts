
import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials } from '@/utils/validateCredentials';
import { signAppToken } from '@/utils/Jwt';
import { dbConnect } from '@/database/database';

export async function POST(req: NextRequest) {
  await dbConnect();

  const { email, phoneNumber, password } = await req.json();

  const hasEmail = typeof email === 'string' && email.trim() !== '';
  const hasPhone = typeof phoneNumber === 'string' && phoneNumber.trim() !== '';


  if (hasEmail === hasPhone) {
    return NextResponse.json(
      { error: 'Please provide either email or phoneNumber (not both).' },
      { status: 400 }
    );
  }

  const identifier = (hasEmail ? email : phoneNumber)!.toString().trim();
  const normalizedId = hasEmail ? identifier.toLowerCase() : identifier;

  let user;

  if (hasEmail) {

    const exists = await validateCredentials(normalizedId);
    if (!exists) {
      return NextResponse.json(
        { error: 'Email not registered.' },
        { status: 404 }
      );
    }


    if (!password) {
      return NextResponse.json(
        { error: 'Password is required when logging in with email.' },
        { status: 400 }
      );
    }

    user = await validateCredentials(normalizedId, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid password.' },
        { status: 401 }
      );
    }

  } else {

    user = await validateCredentials(normalizedId);
    if (!user) {
      return NextResponse.json(
        { error: 'Phone number not found.' },
        { status: 404 }
      );
    }
  }


  const token = await signAppToken({
    id: user._id,
    name: user.name,
    role: user.role,
    email: user.email,
    phoneNumber: user.phoneNumber,
  });

  return NextResponse.json(
    {
      message: `${user.name} logged in successfully!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    },
    { status: 200 }
  );
}
