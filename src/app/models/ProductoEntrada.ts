export class ProductoEntrada{

    idProductoEntrada: number;
    idProducto: number;
    nombre: string;
    minimoMenor: number;
    maximoMenor: number;
    tarifaMenor: number;
    tarifaAdulto: number;

    constructor() {
        this.idProductoEntrada=0;
        this.idProducto=0;
        this.nombre=``;
        this.minimoMenor=0;
        this.maximoMenor=0;
        this.tarifaMenor=0;
        this.tarifaAdulto=0;
    }

}