import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class CanActivateViaAuthFinanzasGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate() {
        if(!this.authService.isLoggedFinanzas()){
            this.router.navigate(['login']);
            return false;
        }else{
            return true;
        }
    }
}