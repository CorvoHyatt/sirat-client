export class Traslado {
    idTraslado: number;
    idCiudad: number;
    idDesde: number;
    idHacia: number;
    otraCiudad: number;
    cancelaciones: string;
    muelle: number;
    comision: number;
    estatus: number;
    desdeOriginal: string;
    haciaOriginal: string;
   
    constructor() {
        this.idTraslado = 0;
        this.idCiudad = 0;
        this.idDesde = 0;
        this.idHacia = 0;
        this.otraCiudad = 0;
        this.cancelaciones = "";
        this.muelle=0;
        this.comision = 0;
        this.estatus = 0;
        this.desdeOriginal = "";
        this.haciaOriginal = "";
    }

}