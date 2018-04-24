import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule,
  MatProgressBarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxElectronModule } from 'ngx-electron';
import { AppComponent } from './app.component';
import { CardPreviewOverlayComponent } from './card-preview/card-preview.component';
import { CardPreviewOverlayService } from './card-preview/card-preview.service';
import { HomeComponent } from './home/home.component';
import { IpcService } from './ipc.service';
import { SetItemComponent } from './set-item/set-item.component';
import { UpdateAvailableDialogComponent } from './update/update-available/update-available-dialog.component';
import { UpdateDownloadedDialogComponent } from './update/update-downloaded/update-downloaded-dialog.component';
import { UpdaterService } from './update/updater.service';

import { ChartsComponent } from './chart/chart.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SeriesChartComponent } from './chart/series-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChartsComponent,

    SetItemComponent,

    // MenuItemComponent,
    UpdateAvailableDialogComponent,
    UpdateDownloadedDialogComponent,
    CardPreviewOverlayComponent,

    SeriesChartComponent
    // SettingsDialogComponent
  ],
  imports: [
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatProgressBarModule,

    NgxElectronModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxChartsModule,

    OverlayModule
  ],
  providers: [
    //SettingsService,
    UpdaterService,
    IpcService,

    CardPreviewOverlayService

    // SetService,
    // CardService,
    // CollectionService,
    // SettingsStore,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: (settingsStore: SettingsStore) => () =>
    //     settingsStore.initSettings(),
    //   deps: [SettingsStore],
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    UpdateAvailableDialogComponent,
    UpdateDownloadedDialogComponent,
    CardPreviewOverlayComponent
    // SettingsDialogComponent
  ]
})
export class AppModule {}
