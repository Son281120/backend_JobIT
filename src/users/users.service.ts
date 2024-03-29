import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import {
  UpdateInfoUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import mongoose from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.inferface';
import aqp from 'api-query-params';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { USER_ROLE } from 'src/databases/sample';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async register(newUser: RegisterUserDto) {
    const { name, email, password, age, gender, address } = newUser;
    //add logic check email
    const isExist = await this.userModel.findOne({ email: email });
    if (isExist) {
      throw new BadRequestException(
        `Email ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác!`,
      );
    }

    const userRole = await this.roleModel.findOne({ name: USER_ROLE });

    const hashPassword = this.getHashPassword(password);
    let newRegister = await this.userModel.create({
      name,
      email,
      age: +age,
      gender,
      address,
      password: hashPassword,
      role: userRole?._id,
    });

    return newRegister;
  }

  async create(newUser: CreateUserDto, user: IUser) {
    const hashPassword = this.getHashPassword(newUser.password);
    const isExist = await this.userModel.findOne({ email: newUser.email });
    if (isExist) {
      throw new BadRequestException(
        `Email ${newUser.email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác!`,
      );
    }
    let createdUser = await this.userModel.create({
      ...newUser,
      password: hashPassword,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: createdUser._id,
      createdAt: createdUser.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qr: string) {
    const { filter, sort, population } = aqp(qr);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password -refreshToken')
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found user with id=${id}`);
    }

    let userById = await this.userModel
      .findOne({
        _id: id,
      })
      .select('-password -refreshToken')
      .populate({ path: 'role', select: { name: 1, _id: 1 } });

    return userById;
  }

  findOneByUsername(username: string) {
    return this.userModel
      .findOne({
        email: username,
      })
      .populate({ path: 'role', select: { name: 1 } });
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async updateInfo(id: string, updateInfoUserDto: UpdateInfoUserDto) {
    const { email, password, name, age, gender, address } = updateInfoUserDto;
    const isExistUser = await this.userModel.findOne({ _id: id });
    if (!isExistUser) {
      throw new BadRequestException('Email không hợp lệ!');
    }
    const isValid = this.isValidPassword(password, isExistUser.password);
    if (!isValid) {
      throw new BadRequestException('Mật khẩu không đúng!');
    }
    return await this.userModel.updateOne(
      { _id: id },
      {
        email,
        name,
        age,
        gender,
        address,
        updatedBy: {
          _id: id,
          email: email,
        },
      },
    );
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const isExistUser = await this.userModel.findOne({ _id: id });
    if (!isExistUser) {
      throw new BadRequestException('Email không hợp lệ!');
    }
    const isValid = this.isValidPassword(
      updatePasswordDto.password,
      isExistUser.password,
    );
    if (!isValid) {
      throw new BadRequestException('Mật khẩu cũ không đúng!');
    }
    return await this.userModel.updateOne(
      { _id: id },
      { password: this.getHashPassword(updatePasswordDto.newPassword) },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found user with id=${id}`);
    }

    const foundUser = await this.userModel.findById(id);
    if (foundUser && foundUser.email === 'admin@gmail.com') {
      throw new BadRequestException('Không thể xóa tài khoản admin!');
    }

    await this.userModel.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return this.userModel.softDelete({
      _id: id,
    });
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };

  findUserByToken = async (refreshToken: string) => {
    return (await this.userModel.findOne({ refreshToken })).populate({
      path: 'role',
      select: { name: 1 },
    });
  };
}
