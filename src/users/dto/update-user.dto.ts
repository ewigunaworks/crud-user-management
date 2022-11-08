import { User } from "../entities/users.entity";

export class UpdateUserDto extends User {
  _id: string;
}