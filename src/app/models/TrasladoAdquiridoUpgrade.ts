export class TrasladoAdquiridoUpgrade {

    IdTrasladoAdquiridoUpgrade: number;
    idCotizacion: number;
    idTrasladoAdquirido: number;
    idVehiculo: number;
    diferencia: number;
    fecha: string;
    versionCotizacion: number;
    constructor() {
        this.IdTrasladoAdquiridoUpgrade = 0;
        this.idCotizacion= 0;
        this.idTrasladoAdquirido= 0;
        this.idVehiculo= 0;
        this.diferencia= 0;
        this.fecha = "";
        this.versionCotizacion = 1;
    }
}