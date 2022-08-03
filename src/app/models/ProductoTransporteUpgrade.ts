export class ProductoTransporteUpgrade{
    idProductoTransporteUpgrade: number;
    idCotizacion: number;
    idProductoAdquirido: number;
    idVehiculo: number;
    diferencia: number;
    fecha: string;
    versionCotizacion : number;

    constructor() {
        this.idProductoTransporteUpgrade = 0;
        this.idCotizacion = 0;
        this.idProductoAdquirido = 0;
        this.idVehiculo = 0;
        this.diferencia = 0;
        this.fecha = "";
        this.versionCotizacion = 1;
    }
}