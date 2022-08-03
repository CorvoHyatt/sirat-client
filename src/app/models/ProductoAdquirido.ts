import { formatDate } from "@angular/common";

export class ProductoAdquirido {
  idProductoAdquirido: number;
  idProducto: number;
  fecha: string;
  horario: string;
  horasExtras: number;
  guiaAcademico: boolean;
  notas: string;
  descripcion: string;
  choferGuia: boolean;
  freeTour: boolean;
  guiaEspecializado: boolean;
  audioguia: boolean;
  tarifa: number;
  comision: number;
  comisionAgente: number;
  opcional: number;

  constructor() {
    let fechaI = localStorage.getItem('fechaInicio');
    let minDate: any = new Date(fechaI += 'T00:00:00');
    this.idProductoAdquirido = 0;
    this.idProducto = 0;
    this.fecha = formatDate(minDate, 'yyyy-MM-dd', 'en');
    this.horario = `00:00:00`;
    this.horasExtras = 0;
    this.guiaAcademico = false;
    this.notas = ``;
    this.descripcion = ``;
    this.choferGuia = false;
    this.freeTour = false;
    this.guiaEspecializado = false;
    this.audioguia = false;
    this.tarifa = 0;
    this.comision = 0;
    this.comisionAgente = 0;
    this.opcional = 0;
  }
}
