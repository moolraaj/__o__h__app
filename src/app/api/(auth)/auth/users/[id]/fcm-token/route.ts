import { NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import User from '@/models/User';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    const id=(await params).id
  try {
    await dbConnect();
    const { fcmToken } = await request.json();

    if (!fcmToken) {
      return NextResponse.json({ status: 400, message: "FCM token required" });
    }
    await User.findByIdAndUpdate(id, { fcmToken }, { new: true });
    return NextResponse.json({ status: 200, message: "FCM token updated" });
  } catch (error) {
    return NextResponse.json({ status: 500, message: "Error updating FCM token" });
  }
}
