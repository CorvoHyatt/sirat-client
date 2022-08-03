import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  public pusher: any

  constructor() {
    //Pusher.logToConsole = true;
    this.pusher = new Pusher(
      'f7e8a37d1ad14888fa5d',
      {
        cluster: 'us2'
      }
    );
  }

  subscribeToChannel(channelName: String, events: String[], cb: Function) {
    var channel = this.pusher.subscribe(channelName);
    events.forEach( event => {
      channel.bind(event, function(data: any) {
        cb(data)
      });
    })
  }
}