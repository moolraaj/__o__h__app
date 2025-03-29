import nodemailer from 'nodemailer';
import { Users } from './Types';

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

export const sendApprovalEmail = async (newUser: Users, token: string) => {
    const approvalLink = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify/${token}?action=approve`;
    const rejectionLink = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify/${token}?action=reject`;

    const mailOptions = {
        from: process.env.GMAIL,
        to: process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL,
        subject: 'Approve or Reject New Admin/Ambassador Registration',
        html: `
 
<html>

<head>

    <style>
        .wrapper {

            padding: 32px;
            color: #A73439;
            border: 1px solid #80808036;
            max-width: 550px;
            width: 100%;
        }

        ul.table_content li {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #80808036;
        }

        .actions p a:nth-child(2) {
            background: #e74c3c;
            color: #fff;
        }

        .actions p a:nth-child(1) {
            background: #2ecc71;
            color: #fff;

        }

        ul.table_content li:nth-child(3) {
            border: none;
        }

        .actions h5 {
            margin: 0px 0px 6px;
        }



        .actions p a {
            padding: 8px 18px;
            text-decoration: none;
            font-size: 16px;
            font-weight: 500;
            border-radius: 2px;
    }

        .wrapper h1 {
            margin: 0px;
        }


        ul.table_content {
            padding: 28px;
            list-style: none;
            background: #fff;
            color: #121212;
            border: 1px solid #80808036;
            border-radius: 4px;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <h1>Hi Super Admin,</h1>
        <h3>A new user registered as <b>${newUser.role}</b>. Please review the details below:</h3>
        <ul class="table_content">


            <li>
                <p>Name: </p>
                <p>${newUser.name}</p>
            </li>
            <li>
                <p>Email:</p>
                <p>${newUser.email}</p>
            </li>
            <li>
                <p>Phone:</p>
                <p>${newUser.phoneNumber}</p>
            </li>



        </ul>
        <div class="actions">

            <h5>Please choose one of the following actions</h5>
            <p>
<a href="${approvalLink}" class="btn btn-approve" style="background:#2ecc71; color: #fff;">Approve</a>
<a href="${rejectionLink}" class="btn btn-reject" style="background:#e74c3c; color: #fff; margin-left:30px;">Reject</a>
            </p>
        </div>

    </div>
</body>

</html>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
};
