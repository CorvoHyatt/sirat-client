export class ProductoTransporte {
  idProductoTransporte: number;
  idProducto: number;
  idVehiculo: number;
  tarifa: number;
  noPersonas: number;
  horasExtras: number;

  constructor() {
    this.idProductoTransporte = 0;
    this.idProducto = 0;
    this.idVehiculo = 0;
    this.tarifa = 0;
    this.noPersonas = 0;
    this.horasExtras = 0;
  }
}
