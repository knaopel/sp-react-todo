import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient } from '@microsoft/sp-http';

export interface ISharePointStoreModel {
  readonly context: WebPartContext;
  readonly spHttpClient: SPHttpClient;
  readonly webUrl: string;
  // readonly userId: number;
}
