import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISharePointStoreModel } from './ISharePointStoreModel';

export class SharePointStore implements ISharePointStoreModel {
  public readonly context: WebPartContext;
  public readonly spHttpClient: SPHttpClient;
  public readonly webUrl: string;

  public constructor(
    context?: WebPartContext,
    spHttpClient?: SPHttpClient,
    webUrl?: string
  ) {
    this.context = context;
    this.spHttpClient = spHttpClient;
    this.webUrl = webUrl || '';
  }
}
