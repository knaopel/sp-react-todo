import { IPollService } from '../../services';

export interface IVoteProps {
  onVoted: () => void;
  pollService: IPollService;
}
