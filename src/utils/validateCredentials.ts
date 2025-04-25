 
import User from '@/models/User';
import bcrypt from 'bcryptjs';
 

export async function validateCredentials(
  phoneOrEmail: string,
  password?: string         
) {
 
  const filter = phoneOrEmail.includes('@')
    ? { email: phoneOrEmail }
    : { phoneNumber: phoneOrEmail };

 
  const user = await User.findOne(filter).select('+password');
  if (!user) return null;

 
  if (!password) return user;

 
  const ok = await bcrypt.compare(password, user.password);
  return ok ? user : null;
}
