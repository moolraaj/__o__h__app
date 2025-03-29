


import { dbConnect } from '@/database/database';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import VerificationToken from '@/models/VerificationToken';
import { sendApprovalEmail } from '@/utils/Email';
import { Users } from '@/utils/Types';
import User from '@/models/User';



// get single user
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  await dbConnect()
  if (!id) {
    return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
  }
  const user = await User.findOne({ _id: id });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'User retrieved successfully', user });
}



// delete single user
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  await dbConnect()
  if (!id) {
    return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
  }
  const user = await User.findOne({ _id: id });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  await user.deleteOne()
  return NextResponse.json({ message: 'User deleted successfully' });
}


// update user
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const body = await req.json();
  const { name, email, password, phoneNumber, role, status } = body;

  await dbConnect();

  if (!id) {
    return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
  }

  const currentUser = await User.findById({ _id: id });
  if (!currentUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

 
  const updateFields: Partial<Users> = {};

  if (name) updateFields.name = name;
  if (email && email !== currentUser.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return NextResponse.json({ error: 'Email is already in use' }, { status: 400 });
    }
    updateFields.email = email;
  }
  if (phoneNumber) updateFields.phoneNumber = Number(phoneNumber);
  if (password) updateFields.password = await bcrypt.hash(password, 10);

  if (status) {
    updateFields.status = status;
    if (status === "approved") {
      updateFields.role = role || currentUser.role;
    } else if (status === "rejected") {
      updateFields.role = "user";
    }
  } else {
    updateFields.status = "pending";
    if (role) {
      updateFields.role = role;
    }
  }

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json({ error: 'No fields to update provided or values are the same.' }, { status: 400 });
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });

  if (
    updatedUser?.status === "pending" &&
    (updatedUser?.role === "admin" || updatedUser?.role === "ambassador")
  ) {
    const token = crypto.randomBytes(32).toString("hex");
    await VerificationToken.create({
      userId: updatedUser._id,
      token,
      createdAt: new Date(),
    });

    
    const userObj = updatedUser.toObject();
    const user: Users = {
      _id: userObj._id ? userObj._id.toString() : '',
      name: userObj.name,
      email: userObj.email,
      phoneNumber: typeof userObj.phoneNumber === 'string' 
        ? Number(userObj.phoneNumber)
        : userObj.phoneNumber,
      password: userObj.password,
      role: userObj.role,
      status: userObj.status,
    };

    await sendApprovalEmail(user, token);
  }

  return NextResponse.json({ message: 'User updated successfully', user: updatedUser });
}






