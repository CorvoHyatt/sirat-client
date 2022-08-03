import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendDataToEditService {

  private trasladoOtro$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private traslado$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private disposicion$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private tourPie$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private tourTransporte$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private tourGrupo$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private actividad$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private hotel$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private vuelo$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private tren$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private extra$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private rentaVehiculo$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private cotizacion$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private product$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor() { }

  getProduct(type: string): Observable<any> {
    var product: any;
    switch(type){
      case 'traslado':
        product = this.traslado$.asObservable();
        break;
      case 'trasladoOtro':
        product = this.trasladoOtro$.asObservable();
        break;
      case 'disposicion':
        product = this.disposicion$.asObservable();
        break;
      case 'tourPie':
        product = this.tourPie$.asObservable();
        break;
      case 'tourTransporte':
        product = this.tourTransporte$.asObservable();
        break;
      case 'tourGrupo':
        product = this.tourGrupo$.asObservable();
        break;
      case 'actividad':
        product = this.actividad$.asObservable();
        break;
      case 'hotel':
        product = this.hotel$.asObservable();
        break;
      case 'vuelo':
        product = this.vuelo$.asObservable();
        break;
      case 'tren':
        product = this.tren$.asObservable();
        break;
      case 'extra':
        product = this.extra$.asObservable();
        break;
      case 'rentaVehiculo':
        product = this.rentaVehiculo$.asObservable();
        break;
      case 'cotizacion':
        product = this.cotizacion$.asObservable();
        break;
    }
    return product;
  }

  sendProductToEdit(value: any, type: string): void {
    switch(type){
      case 'traslado':
        this.traslado$.next(value);
        break;
      case 'trasladoOtro':
        this.trasladoOtro$.next(value);
        break;
      case 'disposicion':
        this.disposicion$.next(value);
        break;
      case 'tourPie':
        this.tourPie$.next(value);
        break;
      case 'tourTransporte':
        this.tourTransporte$.next(value);
        break;
      case 'tourGrupo':
        this.tourGrupo$.next(value);
        break;
      case 'actividad':
        this.actividad$.next(value);
        break;
      case 'hotel':
        this.hotel$.next(value);
        break;
      case 'vuelo':
        this.vuelo$.next(value);
        break;
      case 'tren':
        this.tren$.next(value);
        break;
      case 'extra':
        this.extra$.next(value);
        break;
      case 'rentaVehiculo':
        this.rentaVehiculo$.next(value);
        break;
      case 'cotizacion':
        this.cotizacion$.next(value);
        break;
    }
  }

  getProductToUpdate(): Observable<any> {
    return this.product$.asObservable();
  }

  sendProductToUpdate(value: any): void {
    this.product$.next(value);
  }
}
