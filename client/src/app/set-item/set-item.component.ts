import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { IpcService } from '../ipc.service';
import { Set } from '../models/set.interface';

@Component({
  selector: 'pokemon-set-item',
  templateUrl: './set-item.component.html',
  styleUrls: ['./set-item.component.scss']
})
export class SetItemComponent implements OnInit {
  @Input() set: Set;
  @Input() last: boolean;

  count: BehaviorSubject<number> = new BehaviorSubject(0);
  img$: Subject<string> = new Subject<string>();

  constructor(private _ipcService: IpcService) {}

  ngOnInit() {
    this._ipcService.setupIpcListenerOnce(
      `collection:count:${this.set.code}`,
      (event, args) => {
        this.count.next(args);
      }
    );

    this._ipcService.setupIpcListener(
      `collection:added:${this.set.code}`,
      (event, args) => {
        let value = this.count.value;
        this.count.next(++value);
      }
    );

    this._ipcService.setupIpcListener(
      `sets:symbol:${this.set.code}`,
      (event, args) => {
        this.img$.next(`data:image/png;base64,${args}`);
      }
    );

    this._ipcService.sendMessage('sets:load:symbol', {
      setCode: this.set.code
    });

    this._ipcService.sendMessage('collection:count', {
      setCode: this.set.code
    });
  }
}
