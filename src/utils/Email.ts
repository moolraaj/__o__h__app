 

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
  EmailData,
  LesionEmailData,
  RegisterEmailData,
  RegisterVerificationEmailData
} from './Types';

const HOST = "https://o-h-app.vercel.app";
// const HOST = "http://localhost:3000";

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
  type:
    | 'register'
    | 'lesion'
    | 'questionnaire'
    | 'adminlesionfeedback'
    | 'adminQuestionaryfeedback'
    | 'registerverificationcode'
    | 'forgotPassword',             
  token?: string,
  recipients?: string[]
) => {
  let approvalLink = '';
  let rejectionLink = '';
  let subject = '';
  let htmlContent = '';

 
  if (type === 'forgotPassword') {
    subject = 'Your Password Reset Code';
    htmlContent = `
      <html>
        <body style="font-family:sans-serif;line-height:1.4">
          <h2>Password Reset Requested</h2>
          <p>We received a request to reset your password for <b>${(data as RegisterVerificationEmailData).email}</b>.</p>
          <p>Your one-time code is:</p>
          <p style="font-size:1.5rem;font-weight:bold;">${token}</p>
          <p>If you did not request this, please ignore this email.</p>
        </body>
      </html>
    `;
  }
  

  else if (type === 'register') {
    if (token) {
      approvalLink = `${HOST}/api/auth/verify/${token}?action=approve`;
      rejectionLink = `${HOST}/api/auth/verify/${token}?action=reject`;
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
            <h3>
              A new user registered as
              <b>${(data as RegisterEmailData).role}</b>. Please review:
            </h3>
            <ul class="table_content">
              <li>
                <p>Name:</p><p>${(data as RegisterEmailData).name}</p>
              </li>
              <li>
                <p>Email:</p><p>${(data as RegisterEmailData).email}</p>
              </li>
              <li>
                <p>Phone:</p><p>${(data as RegisterEmailData).phoneNumber}</p>
              </li>
            </ul>
            <div class="actions">
              <h5>Please choose an action</h5>
              <p>
                ${token
                  ? `<a href="${approvalLink}" style="background:#2ecc71; color:#fff; padding:8px 12px; text-decoration:none;">Approve</a>
                     <a href="${rejectionLink}" style="background:#e74c3c; color:#fff; padding:8px 12px; margin-left:20px; text-decoration:none;">Reject</a>`
                  : ''}
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  else if (type === 'registerverificationcode') {
    if (token) {
      approvalLink = `${HOST}/api/auth/register/verify/${token}?action=verify`;
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
            <p>
              Please verify your email by clicking the button below:
            </p>
            <p>
              ${token
                ? `<a href="${approvalLink}" style="background:#2ecc71; color:#fff; padding:8px 12px; text-decoration:none;">Verify</a>`
                : ''}
            </p>
          </div>
        </body>
      </html>
    `;
  }

  else if (type === 'lesion') {
    if (token) {
      approvalLink = `${HOST}/api/lesion/verify/${token}?action=approve`;
      rejectionLink = `${HOST}/api/lesion/verify/${token}?action=reject`;
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
            <p>Details submitted:</p>
            <pre>${JSON.stringify(data, null, 2)}</pre>
            <div class="actions">
              <p>${token ? `<a href="${approvalLink}">Approve</a>` : ''}</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  else if (type === 'questionnaire') {
    if (token) {
      approvalLink = `${HOST}/api/questionnaire/verify/${token}?action=approve`;
      rejectionLink = `${HOST}/api/questionnaire/verify/${token}?action=reject`;
    }
    subject = 'New Questionnaire Submitted for Approval';
    htmlContent = `
      <html>
        <head>
          <style>
            .wrapper { padding:32px; border:1px solid #ccc; max-width:550px; }
            pre { background:#f4f4f4; padding:10px; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <h1>Questionnaire Approval Request</h1>
            <p>Details:</p>
            <pre>${JSON.stringify(data, null, 2)}</pre>
            <div class="actions">
              <p>${token ? `<a href="${approvalLink}">Approve</a>` : ''}</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  else if (type === 'adminlesionfeedback') {
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
            <p>
              Your lesion record (ID: ${(data as LesionEmailData)._id})
              has new feedback.
            </p>
            <ul>
              <li><strong>Type:</strong> ${(data as LesionEmailData).lesion_type || 'N/A'}</li>
              <li><strong>Notes:</strong> ${(data as LesionEmailData).diagnosis_notes || 'N/A'}</li>
              <li><strong>Actions:</strong> ${(data as LesionEmailData).recomanded_actions || 'N/A'}</li>
              <li><strong>Comments:</strong> ${(data as LesionEmailData).comments_or_notes || 'N/A'}</li>
            </ul>
            <p>Please log in for full details.</p>
          </div>
        </body>
      </html>
    `;
  }

  else if (type === 'adminQuestionaryfeedback') {
    subject = 'Your Questionnaire Record Has Received Admin Feedback';
    htmlContent = `
      <html>
        <head>
          <style>
            /* CSS styles for admin questionnaire feedback */
          </style>
        </head>
        <body>
          <div class="wrapper">
            <h1>Admin Feedback Received</h1>
            <p>
              Your questionnaire (ID: ${(data as LesionEmailData)._id})
              has new feedback.
            </p>
            <ul>
              <li><strong>Type:</strong> ${(data as LesionEmailData).questionary_type || 'N/A'}</li>
              <li><strong>Notes:</strong> ${(data as LesionEmailData).diagnosis_notes || 'N/A'}</li>
              <li><strong>Actions:</strong> ${(data as LesionEmailData).recomanded_actions || 'N/A'}</li>
              <li><strong>Comments:</strong> ${(data as LesionEmailData).comments_or_notes || 'N/A'}</li>
            </ul>
            <p>Please log in for full details.</p>
          </div>
        </body>
      </html>
    `;
  }

  // determine recipient
  const toEmails =
    (type === 'registerverificationcode' || type === 'forgotPassword')
      ? (data as RegisterVerificationEmailData).email
      : recipients && recipients.length > 0
        ? Array.isArray(recipients)
          ? recipients.join(',')
          : recipients
        : process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL!;

  const mailOptions = {
    from:    process.env.GMAIL,
    to:      toEmails,
    subject,
    html:    htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Mail sent successfully:", info.messageId);
    return NextResponse.json({
      status: 200,
      message: `Email sent: ${info.messageId}`
    });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
};
