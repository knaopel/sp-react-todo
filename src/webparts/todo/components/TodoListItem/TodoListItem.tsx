import * as React from "react";
import {
  Checkbox,
  css,
  FocusZone,
  FocusZoneDirection,
  IconButton,
  IIconProps,
  IStackTokens,
  Stack,
} from "office-ui-fabric-react";
import { FormEvent, FunctionComponent, MouseEvent } from "react";
import ITodoListItemProps from "./ITodoListItemProps";
import styles from "./TodoListItem.module.scss";
import ITodoItem from "../../models/ITodoItem";

const TodoListItem: FunctionComponent<ITodoListItemProps> = (props) => {
  const { item, isChecked, onCompleteListItem, onDeleteListItem } = props;

  const deleteIcon: IIconProps = { iconName: "Delete" };

  const classTodoItem: string = css(
    styles.todoListItem,
    "ms-grid",
    "ms-u-slideDownIn20"
  );

  const handleToggleChanged = (
    event: FormEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    const updatedItem: ITodoItem = {
      ...item,
      PercentComplete: item.PercentComplete >= 1 ? 0 : 1,
    };
    onCompleteListItem(updatedItem);
  };

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>): void => {
    onDeleteListItem(item);
  };

  const stackTokens: IStackTokens = { childrenGap: 30 };

  return (
    <div role="row" className={classTodoItem} data-is-focusable={true}>
      <FocusZone direction={FocusZoneDirection.horizontal}>
        <Stack horizontal horizontalAlign="space-around" tokens={stackTokens}>
          <Stack.Item grow align="center">
            <Checkbox
              className={css(styles.checkbox, "ms-u-sm11")}
              label={item.Title}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={handleToggleChanged}
              checked={isChecked}
            />
          </Stack.Item>
          <Stack.Item align="end" disableShrink>
            <IconButton
              className={css(styles.deleteButton, "ms-u-sm11")}
              iconProps={deleteIcon}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={handleDeleteClick}
            />
          </Stack.Item>
        </Stack>
      </FocusZone>
    </div>
  );
};

export default TodoListItem;
