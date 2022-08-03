export class ProductoCosto{

    idProductoCosto: number;
    idProductoAdquirido: number;
    idCotizacion: number;
    tipo: number;
    costoCotizado: number;
    precioComprado: number;
    completado: number;

    constructor() {
        this.idProductoCosto = 0;
        this.idProductoAdquirido= 0;
        this.idCotizacion= 0;
        this.tipo= 0;
        this.costoCotizado= 0;
        this.precioComprado= 0;
        this.completado= 0;
    }
}