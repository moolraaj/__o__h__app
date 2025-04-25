
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
      { status: 400, error: 'Please provide either email or phoneNumber (not both).' },

    );
  }

  const identifier = (hasEmail ? email : phoneNumber)!.toString().trim();
  const normalizedId = hasEmail ? identifier.toLowerCase() : identifier;

  let user;

  if (hasEmail) {

    const exists = await validateCredentials(normalizedId);
    if (!exists) {
      return NextResponse.json(
        { status: 404, error: 'Email not registered or invalid email.' },

      );
    }


    if (!password) {
      return NextResponse.json(
        { status: 400, error: 'Password is required when logging in with email.' },

      );
    }

    user = await validateCredentials(normalizedId, password);
    if (!user) {
      return NextResponse.json(
        { status: 401, error: 'Invalid password.' },

      );
    }

  } else {

    user = await validateCredentials(normalizedId);
    if (!user) {
      return NextResponse.json(
        { status: 404, error: 'Phone number not found or invalid number' },

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
      status: 200,
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

  );
}
