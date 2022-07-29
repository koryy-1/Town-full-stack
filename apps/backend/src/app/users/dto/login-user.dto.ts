import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({example: 'mybestlogin', description: 'логин для аккаунта'})
    readonly login: string | null;

    @ApiProperty({example: 'mybestpASSword', description: 'пароль для аккаунта'})
    readonly password: string | null;
}