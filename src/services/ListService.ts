import { SharePointStore } from '../webparts/todo/models';
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from '@microsoft/sp-http';
import ITodoTaskList from '../webparts/todo/models/ITodoTaskList';
import BaseSPService from './BaseSPService/BaseSPService';

class ListService extends BaseSPService {
  private _baseUrl: string;
  private _spHttpClient: SPHttpClient;

  public constructor(sharePointStore: SharePointStore) {
    super(sharePointStore);
    this._baseUrl = `${sharePointStore.sharePointUrl}/_api/Web/Lists`;
    this._spHttpClient = sharePointStore.spHttpClient;
  }

  // eslint-disable-next-line @microsoft/spfx/no-async-await
  public getAsync = async (): Promise<ITodoTaskList[]> => {
    const listTemplateId: number = 171;
    const queryString: string = `?$filter=BaseTemplate eq ${listTemplateId}`;
    const queryUrl: string = this._baseUrl + queryString;

    const response: SPHttpClientResponse = await this._spHttpClient.get(
      queryUrl,
      SPHttpClient.configurations.v1
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await response.json();
    return data.value;
  };

  // eslint-disable-next-line @microsoft/spfx/no-async-await
  public createAsync = async (
    list: Partial<ITodoTaskList>
  ): Promise<ITodoTaskList> => {
    const listDefinition: {} = {
      Title: list.Title,
      BaseTemplate: 171,
    };

    const spHttpClientOptions: ISPHttpClientOptions = {
      body: JSON.stringify(listDefinition),
    };

    const response: SPHttpClientResponse = await this._spHttpClient.post(
      this._baseUrl,
      SPHttpClient.configurations.v1,
      spHttpClientOptions
    );

    if (response.ok) {
      const list: ITodoTaskList = await response.json();
      return list;
    } else {
      return null;
    }
  };
}

export default ListService;
