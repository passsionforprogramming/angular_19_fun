export interface User {
  id: number;
  name: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  status: 'active' | 'inactive';
}
