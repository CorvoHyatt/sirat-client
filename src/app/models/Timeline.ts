export class Timeline{
    idTimeline: number;
    idCotizacion: number;
    fecha: string;
    notas: string;
    tipo: number;

    constructor() {
        this.idTimeline = 0;
        this.idCotizacion = 0;
        this.fecha = new Date().toISOString();
        this.notas = ``;
        this.tipo = 0;
    }
}