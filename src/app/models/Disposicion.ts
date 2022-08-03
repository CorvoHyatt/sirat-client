export class Disposicion{

    	
    idDisposicion: number;
    idCiudad: number;
    idDivisa: number;
    idLugar: number;
    cancelaciones: string;
    comision: number;
    dentro: boolean;
    estatus: number;

    constructor() {
         	
    this.idDisposicion=0;
    this.idCiudad=0;
    this.idDivisa=0;
    this.idLugar=0;
    this.cancelaciones=``;
    this.comision=0;
        this.dentro = true;
        this.estatus = 0;
    
    }
}