import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(@InjectModel('users') private readonly UserModal: Model<User>) { };

  async create(createUserDto: CreateUserDto) {
    var post = new this.UserModal(createUserDto);

    return await post.save();
  }

  findAll() {
    return this.UserModal.find();
  }

  findOne(id: string) {
    return this.UserModal.findById(id);
  }

  findOneByUsername(username: string) {
    return this.UserModal.findOne({
      "username": username
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    var option = { 'new': true };
    return this.UserModal.findByIdAndUpdate(id, updateUserDto, option);
  }

  remove(id: string) {
    return this.UserModal.findByIdAndDelete(id);
  }
}
