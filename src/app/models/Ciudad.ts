export class Ciudad{
    idCiudad: number;
    idPais: number;
    nombre: string;
    presentacion: string;
    latitud: number;
    longitud: number;
    img: string;
    prioridad: number;

    constructor() {
        this.idCiudad=0;
        this.idPais=0;
        this.nombre=``;
        this.presentacion=``;
        this.latitud=0;
        this.longitud=0;
        this.img=``;
        this.prioridad=0;
    
    }
}