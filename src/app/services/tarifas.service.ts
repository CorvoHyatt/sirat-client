import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarifasService {

    private restarTarifaHNeta$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private restarTarifaSNeta$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private restarTarifaHComision$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private restarTarifaSComision$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private tarifaHNeta$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private tarifaSNeta$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private tarifaHComision$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private tarifaSComision$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private cotizacion$: BehaviorSubject<any> = new BehaviorSubject<any>({});
    private diferenciaTarifa$: BehaviorSubject<any> = new BehaviorSubject<any>({});

    constructor() { }

    getTarifa(type: string): Observable<any> {
        var tarifa: any;
        switch(type){
        case 'tarifaHNeta':
            tarifa = this.tarifaHNeta$.asObservable();
            break;
        case 'tarifaSNeta':
            tarifa = this.tarifaSNeta$.asObservable();
            break;
        case 'tarifaHComision':
            tarifa = this.tarifaHComision$.asObservable();
            break;
        case 'tarifaSComision':
            tarifa = this.tarifaSComision$.asObservable();
            break;
        case 'restarTarifaHNeta':
            tarifa = this.restarTarifaHNeta$.asObservable();
            break;
        case 'restarTarifaSNeta':
            tarifa = this.restarTarifaSNeta$.asObservable();
            break;
        case 'restarTarifaHComision':
            tarifa = this.restarTarifaHComision$.asObservable();
            break;
        case 'restarTarifaSComision':
            tarifa = this.restarTarifaSComision$.asObservable();
            break;
        case 'cotizacion':
            tarifa = this.cotizacion$.asObservable();
            break;
        case 'diferenciaTarifa':
            tarifa = this.diferenciaTarifa$.asObservable();
            break;
        }
        return tarifa;
    }

    setTarifa(value: any, type: string): void {
        switch(type){
        case 'tarifaHNeta':
            this.tarifaHNeta$.next(value);
            break;
        case 'tarifaSNeta':
            this.tarifaSNeta$.next(value);
            break;
        case 'tarifaHComision':
            this.tarifaHComision$.next(value);
            break;
        case 'tarifaSComision':
            this.tarifaSComision$.next(value);
            break;
        case 'restarTarifaHNeta':
            this.restarTarifaHNeta$.next(value);
            break;
        case 'restarTarifaSNeta':
            this.restarTarifaSNeta$.next(value);
            break;
        case 'restarTarifaHComision':
            this.restarTarifaHComision$.next(value);
            break;
        case 'restarTarifaSComision':
            this.restarTarifaSComision$.next(value);
            break;
        case 'cotizacion':
            this.cotizacion$.next(value);
            break;
        case 'diferenciaTarifa':
            this.diferenciaTarifa$.next(value);
            break;
        }
    }
}
