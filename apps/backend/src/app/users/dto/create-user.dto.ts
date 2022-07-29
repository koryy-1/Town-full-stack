import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({example: 'mybestlogin', description: 'логин для аккаунта'})
    readonly login: string | null;

    @ApiProperty({example: 'mybestpASSword', description: 'пароль для аккаунта'})
    readonly password: string | null;

    @ApiProperty({example: 'Иван', description: 'Имя'})
    readonly firstName: string | null;

    @ApiProperty({example: 'Иванов', description: 'Фамилия'})
    readonly lastName: string | null;

    @ApiProperty({example: 'Иванович', description: 'Отчество'})
    readonly patronymic: string | null;

    @ApiProperty({example: 'admin', description: 'роль пользователя'})
    readonly role: string | null;

    @ApiProperty({example: 'true', description: 'статус онлайн'})
    readonly isActive: boolean | null;

    @ApiProperty({example: 'eyJhbGciOiJIUzI1NiIsIn...', description: 'jwt токен'})
    readonly token: string | null;
}