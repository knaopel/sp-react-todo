import ItemOperationCallback from '../../models/ItemOperationCallback';
import ITodoItem from '../../models/ITodoItem';

export default interface ITodoListItemProps {
  item: ITodoItem;
  isChecked?: boolean;
  onCompleteListItem: ItemOperationCallback;
  onDeleteListItem: ItemOperationCallback;
}
