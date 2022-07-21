import * as React from "react";
import {
  Checkbox,
  css,
  FocusZone,
  FocusZoneDirection,
  IconButton,
  IIconProps,
} from "office-ui-fabric-react";
import { FormEvent, FunctionComponent, MouseEvent, useEffect } from "react";
import ITodoListItemProps from "./ITodoListItemProps";
import styles from "./TodoListItem.module.scss";
import ITodoItem from "../../models/ITodoItem";

const TodoListItem: FunctionComponent<ITodoListItemProps> = (props) => {
  const { item, isChecked, onCompleteListItem, onDeleteListItem } = props;

  const deleteIcon: IIconProps = { iconName: "Delete" };

  useEffect(() => {
    console.log(item);
  }, [item]);

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

  return (
    <div role="row" className={classTodoItem} data-is-focusable={true}>
      <FocusZone direction={FocusZoneDirection.horizontal}>
        <div className={css(styles.itemTaskRow, "ms-Grid-row")}>
          <Checkbox
            className={css(styles.checkbox, "ms-Grid-col", "ms-u-sm11")}
            label={item.Title}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={handleToggleChanged}
            checked={isChecked}
          />
          <IconButton
            className={css(styles.deleteButton, "ms-Grid-col", "ms-u-sm11")}
            iconProps={deleteIcon}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={handleDeleteClick}
          />
        </div>
      </FocusZone>
    </div>
  );
};

export default TodoListItem;
