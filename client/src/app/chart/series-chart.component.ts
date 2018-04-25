import { AfterViewInit, Component, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { IpcService } from '../ipc.service';


@Component({
  selector: 'pokemon-series-chart',
  templateUrl: './series-chart.component.html',
  styleUrls: ['./series-chart.component.scss']
})
export class SeriesChartComponent implements AfterViewInit {
  @Input() series: string;

  chart;

  constructor(private _ipcService: IpcService) {}

  ngAfterViewInit(): void {
    this._setupSeriesChartHandler();
    this._ipcService.sendMessage(`series:data:load`, this.series);
  }

  private _setupSeriesChartHandler() {
    this._ipcService.setupIpcListenerOnce(
      `series:data:${this.series}`,
      (event, data) => {
        let seriesData = data.reduce(
          (accumulator, currentValue) => {
            accumulator.labels.push(currentValue.name);
            accumulator.values.push(currentValue.value);
            return accumulator;
          },
          { labels: [], values: [] }
        );

        this.chart = new Chart(this.series, {
          type: 'polarArea',
          data: {
            labels: seriesData.labels,
            datasets: [
              {
                data: seriesData.values,
                backgroundColor: this._fillColors(seriesData.values.length)
              }
            ]
          }
        });
      }
    );
  }

  private _fillColors(length) {
    return Array.apply(null, Array(length)).map(x => this._getRandomColor());
  }

  private _getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
