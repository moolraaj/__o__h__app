// app/api/auth/register.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/database/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendApprovalEmail } from "@/utils/Email";
import { createVerificationToken } from "@/utils/Constants";
import { Users } from "@/utils/Types";

export async function POST(req: NextRequest) {
  try {
    // 1. pull everything—including OTP fields—from the body
    const {
      name,
      email,
      password,
      phoneNumber,
      role,
      requestId,  
      otp,         
    } = await req.json();

 
    if (
      !name ||
      !email ||
      !password ||
      !phoneNumber ||
      !requestId ||
      !otp
    ) {
      return NextResponse.json(
        { status: 400, error: "All fields + OTP verification are required" },
        { status: 400 }
      );
    }

 
    const verifyRes = await fetch(
      new URL("/api/verify-otp", req.url).toString(),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, otp }),
      }
    );
    const verifyJson = await verifyRes.json();
    if (!verifyRes.ok || !verifyJson.success) {
      return NextResponse.json(
        { status: 400, error: "OTP verification failed" },
        { status: 400 }
      );
    }

 
    await dbConnect();

    if (await User.findOne({ email })) {
      return NextResponse.json(
        { status: 409, error: "Email already in use" },
        { status: 409 }
      );
    }
    if (await User.findOne({ phoneNumber })) {
      return NextResponse.json(
        { status: 409, error: "Phone number already in use" },
        { status: 409 }
      );
    }

 
    const finalRole = role || "user";
    let status: "approved" | "pending" = "approved";
    if (finalRole === "admin" || finalRole === "dantasurakshaks") {
      status = "pending";
    }

 
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role: finalRole,
      status,
      isVerified: true,
    });

 
    const newUserObj = newUser.toObject();
    const userToSend: Users = {
      ...newUserObj,
      _id: String(newUserObj._id),
      phoneNumber: Number(newUserObj.phoneNumber),
    };

    const superAdmins = await User.find({ role: "superadmin" }).select("email");
    const superAdminEmails = superAdmins.map((a) => a.email);

 
    if (status === "pending") {
      const tokenForRoleApproval = await createVerificationToken(
        newUser._id as string
      );
      await sendApprovalEmail(
        userToSend,
        "register",
        tokenForRoleApproval,
        superAdminEmails
      );
    }

 
    if (!newUser.isVerified) {
      const verificationToken = await createVerificationToken(
        newUser._id as string
      );
      await sendApprovalEmail(
        userToSend,
        "registerverificationcode",
        verificationToken
      );
    }

  
    const baseUser = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phoneNumber: Number(newUser.phoneNumber),
      role: newUser.role,
      status: newUser.status,
      isVerified: newUser.isVerified,
    };

 
    return NextResponse.json(
      {
        message:
          status === "approved"
            ? "Registration successful"
            : "Registration submitted; pending approval",
        user: baseUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Server error." },
      { status: 500 }
    );
  }
}
