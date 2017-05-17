import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MdlModule } from '@angular-mdl/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { DatabaseService } from './database.service';
import { SetService } from './set.service';
import { CardService } from './card.service';
import { MenuItemComponent } from './menu-item/menu-item.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MdlModule,
  ],
  providers: [
    DatabaseService,
    SetService,
    CardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
