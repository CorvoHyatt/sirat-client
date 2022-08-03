export class HotelUpgrade {
    idHotelAdquiridoUM: number;
    idCotizacion: number;
    idHotelAdquirido: number;
    nombre: string;
    categoria: string;
    direccion: string;
    telefono: string;
    noPersonas: number;
    estrellas: number;
    comisionAgente: number;
    tarifa: number;
    diferencia: number;
    fecha: any;
    hotel1: number;
    hotel2: number;
    versionCotizacion: number;

    constructor() {
        this.idHotelAdquiridoUM = 0;
        this.idCotizacion = 0;
        this.idHotelAdquirido = 0;
        this.nombre = '';
        this.categoria = '';
        this.direccion = '';
        this.telefono = '';
        this.noPersonas = 0;
        this.estrellas = 0;
        this.comisionAgente = 0;
        this.tarifa = 0;
        this.diferencia = 0;
        this.fecha = '';
        this.hotel1 = 0;
        this.hotel2 = 0;
        this.versionCotizacion = 1;
    }
}