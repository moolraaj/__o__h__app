import User from "@/models/User"
import VerificationToken from "@/models/VerificationToken";
import crypto from 'crypto';
import { ConfirmationPageParams } from "./Types";

export const PAGE_PER_PAGE_LIMIT = 10
export const LESION_CREATE = "lesion-created"

export const EN = 'en'
export const KN = 'kn'

export const CLOUD_NAME = 'do6qy56kf'
export const API_KEY = '888443219665931'
export const API_SECRET = 'YJE-bgUxrpRLrGcVqNICTqq_otA'
export const CLOUD_APP_NAME = "o_h_app"


export function parseValue(key: string, value: string) {
    const numericFields = ['age', 'income'];
    if (numericFields.includes(key)) {
        const num = Number(value);
        return isNaN(num) ? value : num;
    }
    return value;
}

export async function getAdminsEmails(adminIds: string[]): Promise<string[]> {
    const admins = await User.find({ _id: { $in: adminIds } });
    return admins.map((admin) => admin.email);
}


export const createVerificationToken = async (userId: string): Promise<string> => {
    const token = crypto.randomBytes(32).toString('hex');
    await VerificationToken.create({
        userId,
        token,
        createdAt: new Date(),
    });
    return token;
};




export function renderConfirmationPage({
    recordType,
    action,
    id,
    redirectUrl
}: ConfirmationPageParams): string {

    const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1);

    return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>${recordType} ${capitalizedAction}d Successfully</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .container { max-width: 600px; margin: auto; text-align: center; }
        a { background-color: #2ecc71; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${recordType} ${capitalizedAction}d Successfully!</h1>
        <p>The ${recordType} record with ID <strong>${id}</strong>  has been ${action}d successfully.</p>
        <p><a href="${redirectUrl}">Go Back</a></p>
      </div>
    </body>
  </html>`;
}
