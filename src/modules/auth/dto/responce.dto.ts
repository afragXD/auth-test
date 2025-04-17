export class UserResponseDto {
  id: string;
  displayName: string;
  email: string;
  picture: string | null;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
