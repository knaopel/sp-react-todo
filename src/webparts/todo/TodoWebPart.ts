import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  Environment,
  EnvironmentType,
  Version,
} from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  IPropertyPaneField,
  PropertyPaneLabel,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as lodash from '@microsoft/sp-lodash-subset';
import * as strings from 'TodoWebPartStrings';
import TodoContainer from './components/TodoContainer/TodoContainer';
import ITodoWebPartProps from './ITodoWebPartProps';
import ITodoDataProvider from './dataProviders/ITodoDataProvider';
import ITodoTaskList from './models/ITodoTaskList';
import SharePointDataProvider from './dataProviders/SharePointDataProvider';
import MockDataProvider from './tests/MockDataProvider';
import ITodoContainerProps from './components/TodoContainer/ITodoContainerProps';
import { SharePointStore } from './models';

export default class TodoWebPart extends BaseClientSideWebPart<ITodoWebPartProps> {
  private _dropdownOptions: IPropertyPaneDropdownOption[] = [];
  private _dataProvider: ITodoDataProvider;
  private _sharePointStore: SharePointStore;
  private _selectedList: ITodoTaskList;
  private _disableDropdown: boolean;

  protected onInit(): Promise<void> {
    this.context.statusRenderer.displayLoadingIndicator(
      this.domElement,
      'Todo'
    );

    if (DEBUG && Environment.type === EnvironmentType.Local) {
      this._dataProvider = new MockDataProvider();
    } else {
      this._dataProvider = new SharePointDataProvider();
      this._dataProvider.webPartContext = this.context;
      this._sharePointStore = new SharePointStore(this.context);
    }

    this._openPropertyPane = this._openPropertyPane.bind(this);

    this._loadTaskLists().then(
      () => null,
      (err) => console.log(err)
    );

    return super.onInit();
  }

  public render(): void {
    /*
    Create the react element we want to render in the web part DOM. Pass the required props to the react component.
    */
    if (!this._dataProvider.selectedList && this.properties.spListIndex) {
      this._setSelectedList(this.properties.spListIndex);
    }
    const element: React.ReactElement<ITodoContainerProps> =
      React.createElement(TodoContainer, {
        dataProvider: this._dataProvider,
        selectedListId: this._selectedList ? this._selectedList.Id : null,
        webPartDisplayMode: this.displayMode,
        configureStartCallback: this._openPropertyPane,
      });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _loadTaskLists(): Promise<any> {
    return this._dataProvider
      .getTaskLists()
      .then((taskLists: ITodoTaskList[]) => {
        // Disable dropdown field if there are no results from the server.
        this._disableDropdown = taskLists.length === 0;
        if (taskLists.length !== 0) {
          this._dropdownOptions = taskLists.map((list: ITodoTaskList) => {
            return { key: list.Id, text: list.Title };
          });
          if (this.properties.spListIndex)
            this._setSelectedList(this.properties.spListIndex);
        }
      });
  }

  private _setSelectedList(value: string): void {
    const selectedIndex: number = lodash.findIndex(
      this._dropdownOptions,
      (item: IPropertyPaneDropdownOption) => item.key === value
    );

    const selectedDropDownOption: IPropertyPaneDropdownOption =
      this._dropdownOptions[selectedIndex];

    if (selectedDropDownOption) {
      this._selectedList = {
        Title: selectedDropDownOption.text,
        Id: selectedDropDownOption.key.toString(),
      };
      this._dataProvider.selectedList = this._selectedList;
      this.render();
    }
  }

  // private _getListFromListId(listId: string): ITodoTaskList {
  //   const matchingLists: ITodoTaskList[] = this._todoTaskLists.filter(
  //     (l: ITodoTaskList) => {
  //       return l.Id === listId;
  //     }
  //   );
  //   if (matchingLists.length > 0) {
  //     return matchingLists[0];
  //   } else {
  //     return null;
  //   }
  // }

  private _openPropertyPane(): void {
    this.context.propertyPane.open();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: this._getGroupFields(),
            },
          ],
        },
      ],
    };
  }

  protected onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: string,
    newValue: string
  ): void {
    /*
      Check the property path to see which property pane field changed.
      If the property path matches the dropdown, then we set that list as the selected list for the web part.
      */
    if (propertyPath === 'spListIndex') {
      this._setSelectedList(newValue);
    }

    /*
    Finally, tell property pane to re-render the WebPart.
    This is valid for reactive property pane
    */
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    this.render();
  }

  private _getGroupFields(): IPropertyPaneField<unknown>[] {
    const fields: IPropertyPaneField<unknown>[] = [];

    fields.push(
      PropertyPaneDropdown('spListIndex', {
        label: 'Select a list',
        disabled: this._disableDropdown,
        options: this._dropdownOptions,
      })
    );

    if (this._disableDropdown) {
      fields.push(
        PropertyPaneLabel(null, {
          text: 'Could not find task lists in your site. Create one or more task list and then try using the web part.',
        })
      );
    }
    return fields;
  }
}
