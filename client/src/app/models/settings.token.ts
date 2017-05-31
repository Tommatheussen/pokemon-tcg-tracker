import { InjectionToken } from '@angular/core';
import { Settings } from './setting.interface';

export let SETTINGS = new InjectionToken<Settings>('settings');
