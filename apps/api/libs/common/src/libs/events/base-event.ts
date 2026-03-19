export abstract class BaseEvent {
  public readonly occurredAt: Date;
  public readonly actor?: string;

  constructor(actor?: string) {
    this.occurredAt = new Date();
    this.actor = actor;
  }

  abstract getPayload(): any;
}

export function DomainEvent(
  eventName: string,
  options?: { version?: number },
): ClassDecorator {
  return (target: any) => {
    target.eventName = eventName;
    target.version = options?.version || 1;
  };
}
