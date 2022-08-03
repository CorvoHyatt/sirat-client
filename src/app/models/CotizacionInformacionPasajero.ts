export class CotizacionInformacionPasajero {
    idCotizacionInformacionPasajero: number;
    idCotizacion: number;
    nombre: string;
    apellidos: string;
    edad: number;
    pasaporte: string;
    principal: number;
    constructor() {
        this.idCotizacionInformacionPasajero = 0;
        this.idCotizacion = 0;
        this.nombre = ``;
        this.apellidos = "";
        this.edad = 0;
        this.pasaporte = ``;
        this.principal = 0;
        }
}