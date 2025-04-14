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
    const  id = (await params).id;

 

    try {
        const existingQuestionnaire = await Questionnaire.findById(id);
        if (!existingQuestionnaire) {
            return NextResponse.json({ message: 'Questionnaire record not found' }, { status: 404 });
        }
        if (existingQuestionnaire.status !== 'submit') {
            return NextResponse.json(
                { status: 400, message: 'Feedback can only be created when the questionnaire status is submit' }
            );
        }
        if (existingQuestionnaire.send_email_to_dantasurakshaks === true) {
            return NextResponse.json(
                { status: 400, message: "Feedback has already been sent to dantasurakshaks." },
                { status: 400 }
            );
        }

        const formData = await request.formData();
        const questionary_type = formData.get('questionary_type');
        const diagnosis_notes = formData.get('diagnosis_notes');
        const recomanded_actions = formData.get('recomanded_actions');
        const comments_or_notes = formData.get('comments_or_notes');

        const updatedQuestionary = await Questionnaire.findByIdAndUpdate(
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

        if (!updatedQuestionary) {
            return NextResponse.json({ message: 'Error updating questionnaire record' }, { status: 500 });
        }

        await updatedQuestionary.populate('submitted_by', 'email');
        
        const submitterEmail = (updatedQuestionary.submitted_by as unknown as Users)?.email;
      
        if (submitterEmail) {
            
            await sendApprovalEmail(
                updatedQuestionary.toObject() as unknown as LesionEmailData,
                'adminQuestionaryfeedback',
                undefined,
                [submitterEmail]
              );
              

        }

        return NextResponse.json({
            message: `Admin replied successfully to questionnaire id ${id}`,
            status: 200,
            updatedQuestionary,
        });
    } catch (error) {
        console.error("Error while processing PUT:", error);
        if (error instanceof Error) {
            return NextResponse.json({ message: 'Error updating questionnaire record', error: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'Unknown error' }, { status: 500 });
    }
}
