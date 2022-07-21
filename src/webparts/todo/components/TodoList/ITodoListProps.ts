import ItemOperationCallback from '../../models/ItemOperationCallback';
import ITodoItem from '../../models/ITodoItem';

export default interface ITodoListProps {
  items: ITodoItem[];
  onCompleteTodoItem: ItemOperationCallback;
  onDeleteTodoItem: ItemOperationCallback;
}
