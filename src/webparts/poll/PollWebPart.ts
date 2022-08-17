import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import {   Environment,   EnvironmentType,   Version, } from '@microsoft/sp-core-library';

import * as strings from 'PollStrings';
import { IPollWebPartProps } from './IPollWebPartProps';
// import ReactTodo2 from './components/ReactTodo2';
import { IMainProps, Main } from './components/Main';

export default class PollWebPart extends BaseClientSideWebPart<IPollWebPartProps> {
  // private pollService: IPollService;

  protected onInit(): Promise<void> {
    this._configureWebPart = this._configureWebPart.bind(this);

    if (DEBUG && Environment.type === EnvironmentType.Local) {
      // this.pollService = new MockPollService();
    } else {
      // this.pollService = new PollService(this.context);
    }

    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IMainProps> = React.createElement(
      Main,
      {
        // listName: this.properties.listName,
        // pollTitle: this.properties.pollTitle,
        // pollDescription: this.properties.pollDescription,
        needsConfiguration: this._needsConfiguration(),
        // displayMode: this.displayMode,
        configureWebPart: this._configureWebPart,
        // pollService: this.pollService
      }
    );

    ReactDom.render(element, this.domElement);
  }

  // protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
  //   if (!currentTheme) {
  //     return;
  //   }

  //   this._isDarkTheme = !!currentTheme.isInverted;
  //   const { semanticColors } = currentTheme;

  //   if (semanticColors) {
  //     this.domElement.style.setProperty(
  //       '--bodyText',
  //       semanticColors.bodyText || null
  //     );
  //     this.domElement.style.setProperty('--link', semanticColors.link || null);
  //     this.domElement.style.setProperty(
  //       '--linkHovered',
  //       semanticColors.linkHovered || null
  //     );
  //   }
  // }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
              groupName: strings.ViewGroupName,
              groupFields: [
                PropertyPaneTextField('pollTitle', {
                  label: strings.PollTitleFieldLabel,
                  onGetErrorMessage: this.validatePollTitle
                }),
                PropertyPaneTextField('pollDescription',{
                  label: strings.PollDescriptionFieldLabel
                })
              ],
            },
            {
              groupName: strings.DataGroupName,
              groupFields:[
                PropertyPaneTextField('listName',{
                  label:strings.ListNameFieldLabel,
                  onGetErrorMessage: this.validateListName
                })
              ]
            }
          ],
        },
      ],
    };
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private validatePollTitle(pollTitle: string):string {
    if(pollTitle.trim().length ===0){
      return 'Please enter a title for this poll';
    }else{
      return '';
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private validateListName(pollTitle: string):string {
    if(pollTitle.trim().length ===0){
      return 'Please enter the name of the list.';
    }else{
      return '';
    }
  }

  private _needsConfiguration():boolean{
    return this.properties.listName === null ||
    this.properties.listName.trim().length ===0 ||
    this.properties.pollTitle === null ||
    this.properties.pollTitle.trim().length ===0;
  }

  private _configureWebPart():void {
    this.context.propertyPane.open();
  }
}
