export class ProductoInfo {
  idProducto: number;
  frasesGoogle: string;
  puntoEncuentro: string;
  referencia: string;
  puntuacion: number;
  notas: string;
  notasCruceros: string;
  cancelacion: string;
  incluye: string;
  noIncluye: string;
  incluyeCrucero: string;
  noIncluyeCrucero: string;
  muelle: number;
  idDivisa: number;
  audifonos: number;
  tarifaCientifica: number;
  guiaAcademico: number;
  guiaEspecializado: number;
  audioguia: number;
  choferGuia: number;
  choferGuiaMaximun: number;
  horaExtraGuia: number;
  reserva2Meses: boolean;
  link: string;
  com: number;
  superiorGratuidad: number;
  edadMinima: number;
  edadMaxima: number;
  operadorCompra: string;
  freeTour: boolean;
  minimoMenor: number;
  maximoMenor: number;
  tarifaMenor: number;
  ciudad: string;

  constructor() {
    this.idProducto = 0;
    this.frasesGoogle = ``;
    this.puntoEncuentro = ``;
    this.referencia = ``;
    this.puntuacion = 0;
    this.notas = ``;
    this.notasCruceros = ``;
    this.cancelacion = ``;
    this.incluye = ``;
    this.noIncluye = ``;
    this.incluyeCrucero = ``;
    this.noIncluyeCrucero = ``;
    this.muelle = 0;
    this.idDivisa = 0;
    this.audifonos = 0;
    this.tarifaCientifica = 0;
    this.guiaAcademico = 0;
    this.guiaEspecializado = 0;
    this.audioguia = 0;
    this.choferGuia = 0;
    this.choferGuiaMaximun = 0;
    this.horaExtraGuia = 0;
    this.reserva2Meses = false;
    this.link = ``;
    this.com = 0;
    this.superiorGratuidad = 0;
    this.edadMinima = 0;
    this.edadMaxima = 0;
    this.operadorCompra = ``;
    this.freeTour = false;
    this.minimoMenor = 0;
    this.maximoMenor = 0;
    this.tarifaMenor = 0;
    this.ciudad = ``;
  }
}
