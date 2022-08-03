export class RentaVehiculoInfo{

    idRentaVehiculoInfo: number;
    idRentaVehiculo: number;
    idCotizacion: number;
    idCiudad: number;
    fechaPickUp: string;
    fechaDropOff: string;
    horaPickUp: string;
    horaDropOff: string;
    fechaEnvio: string;
    completado: number;
    estado: number;
    link: string;
    arrendadora: string;

    constructor() {
        this.idRentaVehiculoInfo = 0;
        this.idRentaVehiculo = 0;
        this.idCotizacion = 0;
        this.idCiudad = 0;
        this.fechaPickUp = "";
        this.fechaDropOff = "";
        this.horaPickUp = "";
        this.horaDropOff = "";
        this.fechaEnvio = "";
        this.completado = 0;
        this.estado = 0;
        this.link = "";
        this.arrendadora = "";
    }
}