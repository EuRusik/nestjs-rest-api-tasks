import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../entities/user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity>{

  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async genSalt(): Promise<string> {
    return await bcrypt.genSalt();
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (user && await user.validatePassword(password)) {
      return user.username;
    } return null;
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = new UserEntity();
    user.username = username;
    user.salt = await this.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save(); 
    } catch (e) {
      console.log(e);
      if (e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username already dy exist!')
      } throw new InternalServerErrorException();
    }
  }
}