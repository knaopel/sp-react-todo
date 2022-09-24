import { IResponseFile } from './IResponseFileModel';

export interface IResponseItem {
  Id: number;
  File: IResponseFile;
  FileLeafRef: string;
  Title: string;
}
