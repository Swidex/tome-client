import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps/ngx';
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular'
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-summon',
  templateUrl: './summon.page.html',
  styleUrls: ['./summon.page.scss'],
})
export class SummonPage implements OnInit{

  map: GoogleMap;
  constructor(private platform: Platform, private geolocation: Geolocation,private api: ApiService,) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      this.centerMap();
    });
  }

  centerMap(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.loadMap(resp.coords.latitude,resp.coords.longitude)
     }).catch((error) => {
       console.log('Error: Failed to get location', error);
     });
  }

  updateLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.map.remove();
      this.loadMap(resp.coords.latitude,resp.coords.longitude)
    }).catch((error) => {
      console.log('Error: Failed to get location', error);
    });
  }

  loadMap(lat,long) {
  
    // This code is necessary for browser
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyAuAa0Ckp0xVmn-dw9upNfdakZ2-bQs0mE',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyAuAa0Ckp0xVmn-dw9upNfdakZ2-bQs0mE'
    });

    let mapOptions: GoogleMapOptions = {
      enableHighAccuracy : true,
      camera: {
         target: {
           lat: lat,
           lng: long
           
         },
         zoom: 18,
         tilt: 30
       }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    let userLocationMarker: Marker = this.map.addMarkerSync({
      title: 'You',
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: lat,
        lng: long
      }
    });
  }

  signOut() {
    this.api.logout();
  }

}
