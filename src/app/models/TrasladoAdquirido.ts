import {formatDate} from '@angular/common';

export class TrasladoAdquirido {
  idTrasladoAdquirido: number;
  idTraslado: number;
  idTrasladoCosto: number;
  pasajeros: number;
  equipaje: number;
  fecha: string;
  hora: string;
  descripcion: string;
  notas: string;
  tarifa: number;
  comision: number ;
  comisionAgente: number;
  opcional: number;

  constructor() {
    let fechaI = localStorage.getItem('fechaInicio');
    let minDate: any = new Date(fechaI += 'T00:00:00');
    this.idTrasladoAdquirido = 0;
    this.idTraslado = 0;
    this.idTrasladoCosto = 0;
    this.pasajeros = 1;
    this.equipaje = 0;
    this.fecha = formatDate(minDate, 'yyyy-MM-dd', 'en');
    this.hora = `12:00`;
    this.descripcion = ``;
    this.notas = ``;
    this.tarifa = 0;
    this.comision =0 ;
    this.comisionAgente = 0;
    this.opcional = 0;
  } 
}
