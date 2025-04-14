import { dbConnect } from '@/database/database';
import { NextRequest, NextResponse } from 'next/server';
import { sendApprovalEmail } from '@/utils/Email';
import { LesionEmailData, Users } from '@/utils/Types';
import Questionnaire from '@/models/Questionnaire';



export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const id = (await params).id;
    
    try {
        const existingQuestionnaire = await Questionnaire.findById(id);
        if (!existingQuestionnaire) {
            return NextResponse.json({ message: 'Lesion record not found' }, { status: 404 });
        }
       
        if (existingQuestionnaire.status !== 'submit') {
            return NextResponse.json(
                { status: 400, message: 'Feedback can only be created when the lesion status is submit' }
            );
        }
        if (existingQuestionnaire.send_email_to_dantasurakshaks === true) {
            return NextResponse.json(
                { status: 400, message: "Feedback has already been sent to dantasurakshaks. " },
                { status: 400 }
            );
        }
        const formData = await request.formData();
        const questionary_type = formData.get('questionary_type');
        const diagnosis_notes = formData.get('diagnosis_notes');
        const recomanded_actions = formData.get('recomanded_actions');
        const comments_or_notes = formData.get('comments_or_notes');


        const updatedLesion = await Questionnaire.findByIdAndUpdate(
            id,
            {
                questionary_type,
                diagnosis_notes,
                recomanded_actions,
                comments_or_notes,
                send_email_to_dantasurakshaks: true,
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .select('+questionary_type +diagnosis_notes +recomanded_actions +comments_or_notes +send_email_to_dantasurakshaks');

        if (!updatedLesion) {
            return NextResponse.json({ message: 'Error updating lesion record' }, { status: 500 });
        }
        await updatedLesion.populate('submitted_by', 'email');
        const submitterEmail = (updatedLesion.submitted_by as unknown as Users)?.email;
        if (submitterEmail) {
            await sendApprovalEmail(
                updatedLesion.toObject() as unknown as LesionEmailData,
                'adminQuestionaryfeedback',
                submitterEmail
            );
        }

        return NextResponse.json({
            message: `Admin replied successfully to lesion id ${id}`,
            status: 200,
            updatedLesion,
        });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: 'Error updating lesion record', error }, { status: 500 });
        }

    }
}
