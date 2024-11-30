export class CreatedDeltaFileEvent {
  constructor(
    readonly filePath: string,
    readonly importId: string,
  ) {}
}
