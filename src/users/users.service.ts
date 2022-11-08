import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { HashService } from 'src/common/hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private users: Model<UserDocument>,
    private hashService: HashService,
  ){};

  /**
   * It returns a user object if the username exists and the user is not deleted
   * @param {string} username - string - the username of the user you want to find
   * @returns A user object
   */
  async getUserByUsername(username: string) {
    return await this.findOneByAttribute({username, deletedAt: {$exists: false}}, null);
  }

  /**
   * It takes a CreateUserDto object, adds a createdAt and updatedAt property to it, creates a new user
   * object from the CreateUserDto object, checks if the username already exists, hashes the password,
   * and then saves the user object to the database
   * @param {CreateUserDto} createUserDto - CreateUserDto - This is the DTO that we created earlier.
   * @returns The user object is being returned.
   */
  async registerUser(createUserDto: CreateUserDto) {
    createUserDto['createdAt'] = new Date();
    createUserDto['updatedAt'] = new Date();
    const createUser = new this.users(createUserDto);

    const user = await this.getUserByUsername(createUser.username);
    if (user) throw new BadRequestException({
      result: {},
      message: "username already exist"
    });

    createUser.password = await this.hashService.hashPassword(createUser.password);

    return createUser.save();
  }

  /**
   * It updates a user by id
   * @param {UpdateUserDto} updateUserDto - UpdateUserDto - This is the DTO that we created earlier.
   * @returns The updated user
   */
  async updateUser(updateUserDto: UpdateUserDto) {
    updateUserDto['updatedAt'] = new Date();
    const user = await this.findOneByAttribute({_id: updateUserDto._id, deletedAt: {$exists: false}}, null);

    if (!user) throw new NotFoundException({
      result: {},
      message: "user not found"
    });

    return await this.users.findByIdAndUpdate(updateUserDto._id, updateUserDto, {new: true});
  }

  /**
   * It finds a user by id and then sets the deletedAt property to the current date
   * @param {string} id - string - The id of the user to delete
   * @returns The user object with the deletedAt property set to the current date.
   */
  async deleteUser(id: string) {
    const user = await this.findOneByAttribute({_id: id, deletedAt: {$exists: false}}, null);
    if (!user) throw new NotFoundException();

    const result = await this.users.findOneAndUpdate({_id: user._id}, {deletedAt: new Date()}, {new: true});
    return result;
  }

  /**
   * It returns a user document that matches the findOption parameter
   * @param findOption - FilterQuery<User>
   * @param {QueryOptions} options - QueryOptions
   * @returns A promise that resolves to a single user document.
   */
  async findOneByAttribute(
    findOption: FilterQuery<User>,
    options: QueryOptions,
  ) {
    return await this.users.findOne(findOption, null, options);
  }

  /**
   * It returns a list of users that match the given filter query and options
   * @param findOption - FilterQuery<User>
   * @param {QueryOptions} options - QueryOptions
   * @returns An array of users
   */
  async findByAttribute(
    findOption: FilterQuery<User>,
    options: QueryOptions,
  ) {
    return await this.users.find(findOption, null, options);
  }
}
