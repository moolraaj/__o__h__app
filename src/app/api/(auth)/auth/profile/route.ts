

import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { dbConnect } from '@/database/database'
import UserModel from '@/models/User'
const secret = process.env.NEXTAUTH_SECRET!
export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret })
    if (!token) {
        return NextResponse.json({ status: 401, error: 'Unauthorized' })
    }
    await dbConnect()
    const user = await UserModel
        .findById(token.id)
        .select('-password')
        .lean()
    if (!user || user.role !== token.role) {
        return NextResponse.json({ status: 401, error: 'Session invalidated' })
    }
    return NextResponse.json({ status: 200, user })
}
