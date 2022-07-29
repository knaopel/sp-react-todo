import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient } from '@microsoft/sp-http';

export interface ISharePointStoreModel {
  context: WebPartContext;
  sharePointUrl: string;
  userEmail: string;
  spHttpClient: SPHttpClient;
}
