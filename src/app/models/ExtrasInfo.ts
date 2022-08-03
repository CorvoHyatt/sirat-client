export class ExtrasInfo{


    idExtrasInfo: number;
    idExtra: number;
    idCotizacion: number;
    idCiudad: number;
    completado: number;
    estado: number;
    fechaEnvio: string;
    extras: string;
    descripcion:string;
    notas: string;
    fecha: string;
    nombreFactura: string;
    urgente : boolean;
    constructor() {
        this.idExtrasInfo = 0;
        this.idExtra = 0;
        this.idCotizacion = 0;
        this.idCiudad = 0;
        this.completado = 0;
        this.estado = 0;
        this.fechaEnvio = "";
        this.extras = "";
        this.notas = "";
        this.fecha = "";
        this.descripcion="";       
        this.nombreFactura="";
        this.urgente=false;
    }


}