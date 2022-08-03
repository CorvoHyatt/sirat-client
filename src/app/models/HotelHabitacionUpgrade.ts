export class HotelHabitacionUpgrade {
    idHotelAdquiridoUpgrade: number;
    idHabitacion: number;
    idCotizacion: number;
    idHotelAdquirido: number;
    tarifa: number;
    diferencia: number;
    tipoHabitacion: string;
    tipoCategoria: string;
    tipoCama: string;
    fecha: any;
    hotel1: number;
    hotel2: number;
    versionCotizacion: number;

    constructor() {
        this.idHotelAdquiridoUpgrade = 0;
        this.idHabitacion = 0;
        this.idCotizacion = 0;
        this.idHotelAdquirido = 0;
        this.tarifa = 0;
        this.diferencia = 0;
        this.tipoHabitacion = '';
        this.tipoCategoria = '';
        this.tipoCama = '';
        this.fecha = '';
        this.hotel1 = 0;
        this.hotel2 = 0;
        this.versionCotizacion = 1;
    }
}