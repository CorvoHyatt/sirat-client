
export class TrenUpgrade {
    IdTrenUpgrade: number;
    idCotizacion: number;
    idTren: number;
    clase: string;
    diferencia: number;
    fecha: any;
    versionCotizacion: number;

    constructor() {
        this.IdTrenUpgrade = 0;
        this.idCotizacion= 0;
        this.idTren= 0;
        this.clase= '';
        this.diferencia= 0;
        this.fecha = '';
        this.versionCotizacion = 1;
    }
}