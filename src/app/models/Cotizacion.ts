import { DatePipe } from '@angular/common';
var datePipe = new DatePipe('en-US');


export class Cotizacion {


  
  idCotizacion: number;
  idUsuario: number;
  ref: string;
  tipoCotiz: number;
  idAgente: number;
  viajeroNombre: string;
  viajeroApellido: string;
  viajeroTel: string;
  titulo: string;
  fechaInicio: string;
  fechaFinal: string;
  noches: number;
  precioTotal: number;
  precioPersona: number;
  numM: number;
  num18: number;
  num12: number;
  tipo: number;
  divisa: number;
  estado: number;
  version: number;
  notas = ``;
  comisionAgente: number;

  constructor(
  ) {
    
    this.idCotizacion = 0;
    this.idUsuario = 0;
    this.ref = ``;
    this.tipoCotiz = 0;
    this.idAgente = 0;
    this.viajeroNombre = ``;
    this.viajeroApellido = ``;
    this.viajeroTel = ``;
    this.titulo = ``;
    this.fechaInicio = datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.fechaFinal = datePipe.transform(new Date(new Date().setDate(new Date().getDate() + 1)),"yyyy-MM-dd" ); 
    this.noches = 0;
    this.precioTotal = 0;
    this.precioPersona = 0;
    this.numM = 0;
    this.num18 = 0;
    this.num12 = 0;
    this.tipo = 0;
    this.divisa = 1;
    this.estado = 0;
    this.version = 0;
    this.notas = ``;
    this.comisionAgente = 2;
  }
}
