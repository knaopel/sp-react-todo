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

    this.vote = this.vote.bind(this);
    this.update = this.update.bind(this);
    this.deleteAsync = this.deleteAsync.bind(this);
    this.selectVoteOption = this.selectVoteOption.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const { pollService } = this.props;
    try {
      const voteOptions = await pollService.getVoteOptions();
      this.setState({ voteOptions, loading: false });
    } catch (err) {
      console.log(err);
    }
  }

  public render(): JSX.Element {
    const { error, loading, voteOptionId, voteOptions, voting } = this.state;
    const options: IChoiceGroupOption[] = voteOptions.map<IChoiceGroupOption>(
      (value: IVoteOption): IChoiceGroupOption => {
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
              onChange={this.selectVoteOption}
              disabled={voting}
            />
            <PrimaryButton
              onClick={this.vote}
              disabled={voteOptionId === undefined || voting}
              text='Vote'
            />
            <PrimaryButton
              onClick={this.update}
              disabled={voteOptionId === undefined || voting}
              text='Update'
            />
            <PrimaryButton
              onClick={this.deleteAsync}
              disabled={voteOptionId === undefined || voting}
              text='Delete'
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

  private selectVoteOption(evt: unknown, option: IChoiceGroupOption): void {
    this.setState({
      voteOptionId: parseInt(option.key),
    });
  }

  private async vote(): Promise<void> {
    const { pollService, onVoted } = this.props;
    const { voteOptionId } = this.state;

    this.setState({ error: undefined, voting: true });

    try {
      await pollService.vote(voteOptionId);
      this.setState({ voting: false });
      onVoted();
    } catch (error) {
      console.log(error);
      this.setState({ voting: false, error: error.data });
    }
  }

  private async update(): Promise<void> {
    const { pollService } = this.props;
    const { voteOptionId, voteOptions } = this.state;

    try {
      const filteredVoteOptions: IVoteOption[] = voteOptions.filter(
        (option: IVoteOption) => option.id === voteOptionId
      );
      const option: IVoteOption = filteredVoteOptions[0];
      await pollService.update({
        Id: option.id,
        Title: `${option.label}-Updated`,
      });
      const newVoteOptions = await pollService.getVoteOptions();
      this.setState({ voting: false, voteOptions: newVoteOptions });
    } catch (error) {
      console.log(error);
      this.setState({ voting: false, error: error.data });
    }
  }

  private async deleteAsync(): Promise<void> {
    const { pollService } = this.props;
    const { voteOptionId } = this.state;
    try {
      await pollService.deleteItem(voteOptionId);
      const updatedVoteOptions = await pollService.getVoteOptions();
      this.setState({
        voteOptions: updatedVoteOptions,
        voteOptionId: undefined,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
