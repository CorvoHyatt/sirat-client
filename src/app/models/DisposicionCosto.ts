export class DisposicionCosto {
  idDisposicionCosto: number;
  idDisposicion: number;
  idVehiculo: number;
  horasMinimo: number;
  costo: number;
  horaExtra: number;

  constructor() {
    this.idDisposicionCosto = 0;
    this.idDisposicion = 0;
    this.idVehiculo = 0;
    this.horasMinimo = 0;
    this.costo = 0;
    this.horaExtra = 0;
  }
}
