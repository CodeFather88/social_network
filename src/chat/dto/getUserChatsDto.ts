import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsArray } from 'class-validator';

export class GetUserChatsDto {
	@ApiProperty({ example: 'dd834c8a-b67d-4326-905a-101115ebfb3b', description: 'id пользователя' })
	@IsString({ message: 'Должно быть строкой' })
	@Length(10, 80, { message: 'не более 80 символов' })
	readonly userId: string;
}
