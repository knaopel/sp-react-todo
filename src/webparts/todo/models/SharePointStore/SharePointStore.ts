import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISharePointStoreModel } from './ISharePointStoreModel';

export class SharePointStore implements ISharePointStoreModel {
  public readonly context: WebPartContext;
  public readonly sharePointUrl: string;
  public readonly userEmail: string;
  public readonly spHttpClient: SPHttpClient;

  public constructor(context: WebPartContext) {
    this.context = context;
    this.sharePointUrl = context.pageContext.web.absoluteUrl;
    this.userEmail = context.pageContext.user.email;
    this.spHttpClient = context.spHttpClient;
  }
}
