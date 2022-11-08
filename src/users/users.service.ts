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

  async getUserByUsername(username: string) {
    return await this.findOneByAttribute({username, deletedAt: {$exists: false}}, null);
  }

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

  async updateUser(updateUserDto: UpdateUserDto) {
    updateUserDto['updatedAt'] = new Date();
    const user = await this.findOneByAttribute({_id: updateUserDto._id, deletedAt: {$exists: false}}, null);

    if (!user) throw new NotFoundException({
      result: {},
      message: "user not found"
    });

    return await this.users.findByIdAndUpdate(updateUserDto._id, updateUserDto, {new: true});
  }

  async deleteUser(id: string) {
    const user = await this.findOneByAttribute({_id: id, deletedAt: {$exists: false}}, null);
    if (!user) throw new NotFoundException();

    const result = await this.users.findOneAndUpdate({_id: user._id}, {deletedAt: new Date()}, {new: true});
    return result;
  }

  async findOneByAttribute(
    findOption: FilterQuery<User>,
    options: QueryOptions,
  ) {
    return await this.users.findOne(findOption, null, options);
  }

  async findByAttribute(
    findOption: FilterQuery<User>,
    options: QueryOptions,
  ) {
    return await this.users.find(findOption, null, options);
  }
}
