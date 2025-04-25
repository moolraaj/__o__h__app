 
import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials } from '@/utils/validateCredentials';
import { signAppToken } from '@/utils/Jwt';
import { Users } from '@/utils/Types';
import { dbConnect } from '@/database/database';

export async function POST(req: NextRequest) {
  await dbConnect()
  const { phoneNumber } = await req.json();
  if (!phoneNumber) {
    return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
  }

  const user = await validateCredentials(phoneNumber) as unknown as Users;      
  if (!user) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 404 });
  }

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
      user: { id: user._id, name: user.name, phoneNumber: user.phoneNumber, role: user.role },
    },
    { status: 200 },
  );
}

