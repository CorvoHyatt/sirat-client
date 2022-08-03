import { Component, OnInit } from '@angular/core';
import { HelperAuthService } from './services/helperAuth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [HelperAuthService],
})
export class AdminComponent implements OnInit {
  public isAuth: boolean = false;
  public title: string = 'Panel de administración SIRAT';

  constructor(private _helperAuthService: HelperAuthService){}

  ngOnInit(): void{
    this.getStatusAuth();
  }

  getStatusAuth(){
    this._helperAuthService.getStatusAuth().subscribe(
      auth => {
        this.isAuth = auth;
      }
    );
  }

  changeStatusAuth(){
    this._helperAuthService.changeStatusAuth(false);
  }
}
