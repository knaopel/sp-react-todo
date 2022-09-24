import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { RouteType, SharePointStore } from '../models';
import { ServerRoute } from './ServerRoute';

export class ApiService {
  private static _sharePointStore: SharePointStore;

  public static setStore(context: WebPartContext): void {
    if (!ApiService._sharePointStore) {
      const spHttpClient: SPHttpClient = context.spHttpClient;
      const webUrl: string = context.pageContext.web.serverRelativeUrl;
      // const logonName:string = context.pageContext.user.loginName;
      const sharePointStore: SharePointStore = new SharePointStore(
        context,
        spHttpClient,
        webUrl
      );
      ApiService._sharePointStore = sharePointStore;
    }
  }

  public static getListItemType(name: string, type?: RouteType): string {
    let itemString: string;
    switch (type) {
      case RouteType.list:
        itemString = 'ListItem';
        break;
      case RouteType.document:
        itemString = 'Item';
        break;
      default:
        itemString = 'ListItem';
        break;
    }

    let safeListType: string = `SP.Data.${name[0].toUpperCase()}${name.substring(
      1
    )}${itemString}`;
    safeListType = safeListType.replace(/_/g, '_x005f_');
    safeListType = safeListType.replace(/ /g, '_x0020_');
    return safeListType;
  }

  // eslint-disable-next-line @microsoft/spfx/no-async-await
  public static async getListItemEntityTypeAsync(
    listName: string
  ): Promise<string> {
    const listRoute: ServerRoute = new ServerRoute(
      RouteType.list,
      listName,
      `?$Select=ListItemEntityTypeFullName`,
      true
    );
    const listItemEntityTypeName: { ListItemEntityTypeFullName: string } =
      await this.apiGetCallAsync<{ ListItemEntityTypeFullName: string }>(
        listRoute
      );
    return listItemEntityTypeName.ListItemEntityTypeFullName;
  }

  // eslint-disable-next-line @microsoft/spfx/no-async-await
  public static async constructBodyAsync(
    listName?: string,
    routeType?: RouteType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any,
    method?: string
  ): Promise<string> {
    let bodyStr: string;
    const bodyObj: {} =
      routeType === RouteType.comment
        ? {
            __metadata: {
              type: 'Microsoft.SharePoint.Comments.comment',
            },
            text: payload,
          }
        : {
            __metadata: {
              type: await this.getListItemEntityTypeAsync(listName),
            },
          };
    if (
      routeType !== RouteType.comment &&
      method !== 'DELETE' &&
      payload !== null &&
      payload !== undefined
    ) {
      const mergedPayload: {} = { ...bodyObj, ...payload };
      bodyStr = JSON.stringify(mergedPayload);
    } else {
      bodyStr = JSON.stringify(bodyObj);
    }
    return bodyStr;
  }

  public static constructBody(
    type: string,
    routeType?: RouteType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any,
    method?: string
  ): string {
    const bodyObj: {} =
      routeType === RouteType.comment
        ? {
            __metadata: {
              type: 'Microsoft.SharePoint.Comments.comment',
            },
            text: payload,
          }
        : {
            __metadata: {
              type: this.getListItemType(type, routeType),
            },
          };
    let body: string = JSON.stringify(bodyObj);
    if (
      routeType !== RouteType.comment &&
      method !== 'DELETE' &&
      payload !== null &&
      payload !== undefined
    ) {
      let payloadJson: string = JSON.stringify(payload);
      payloadJson = payloadJson.substring(1, payloadJson.length - 1);
      body = body.substring(1, body.length - 1);
      body = `{${body}, ${payloadJson}}`;
    }

    return body;
  }

  public static getWebUrl(): string {
    return this._sharePointStore.webUrl;
  }

  public static getWebContext(): WebPartContext {
    return this._sharePointStore.context;
  }

  // eslint-disable-next-line @microsoft/spfx/no-async-await
  public static async apiGetCallAsync<T>(serverRoute: ServerRoute): Promise<T> {
    const isSingleResult: boolean = serverRoute.isSingleResult();
    try {
      const restUrl: string = `${this._sharePointStore.webUrl}/_api/Web${serverRoute.fullUrl}`;
      const response: SPHttpClientResponse =
        await this._sharePointStore.spHttpClient.get(
          restUrl,
          SPHttpClient.configurations.v1
        );
      return await this._getResults<T>(response, isSingleResult);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      return isSingleResult ? ({} as T) : ([] as unknown as T);
    }
  }

  // eslint-disable-next-line @microsoft/spfx/no-async-await
  public static async apiPostCallAsync<T, R>(
    payload: T,
    list: string,
    itemId?: number,
    method?: string,
    // eslint-disable-next-line @typescript-eslint/typedef
    file?,
    newFileName?: string,
    isSingleResult?: boolean,
    routeType?: RouteType
  ): Promise<R> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let body: string | any = await this.constructBodyAsync(
        list,
        routeType,
        payload,
        method
      );

      let itemsParam: string =
        itemId !== 0 && itemId !== null && itemId !== undefined
          ? `/Items(${itemId})`
          : '/Items';

      // If we are uploading a file ignore the above
      if (file !== undefined && file !== null) {
        body = file;
        itemsParam = `/RootFolder/Files/Add(url='${newFileName}', overwrite=true)`;
      }

      if (routeType === RouteType.comment) {
        itemsParam += '/Comments()';
      }

      const restUrl: string = `${this._sharePointStore.webUrl}/_api/Web/Lists/getByTitle('${list}')${itemsParam}`;
      const response: SPHttpClientResponse =
        await this._sharePointStore.spHttpClient.post(
          restUrl,
          SPHttpClient.configurations.v1,
          {
            headers: {
              Accept: 'application/json;odata=nometadata',
              'Content-Type': 'application/json;odata=verbose',
              'odata-version': '',
              'If-MATCH': '*',
              'X-HTTP-METHOD': method,
            },
            body,
          }
        );

      return await this._getResults<R>(response, isSingleResult);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      return isSingleResult ? ({} as R) : ([] as unknown as R);
    }

    // return new Promise<R>((resolve, reject) => {
    //   try {
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     let body: string | any = this.constructBody(
    //       type,
    //       routeType,
    //       payload,
    //       method
    //     );
    //     let itemsParam: string =
    //       itemId !== 0 && itemId !== null && itemId !== undefined
    //         ? `/Items(${itemId})`
    //         : '/Items';

    //     // If we are uploading a file ignore the above
    //     if (file !== undefined && file !== null) {
    //       body = file;
    //       itemsParam = `/RootFolder/Files/Add(url='${newFileName}', overwrite=true)`;
    //     }

    //     if (routeType === RouteType.comment) {
    //       itemsParam += '/Comments()';
    //     }

    //     const restUrl: string = `${this._sharePointStore.webUrl}/_api/Web/Lists/getByTitle('${list}')${itemsParam}`;

    //     this._sharePointStore.spHttpClient
    //       .post(restUrl, SPHttpClient.configurations.v1, {
    //         headers: {
    //           Accept: 'application/json;odata=nometadata',
    //           'Content-Type': 'application/json;odata=verbose',
    //           'odata-version': '',
    //           'IF-MATCH': '*',
    //           'X-HTTP-METHOD': method,
    //         },
    //         body,
    //       })
    //       .then(
    //         (response: SPHttpClientResponse) => {
    //           if (
    //             method === 'DELETE' ||
    //             method === 'MERGE' ||
    //             response === null ||
    //             response === undefined
    //           ) {
    //             resolve({} as R);
    //           } else {
    //             response.json().then(
    //               (data) => {
    //                 if (isSingleResult) {
    //                   resolve(data as R);
    //                 } else {
    //                   resolve(data.value as R);
    //                 }
    //               },
    //               (reason) => reject(reason)
    //             );
    //           }
    //         },
    //         (reason) => reject(reason)
    //       );
    //   } catch (e) {
    //     console.log('EXCEPTION e: ', e);
    //     reject(e);
    //   }
    // });
  }

  // eslint-disable-next-line @microsoft/spfx/no-async-await
  private static async _getResults<T>(
    response: SPHttpClientResponse,
    isSingleResult: boolean
  ): Promise<T> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results: any = await response.json();
      return isSingleResult ? (results as T) : (results.value as T);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      return {} as T;
    }
  }
}
