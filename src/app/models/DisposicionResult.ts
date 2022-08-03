export class DisposicionResult{

    	
    idDisposicion: number;
    idCiudad: number;
    idDivisa: number;
    idLugar: number;
    cancelaciones: string;
    comision: number;
    dentro: number;
    nombre: string;

    constructor() {
         	
    this.idDisposicion=0;
    this.idCiudad=0;
    this.idDivisa=0;
    this.idLugar=0;
    this.cancelaciones=``;
    this.comision=0;
        this.dentro = 0;
        this.nombre = ``;
    
    }
}