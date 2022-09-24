/* eslint-disable no-bitwise */
import { merge } from '@microsoft/sp-lodash-subset';
import { Spinner } from 'office-ui-fabric-react';
import * as React from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import { IVoteResult } from '../../services';
import { IResultsProps } from './IResultsProps';
import { IResultsState } from './IResultsState';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires
const Chart: any = require('chart.js');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaults: any = Chart.defaults;

interface IColorInfo {
  backgroundColor: string;
  pointBackgroundColor: string;
  pointHoverBackgroundColor: string;
  borderColor: string;
  pointBorderColor: string;
  pointHoverBorderColor: string;
}

export class Results extends React.Component<IResultsProps, IResultsState> {
  private _useExcanvas: boolean =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (window as any).G_vmlCanvasManager === 'object' &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).G_vmlCanvasManager !== null &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (window as any).G_vmlCanvasManager.initElement === 'function';
  private _convertedColors: IColorInfo[] = undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _data: { labels: string[]; datasets: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _options: any;

  public constructor(props: IResultsProps) {
    super(props);

    this.state = {
      loading: true,
      error: undefined,
      results: [],
    };

    this._convertColor = this._convertColor.bind(this);
  }

  public async componentDidMount(): Promise<void> {
    const { pollService } = this.props;
    defaults.global.tooltips.mode = 'label';
    defaults.global.elements.line.borderWidth = 2;
    defaults.global.elements.rectangle.borderWidth = 2;
    defaults.global.legend.display = false;
    defaults.global.colors = [
      '#97BBCD', // blue
      '#DCDCDC', // light grey
      '#F7464A', // red
      '#46BFBD', // green
      '#FDB45C', // yellow
      '#949FB1', // grey
      '#4D5360', // dark grey
    ];
    this._convertedColors = defaults.global.colors.map(this._convertColor);

    this._data = {
      labels: [],
      datasets: [
        merge({}, this._convertedColors[0], {
          label: 'Number of votes',
          data: [],
        }),
      ],
    };

    this._options = {
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'Number of votes',
            },
          },
        ],
      },
    };

    const results: IVoteResult[] = await pollService.getResults();
    this.setState({ results, loading: false });
  }

  public render(): JSX.Element {
    const { loading, results } = this.state;
    if (results.length > 0) {
      this._data.labels.length = 0;
      this._data.datasets[0].data.length = 0;

      for (let i: number = 0; i < results.length; i++) {
        const result: IVoteResult = results[i];
        this._data.labels.push(result.label);
        this._data.datasets[0].data.push(result.numVotes);
      }
    }
    return (
      <div>
        {loading && <Spinner label='Loading results...' />}
        {loading === false && (
          <HorizontalBar data={this._data} options={this._options} />
        )}
      </div>
    );
  }

  private _convertColor(color: IColorInfo | string): IColorInfo {
    if (typeof color === 'object' && color !== null) return color;
    if (typeof color === 'string' && color[0] === '#') {
      const subStr: string = color.substring(1);
      const rgbColor: number[] = Results._hexToRgb(subStr);
      return this._getColor(rgbColor);
    }
    return this._getRandomColor();
  }

  private _getRandomColor(): IColorInfo {
    const color: number[] = [
      Results._getRandomInt(0, 255),
      Results._getRandomInt(0, 255),
      Results._getRandomInt(0, 255),
    ];
    return this._getColor(color);
  }

  private _getColor(color: number[]): IColorInfo {
    return {
      backgroundColor: this._rgba(color, 0.2),
      pointBackgroundColor: this._rgba(color, 1),
      pointHoverBackgroundColor: this._rgba(color, 0.8),
      borderColor: this._rgba(color, 1),
      pointBorderColor: '#fff',
      pointHoverBorderColor: this._rgba(color, 1),
    };
  }

  private static _getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private _rgba(color: number[], alpha: number): string {
    return this._useExcanvas
      ? `rgb(${color.join(',')})`
      : `rgba(${color.concat(alpha).join(',')})`;
  }

  private static _hexToRgb(hex: string): number[] {
    const bigint: number = parseInt(hex, 16),
      r: number = (bigint >> 16) & 255,
      g: number = (bigint >> 8) & 255,
      b: number = bigint & 255;

    return [r, g, b];
  }
}
