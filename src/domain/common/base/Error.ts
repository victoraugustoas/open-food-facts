export interface Error {
  type: string;
  cls?: string;
  atr?: string;
  value?: any;
  details?: any;
  msg?: (e?: Error) => string;
}
