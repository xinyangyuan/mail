export class UpdateMailStatus {
  static readonly type = '[Passwordless Page] Update Mail Status';
  constructor(public payload: { id: string; emailToken: string }) {}
}
