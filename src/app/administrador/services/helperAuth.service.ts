import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class HelperAuthService {

  private auth: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {}

  public getStatusAuth(): Observable<boolean> {
    return this.auth.asObservable();
  }

  public changeStatusAuth(value: boolean): void {
    this.auth.next(value);
  }

}