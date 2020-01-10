import { Component, OnInit } from '@angular/core';
import { ApiService, Provider } from '../../services/api.service';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.page.html',
  styleUrls: ['./providers.page.scss'],
})
export class ProvidersPage implements OnInit {

  credentials = {
    email: '',
    password: ''
  };
 
  constructor(
    private api: ApiService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}
 
  ngOnInit() { }
 
  async pair() {
    const loading = await this.loadingCtrl.create();
    loading.present();

    this.api.pair(this.credentials).pipe(
      finalize(() => loading.dismiss())
    )
    .subscribe(res => {
        this.router.navigateByUrl('/app');
    }, async err => {
      const alert = await this.alertCtrl.create({
        header: 'Pairing failed',
        message: err.error['msg'],
        buttons: ['OK']
      });
      await alert.present();
    });
  }

  signOut() {
    this.api.logout();
  }

}
