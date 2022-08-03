export class ProductoOpcionAdquiridaUpgrade{

    idProductoOpcionAdquiridaUpgrade: number;
    idCotizacion: number;
    idProductoAdquirido: number;
    idProductoOpcion: number;
    diferencia: number;
    fecha: string;
    versionCotizacion : number;

    constructor() {
        this.idProductoOpcionAdquiridaUpgrade = 0;
        this.idCotizacion = 0;
        this.idProductoAdquirido = 0;
        this.idProductoOpcion = 0;
        this.diferencia = 0;
        this.fecha = "";
        this.versionCotizacion = 1;
    }
}