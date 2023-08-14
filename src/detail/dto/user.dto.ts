import { UUID } from 'crypto';
import { UserRole, UserStatus, UserType } from 'src/users/users.enum';
export interface userDto {
  user_id: UUID;
  user: string;
  password: string;
  phone_number: string;
  nickname: string;
  profile_image: string;
  user_type: UserType;
  user_status: UserStatus;
  user_role: UserRole;
  gender: string;
  birthday: Date;
  created_at: Date;
  updated_at: Date;
}
