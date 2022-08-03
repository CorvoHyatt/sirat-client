import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TarifasService } from 'src/app/services/tarifas.service';

@Component({
  selector: 'app-tarifas',
  templateUrl: './tarifas.component.html',
  styleUrls: ['./tarifas.component.css']
})
export class TarifasComponent implements OnInit, OnDestroy {

  public suscripciones: Subscription[] = [];
  public cotizacion: any = {};
  public tarifaSNeta: number = 0;
  public tarifaHNeta: number = 0;
  public tarifaSComision: number = 0;
  public tarifaHComision: number = 0;
  public diferenciaTarifa: number = 0;
  public mostrarPrecio: boolean = false;

  constructor(private tarifasService: TarifasService, private router: Router) { }

  ngOnInit(): void {
    this.getCotizacion();
    this.getTarifaHNeta();
    this.getTarifaSNeta();
    this.getTarifaHComision();
    this.getTarifaSComision();
    this.restarTarifaHNeta();
    this.restarTarifaSNeta();
    this.restarTarifaHComision();
    this.restarTarifaSComision();
    this.getDiferenciaTarifa();
    this.actualRoute();
  }

  actualRoute(){
    let route = this.router.url.split('/');
    if(route && route[2] === 'completarCotizacion'){
      this.mostrarPrecio = true;
    }else{
      this.mostrarPrecio = false;
    }
  }

  ngOnDestroy(): void {
    this.diferenciaTarifa = 0;
    this.suscripciones.forEach(s => s.unsubscribe());
  }

  getCotizacion(){
    let s = this.tarifasService.getTarifa('cotizacion').subscribe(cotizacion => this.cotizacion = cotizacion);
    this.suscripciones.push(s);
  }

  getTarifaHNeta(){
    let s = this.tarifasService.getTarifa('tarifaHNeta').subscribe(tarifaHNeta => this.tarifaHNeta = tarifaHNeta);
    this.suscripciones.push(s);
  }

  getTarifaSNeta(){
    let s = this.tarifasService.getTarifa('tarifaSNeta').subscribe(tarifaSNeta => this.tarifaSNeta = tarifaSNeta);
    this.suscripciones.push(s);
  }

  getTarifaHComision(){
    let s = this.tarifasService.getTarifa('tarifaHComision').subscribe(tarifaHComision => this.tarifaHComision = tarifaHComision);
    this.suscripciones.push(s);
  }

  getTarifaSComision(){
    let s = this.tarifasService.getTarifa('tarifaSComision').subscribe(tarifaSComision => this.tarifaSComision = tarifaSComision);
    this.suscripciones.push(s);
  }

  restarTarifaHNeta(){
    let s = this.tarifasService.getTarifa('restarTarifaHNeta').subscribe(restarTarifaHNeta => this.tarifaHNeta -= restarTarifaHNeta);
    this.suscripciones.push(s);
  }

  restarTarifaSNeta(){
    let s = this.tarifasService.getTarifa('restarTarifaSNeta').subscribe(restarTarifaSNeta => this.tarifaSNeta -= restarTarifaSNeta);
    this.suscripciones.push(s);
  }

  restarTarifaHComision(){
    let s = this.tarifasService.getTarifa('restarTarifaHComision').subscribe(restarTarifaHComision => this.tarifaHComision -= restarTarifaHComision);
    this.suscripciones.push(s);
  }

  restarTarifaSComision(){
    let s = this.tarifasService.getTarifa('restarTarifaSComision').subscribe(restarTarifaSComision => this.tarifaSComision -= restarTarifaSComision);
    this.suscripciones.push(s);
  }

  getDiferenciaTarifa(){
    let s = this.tarifasService.getTarifa('diferenciaTarifa').subscribe(diferenica => this.diferenciaTarifa = diferenica);
    this.suscripciones.push(s);
  }

}
