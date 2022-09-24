import * as React from 'react';
import { DisplayMode } from '@microsoft/sp-core-library';
import { Fabric } from 'office-ui-fabric-react';
import { IConfigProps } from './IConfigProps';
import { Placeholder } from '../Placeholder';

export class Config extends React.Component<IConfigProps, {}> {
  public render(): JSX.Element {
    const { configure, displayMode } = this.props;
    return (
      <Fabric>
        {displayMode === DisplayMode.Edit && (
          <Placeholder
            icon='CheckboxComposite'
            iconText='Poll'
            description='Find out what others think.'
            buttonLabel='Configure'
            onAdd={configure}
          />
        )}
        {displayMode === DisplayMode.Read && (
          <Placeholder
            icon='CheckboxComposite'
            iconText='Poll'
            description='Find out what others think.'
          />
        )}
      </Fabric>
    );
  }
}
