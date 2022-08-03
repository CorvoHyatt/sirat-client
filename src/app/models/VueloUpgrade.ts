export class VueloUpgrade {
    IdVueloUpgrade: number;
    idCotizacion: number;
    idVuelo: number;
    clase: string;
    diferencia: number;
    fecha: any;
    versionCotizacion: number;

    constructor() {
        this.IdVueloUpgrade = 0;
        this.idCotizacion = 0;
        this.idVuelo = 0;
        this.clase = '';
        this.diferencia = 0;
        this.fecha = ''
        this.versionCotizacion = 1
    }
}