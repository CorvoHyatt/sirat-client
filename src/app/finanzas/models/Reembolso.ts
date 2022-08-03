export class Reembolso{
    idReembolso: number;
    idCotizacion: number;
    refReembolso: string;
    fecha: string;
    reembolsoS: string;
    cantidadNeta: number;
    cantidadDivisa: number;
    cantidadMXN: number;
    cantidadCotizada: number;
    cuentaEmisora: string;
    cuentaReceptora: string;
    facturaE: number;
    concepto: string;
    com5R: number;
    comAR: number;
    porcentaje: number;
    eliminado: number;
    reembolsoFinal: number;
    constructor() {
        this.idReembolso = 0;
        this.idCotizacion = 0;
        this.refReembolso = ``;
        this.fecha = ``;
        this.reembolsoS = ``;
        this.cantidadNeta = 0;
        this.cantidadDivisa = 0;
        this.cantidadMXN = 0;
        this.cantidadCotizada = 0;
        this.cuentaEmisora = ``;
        this.cuentaReceptora = ``;
        this.facturaE = 0;
        this.concepto = ``;
        this.com5R = 0;
        this.comAR = 0;
        this.porcentaje = 0;
        this.eliminado = 0;
        this.reembolsoFinal = 0;
    }
}