export class PagoParcial{
    idProductoCosto: number;
    pagoParcial: number;
    tarjeta:string;
    nota: string;
    fecha: string;
    idDivisa:number;
    terminado:boolean;
    proximoPago:string;
    constructor() 
    {
        let hoy = new Date();
        this.idProductoCosto = 0;
        this.nota = '';
        this.proximoPago = hoy.getFullYear() + '-' + ((hoy.getMonth() + 1) < 10 ? '0' + (hoy.getMonth() + 1) : '' + (hoy.getMonth() + 1)) + '-' + (hoy.getDate() < 10 ? '0' + hoy.getDate() : '' + hoy.getDate());
        this.terminado=false;
        this.idDivisa=96;
        this.tarjeta="";
    }
}