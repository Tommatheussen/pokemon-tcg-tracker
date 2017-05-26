import { InjectionToken } from '@angular/core';
import { UpdateInfo } from './update-info.interface';

export let UPDATE_INFO = new InjectionToken<UpdateInfo>('release.info');