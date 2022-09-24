import { WebPartContext } from '@microsoft/sp-webpart-base';
import { spfi, SPFI, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import {
  IPollService,
  IVoteOption,
  IVoteOptionItem,
  IVoteResult,
} from '../services';
import { IList } from '@pnp/sp/lists';
import { IItemAddResult } from '@pnp/sp/items';

export class PollService implements IPollService {
  private readonly context: WebPartContext;
  private readonly listName: string;
  private readonly sp: SPFI;
  private readonly list: IList;

  public constructor(context: WebPartContext, listName: string) {
    this.context = context;
    this.listName = listName;
    this.sp = spfi().using(SPFx(context));
    this.list = this.sp.web.lists.getByTitle(listName);
  }

  public async addItem(
    voteItem: Partial<IVoteOptionItem>
  ): Promise<IVoteOptionItem> {
    try {
      const response: IItemAddResult = await this.list.items.add(voteItem);
      return response.data as IVoteOptionItem;
    } catch (err) {
      console.error(err);
      return {} as IVoteOptionItem;
    }
  }

  public async getVoteOptions(): Promise<IVoteOption[]> {
    try {
      const options = await this.list.items.select('Id', 'Title')();
      return options.map((opt: IVoteOptionItem) => {
        return { id: opt.Id, label: opt.Title } as IVoteOption;
      });
    } catch (err) {
      console.error(err);
      return [] as IVoteOption[];
    }
  }

  public async vote(voteOptionId: number): Promise<void> {
    try {
      const option: IVoteOptionItem = await this.list.items.getById(
        voteOptionId
      )();
      const updateObject: Partial<IVoteOptionItem> = {
        NumVotes: option.NumVotes + 1,
      };
      await this.list.items.getById(voteOptionId).update(updateObject);
    } catch (reason) {
      console.error(reason);
    }
  }

  public async update(
    updatedVoteItem: Partial<IVoteOptionItem>
  ): Promise<void> {
    try {
      await this.list.items.getById(updatedVoteItem.Id).update(updatedVoteItem);
    } catch (error) {
      console.log(error);
    }
  }

  public async getResults(): Promise<IVoteResult[]> {
    try {
      const options = await this.list.items.select('Id', 'Title', 'NumVotes')();
      return options.map((opt: IVoteOptionItem) => {
        return {
          id: opt.Id,
          label: opt.Title,
          numVotes: opt.NumVotes,
        } as IVoteResult;
      });
    } catch (err) {
      console.error(err);
      return [] as IVoteResult[];
    }
  }

  public async getOption(itemId: number): Promise<IVoteOption> {
    try {
      const item: IVoteOptionItem = await this.list.items.getById(itemId)();
      return { id: item.Id, label: item.Title } as IVoteOption;
    } catch (reason) {
      console.log(reason);
    }
  }

  public async deleteItem(voteOptionId: number): Promise<void> {
    try {
      await this.list.items.getById(voteOptionId).delete();
    } catch (err) {
      console.error(err);
    }
  }
}
