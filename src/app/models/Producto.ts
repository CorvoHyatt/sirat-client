export class Producto {
  idProducto: number;
  idCiudad: number;
  titulo: string;
  resumen: string;
  descripcion: string;
  categoria: number;
  duracion: number;
  minimunViajeros: number;
  maximunViajeros: number;
  estatus: number;


  constructor() {
    this.idProducto = 0;
    this.idCiudad = 0;
    this.titulo = ``;
    this.resumen = ``;
    this.descripcion = ``;
    this.categoria = 0;
    this.duracion = 0;
    this.minimunViajeros = 0;
    this.maximunViajeros = 0;
    this.estatus = 0;
  }
}
