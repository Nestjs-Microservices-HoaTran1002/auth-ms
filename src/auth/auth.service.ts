import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RegisterUserDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
// import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('AuthService');

    constructor(private readonly jwtService: JwtService) {
        super();
    }
  
    onModuleInit() {
      this.$connect();
      this.logger.log('MongoDB connected');
    }
    // async signJWT(payload: JwtPayload) {
    //     return this.jwtService.sign(payload);
    //   }
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
              password: bcrypt.hashSync(password, 10), // TODO: encriptar / hash
              name: name,
            },
          });
    
        //   const { password: __, ...rest } = newUser;
    console.log('1122233000...')
          return {
            user: newUser
            // token: await this.signJWT(rest),
          };
        } catch (error) {
          throw new RpcException({
            status: 400,
            message: error.message,
          });
        }
      }
    
}
