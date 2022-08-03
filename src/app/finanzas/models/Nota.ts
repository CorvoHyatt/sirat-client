export class Nota{
    idNota: number;
    idCotizacion: number;
    idUsuario: number;
    nota: string;
    asunto: string;
    prioridad: number;
    caducidad: number;
    constructor() {
        this.idNota = 0;
        this.idCotizacion = 0;
        this.idUsuario = 0;
        this.nota = ``;
        this.asunto = ``;
        this.prioridad = 1;
        this.caducidad = 1;
    }
}