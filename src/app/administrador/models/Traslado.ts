export class Traslado {
    idTraslado: number;
    idPais: number;
    idCiudad: number;
    pickUp: string;
    DropOff: string;
    moneda: string;
    porHorario: string;
    porFecha: string;
    comision: number;
    condicionesCencelacion: string;
    operador: string;
    constructor() {
        this.idTraslado = 0;
        this.idPais = 0;
        this.idCiudad = 0;
        this.pickUp = ``;
        this.DropOff = ``;
        this.moneda = ``;
        this.porHorario = ``;
        this.porFecha = ``;
        this.comision = 0;
        this.condicionesCencelacion = ``;
        this.operador = ``;
    }

}