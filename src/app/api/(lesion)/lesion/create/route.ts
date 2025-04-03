import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/database/database'; 
import LesionModel from '@/models/Lesion';  
import User from '@/models/User';  
import { uploadPhotoToCloudinary } from '@/utils/Cloudinary';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const formData = await req.formData();
        const fullName = formData.get('fullName');
        const age = formData.get('age');
        const gender = formData.get('gender');
        const contactNumber = formData.get('contactNumber');
        const location = formData.get('location');
        const symptoms = formData.get('symptoms');
        const duration = formData.get('duration');
        const habits = formData.get('habits');
        const previousDentalTreatments = formData.get('previousDentalTreatments');
        const submittedBy = formData.get('submittedBy');
        const images = formData.getAll('files') as Blob[];

      
        if (images.length === 0) {
            return NextResponse.json({ error: 'At least one photo is required' }, { status: 400 });
        }

 
        const user = await User.findById(submittedBy);
        if (!user || user.role !== 'dantasurakshaks') {
            return NextResponse.json({ error: 'Please provide a valid Ambassador ID' }, { status: 404 });
        }

       
        const imageUrls: string[] = [];
        for (const image of images) {
            const photoUrl = await uploadPhotoToCloudinary(image);
            imageUrls.push(photoUrl);
        }

      
        const newLesion = new LesionModel({
            fullName,
            age,
            gender,
            contactNumber,
            location,
            symptoms,
            duration,
            habits,
            previousDentalTreatments,
            submittedBy,
            images: imageUrls,
        });

 
        await newLesion.save();

 
        if (user.role === 'dantasurakshaks') {
    
            const admins = await User.find({ role: 'admin' });

          
            newLesion.assignedToAdmins = admins.map(admin => admin._id);
            await newLesion.save();
            console.log("Notified admins about the new lesion:", admins);
        }
        return NextResponse.json({
            message: 'Lesion created successfully!',
            lesion: newLesion,
        }, { status: 200 });
    } catch (err) {
        if(err instanceof Error){

            return NextResponse.json({ error: 'An error occurred while creating the lesion.' }, { status: 500 });
        }
    }
}
