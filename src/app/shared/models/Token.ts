/* eslint-disable @typescript-eslint/naming-convention */
export interface Token {
  exp: number;
  iat: number;
  nameid: string;
  nbf: number;
  role: string;
  unique_name: string;
}
