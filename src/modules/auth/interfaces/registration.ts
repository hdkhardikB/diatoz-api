import UserEntity from '@entities/user.entity';

export interface RegistrationStatus {
  success: boolean;
  message: string;
  user?: UserEntity;
}
