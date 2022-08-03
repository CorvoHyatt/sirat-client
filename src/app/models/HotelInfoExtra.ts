export class HotelInfoExtra{

    idHotelesAdquiridosInfo: number;
    idHotelAdquirido: number;
    idCotizacion: number;
    idCiudad: number;
    checkIn: string;
    checkOut: string;
    numeroHabitacion: string;
    completado: number;
    fechaEnvio: string;
    estado: number; 
    nombreFactura: string;
    urgente : boolean;
    constructor() {
        this.idHotelesAdquiridosInfo = 0;
        this.idHotelAdquirido= 0;
        this.idCotizacion= 0;
        this.idCiudad= 0;
        this.checkIn= "";
        this.checkOut= "";
        this.numeroHabitacion= "";
        this.completado= 0;
        this.fechaEnvio= "";
        this.estado= 0;        
        this.nombreFactura="";
        this.urgente=false;

    } 
}