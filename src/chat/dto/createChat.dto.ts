import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsArray } from 'class-validator';

export class CreateChatDto {
	@ApiProperty({ example: '[1, 2, 3]', description: 'id пользователей, добавленных в чат' })
	@IsArray({ message: 'Должно быть массивом' })
	readonly addedUsers: string[];
	@ApiProperty({ example: 'Рабочий чат', description: 'Название чата' })
	@IsString({ message: 'Должно быть строкой' })
	@Length(0, 30, { message: 'не более 30 символов' })
	readonly name: string;
}
