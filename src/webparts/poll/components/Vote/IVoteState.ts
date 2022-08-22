import { IPollService } from '../../services';

export interface IVoteProps {
  onVoted: () => void;
  listName: string;
  pollService: IPollService;
}
