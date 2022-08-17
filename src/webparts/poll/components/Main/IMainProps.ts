// import { IPollWebPartProps } from '../../IPollWebPartProps';
// import { DisplayMode } from '@microsoft/sp-core-library';
// import { IPollService } from '../../services';

// export interface IMainProps extends IPollWebPartProps {
export interface IMainProps {
  needsConfiguration: boolean;
  configureWebPart: () => void;
  // displayMode: DisplayMode;
  // pollService: IPollService;
}
