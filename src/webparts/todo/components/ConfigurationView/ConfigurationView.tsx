import * as React from 'react';
import { ButtonType, DefaultButton } from 'office-ui-fabric-react';
import styles from './ConfigurationView.module.scss';
import IConfigurationViewProps from './IConfigurationViewProps';
import {
  FunctionComponent,
  MouseEvent,
  useState,
} from 'react';

const ConfigurationView: FunctionComponent<IConfigurationViewProps> = (
  props
) => {
  const [placeHolderText, setPlaceHolderText] = useState('Enter your todo');
  const [inputValue, setInputValue] = useState('');

  const handleConfigureButtonClick = (
    event?: MouseEvent<HTMLButtonElement>
  ): void => {
    props.onConfigure();
  };

  return (
    <div className='Placeholder'>
      <div className='Placeholder-container ms-grid'>
        <div className='ms-Grid-col ms-u-hiddenSm ms-u-md3' />
        <div className='Placeholder-headContainer ms-Grid-col ms-u-sm12 ms-u-md6'>
          <i
            className={'Placeholder-icon ms-fontSize-su ms-Icon ' + props.icon}
          />
          <span className='Placeholder-text ms-fontWeight-light ms-fontSize-xxl'>
            {props.iconText}
          </span>
        </div>
        <div className='Placeholder-description ms-Grid-row'>
          <span className='Placeholder-descriptionText'>
            {props.description}
          </span>
        </div>
        <div className='Placeholder-description ms-Grid-row'>
          <DefaultButton
            className={styles.configureButton}
            buttonType={ButtonType.primary}
            ariaLabel={props.buttonLabel}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={handleConfigureButtonClick}
          >
            {props.buttonLabel}
          </DefaultButton>
        </div>
        <div className='ms-Grid-col ms-u-hiddenSm ms-u-md3' />
      </div>
    </div>
  );
};

export default ConfigurationView;
