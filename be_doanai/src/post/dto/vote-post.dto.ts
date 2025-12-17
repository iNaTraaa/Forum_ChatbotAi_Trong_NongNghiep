import { IsIn, IsNumber } from 'class-validator';

export class VoteDto {
    @IsNumber()
    @IsIn([1, -1])
    direction: number;
}