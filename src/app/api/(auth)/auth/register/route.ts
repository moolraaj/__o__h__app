import { dbConnect } from '@/database/database';
import User from '@/models/User';
 
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Users } from '@/utils/Types';
import { sendApprovalEmail } from '@/utils/Email';
import { createVerificationToken } from '@/utils/Constants';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phoneNumber, role } = await req.json();
    if (!name || !email || !password || !phoneNumber) {
      return NextResponse.json(
        {status: 400, error: 'All fields are required' },
        
      );
    }
    await dbConnect();
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return NextResponse.json(
        { status: 409 ,error: 'User with this email already exists.' },
        
      );
    }
    const existingUserByPhone = await User.findOne({ phoneNumber });
    if (existingUserByPhone) {
      return NextResponse.json(
        { status: 409,error: 'User with this phone number already exists.' },
     
      );
    }

    const finalRole = role || 'user';
   
    let status = 'approved';
    if (finalRole === 'admin' || finalRole === 'dantasurakshaks') {
      status = 'pending';
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role: finalRole,
      status,
    });

    
    const newUserObj = newUser.toObject();
    const userToSend: Users = {
      ...newUserObj,
      _id: String(newUserObj._id),
      phoneNumber: Number(newUserObj.phoneNumber),
    };

    if (status === 'pending') {

       const tokenForRoleApproval = await createVerificationToken(newUser._id as string);
      await sendApprovalEmail(userToSend, 'register', tokenForRoleApproval);
    }

    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phoneNumber: Number(newUser.phoneNumber),
          role: newUser.role,
          status: newUser.status,
          isVerified:false
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
