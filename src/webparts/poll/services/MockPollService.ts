import { IPollService } from './IPollService';
import { IVoteOption } from './IVoteOption';
import { IVoteOptionItem } from './IVoteOptionItem';
import { IVoteResult } from './IVoteResult';

export class MockPollService implements IPollService {
  private _poll: IVoteResult[];

  public constructor() {
    this._poll = [
      {
        id: 1,
        label: 'Angular',
        numVotes: 0,
      },
      {
        id: 2,
        label: 'React',
        numVotes: 0,
      },
    ];
  }
  public async getOption(voteOptionId: number): Promise<IVoteOption> {
    const filteredOptions = this._poll.filter((opt) => opt.id === voteOptionId);
    return filteredOptions[0];
  }

  public async deleteItem(voteOptionId: number): Promise<void> {
    this._poll = this._poll.filter(
      (option: IVoteResult) => option.id !== voteOptionId
    );
  }

  public addItem(voteItem: Partial<IVoteOptionItem>): Promise<IVoteOptionItem> {
    return new Promise<IVoteOptionItem>(
      (
        resolve: (result: IVoteOptionItem) => void,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        reject: (reason: any) => void
      ): void => {
        const newId: number = this._poll.length + 1;
        const newOption: IVoteResult = {
          id: newId,
          label: voteItem.Title,
          numVotes: 0,
        };
        const newItem: IVoteOptionItem = {
          Id: newId,
          Title: voteItem.Title,
          NumVotes: 0,
        };
        this._poll.push(newOption);
        resolve(newItem);
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async update(updatedVoteItem: IVoteOptionItem): Promise<void> {
    return new Promise<void>(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (resolve: () => void, reject: (error: any) => void): void => {
        try {
          resolve();
        } catch (reason) {
          reject(reason);
        }
      }
    );
  }

  public getVoteOptions(): Promise<IVoteOption[]> {
    return new Promise<IVoteOption[]>(
      (
        resolve: (voteOptions: IVoteOption[]) => void,
        reject: (error: unknown) => void
      ): void => {
        try {
          resolve(this._poll);
        } catch (reason) {
          reject(reason);
        }
      }
    );
  }

  public vote(voteOptionId: number): Promise<void> {
    return new Promise<void>(
      (resolve: () => void, reject: (reason?: unknown) => void): void => {
        let voted: boolean = false;

        for (let i: number = 0; i < this._poll.length; i++) {
          if (this._poll[i].id === voteOptionId) {
            this._poll[i].numVotes += 1;
            voted = true;
            break;
          }

          if (voted) {
            resolve();
          } else {
            reject('Invalid vote Option');
          }
        }
      }
    );
  }

  public async getResults(): Promise<IVoteResult[]> {
    const promise: Promise<IVoteResult[]> = new Promise<IVoteResult[]>(
      (
        resolve: (results: IVoteResult[]) => void,
        reject: (reason?: unknown) => void
      ): void => {
        try {
          resolve(this._poll);
        } catch (error) {
          reject(error);
        }
      }
    );
    return await promise;
  }
}
