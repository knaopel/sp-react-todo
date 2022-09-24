import * as React from 'react';
import { IPollProps } from './IPollProps';
import { IPollState } from './IPollState';
import { PrimaryButton } from '@microsoft/office-ui-fabric-react-bundle';
import { Vote } from '../Vote';
import { Results } from '../Results';

export class Poll extends React.Component<IPollProps, IPollState> {
  public constructor(props: IPollProps) {
    super(props);

    this.state = {
      showResults: true,
    };

    this._voted = this._voted.bind(this);
    this._voteNow = this._voteNow.bind(this);
  }

  public static getDerivedStateFromProps(
    props: IPollProps,
    state: IPollState
  ): IPollState {
    const { showResults } = state;
    return {
      showResults,
    };
  }

  public render(): JSX.Element {
    const { description, title } = this.props;
    const { showResults } = this.state;

    return (
      <div>
        <div className='ms-font-xl'>{title}</div>
        <div className='ms-font-m-plus'>{description}</div>
        <br />
        {showResults === false && (
          <div>
            <Vote onVoted={this._voted} {...this.props} />
            <PrimaryButton
              data-automation-id='toResults'
              onClick={this._voted}
              disabled={false}
              text='View Results'
            />
          </div>
        )}
        {showResults && (
          <div>
            <Results {...this.props} />
            <PrimaryButton
              data-automation-id='toVote'
              onClick={this._voteNow}
              disabled={false}
              text='Vote Now'
            />
          </div>
        )}
      </div>
    );
  }

  private _voted(): void {
    this.setState({
      showResults: true,
    });
  }

  private _voteNow(): void {
    this.setState({
      showResults: false,
    });
  }
}
