import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    ForbiddenException,
    DefaultValuePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response-dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enum/role.enum';
import { AuthGuard } from '../auth/presentation/http/guard/auth.guard';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }
    @Get()
    @UseGuards(AuthGuard, AuthorizationGuard)
    @Roles(Role.ADMIN)
   
    findAll(
        @Query('page',new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit',new DefaultValuePipe(10), ParseIntPipe) limit = 10
    ): Promise<PaginationResponseDto<User>> {
        return this.usersService.findAll(page, limit);
    }

    @Get('/search')
    @UseGuards(AuthGuard, AuthorizationGuard)
    @Roles(Role.ADMIN)
    searchUsers(
        @Query('q') query: string,
        @Query('page', ParseIntPipe) page = 1,
        @Query('limit', ParseIntPipe) limit = 10
    ): Promise<PaginationResponseDto<User>> {
        limit = Math.min(limit, 50);
        return this.usersService.searchUsers(query, page, limit);
    }

    @Get('me')
    @UseGuards(AuthGuard)
    getCurrentUser(@Req() req): Promise<User> {
        return this.usersService.findOne(req.user.sub);
    }
    
    @Get(':id')
    @UseGuards(AuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<User> {
        if (req.user.sub !== id && req.user.role !== Role.ADMIN) {
            throw new ForbiddenException('You may only view your own profile unless you are an admin');
        }
        return this.usersService.findOne(id);
    }
    @Post()
    createUser(@Body() dto: CreateUserDto): Promise<User> {
        return this.usersService.createUser(dto)
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserDto,
        @Req() req,
    ): Promise<User> {
        return this.usersService.updateUser(id, dto, {
            sub: req.user.sub,
            role: req.user.role,
        });
    }
    
    @Patch(':id/profile-picture')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileInterceptor('image', {
            storage: memoryStorage(),
            limits: { fileSize: 5 * 1024 * 1024 },
            fileFilter: (_req, file, callback) => {
                const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    return callback(new Error('Only jpeg, png, and webp images are allowed'), false);
                }
                callback(null, true);
            },
        }),
    )
    uploadProfilePicture(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
    ): Promise<User> {
        return this.usersService.uploadUserProfilePicture(id, file, {
            sub: req.user.sub,
            role: req.user.role,
        });
    }

    @Patch(':id/profile-picture/review')
    @UseGuards(AuthGuard, AuthorizationGuard)
    @Roles(Role.ADMIN)
    reviewProfilePicture(
        @Param('id', ParseIntPipe) id: number,
        @Body('approved') approved: boolean,
        @Req() req,
    ): Promise<User> {
        return this.usersService.reviewUserProfilePicture(id, approved, {
            sub: req.user.sub,
            role: req.user.role,
        });
    }
    @Delete(':id')
    @UseGuards(AuthGuard, AuthorizationGuard)
    @Roles(Role.ADMIN)
    deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.usersService.deleteUser(id);
    }
}
