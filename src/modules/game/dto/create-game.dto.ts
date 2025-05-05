import { AppError } from '@/common/errors';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  @MinLength(6, {
    message: AppError.GAME_LENGTH,
  })
  roomName: string;

  @IsNumber()
  @Min(1)
  @Max(6)
  initialTeamSize: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  maxRounds: number;

  @IsBoolean()
  isRating: boolean;

  @IsBoolean()
  isPrivate: boolean;

  @IsString()
  @IsOptional()
  roomPassword: string;
}
