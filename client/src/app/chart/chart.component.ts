import { AfterViewInit, Component } from '@angular/core';
import { Chart } from 'chart.js';
import { IpcService } from '../ipc.service';


@Component({
  selector: 'pokemon-charts',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartsComponent implements AfterViewInit {
  totalProgress = 0;

  seriesData: {
    name: string;
    series: {
      name: string;
      value: number;
    }[];
  }[] = [
    {
      name: 'XY',
      series: [
        {
          name: 'Set 1',
          value: 97
        },
        {
          name: 'Set 2',
          value: 65
        },
        {
          name: 'Set 3',
          value: 23
        }
      ]
    }
  ];

  data: { name: string; value: number }[] = [];

  charts = [
    'Base',
    'XY',
    'POP',
    'Black & White',
    'HeartGold & SoulSilver',
    'Platinum',
    'EX',
    'Sun & Moon',
    'Gym',
    'Diamond & Pearl',
    'Neo',
    'E-Card'
  ];
  chartData = {};

  chart: Chart[];

  series: string[];

  constructor(private _ipcService: IpcService) {}

  ngAfterViewInit(): void {
    this._setupSeriesHandler();

    this._setupChartingHandler();
    this._ipcService.sendMessage('chart:load');

    // this._setupSeriesDataHandler();
    // this._ipcService.sendMessage('chart:load:series');

    // this.chart = new Chart('canvas', {
    //   type: 'polarArea',
    //   data: {
    //     labels: ['Series 1', 'Series 2', 'Series 3', 'Series 4', 'Series 5'],
    //     datasets: [
    //       {
    //         data: [15, 52, 17, 93, 100]
    //       }
    //     ]
    //   }
    // });
  }

  private _setupChartingHandler() {
    this._ipcService.setupIpcListenerOnce('chart:data', (event, data) => {
      this.totalProgress = data.collected / data.total * 100;
    });
  }

  private _setupSeriesHandler() {
    this._ipcService.setupIpcListenerOnce('series:data', (event, data) => {
      this.series = data;
    });
  }

  private _setupSeriesDataHandler() {
    this._ipcService.setupIpcListenerOnce(
      'chart:data:series',
      (event, data) => {
        data.forEach(seriesSet => {
          // let chartObject: { name: string; chart ?: any } = {
          //   name: seriesSet.name
          // };

          // this.charts.push(seriesSet.name);

          let labels = [];
          let data = [];

          seriesSet.series.forEach(set => {
            labels.push(set.name);
            data.push(set.value);
          });

          console.log(labels, data);

          this.chartData[seriesSet.name] = new Chart(seriesSet.name, {
            type: 'polarArea',
            data: {
              labels: labels,
              datasets: [
                {
                  data: data
                }
              ]
            }
          });

          console.log(this.chartData);

          // console.log(seriesChart);

          // seriesSet.series.forEach(set => {
          //   seriesChart.data.labels.push(set.name);
          //   seriesChart.data.datasets = [
          //     {

          //       .forEach(dataset => {
          //     console.log(set);
          //     dataset.data.push(set.value);
          //   });
          //   seriesChart.update();
          // });

          //this.charts.push(seriesChart);

          // this.chartData[seriesSet.name] = seriesChart;

          // chartObject.chart = seriesChart;
        });

        console.log(data);
        this.seriesData = data;
      }
    );
  }
}
