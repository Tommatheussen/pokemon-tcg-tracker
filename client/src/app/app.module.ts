import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDialogModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTableModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxElectronModule } from 'ngx-electron';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SetItemComponent } from './set-item/set-item.component';
import { UpdateAvailableDialogComponent } from './update/update-available/update-available-dialog.component';
import { UpdateDownloadedDialogComponent } from './update/update-downloaded/update-downloaded-dialog.component';
import { UpdaterService } from './update/updater.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,

    SetItemComponent,

    // MenuItemComponent,
    UpdateAvailableDialogComponent,
    UpdateDownloadedDialogComponent
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

    NgxElectronModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    //SettingsService,
    UpdaterService
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
    UpdateDownloadedDialogComponent
    // SettingsDialogComponent
  ]
})
export class AppModule {}
