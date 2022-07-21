import * as React from 'react';
import { Fabric } from 'office-ui-fabric-react';
import styles from './TodoContainer.module.scss';
import ITodoContainerProps from './ITodoContainerProps';
import ITodoItem from '../../models/ITodoItem';
import ConfigurationView from '../ConfigurationView/ConfigurationView';
import { DisplayMode } from '@microsoft/sp-core-library';
import TodoForm from '../TodoForm/TodoForm';
import TodoList from '../TodoList/TodoList';

const TodoContainer: React.FunctionComponent<ITodoContainerProps> = (props) => {
  const [showPlaceholder, setShowPlaceholder] = React.useState(true);
  const [todoItems, setTodoItems] = React.useState([]);
  const { webPartDisplayMode, dataProvider, configureStartCallback } = props;
  const { selectedList } = dataProvider;

  const createTodoItem = (inputValue: string): Promise<void> => {
    return dataProvider.createItem(inputValue).then((items: ITodoItem[]) => {
      setTodoItems(items);
    });
  };

  React.useEffect(() => {
    if (selectedList) {
      if (selectedList.Id !== '0') {
        setShowPlaceholder(false);
        dataProvider.getItems().then(
          (items: ITodoItem[]) => setTodoItems(items),
          (err) => console.log(err)
        );
      } else if (selectedList.Id === '0') {
        setShowPlaceholder(true);
      }
    } else {
      setShowPlaceholder(true);
    }
  }, [dataProvider, selectedList, showPlaceholder]);

  const configureWebPart = (): void => {
    configureStartCallback();
  };

  return (
    <Fabric>
      {showPlaceholder && webPartDisplayMode === DisplayMode.Edit && (
        <ConfigurationView
          icon={'ms-Icon-Edit'}
          iconText='Todos'
          description='Get things done. Organize and share your to-do items with your team.'
          buttonLabel='configure'
          // eslint-disable-next-line react/jsx-no-bind
          onConfigure={configureWebPart}
        />
      )}
      {showPlaceholder && webPartDisplayMode === DisplayMode.Read && (
        <ConfigurationView
          icon={'ms-Icon-Edit'}
          iconText='Todos'
          description='Get things done. Organize and share your teams to-do items with your team. Edit this web part to start managing to-dos.'
        />
      )}
      {!showPlaceholder && (
        <div className={styles.todo}>
          <div className={styles.topRow}>
            <h2 className={styles.todoHeading}>Todo</h2>
          </div>
          <TodoForm
            // eslint-disable-next-line react/jsx-no-bind
            onAddTodoItem={createTodoItem}
          />
          <TodoList
            items={todoItems}
            // eslint-disable-next-line react/jsx-no-bind
            onCompleteTodoItem={() => {
              return;
            }}
            // eslint-disable-next-line react/jsx-no-bind
            onDeleteTodoItem={() => {
              return;
            }}
          />
        </div>
      )}
    </Fabric>
  );
};

export default TodoContainer;
