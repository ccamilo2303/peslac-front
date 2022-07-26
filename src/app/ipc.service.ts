import { Injectable } from "@angular/core";
import { IpcRenderer} from "electron";

import * as SerialPort from 'serialport';

import $ from "jquery";

@Injectable({
  providedIn: "root"
})
export class IpcService {

  private ipc!: IpcRenderer;
  serialPort!: typeof SerialPort;
  $!:any;

  constructor() {
    if (window.require) {
      try {
        this.ipc = window.require("electron").ipcRenderer;
        this.serialPort = window.require('serialport');
        this.$ = window.require('jquery');
      } catch (e) {
        throw e;
      }
    } else {
      console.warn("Electron IPC was not loaded");
    }
  }

  public on(channel: string, listener: any): void {
    if (!this.ipc) {
      return;
    }
    this.ipc.on(channel, listener);
  }
  
  public once(channel: string, listener: any): void {
    if (!this.ipc) {
      return;
    }
    this.ipc.once(channel, listener);
  }

  public send(channel: string, ...args: any[]): void {
    if (!this.ipc) {
      return;
    }
    this.ipc.send(channel, ...args);
  }

  public removeAllListeners(channel: string): void {
    if (!this.ipc) {
      return;
    }
    this.ipc.removeAllListeners(channel);
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }
  
}