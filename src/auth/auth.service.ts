import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RegisterUserDto } from './dto';
import { RpcException } from '@nestjs/microservices';
// import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit{
    private readonly logger = new Logger('AuthService');

  
    onModuleInit() {
      this.$connect();
      this.logger.log('MongoDB connected');
    }
    async registerUser(registerUserDto: RegisterUserDto) {
        const { email, name, password } = registerUserDto;
    
        try {
          const user = await this.user.findUnique({
            where: {
              email: email,
            },
          });
    
          if (user) {
            throw new RpcException({
              status: 400,
              message: 'User already exists',
            });
          }
    
          const newUser = await this.user.create({
            data: {
              email: email,
              password: bcrypt.hashSync(password, 10),
              name: name,
            },
          });
          return {
            user: registerUserDto
          };
        } catch (error) {
          throw new RpcException({
            status: 400,
            message: error.message,
          });
        }
      }
    
}
