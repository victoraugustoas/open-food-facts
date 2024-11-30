export class UnzipFileEvent {
  constructor(
    readonly filePath: string,
    readonly importId: string,
  ) {}
}
