import { IPollService } from './IPollService';
import { IVoteOption } from './IVoteOption';
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

  public getVoteOptions(listName: string): Promise<IVoteOption[]> {
    return new Promise<IVoteOption[]>(
      (
        resolve: (voteOptions: IVoteOption[]) => void,
        reject: (error: unknown) => void
      ): void => {
        resolve(this._poll);
      }
    );
  }

  public vote(voteOptionId: number, listName: string): Promise<{}> {
    return new Promise<{}>(
      (resolve: (_?: {}) => void, reject: (reason?: unknown) => void): void => {
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

  public getResults(listName: string): Promise<IVoteResult[]> {
    return new Promise<IVoteResult[]>(
      (
        resolve: (results: IVoteResult[]) => void,
        reject: (reason?: unknown) => void
      ): void => {
        resolve(this._poll);
      }
    );
  }
}
