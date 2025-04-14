 



 

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { EmailData, LesionEmailData, RegisterEmailData, RegisterVerificationEmailData } from './Types';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendApprovalEmail = async (
  data: EmailData,
  type: 'register' | 'lesion' | 'questionnaire' | 'adminlesionfeedback' | 'registerverificationcode'|'adminQuestionaryfeedback',
  token?: string,
  recipients?: string[]
) => {
  let approvalLink = '';
  let rejectionLink = '';
  let subject = '';
  let htmlContent = '';

  if (type === 'register') {
    if (token) {
      approvalLink = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify/${token}?action=approve`;
      rejectionLink = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify/${token}?action=reject`;
    }
    subject = 'Approve or Reject New Admin/Ambassador Registration';
    htmlContent = `
      <html>
        <head>
          <style>
            /* CSS styles for registration email */
          </style>
        </head>
        <body>
          <div class="wrapper">
            <h1>Hi Super Admin,</h1>
            <h3>A new user registered as <b>${(data as RegisterEmailData).role}</b>. Please review the details below:</h3>
            <ul class="table_content">
              <li><p>Name:</p><p>${(data as RegisterEmailData).name}</p></li>
              <li><p>Email:</p><p>${(data as RegisterEmailData).email}</p></li>
              <li><p>Phone:</p><p>${(data as RegisterEmailData).phoneNumber}</p></li>
            </ul>
            <div class="actions">
              <h5>Please choose one of the following actions</h5>
              <p>
                ${token ? `<a href="${approvalLink}" style="background:#2ecc71; color: #fff;">Approve</a>
                <a href="${rejectionLink}" style="background:#e74c3c; color: #fff; margin-left:30px;">Reject</a>` : ''}
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  } else if (type === 'registerverificationcode') {
    if (token) {
      approvalLink = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/verify/${token}?action=verify`;
    }
    subject = 'Verify Your Email Address';
    htmlContent = `
      <html>
        <head>
          <style>
            /* CSS styles for email verification */
          </style>
        </head>
        <body>
          <div class="wrapper">
            <h1>Email Verification</h1>
            <p>Hello ${(data as RegisterVerificationEmailData).name},</p>
            <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
            <p>
              ${token ? `<a href="${approvalLink}" style="background:#2ecc71; color: #fff;">Verify</a>` : ''}
            </p>
          </div>
        </body>
      </html>
    `;
  } else if (type === 'lesion') {
    if (token) {
      approvalLink = `${process.env.NEXT_PUBLIC_API_URL}/api/lesion/verify/${token}?action=approve`;
      rejectionLink = `${process.env.NEXT_PUBLIC_API_URL}/api/lesion/verify/${token}?action=reject`;
    }
    subject = 'New Lesion Record Submitted for Approval';
    htmlContent = `
      <html>
        <head>
          <style>
            /* CSS styles for lesion email */
          </style>
        </head>
        <body>
          <div class="wrapper">
            <h1>Lesion Approval Request</h1>
            <p>A lesion record was submitted with the following details:</p>
            <pre>${JSON.stringify(data, null, 2)}</pre>
            <div class="actions">
              <p>${token ? `<a href="${approvalLink}">Approve</a>` : ''}</p>
            </div>
          </div>
        </body>
      </html>
    `;
  } else if (type === 'questionnaire') {
    if (token) {
      approvalLink = `${process.env.NEXT_PUBLIC_API_URL}/api/questionnaire/verify/${token}?action=approve`;
      rejectionLink = `${process.env.NEXT_PUBLIC_API_URL}/api/questionnaire/verify/${token}?action=reject`;
    }
    subject = 'New Questionnaire Submitted for Approval';
    htmlContent = `
      <html>
        <head>
          <style>
            .wrapper { padding: 32px; border: 1px solid #80808036; max-width: 550px; width: 100%; }
            pre { background: #f4f4f4; padding: 10px; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <h1>Questionnaire Approval Request</h1>
            <p>A new questionnaire was submitted with the following details:</p>
            <pre>${JSON.stringify(data, null, 2)}</pre>
            <div class="actions">
              <p>${token ? `<a href="${approvalLink}">Approve</a>` : ''}</p>
            </div>
          </div>
        </body>
      </html>
    `;
  } else if (type === 'adminlesionfeedback') {
    subject = 'Your Lesion Record Has Received Admin Feedback';
    htmlContent = `
      <html>
        <head>
          <style>
              /* CSS styles for admin lesion feedback */
          </style>
        </head>
        <body>
          <div class="wrapper">
            <h1>Admin Feedback Received</h1>
            <p>Your lesion record (ID: ${(data as LesionEmailData)._id}) has received new admin feedback.</p>
            <p>Feedback Details:</p>
            <ul>
              <li><strong>Lesion Type:</strong> ${(data as LesionEmailData).lesion_type || 'N/A'}</li>
              <li><strong>Diagnosis Notes:</strong> ${(data as LesionEmailData).diagnosis_notes || 'N/A'}</li>
              <li><strong>Recommended Actions:</strong> ${(data as LesionEmailData).recomanded_actions || 'N/A'}</li>
              <li><strong>Additional Comments:</strong> ${(data as LesionEmailData).comments_or_notes || 'N/A'}</li>
            </ul>
            <p>Please log in to your dashboard for full details.</p>
          </div>
        </body>
      </html>
    `;
  }else if(type==='adminQuestionaryfeedback'){
    subject = 'Your Questionary Record Has Received Admin Feedback';
    htmlContent = `
      <html>
        <head>
          <style>
              /* CSS styles for admin lesion feedback */
          </style>
        </head>
        <body>
          <div class="wrapper">
            <h1>Admin Feedback Received</h1>
            <p>Your lesion record (ID: ${(data as LesionEmailData)._id}) has received new admin feedback.</p>
            <p>Feedback Details:</p>
            <ul>
              <li><strong>Lesion Type:</strong> ${(data as LesionEmailData).questionary_type || 'N/A'}</li>
              <li><strong>Diagnosis Notes:</strong> ${(data as LesionEmailData).diagnosis_notes || 'N/A'}</li>
              <li><strong>Recommended Actions:</strong> ${(data as LesionEmailData).recomanded_actions || 'N/A'}</li>
              <li><strong>Additional Comments:</strong> ${(data as LesionEmailData).comments_or_notes || 'N/A'}</li>
            </ul>
            <p>Please log in to your dashboard for full details.</p>
          </div>
        </body>
      </html>
    `;
    
  }

  const toEmails =
    type === 'registerverificationcode'
      ? (data as RegisterVerificationEmailData).email
      : recipients && recipients.length > 0
      ? type === 'lesion'
        ? recipients.join(',')
        : recipients[0]
      : process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL;

  const mailOptions = {
    from: process.env.GMAIL,
    to: toEmails,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ status: 200, message: `Email sent successfully to ${info.messageId}` });
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error sending email:', error);
    }
    // You could return an error response here if desired
  }
};
