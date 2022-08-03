export class ProductosPreciosTotales {
    idProductoPrecioTotal: number;
    tipoProducto: number;
    idProducto: number;
    idCotizacion: number;
    precioPorPersona: number;
    total: number;
   
    constructor() {
        this.idProductoPrecioTotal = 0;
        this.tipoProducto = 0;
        this.idCotizacion = 0;
        this.idProducto = 0;
        this.precioPorPersona = 0;
        this.total = 0;
    }
}