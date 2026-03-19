export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  provider: string | null;
  image: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}
