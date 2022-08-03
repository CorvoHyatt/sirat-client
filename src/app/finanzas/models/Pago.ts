export class Pago{
    idPago: number;
    idCotizacion: number;
    idDivisaBase: number;
    refPago: string;
    fecha: string;
    pagoVerificado: number;
    facturaE: number;
    cantidadMXN: number;
    cantidadDivisa: number;
    cantidadNeta: number;
    formaPago: string;
    tasa: number;
    cuenta: string;
    notas: string;
    pagoExtra: boolean;
    constructor() {
        this.idPago = 0;
        this.idCotizacion = 0;
        this.idDivisaBase = 1;
        this.refPago = ``;
        this.fecha = ``;
        this.pagoVerificado = 0;
        this.facturaE = 0;
        this.cantidadMXN = 0;
        this.cantidadDivisa = 0;
        this.cantidadNeta = 0;
        this.formaPago = 'VISA'
        this.tasa = 3.2;
        this.cuenta = ``;
        this.notas = ``;
        this.pagoExtra = false;
    }
}