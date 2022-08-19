import { IWebPartContext } from '@microsoft/sp-webpart-base';
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from '@microsoft/sp-http';
import {
  IPollService,
  IVoteOption,
  IVoteOptionItem,
  IVoteResult,
} from '../services';

export class PollService implements IPollService {
  public constructor(private context: IWebPartContext) {}

  public getVoteOptions(listName: string): Promise<IVoteOption[]> {
    const httpClientOptions: ISPHttpClientOptions =
      this._getHttpClientOptions();

    return new Promise<IVoteOption[]>(
      (
        resolve: (voteOptions: IVoteOption[]) => void,
        reject: (error?: unknown) => void
      ): void => {
        this.context.spHttpClient
          .get(
            this.context.pageContext.web.serverRelativeUrl +
              `/_api/Web/Lists/getByTitle('${listName}')/Items?$select=Id,Title`,
            SPHttpClient.configurations.v1,
            httpClientOptions
          )
          .then(
            (
              response: SPHttpClientResponse
            ): Promise<{ value: IVoteOptionItem[] }> => {
              return response.json();
            }
          )
          .then(
            (voteOptionItems: { value: IVoteOptionItem[] }): void => {
              const voteOptions: IVoteOption[] = [];
              for (let i: number = 0; i < voteOptionItems.value.length; i++) {
                voteOptions.push({
                  id: voteOptionItems[i].Id,
                  label: voteOptionItems[i].Title,
                });
              }
              resolve(voteOptions);
            },
            (error: unknown): void => {
              reject(error);
            }
          );
      }
    );
  }

  public vote(voteOptionId: number, listName: string): Promise<{}> {
    return new Promise<{}>(
      (resolve: (_?: {}) => void, reject: (error: unknown) => void): void => {
        // let listItemEntityTypeName: string = undefined;
        // let etag: string = undefined;
        resolve({});

        // this._getListItemEntityTypeName(listName)
        //   .then((itemEntityTypeName: string): Promise<{}> => {
        //     listItemEntityTypeName = itemEntityTypeName;
        //     resolve({});
        //   //   return this.context.spHttpClient.get(
        //   //     this.context.pageContext.web.serverRelativeUrl +
        //   //       `/_api/Web/Lists/getByTitle('${listName}')/Items('${voteOptionId}')?$select=Id,NumVotes`,
        //   //     SPHttpClient.configurations.v1,
        //   //     this._getHttpClientOptions()
        //   //   );
        //   // })
        //   // .then((response: SPHttpClientResponse): Promise<IVoteOptionItem> => {
        //   //   etag = response.headers.get('ETag');
        //   //   return response.json();
        //   // })
        //   // .then((voteOptionItem: IVoteOptionItem): Promise<Response> => {
        //   //   const body: string = JSON.stringify({
        //   //     __metadata: {
        //   //       type: listItemEntityTypeName,
        //   //     },
        //   //     NumVotes:
        //   //       voteOptionItem.NumVotes && !isNaN(voteOptionItem.NumVotes)
        //   //         ? voteOptionItem.NumVotes + 1
        //   //         : 1,
        //   //   });
        //   //   const httpClientOptions: ISPHttpClientOptions =
        //   //     this._getHttpClientOptions(true);
        //   //   httpClientOptions.headers = {
        //   //     ...httpClientOptions.headers,
        //   //     'Content-Type': 'application/json;odata=verbose',
        //   //     'odata-version': '3.0',
        //   //     'IF-MATCH': etag,
        //   //     'X-HTTP-METHOD': 'MERGE',
        //   //   };
        //   //   httpClientOptions.body = body;

        //   //   return this.context.spHttpClient.post(
        //   //     this.context.pageContext.web.serverRelativeUrl +
        //   //       `/_api/Web/Lists/getByTitle('${listName}')/Items(${voteOptionItem.Id})`,
        //   //     SPHttpClient.configurations.v1,
        //   //     httpClientOptions
        //   //   );
        //   // })
        //   // .then(
        //   //   (response: SPHttpClientResponse): void => {
        //   //     if (response.ok) {
        //   //       resolve();
        //   //     } else {
        //   //       reject(response.statusText);
        //   //     }
        //   //   },
        //   //   (error: unknown): void => {
        //   //     reject(error);
        //     },(error:unknown):void =>{
        //       reject(error);
        //     }
        //   );
      }
    );
  }

  public getResults(listName: string): Promise<IVoteResult[]> {
    return new Promise<IVoteResult[]>(
      (
        resolve: (results: IVoteResult[]) => void,
        reject: (error: unknown) => void
      ): void => {
        this.context.spHttpClient
          .get(
            this.context.pageContext.web.serverRelativeUrl +
              `/_api/Web/Lists/getByTitle('${listName}')/Items?$select=Id,Title,NumVotes`,
            SPHttpClient.configurations.v1,
            this._getHttpClientOptions(true)
          )
          .then(
            (
              response: SPHttpClientResponse
            ): Promise<{ value: IVoteOptionItem[] }> => {
              return response.json();
            }
          )
          .then(
            (voteResultItems: { value: IVoteOptionItem[] }): void => {
              const voteResults: IVoteResult[] = [];
              for (let i: number = 0; i < voteResultItems.value.length; i++) {
                voteResults.push({
                  id: voteResultItems.value[i].Id,
                  label: voteResultItems.value[i].Title,
                  numVotes: voteResultItems.value[i].NumVotes,
                });
              }
              resolve(voteResults);
            },
            (error: unknown): void => {
              reject(error);
            }
          );
      }
    );
  }

  private _getHttpClientOptions(hasNoMetadata?: boolean): ISPHttpClientOptions {
    const httpClientOptions: ISPHttpClientOptions = {};
    const acceptValue: string = hasNoMetadata
      ? 'application/json;odata=nometadata'
      : 'application/json';

    httpClientOptions.headers = {
      Accept: acceptValue,
      'odata-version': '',
    };

    return httpClientOptions;
  }

  private _getListItemEntityTypeName(listName: string): Promise<string> {
    return new Promise<string>(
      (
        resolve: (listEntityTypeName: string) => void,
        reject: (error: unknown) => void
      ): void => {
        this.context.spHttpClient
          .post(
            this.context.pageContext.web.serverRelativeUrl +
              `/_api/Web/Lists/getByTitle('${listName}')?$select=ListItemEntityTypeFullName`,
            SPHttpClient.configurations.v1,
            this._getHttpClientOptions(true)
          )
          .then(
            (
              response: SPHttpClientResponse
            ): Promise<{ ListItemEntityTypeFullName: string }> => {
              return response.json();
            }
          )
          .then(
            (response: { ListItemEntityTypeFullName: string }): void => {
              resolve(response.ListItemEntityTypeFullName);
            },
            (error: unknown) => {
              reject(error);
            }
          );
      }
    );
  }
}
