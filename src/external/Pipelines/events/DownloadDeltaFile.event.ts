export class DownloadDeltaFileEvent {
  constructor(
    readonly fileName: string,
    readonly importId: string,
  ) {}
}
