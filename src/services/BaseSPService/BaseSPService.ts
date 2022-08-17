import { SharePointStore } from '../../webparts/todo/models';

abstract class BaseSPService {
  private readonly _sharePointStore: SharePointStore;

  public constructor(sharePointStore: SharePointStore) {
    this._sharePointStore = sharePointStore;
  }

  public get sharePointStore(): SharePointStore {
    return this._sharePointStore;
  }
}
export default BaseSPService;
