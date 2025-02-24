import { EventEmitter2 } from '@nestjs/event-emitter';

export class EventEmitter2Mock implements Pick<EventEmitter2, 'emit'> {
  emit(event: string, values: any): boolean {
    return false;
  }
}
