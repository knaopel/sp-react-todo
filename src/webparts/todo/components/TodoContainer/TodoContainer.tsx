import * as React from 'react';
import { Fabric } from 'office-ui-fabric-react';
import styles from './TodoContainer.module.scss';
import ITodoContainerProps from './ITodoContainerProps';
import ITodoContainerState from './ITodoContainerState';
import ITodoItem from '../../models/ITodoItem';
import ConfigurationView from '../ConfigurationView/ConfigurationView';
import { DisplayMode } from '@microsoft/sp-core-library';

const TodoContainer: React.FunctionComponent<ITodoContainerProps> = (props) => {
  const [showPlaceholder, setShowPlaceholder] = React.useState(true);
  const [todoItems, setTodoItems] = React.useState([]);
  const { webPartDisplayMode, dataProvider, configureStartCallback } = props;

  React.useEffect(() => {
    if (dataProvider.selectedList) {
      if (dataProvider.selectedList.Id !== '0') {
        setShowPlaceholder(false);
      } else if (dataProvider.selectedList.Id === '0') {
        setShowPlaceholder(true);
      }
    } else {
      setShowPlaceholder(true);
    }
  }, [dataProvider.selectedList, showPlaceholder]);

  const configureWebPart = (): void => {
    configureStartCallback();
  };

  // if (showPlaceholder) {return <ConfigurationView /> }
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
        </div>
      )}
    </Fabric>
  );
};

// export default class Todo extends React.Component<
//   ITodoContainerProps,
//   ITodoContainerState
// > {
//   private _showPlaceholder: boolean = true;

//   public constructor(props: ITodoContainerProps) {
//     super(props);

//     if (this.props.dataProvider.selectedList) {
//       if (this.props.dataProvider.selectedList.Id !== '0') {
//         this._showPlaceholder = false;
//       } else if (this.props.dataProvider.selectedList.Id === '0') {
//         this._showPlaceholder = true;
//       }
//     } else {
//       this._showPlaceholder = true;
//     }

//     this.state = {
//       todoItems: [],
//     };

//     this._configureWebPart = this._configureWebPart.bind(this);
//   }

//   // public static getDerivedStateFromProps(props:ITodoContainerProps,state:ITodoContainerState):ITodoContainerState{
//   //   if (props.dataProvider.selectedList) {
//   //     if (props.dataProvider.selectedList.Id !== '0') {
//   //       // this._showPlaceholder = false;
//   //       props.dataProvider.getItems().then((items: ITodoItem[]) => {
//   //         // const newItems = update(this.state.todoItems, { $set: items });
//   //         return{ todoItems: items };
//   //       });
//   //     } else if (props.dataProvider.selectedList.Id === '0') {
//   //       // this._showPlaceholder = true;
//   //       return {};
//   //     } else {
//   //       // this._showPlaceholder = true;
//   //       return {};
//   //     }
//   //     return null;
//   //   }
//   // }

//   // public componentWillReceiveProps(props: ITodoContainerProps) {
//   //   if (this.props.dataProvider.selectedList) {
//   //     if (this.props.dataProvider.selectedList.Id !== '0') {
//   //       this._showPlaceholder = false;
//   //       this.props.dataProvider.getItems().then((items: ITodoItem[]) => {
//   //         const newItems = update(this.state.todoItems, { $set: items });
//   //         this.setState({ todoItems: newItems });
//   //       });
//   //     } else if (this.props.dataProvider.selectedList.Id === '0') {
//   //       this._showPlaceholder = true;
//   //     } else {
//   //       this._showPlaceholder = true;
//   //     }
//   //   }
//   // }

//   // public componentDidMount() {
//   //   if (!this._showPlaceholder) {
//   //     this.props.dataProvider.getItems().then((items: ITodoItem[]) => {
//   //       this.setState({ todoItems: items });
//   //     });
//   //   }
//   // }

//   public render(): JSX.Element {
//     return <Fabric>Todo Container</Fabric>;
//   }

//   private _configureWebPart(): void {
//     this.props.configureStartCallback();
//   }
// }
export default TodoContainer;
