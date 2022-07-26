import * as React from "react";
import {
  ButtonType,
  FontIcon,
  IStackTokens,
  mergeStyles,
  PrimaryButton,
  Stack,
} from "office-ui-fabric-react";
import styles from "./ConfigurationView.module.scss";
import IConfigurationViewProps from "./IConfigurationViewProps";
import {
  FunctionComponent,
  MouseEvent,
} from "react";

const ConfigurationView: FunctionComponent<IConfigurationViewProps> = (
  props
) => {
  const iconClass: string = mergeStyles({
    fontSize: 50,
    height: 50,
    width: 50,
    margin: "0 25px",
  });

  const handleConfigureButtonClick = (
    event?: MouseEvent<HTMLButtonElement>
  ): void => {
    props.onConfigure();
  };

  const stackTokens: IStackTokens = {
    childrenGap: 10,
    padding: 10,
  };

  return (
    <Stack tokens={stackTokens}>
      <Stack horizontal horizontalAlign="center" tokens={stackTokens}>
        <FontIcon iconName={props.icon} className={iconClass} />
        <span className="Placeholder-text ms-fontWeight-light ms-fontSize-xxl">
          {props.iconText}
        </span>
      </Stack>
      <span className="Placeholder-descriptionText">{props.description}</span>
      <PrimaryButton
        className={styles.configureButton}
        buttonType={ButtonType.primary}
        ariaLabel={props.buttonLabel}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={handleConfigureButtonClick}
      >
        {props.buttonLabel}
      </PrimaryButton>
    </Stack>
  );
};

export default ConfigurationView;
