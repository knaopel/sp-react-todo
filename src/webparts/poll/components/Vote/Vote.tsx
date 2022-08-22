import {
  ChoiceGroup,
  IChoiceGroupOption,
  PrimaryButton,
  Spinner,
} from 'office-ui-fabric-react';
import * as React from 'react';
import { IVoteOption } from '../../services';
import { IVoteState } from './IVoteProps';
import { IVoteProps } from './IVoteState';

export class Vote extends React.Component<IVoteProps, IVoteState> {
  public constructor(props: IVoteProps) {
    super(props);

    this.state = {
      loading: true,
      voteOptions: [],
      voting: false,
      error: undefined,
      voteOptionId: undefined,
    };

    this._vote = this._vote.bind(this);
    this._selectVoteOption = this._selectVoteOption.bind(this);
  }

  public componentDidMount(): void {
    const { listName, pollService } = this.props;
    pollService.getVoteOptions(listName).then(
      (voteOptions: IVoteOption[]): void => {
        this.setState(
          (prevState: IVoteState, props: IVoteProps): IVoteState => {
            prevState.voteOptions = voteOptions;
            prevState.loading = false;
            return prevState;
          }
        );
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error: any): void => {
        this.setState(
          (prevState: IVoteState, props: IVoteProps): IVoteState => {
            prevState.loading = false;
            prevState.error = error.data['odata.error'].message.value;
            return prevState;
          }
        );
      }
    );
  }

  public render(): JSX.Element {
    const { error, loading, voteOptionId, voteOptions, voting } = this.state;
    const options: IChoiceGroupOption[] = voteOptions.map<IChoiceGroupOption>(
      (
        value: IVoteOption,
        index: number,
        array: IVoteOption[]
      ): IChoiceGroupOption => {
        return {
          key: value.id.toString(),
          text: value.label,
        };
      }
    );

    return (
      <div>
        {loading && <Spinner label='Loading poll...' />}
        {loading === false && voteOptions.length > 0 && (
          <div>
            <ChoiceGroup
              options={options}
              onChange={this._selectVoteOption}
              disabled={voting}
            />
            <PrimaryButton
              onClick={this._vote}
              disabled={voteOptionId === undefined || voting}
              text='Vote'
            />
            <br />
          </div>
        )}
        {voting && <Spinner label='Voting...' />}
        {error !== undefined && (
          <div className='ms-fontColor-red'>
            <i className='ms-Icon ms-Icon--StatusErrorFull' /> An error has
            occured while loading vote options: <em>{error}</em>
          </div>
        )}
      </div>
    );
  }

  private _selectVoteOption(evt: unknown, option: IChoiceGroupOption): void {
    this.setState((prevState: IVoteState, props: IVoteProps): IVoteState => {
      prevState.voteOptionId = parseInt(option.key);
      return prevState;
    });
  }

  private _vote(): void {
    const { listName, pollService, onVoted } = this.props;
    const { voteOptionId } = this.state;
    this.setState((prevState: IVoteState, props: IVoteProps): IVoteState => {
      prevState.error = undefined;
      prevState.voting = true;
      return prevState;
    });

    pollService.vote(voteOptionId, listName).then(
      (): void => {
        this.setState(
          (prevState: IVoteState, props: IVoteProps): IVoteState => {
            prevState.voting = false;
            return prevState;
          }
        );

        onVoted();
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error: any): void => {
        this.setState(
          (prevState: IVoteState, props: IVoteProps): IVoteState => {
            prevState.voting = false;
            prevState.error = error.data
              ? error.data['odata.error'].message.value
              : error;
            return prevState;
          }
        );
      }
    );
  }
}
