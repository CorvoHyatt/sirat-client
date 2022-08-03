import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class CanActivateViaAuthAdminGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate() {
        if(!this.authService.isLoggedAdmin()){
            this.router.navigate(['login']);
            return false;
        }else{
            return true;
        }
    }
}