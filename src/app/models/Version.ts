export class Version {
  idActividad: number;
  tipo: number;
  idCotizacion: number;
  versionCotizacion: number;
  accion: number;
  idUsuario: number;
  notas: string;

  constructor() {
    this.idActividad = 0;
    this.tipo = 0;
    this.idCotizacion = 0;
    this.versionCotizacion = 0;
    this.accion = 0;
    this.idUsuario = 0;
    this.notas = ` `;
  }
}
