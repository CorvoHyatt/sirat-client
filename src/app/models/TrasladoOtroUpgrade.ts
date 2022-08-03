export class TrasladoOtroUpgrade{
    
    idTrasladoOtroUpgrade: number;
    idCotizacion: number;
    idTrasladoOtro: number;
    idVehiculo: number;
    tarifa: number;
    idDivisa: number;
    diferencia: number;
    fecha: string;
    versionCotizacion: number;
    
    constructor() {
        this.idTrasladoOtroUpgrade = 0;
        this.idCotizacion = 0;
        this.idTrasladoOtro = 0;
        this.idVehiculo = 0;
        this.tarifa = 0;
        this.idDivisa = 1;
        this.diferencia = 0;
        this.fecha = "";
        this.versionCotizacion = 1;
    }
}