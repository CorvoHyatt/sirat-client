export class DisposicionAdquiridaUpgrade{


    idDisposicionAdquiridoUpgrade: number;
    idCotizacion: number;
    idDisposicionAdquirida: number;
    idVehiculo: number;
    diferencia: number;
    fecha: string;
    versionCotizacion : number;

    constructor() {
        this.idDisposicionAdquiridoUpgrade = 0;
        this.idCotizacion = 0;
        this.idDisposicionAdquirida = 0;
        this.idVehiculo = 0;
        this.diferencia = 0;
        this.fecha = "";
        this.versionCotizacion = 1;
    }
}