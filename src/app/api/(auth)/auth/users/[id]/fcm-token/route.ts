import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/database/database";
import User from "@/models/User";
import { authOptions } from "../../../authOptions";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id=(await params).id
    await dbConnect();

    // ✅ Get NextAuth session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ status: 401, message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Check if the logged-in user is updating their own FCM token
    if (session.user.id !== id) {
      return NextResponse.json({ status: 403, message: "Forbidden" }, { status: 403 });
    }

    const { fcmToken } = await req.json();
    if (!fcmToken) {
      return NextResponse.json({ status: 400, message: "FCM token required" }, { status: 400 });
    }

    await User.findByIdAndUpdate(id, { fcmToken });

    return NextResponse.json({ status: 200, message: "FCM token updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500, message: "Server error" }, { status: 500 });
  }
}
