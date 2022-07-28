import * as React from 'react';
import { Fabric } from 'office-ui-fabric-react';
import styles from './TodoContainer.module.scss';
import ITodoContainerProps from './ITodoContainerProps';
import ITodoItem from '../../models/ITodoItem';
import ConfigurationView from '../ConfigurationView/ConfigurationView';
import { DisplayMode } from '@microsoft/sp-core-library';
import TodoForm from '../TodoForm/TodoForm';
import TodoList from '../TodoList/TodoList';

const TodoContainer: React.FunctionComponent<ITodoContainerProps> = ({
  webPartDisplayMode,
  dataProvider,
  selectedListId,
  configureStartCallback,
}) => {
  const [showPlaceholder, setShowPlaceholder] = React.useState(true);
  const [todoItems, setTodoItems] = React.useState([]);

  const createTodoItem = (inputValue: string): Promise<void> => {
    return dataProvider.createItem(inputValue).then((items: ITodoItem[]) => {
      setTodoItems(items);
    });
  };

  const completeTodoItem = (todoItem: ITodoItem): Promise<void> => {
    return dataProvider.updateItem(todoItem).then((items: ITodoItem[]) => {
      setTodoItems(items);
    });
  };

  const deleteTodo = (todoItem: ITodoItem): Promise<void> => {
    return dataProvider.deleteItem(todoItem).then((items: ITodoItem[]) => {
      setTodoItems(items);
    });
  };

  React.useEffect(() => {
    console.log('useEffect() runs', dataProvider);
    if (selectedListId) {
      if (selectedListId !== '0') {
        setShowPlaceholder(false);
              dataProvider.getItems().then(
                (items: ITodoItem[]) => {
                  setTodoItems(items);
                },
                (err) => console.log(err)
              );
      } else if (selectedListId === '0') {
        setShowPlaceholder(true);
      }
    } else {
      setShowPlaceholder(true);
    }
  }, [dataProvider, selectedListId, showPlaceholder]);

  const configureWebPart = (): void => {
    configureStartCallback();
  };

  return (
    <Fabric>
      {showPlaceholder && webPartDisplayMode === DisplayMode.Edit && (
        <ConfigurationView
          icon='Edit'
          iconText='To-dos'
          description='Get things done. Organize and share your to-do items with your team.'
          buttonLabel='configure'
          // eslint-disable-next-line react/jsx-no-bind
          onConfigure={configureWebPart}
        />
      )}
      {showPlaceholder && webPartDisplayMode === DisplayMode.Read && (
        <ConfigurationView
          icon='Edit'
          iconText='To-dos'
          description='Get things done. Organize and share your teams to-do items with your team. Edit this web part to start managing to-dos.'
        />
      )}
      {!showPlaceholder && (
        <div className={styles.todo}>
          <div className={styles.topRow}>
            <h2 className={styles.todoHeading}>Todo</h2>
          </div>
          {/* <div>
            <strong>ListItemEntityTypeFullName:</strong>
            <span>{dataProvider?.selectedList?.ListItemEntityTypeFullName}</span>
          </div> */}
          <TodoForm
            // eslint-disable-next-line react/jsx-no-bind
            onAddTodoItem={createTodoItem}
          />
          <TodoList
            items={todoItems}
            // eslint-disable-next-line react/jsx-no-bind
            onCompleteTodoItem={completeTodoItem}
            // eslint-disable-next-line react/jsx-no-bind
            onDeleteTodoItem={deleteTodo}
          />
        </div>
      )}
    </Fabric>
  );
};

export default TodoContainer;
