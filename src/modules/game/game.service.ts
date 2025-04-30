import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class GameService {
  private sseStreams: Map<string, Subject<any>> = new Map();
}
