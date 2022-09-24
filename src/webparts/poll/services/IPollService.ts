import { IVoteOption } from './IVoteOption';
import { IVoteOptionItem } from './IVoteOptionItem';
import { IVoteResult } from './IVoteResult';

export interface IPollService {
  getVoteOptions: () => Promise<IVoteOption[]>;
  vote: (voteOptionId: number) => Promise<void>;
  getResults: () => Promise<IVoteResult[]>;
  update: (updatedVoteItem: Partial<IVoteOptionItem>) => Promise<void>;
  getOption: (voteOptionId:number)=>Promise<IVoteOption>;
  addItem: (voteItem: Partial<IVoteOptionItem>) => Promise<IVoteOptionItem>;
  deleteItem: (voteOptionId:number)=> Promise<void>;
}
