import * as React from 'react';
import {
  FocusZone,
  FocusZoneDirection,
  getRTLSafeKeyCode,
  KeyCodes,
  List,
} from 'office-ui-fabric-react';
import { FunctionComponent, KeyboardEvent, ReactFragment } from 'react';
import ITodoItem from '../../models/ITodoItem';
import ITodoListProps from './ITodoListProps';
import styles from './TodoList.module.scss';

const TodoList: FunctionComponent<ITodoListProps> = (props) => {
  const { items, onCompleteTodoItem, onDeleteTodoItem } = props;

  const onRenderCell = (item: ITodoItem, index: number): ReactFragment => {
    return <li>{item.Title}</li>;
  };

  return (
    <FocusZone
      direction={FocusZoneDirection.vertical}
      // eslint-disable-next-line react/jsx-no-bind
      isInnerZoneKeystroke={(event: KeyboardEvent<HTMLElement>) =>
        event.which === getRTLSafeKeyCode(KeyCodes.right)
      }
    >
      <List
        className={styles.todoList}
        items={items}
        // eslint-disable-next-line react/jsx-no-bind
        onRenderCell={onRenderCell}
      />
    </FocusZone>
  );
};

export default TodoList;
