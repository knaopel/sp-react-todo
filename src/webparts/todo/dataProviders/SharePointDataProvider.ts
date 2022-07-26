import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import { IWebPartContext } from "@microsoft/sp-webpart-base";
import ITodoItem from "../models/ITodoItem";
import ITodoTaskList from "../models/ITodoTaskList";
import ITodoDataProvider from "./ITodoDataProvider";

export default class SharePointDataProvider implements ITodoDataProvider {
  private _selectedList: ITodoTaskList;
  private _taskLists: ITodoTaskList[];
  private _listsUrl: string;
  private _listItemsUrl: string;
  private _webPartContext: IWebPartContext;

  public set selectedList(value: ITodoTaskList) {
    this._selectedList = value;
    this._listItemsUrl = `${this._listsUrl}(guid'${value.Id}')/Items`;
  }

  public get selectedList(): ITodoTaskList {
    return this._selectedList;
  }

  public set webPartContext(value: IWebPartContext) {
    this._webPartContext = value;
    this._listsUrl = `${this._webPartContext.pageContext.web.absoluteUrl}/_api/Web/Lists`;
  }

  public get webPartContext(): IWebPartContext {
    return this._webPartContext;
  }

  public getTaskLists(): Promise<ITodoTaskList[]> {
    const listTemplateId: string = "171";
    const queryString: string = `?$filter=BaseTemplate eq ${listTemplateId}`;
    const queryUrl: string = this._listsUrl + queryString;
    return this._webPartContext.spHttpClient
      .get(queryUrl, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((json: { value: ITodoTaskList[] }) => {
        this._taskLists = json.value;
        return this._taskLists;
      });
  }

  public createTaskList(listName: string): Promise<ITodoTaskList> {
    const listDefinition: { Title: string; BaseTemplate: number } = {
      Title: listName,
      BaseTemplate: 171,
    };
    const spHttpClientOptions: ISPHttpClientOptions = {
      body: JSON.stringify(listDefinition),
    };
    return this._webPartContext.spHttpClient
      .post(this._listsUrl, SPHttpClient.configurations.v1, spHttpClientOptions)
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          return response.json().then((list: ITodoTaskList) => list);
        }
      });
  }

  public getItems(): Promise<ITodoItem[]> {
    return this._getItems(this.webPartContext.spHttpClient);
  }

  public createItem(title: string): Promise<ITodoItem[]> {
    const client: SPHttpClient = this.webPartContext.spHttpClient;
    return this._createItem(client, title).then(() => this._getItems(client));
  }

  public updateItem(itemUpdated: ITodoItem): Promise<ITodoItem[]> {
    const client: SPHttpClient = this.webPartContext.spHttpClient;
    return this._updateItem(client, itemUpdated).then(() =>
      this._getItems(client)
    );
  }

  public deleteItem(itemDeleted: ITodoItem): Promise<ITodoItem[]> {
    const client: SPHttpClient = this.webPartContext.spHttpClient;
    return this._deleteItem(client, itemDeleted).then(() =>
      this._getItems(client)
    );
  }

  private _getItems(requestor: SPHttpClient): Promise<ITodoItem[]> {
    const queryString: string = `?$select=Id,Title,PercentComplete`;
    const queryUrl: string = this._listItemsUrl + queryString;

    return requestor
      .get(queryUrl, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((json: { value: ITodoItem[] }) => {
        return json.value.map((task: ITodoItem) => {
          return task;
        });
      });
  }

  private _createItem(
    client: SPHttpClient,
    title: string
  ): Promise<SPHttpClientResponse> {
    const body: {} = {
      "@data.type": `${this._selectedList.ListItemEntityTypeFullName}`,
      Title: title,
    };

    return client.post(this._listItemsUrl, SPHttpClient.configurations.v1, {
      body: JSON.stringify(body),
    });
  }

  private _deleteItem(
    client: SPHttpClient,
    item: ITodoItem
  ): Promise<SPHttpClientResponse> {
    const itemDeletedUrl: string = `${this._listItemsUrl}(${item.Id})`;
    const headers: Headers = new Headers();
    headers.append("If-Match", "*");

    return client.fetch(itemDeletedUrl, SPHttpClient.configurations.v1, {
      headers,
      method: "DELETE",
    });
  }

  private _updateItem(
    client: SPHttpClient,
    itemUpdated: ITodoItem
  ): Promise<SPHttpClientResponse> {
    const itemUpdatedUrl: string = `${this._listItemsUrl}(${itemUpdated.Id})`;

    const headers: Headers = new Headers();
    headers.append("If-Match", "*");

    const body: {} = {
      "@data.type": `${this._selectedList.ListItemEntityTypeFullName}`,
      PercentComplete: itemUpdated.PercentComplete,
    };

    return client.fetch(itemUpdatedUrl, SPHttpClient.configurations.v1, {
      body: JSON.stringify(body),
      headers,
      method: "PATCH",
    });
  }
}
