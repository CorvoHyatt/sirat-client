import { Component, OnInit } from '@angular/core';
import { HelperAuthService } from '../../services/helperAuth.service';
import { NavigationComponent } from '../../../components/navigation/navigation.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [HelperAuthService, NavigationComponent]
})
export class HomeComponent implements OnInit {
  public isAuth: boolean = false;

  constructor(
    private _helperAuthService: HelperAuthService,
    private _navigationComponent: NavigationComponent,
  ) { }

  ngOnInit(): void {
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
    this._helperAuthService.changeStatusAuth(true);
    this._navigationComponent.getStatusAuth();
  }

  

}
