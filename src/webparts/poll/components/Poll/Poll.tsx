import * as React from 'react';
// import styles from './Poll.module.scss';
import { IPollProps } from './IPollProps';
// import { escape } from '@microsoft/sp-lodash-subset';
import { IPollState } from './IPollState';
import { PrimaryButton } from 'office-ui-fabric-react';

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

  // protected componentWillReceiveProps(
  //   nextProps: Readonly<IPollProps>,
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   nextContext: any
  // ): void {
  //   this.setState({
  //     showResults: true,
  //   });
  // }

  public render(): JSX.Element {
    const { description, title } = this.props;
    const showResults: boolean = this.state.showResults;

    return (
      <div>
        <div className='ms-font-xl'>{title}</div>
        <div className='ms-font-m-plus'>{description}</div>
        <br />
        {showResults === false && (
          <div>
            <div>Vote Component here</div>
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
            <div>Results Component here</div>
            <PrimaryButton
              data-automation-id='toVote'
              onClick={this._voteNow}
              disabled={false}
              text='Vote Now'
            />
          </div>
        )}
      </div>
      // <section
      //   className={`${styles.reactTodo2} ${
      //     hasTeamsContext ? styles.teams : ''
      //   }`}
      // >
      //   <div className={styles.welcome}>
      //     <img
      //       alt=''
      //       src={
      //         isDarkTheme
      //           ? require('../assets/welcome-dark.png')
      //           : require('../assets/welcome-light.png')
      //       }
      //       className={styles.welcomeImage}
      //     />
      //     <h2>Well done, {escape(userDisplayName)}!</h2>
      //     <div>{environmentMessage}</div>
      //     <div>
      //       Web part property value: <strong>{escape(description)}</strong>
      //     </div>
      //   </div>
      //   <div>
      //     <h3>Welcome to SharePoint Framework!</h3>
      //     <p>
      //       The SharePoint Framework (SPFx) is a extensibility model for
      //       Microsoft Viva, Microsoft Teams and SharePoint. It&#39;s the easiest
      //       way to extend Microsoft 365 with automatic Single Sign On, automatic
      //       hosting and industry standard tooling.
      //     </p>
      //     <h4>Learn more about SPFx development:</h4>
      //     <ul className={styles.links}>
      //       <li>
      //         <a
      //           href='https://aka.ms/spfx'
      //           target='_blank'
      //           rel='noreferrer noopener'
      //         >
      //           SharePoint Framework Overview
      //         </a>
      //       </li>
      //       <li>
      //         <a
      //           href='https://aka.ms/spfx-yeoman-graph'
      //           target='_blank'
      //           rel='noreferrer noopener'
      //         >
      //           Use Microsoft Graph in your solution
      //         </a>
      //       </li>
      //       <li>
      //         <a
      //           href='https://aka.ms/spfx-yeoman-teams'
      //           target='_blank'
      //           rel='noreferrer noopener'
      //         >
      //           Build for Microsoft Teams using SharePoint Framework
      //         </a>
      //       </li>
      //       <li>
      //         <a
      //           href='https://aka.ms/spfx-yeoman-viva'
      //           target='_blank'
      //           rel='noreferrer noopener'
      //         >
      //           Build for Microsoft Viva Connections using SharePoint Framework
      //         </a>
      //       </li>
      //       <li>
      //         <a
      //           href='https://aka.ms/spfx-yeoman-store'
      //           target='_blank'
      //           rel='noreferrer noopener'
      //         >
      //           Publish SharePoint Framework applications to the marketplace
      //         </a>
      //       </li>
      //       <li>
      //         <a
      //           href='https://aka.ms/spfx-yeoman-api'
      //           target='_blank'
      //           rel='noreferrer noopener'
      //         >
      //           SharePoint Framework API reference
      //         </a>
      //       </li>
      //       <li>
      //         <a
      //           href='https://aka.ms/m365pnp'
      //           target='_blank'
      //           rel='noreferrer noopener'
      //         >
      //           Microsoft 365 Developer Community
      //         </a>
      //       </li>
      //     </ul>
      //   </div>
      // </section>
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
