import * as React from "react";
import * as ReactDom from "react-dom";
import {
  Environment,
  EnvironmentType,
  Version,
} from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  IPropertyPaneField,
  PropertyPaneLabel,
  PropertyPaneTextField,
  PropertyPaneButton,
  PropertyPaneButtonType,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";
import * as lodash from "@microsoft/sp-lodash-subset";
import * as strings from "ReactTodoWebPartStrings";
import TodoContainer from "./components/TodoContainer/TodoContainer";
import ITodoWebPartProps from "./ITodoWebPartProps";
import ITodoDataProvider from "./dataProviders/ITodoDataProvider";
import ITodoTaskList from "./models/ITodoTaskList";
import SharePointDataProvider from "./dataProviders/SharePointDataProvider";
import MockDataProvider from "./tests/MockDataProvider";
import ITodoContainerProps from "./components/TodoContainer/ITodoContainerProps";

export default class TodoWebPart extends BaseClientSideWebPart<ITodoWebPartProps> {
  private _dropdownOptions: IPropertyPaneDropdownOption[];
  private _dataProvider: ITodoDataProvider;
  private _selectedList: ITodoTaskList;
  private _disableDropdown: boolean;
  // existing
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = "";

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();
    this.context.statusRenderer.displayLoadingIndicator(
      this.domElement,
      "Todo"
    );

    if (DEBUG && Environment.type === EnvironmentType.Local) {
      this._dataProvider = new MockDataProvider();
    } else {
      this._dataProvider = new SharePointDataProvider();
      this._dataProvider.webPartContext = this.context;
    }

    this._openPropertyPane = this._openPropertyPane.bind(this);

    this._populateTaskListSelector();
    // this._loadTaskLists().then(
    //   () => {
    //     if (this.properties.spListIndex) {
    //       this._setSelectedList(this.properties.spListIndex.toString());
    //       this.context.statusRenderer.clearLoadingIndicator(this.domElement);
    //     }
    //   },
    //   (err) => console.log(err)
    // );

    return super.onInit();
  }

  public render(): void {
    /*
    Create the react element we want to render in the web part DOM. Pass the required props to the react component.
    */
    const element: React.ReactElement<ITodoContainerProps> =
      React.createElement(TodoContainer, {
        dataProvider: this._dataProvider,
        webPartDisplayMode: this.displayMode,
        configureStartCallback: this._openPropertyPane,
      });

    ReactDom.render(element, this.domElement);
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) {
      // running in Teams
      return this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentTeams
        : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost
      ? strings.AppLocalEnvironmentSharePoint
      : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty(
        "--bodyText",
        semanticColors.bodyText || null
      );
      this.domElement.style.setProperty("--link", semanticColors.link || null);
      this.domElement.style.setProperty(
        "--linkHovered",
        semanticColors.linkHovered || null
      );
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  private _loadTaskLists(): Promise<void | { key: string; text: string }> {
    return this._dataProvider
      .getTaskLists()
      .then((taskLists: ITodoTaskList[]) => {
        // Disable dropdown field if there are no results from the server.
        this._disableDropdown = taskLists.length === 0;
        if (taskLists.length !== 0) {
          this._dropdownOptions = taskLists.map((list: ITodoTaskList) => {
            return { key: list.Id, text: list.Title };
          });
        }
      });
  }

  private _populateTaskListSelector(): void {
    this._loadTaskLists().then(
      () => {
        if (this.properties.spListIndex) {
          this._setSelectedList(this.properties.spListIndex.toString());
          this.context.statusRenderer.clearLoadingIndicator(this.domElement);
        }
      },
      (err) => console.log(err)
    );
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
    }
  }

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
    oldValue: string | boolean,
    newValue: string | boolean
  ): void {
    /*
      Check the property path to see which property pane field changed.
      If the property path matches the dropdown, then we set that list as the selected list for the web part.
      */
    if (propertyPath === "spListIndex") {
      this._setSelectedList(newValue.toString());
    }

    /*
    Finally, tell property pane to re-render the WebPart.
    This is valid for reactive property pane
    */
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }

  private _createNewList(listName: string): Promise<void> {
    return this._dataProvider.createTaskList(listName).then((list) => {
      this.properties.spListIndex = list.Id;
      this._populateTaskListSelector();
      this._openPropertyPane();
    });
  }

  private _getGroupFields(): IPropertyPaneField<unknown>[] {
    const fields: IPropertyPaneField<unknown>[] = [];

    fields.push(
      PropertyPaneDropdown("spListIndex", {
        label: "Select a list",
        disabled: this._disableDropdown,
        options: this._dropdownOptions,
      })
    );

    if (this._disableDropdown) {
      fields.push(
        PropertyPaneLabel(null, {
          text: "Could not find task lists in your site. Create one or more task list and then try using the web part.",
        })
      );
      fields.push(
        PropertyPaneTextField("spNewListName", {
          label: "New List Name",
        })
      );
      fields.push(
        PropertyPaneButton("spListAddButton", {
          text: "Add",
          buttonType: PropertyPaneButtonType.Primary,
          onClick: () => {
            const {
              properties: { spNewListName: listName },
            } = this;
            this._createNewList(listName).then(
              () => console.log(`List "${listName}" created.`),
              (err) => console.error(err)
            );
          },
        })
      );
    }
    return fields;
  }
}
