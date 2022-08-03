
export class TrenInfoExtra{
    idTrenInfo: number;
    idTren: number;
    idCotizacion: number;
    fecha: string;
    hora: string;
    completado: number;
    fechaEnvio: string;
    estado: number;
    idOrigen: number;
    idDestino: number;
    conCargo : number;
    titular: string;
    numeroTarjeta: number;
    mm: number;
    yy: number;
    cvv: number;
    nombreFactura: string;
    urgente : boolean;
    constructor() {
        this.idTrenInfo = 0;
        this.idTren= 0;
        this.idCotizacion= 0;
        this.fecha = "";
        this.hora = "";
        this.completado= 0;
        this.fechaEnvio = "";
        this.estado = 0;
        this.idOrigen = 0;
        this.idDestino = 0;
        this.conCargo = 0;
        this.titular = "",
        this.numeroTarjeta = 0;
        this.mm = 0;
        this.yy = 0;
        this.cvv = 0; 
        this.nombreFactura="";
        this.urgente=false;
    }
}
