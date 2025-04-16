import { dbConnect } from '@/database/database';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { sendApprovalEmail } from '@/utils/Email';
import { createVerificationToken } from '@/utils/Constants';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }   
) {
    const  id  = (await params).id;
    try {
        if (!id) {
            return NextResponse.json(
                {status: 400, error: 'User ID (from URL) is required.' },
              
            );
        }
        await dbConnect();
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json(
                {status: 400, error: 'User not found.' },
              
            );
        }

        if (user.isVerified === true) {
            return NextResponse.json(
                { status: 400,error: 'Email is already verified' },
                 
            );
        }

        const token = await createVerificationToken(String(user._id));
        await sendApprovalEmail(user, 'registerverificationcode', token);

        return NextResponse.json(
            { status: 200, message: 'Verification email sent successfully.' }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 500,error: 'Server error.' ,} );
    }
}



 
 