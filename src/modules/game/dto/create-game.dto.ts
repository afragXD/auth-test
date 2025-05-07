import { AppError } from '@/common/errors';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  @MinLength(6, {
    message: AppError.GAME_MIN_LENGTH,
  })
  @MaxLength(50, {
    message: AppError.GAME_MAX_LENGTH,
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

  @ValidateIf((o: CreateGameDto) => o.isPrivate === true)
  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: AppError.PASSWORD_LENGTH,
  })
  roomPassword: string;
}
