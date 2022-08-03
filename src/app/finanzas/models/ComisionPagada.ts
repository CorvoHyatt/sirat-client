export class ComisionPagada{
    idComision: number;
    idCotizacion: number;
    idDivisaBase: number;
    refComision: string;
    fecha: string;
    verificada: number;
    facturaE: number;
    cantidadDivisa: number;
    cantidadMXN: number;
    banco: string;
    notas: string;
    constructor() {
        this.idComision = 0;
        this.idCotizacion = 0;
        this.idDivisaBase = 1;
        this.refComision = ``;
        this.fecha = ``;
        this.verificada = 0;
        this.facturaE = 0;
        this.cantidadDivisa = 0;
        this.cantidadMXN = 0;
        this.banco = ``;
        this.notas = ``;
    }
}