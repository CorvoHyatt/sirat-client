import { formatDate } from "@angular/common";

export class DisposicionAdquirida {
  idDisposicionAdquirida: number;
  idDisposicion: number;
  idDisposicionCosto: number;
  pasajeros: number;
  equipaje: number;
  fecha: string;
  hora: string;
  descripcion: string;
  notas: string;
  pisckUp: string;
  horasExtras: number;
  tarifa: number;
  comision: number;
  comisionAgente: number;
  opcional: number;

  constructor() {
    let fechaI = localStorage.getItem('fechaInicio');
    let minDate: any = new Date(fechaI += 'T00:00:00');
    this.idDisposicionAdquirida = 0;
    this.idDisposicion = 0;
    this.idDisposicionCosto = 0;
    this.pasajeros = 0;
    this.equipaje = 0;
    this.fecha = formatDate(minDate, "yyyy-MM-dd", "en");
    this.hora = `12:00`;
    this.pisckUp = ``;
    this.horasExtras = 0;
    this.descripcion = `-Su chofer lo verá a su llegada con un letrero a su nombre para trasladarlo a su hotel -`;
    this.notas = ``;
    this.tarifa = 0;
    this.comision = 0;
    this.comisionAgente = 0;
    this.opcional = 0;
  }
}
