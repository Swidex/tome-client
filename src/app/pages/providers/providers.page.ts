import { Component, OnInit } from '@angular/core';
import { ApiService, Provider, User } from '../../services/api.service';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
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

@Component({
  selector: 'app-providers',
  templateUrl: './providers.page.html',
  styleUrls: ['./providers.page.scss'],
})
export class ProvidersPage implements OnInit {
  
  providers: Provider[] = [];
  providerCredentials = {
    pid: ''
  };
  user: User;

  /*google: GoogleMaps;
  directionsService: any;
  distance:any='';*/
 
  constructor(
    private api: ApiService,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private geolocation: Geolocation
  ) {}
 
  ngOnInit() {
    this.loadProviders();
    //this.findDist(41.5999892,-93.6210513)
  }
 
  async pair() {
    const loading = await this.loadingController.create({
      spinner: "crescent",
      translucent: true,
      duration: 5000,
      cssClass: 'loading',
    });
    loading.present();

    this.api.joinProvider(this.providerCredentials).pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(res => {
      this.loadProviders();
    }, async err => {
      const alert = await this.alertCtrl.create({
        header: 'Pairing failed',
        message: err.error['msg'],
        buttons: ['OK']
      });
      await alert.present();
    });
  }

  async loadProviders(event?) {
    const loading = await this.loadingController.create({
      spinner: "crescent",
      translucent: true,
      duration: 5000,
      cssClass: 'loading',
    });
    loading.present();

    this.api.getUserData().subscribe(res => {
      this.api.getProvider(res.pid).pipe(
        tap(data => {
          this.providers = data;
        }),
        finalize(() => {
          loading.dismiss();
          if (event) {
            event.target.complete();
          }
        })
      ).subscribe();
    });
  }

  /*findDist(targetLat,targetLng) {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.getDirections(resp.coords.latitude,resp.coords.longitude,targetLat,targetLng)
    }).catch((error) => {
      console.log('Error: Failed to get location', error);
    });
  }

  getDirections(userLat,userLng,targetLat,targetLng){
    let userPos = { lat:userLat, lng:userLng};
    let targetPos = { lat:targetLat, lng:targetLng};
    this.directionsService.pipe({
      origin : userPos,
      destination : targetPos,
    }, (response) => {
        for (var i = 0; i < response.routes.length; i++) {
          let x = i+1;
          this.distance += x +') '+ response.routes[i].legs[0].distance.text +', ' ;
          console.log('distance',this.distance);
        }
        console.log('response:-',response);
    });
  }*/

  signOut() {
    this.api.logout();
  }

}
