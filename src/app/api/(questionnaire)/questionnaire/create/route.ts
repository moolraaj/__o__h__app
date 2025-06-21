
import { NextResponse, NextRequest } from 'next/server';
import Questionnaire from '@/models/Questionnaire';

import { dbConnect } from '@/database/database';
import { ValidateQuestionnaireFields } from '@/validators/Validate';
import { QuestionnaireTypes } from '@/utils/Types';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();


    const data: Partial<QuestionnaireTypes> = {
      demographics: formData.get('demographics')?.toString() || '',
      name: formData.get('name')?.toString() || '',
      age: Number(formData.get('age') || 0),
      gender: formData.get('gender')?.toString() || '',
      bloodGroup: formData.get('bloodGroup')?.toString() || '',
      idCardAvailable: formData.get('idCardAvailable')?.toString() || '',
      cardNumber: formData.get('cardNumber')?.toString() || '',
      religion: formData.get('religion')?.toString() || '',
      religion_input: formData.get('religion_input')?.toString() || '',
      education: formData.get('education')?.toString() || '',
      occupation: formData.get('occupation')?.toString() || '',
      income: Number(formData.get('income') || 0),
      phoneNumber: formData.get('phoneNumber')?.toString() || '',
      address: formData.get('address')?.toString() || '',
      familyHistory: formData.get('familyHistory')?.toString() || '',
      firstDegreeRelativeOralCancer: formData.get('firstDegreeRelativeOralCancer')?.toString() || '',
      height: Number(formData.get('height') || 0),
      diabetes: formData.get('diabetes')?.toString() || '',
      hypertension: formData.get('hypertension')?.toString() || '',
      dietHistory: formData.get('dietHistory')?.toString() || '',
      fruitsConsumption: formData.get('fruitsConsumption')?.toString() || '',
      vegetableConsumption: formData.get('vegetableConsumption')?.toString() || '',
      habitHistory: formData.get('habitHistory')?.toString() || '',
      tobaccoChewer: formData.get('tobaccoChewer')?.toString() || '',
      tobaccoType: formData.get('tobaccoType')?.toString() || '',
      discontinuedHabit: formData.get('discontinuedHabit')?.toString() || '',
      durationOfDiscontinuingHabit: formData.get('durationOfDiscontinuingHabit')?.toString() || '',
      otherConsumptionHistory: formData.get('otherConsumptionHistory')?.toString() || '',
      alcoholConsumption: formData.get('alcoholConsumption')?.toString() || '',
      smoking: formData.get('smoking')?.toString() || '',
      oralCavityExamination: formData.get('oralCavityExamination')?.toString() || '',
      presenceOfLesion: formData.get('presenceOfLesion')?.toString() || '',
      reductionInMouthOpening: formData.get('reductionInMouthOpening')?.toString() || '',
      suddenWeightLoss: formData.get('suddenWeightLoss')?.toString() || '',
      presenceOfSharpTeeth: formData.get('presenceOfSharpTeeth')?.toString() || '',
      presenceOfDecayedTeeth: formData.get('presenceOfDecayedTeeth')?.toString() || '',
      presenceOfFluorosis: formData.get('presenceOfFluorosis')?.toString() || '',
      submitted_by: formData.get('submitted_by')?.toString() || ''
    };


    const sendToRaw = formData.get('send_to') as string;
    let send_to: string[] = [];
    if (sendToRaw) {
      try {
        send_to = JSON.parse(sendToRaw);
      } catch (error) {
        if (error instanceof Error) {
          send_to = [sendToRaw];
        }

      }
    }
    data.send_to = send_to;

    if (formData.has('presenceOfGumDisease')) {
      const gumValue = formData.get('presenceOfGumDisease');
      if (gumValue) {
        const rawGum = gumValue.toString();

        data.presenceOfGumDisease = rawGum.includes(',')
          ? rawGum.split(',').map(item => item.trim()).filter(item => item !== '')
          : [rawGum.trim()];
      }
    }


    const validatedData = ValidateQuestionnaireFields(data);


    const doc = new Questionnaire(validatedData);
    await doc.save();

    return NextResponse.json({ status: 201, success: true, data: doc });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { success: false, message: err.message || 'Error creating questionnaire' },
        { status: 400 }
      );

    }

  }
}
