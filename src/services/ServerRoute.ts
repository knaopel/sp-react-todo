import { RouteType } from '../models';

export class ServerRoute {
  private readonly _action: string;
  private readonly _route: string;
  private readonly _singleResult: boolean;

  public fullUrl: string;

  public constructor(
    routeType: RouteType,
    list?: string,
    action?: string,
    singleResult?: boolean
  ) {
    switch (routeType) {
      case RouteType.list: {
        this._route = `/Lists/getByTitle('${list}')`;
        break;
      }
      case RouteType.group: {
        this._route = `/SiteGroups`;
        break;
      }
      case RouteType.user: {
        this._route = '/SiteUsers';
        break;
      }
      case RouteType.page: {
        this._route = '/RootFolder';
        break;
      }
      default: {
        this._route = '';
        break;
      }
    }

    this._singleResult =
      singleResult !== null && singleResult !== undefined
        ? singleResult
        : false;

    this._action = action;
    this.fullUrl = this._route + this._action;
  }

  public url(): string {
    return this.fullUrl;
  }

  public isSingleResult(): boolean {
    return this._singleResult;
  }
}
