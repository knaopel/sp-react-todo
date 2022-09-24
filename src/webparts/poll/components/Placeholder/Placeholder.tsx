import {
  Icon,
  mergeStyles,
  PrimaryButton,
  Stack,
  Text,
} from 'office-ui-fabric-react';
import * as React from 'react';
import { IPlaceholderProps } from './IPlaceholderProps';

export class Placeholder extends React.Component<IPlaceholderProps, {}> {
  // private _placeholderButton;
  private _descriptionId: string;

  public constructor(props: IPlaceholderProps) {
    super(props);
  }

  public render(): JSX.Element {
    const {
      buttonLabel,
      children,
      description,
      icon,
      iconText,
      onAdd,
    } = this.props;
    this._descriptionId = 'description-' + Math.random().toString();

    const iconStyles: string = mergeStyles({
      fontSize: 25,
      margin: '0 17.5px',
    });

    return (
        <Stack>
          <Stack
            horizontal
            horizontalAlign='center'
            verticalAlign='center'
          >
            <Icon aria-label={icon} iconName={icon} className={iconStyles} />
            <Text variant='xLarge' style={{ fontWeight: 'bold' }}>
              {iconText}
            </Text>
          </Stack>
          <Stack horizontalAlign='center' style={{ margin: '17.5px' }}>
            <Text variant='large'>{description}</Text>
            {children}
          </Stack>
          <Stack>
            {buttonLabel && (
              <PrimaryButton
                onClick={onAdd}
                ariaLabel={buttonLabel}
                ariaDescription={description}
              >
                {buttonLabel}
              </PrimaryButton>
            )}
          </Stack>
        </Stack>
    );
  }
  private _focusOnPlaceHolderButton(): void {}
}
