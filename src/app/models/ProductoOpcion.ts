export class ProductoOpcion{

    idProductoOpcion: number;
    idProducto: number;
    nombre: string;
    tarifaAdulto: number;
    tarifaMenor: number;
    minimoMenor: number;
    maximoMenor: number;
    horasExtras: number;
    horaExtraChofer: number;
    total: number;

    constructor() {
        this.idProductoOpcion=0;
        this.idProducto=0;
        this.nombre=``;
        this.tarifaAdulto=0;
        this.tarifaMenor=0;
        this.minimoMenor=0;
        this.maximoMenor=0;
        this.horasExtras = 0;
        this.horaExtraChofer = 0;
        this.total=0;
    }
}