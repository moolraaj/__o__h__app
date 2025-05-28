import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/database/database'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { signAppToken } from '@/utils/Jwt'
import { sendApprovalEmail } from '@/utils/Email'
import { createVerificationToken } from '@/utils/Constants'
import { Users } from '@/utils/Types'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phoneNumber, role, phoneVerified } = await req.json();
    
    if (!name || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { status: 400, error: 'All fields are required' },
        
      );
    }

   
    if (!phoneVerified) {
      return NextResponse.json(
        { status: 403, error: 'Phone number not verified' },
    
      );
    }

    await dbConnect();

    if (await User.findOne({ email })) {
      return NextResponse.json(
        { status: 409, error: 'Email already in use' },
      
      );
    }
    
    if (await User.findOne({ phoneNumber })) {
      return NextResponse.json(
        { status: 409, error: 'Phone number already in use' },
      
      );
    }

    const finalRole = role || 'user';
    let status: 'approved' | 'pending' = 'approved';
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
      isVerified: false,
      phoneIsVerified: true  
    });

    const newUserObj = newUser.toObject();
    const userToSend: Users = {
      ...newUserObj,
      _id: String(newUserObj._id),
      phoneNumber: Number(newUserObj.phoneNumber),
    };

    const superAdmins = await User.find({ role: 'superadmin' }).select('email');
    const superAdminEmails = superAdmins.map(admin => admin.email);

    if (status === 'pending') {
      const tokenForRoleApproval = await createVerificationToken(newUser._id as string);
      await sendApprovalEmail(
        userToSend, 
        'register', 
        tokenForRoleApproval,
        superAdminEmails
      );
    }

    if (!newUser.isVerified) {
      const verificationToken = await createVerificationToken(newUser._id as string);
      await sendApprovalEmail(
        userToSend,
        'registerverificationcode',
        verificationToken
      );
    }

    const baseUser = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      role: newUser.role,
      status: newUser.status,
      isVerified: newUser.isVerified,
      phoneIsVerified: newUser.phoneIsVerified
    };

    if (finalRole === 'user') {
      const token = await signAppToken({
        id: userToSend._id,
        phoneNumber: userToSend.phoneNumber,
        name: userToSend.name,
        role: userToSend.role,
      });

      return NextResponse.json(
        {
          status: 201,
          message: 'Registration successful',
          user: baseUser,
          token
        },
       
      );
    }

    return NextResponse.json(
      {
        status: 201,
        message: 'Registration successful; pending approval',
        user: baseUser,
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