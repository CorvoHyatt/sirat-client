export class HotelHabitacion {
    idHotelHabitacion: number;
    idHotelAdquirido: number;
    tarifa: number;
    cantidadHabitaciones: number;
    noPersonas: number;
    tipoHabitacion: string;
    tipoCategoria: string;
    tipoCama: string;

    constructor() {
        this.idHotelHabitacion = 0;
        this.idHotelAdquirido = 0;
        this.tarifa = 0;
        this.cantidadHabitaciones = 1;
        this.noPersonas = 1;
        this.tipoHabitacion = 'Doble';
        this.tipoCategoria = '';
        this.tipoCama = '';
    }
}