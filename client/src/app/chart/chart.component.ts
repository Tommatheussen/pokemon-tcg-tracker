import { Component, OnInit } from '@angular/core';
import { IpcService } from '../ipc.service';

@Component({
  selector: 'pokemon-charts',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartsComponent implements OnInit {
  data: { name: string; value: number }[] = [];

  constructor(private _ipcService: IpcService) {}

  ngOnInit(): void {
    this._setupChartingHandler();

    this._ipcService.sendMessage('chart:load');
  }

  private _setupChartingHandler() {
    this._ipcService.setupIpcListenerOnce('chart:data', (event, data) => {
      this.data = [
        {
          name: 'Collected',
          value: data.collected
        },
        {
          name: 'Not Collected',
          value: data.total - data.collected
        }
      ];
    });
  }
}
