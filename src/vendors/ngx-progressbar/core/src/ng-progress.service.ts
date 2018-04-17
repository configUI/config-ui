import { Injectable, Inject, Optional } from '@angular/core';
import { NgProgressRef } from './ng-progress-ref';
import { NgProgressConfig } from './ng-progress.interface';
import { empty } from 'rxjs/observable/empty';
import { CONFIG } from './ng-progress.token';

const defaultConfig: NgProgressConfig = {
  meteor: true,
  spinner: true,
  thick: false,
  ease: 'linear',
  spinnerPosition: 'right',
  direction: 'ltr+',
  color: '#1B95E0',
  max: 100,
  min: 30,
  speed: 200,
  trickleSpeed: 300
};

@Injectable()
export class NgProgress {

  /** Stores NgProgressRef instances */
  private readonly _instances = {};

  /** Global config */
  config: NgProgressConfig;

  constructor(@Optional() @Inject(CONFIG) config: NgProgressConfig) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Returns NgProgressRef by ID
   */
  ref(id = 'root', config?: NgProgressConfig) {
    if (this._instances[id] instanceof NgProgressRef) {
      return this._instances[id];
    } else {
      config = { ...this.config, ...config };
      return this._instances[id] = new NgProgressRef(config);
    }
  }

  setConfig(config: NgProgressConfig, id = 'root') {
    if (this._instances[id] instanceof NgProgressRef) {
      this._instances[id].setConfig(config);
    }
  }

  start(id = 'root') {
    if (this._instances[id] instanceof NgProgressRef) {
      this._instances[id].start();
    }
  }

  set(n: number, id = 'root') {
    if (this._instances[id] instanceof NgProgressRef) {
      this._instances[id].set(n);
    }
  }

  inc(n?: number, id = 'root') {
    if (this._instances[id] instanceof NgProgressRef) {
      this._instances[id].inc(n);
    }
  }

  complete(id = 'root') {
    if (this._instances[id] instanceof NgProgressRef) {
      this._instances[id].complete();
    }
  }

  isStarted(id = 'root') {
    return (this._instances[id] instanceof NgProgressRef) ? this._instances[id].isStarted : false;
  }

  started(id = 'root') {
    return (this._instances[id] instanceof NgProgressRef) ? this._instances[id].started : empty();
  }

  completed(id = 'root') {
    return (this._instances[id] instanceof NgProgressRef) ? this._instances[id].ended : empty();
  }

  destroy(id = 'root') {
    if (this._instances[id] instanceof NgProgressRef) {
      this._instances[id].destroy();
      this._instances[id] = null;
    }
  }

  destroyAll() {
    Object.keys(this._instances).map((key) => {
      this._instances[key].destroy();
      this._instances[key] = null;
    });
  }
}
