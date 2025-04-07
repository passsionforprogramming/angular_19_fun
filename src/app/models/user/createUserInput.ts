import { User } from './user';

export type CreateUserInput = Omit<User, 'id'>;
