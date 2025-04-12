
import { NextResponse } from 'next/server';
import { dbConnect } from '@/database/database';
import { LesionModel } from '@/models/Lesion';
import VerificationToken from '@/models/VerificationToken';
import { renderConfirmationPage } from '@/utils/Constants';

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
    const token = (await params).token;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    try {
        await dbConnect();
        const verifyToken = await VerificationToken.findOne({ token });
        if (!verifyToken) {
            return NextResponse.json({ error: 'Invalid or expired token.' , status: 400 });
        }
        const lesion = await LesionModel.findById(verifyToken.userId);
        if (!lesion) {
            return NextResponse.json({ error: 'Lesion record not found.' , status: 404 });
        }
        if (action === 'approve') {
            lesion.adminAction = true;
        } else {
            return NextResponse.json({ error: 'Invalid action.' ,status: 400 });
        }
        await lesion.save();
        await VerificationToken.deleteOne({ token });


        const html = renderConfirmationPage({
            recordType: "Lesion",
            action: action || '',
            id: lesion._id as string,    
            redirectUrl:process.env.NEXT_PUBLIC_API_URL
          });
      
          return new NextResponse(html, {
            status: 200,
            headers: { 'Content-Type': 'text/html' },
          });

     } catch (error) {
        if(error instanceof Error){
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        
    }
}
