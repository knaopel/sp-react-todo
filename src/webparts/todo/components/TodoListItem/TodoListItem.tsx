import * as React from 'react';
import { css, FocusZone, FocusZoneDirection } from 'office-ui-fabric-react';
import { FunctionComponent, useEffect, useState } from 'react';
import ITodoListItemProps from './ITodoListItemProps';
import styles from './TodoListItem.module.scss';

const TodoListItem: FunctionComponent<ITodoListItemProps> = (props) => {
  const {item, isChecked, onCompleteListItem, onDeleteListItem} = props;
  const classTodoItem: string = css(
    styles.todoListItem,
    'ms-grid',
    'ms-u-slideDownIn20'
  );

  return (
    <div role='row' className={classTodoItem} data-is-focusable={true}>
      <FocusZone direction={FocusZoneDirection.horizontal} />
    </div>
  );
};
