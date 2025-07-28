import admin from '@/firebasepusher/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';
 

export async function POST(req: NextRequest) {
  try {
    const { token, title, body } = await req.json();

    if (!token) {
      return NextResponse.json({ status: 400, message: 'FCM token required' }, { status: 400 });
    }

    const message = {
      notification: {
        title: title || '🧪 Test Notification',
        body: body || 'This is a test message from Firebase.',
      },
      token,
    };

    const response = await admin.messaging().send(message);
    return NextResponse.json({ status: 200, message: 'Notification sent!', response });
  } catch (err) {
    if(err instanceof Error){
        return NextResponse.json({ status: 500, message: 'Failed to send notification', error: err.message });
    }
    
  }
}
