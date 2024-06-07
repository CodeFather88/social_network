import { IsString } from "class-validator";

export class CreatePostDto {
    @IsString()
    readonly content: string
    @IsString()
    readonly title: string

}