export class DisposicionInfoExtra{

    idDispAdqInfo: number;
    idDisposicionAdquirida: number;
    idCotizacion: number;
    idCiudad: number;
    pickUp: string;
    dropOff: string;
    hora: string;
    fecha: string;
    completado: number;
    fechaEnvio: string;
    estado: number;

    constructor() {
        this.idDispAdqInfo = 0;
        this.idDisposicionAdquirida = 0;
        this.idCotizacion = 0;
        this.idCiudad = 0;
        this.pickUp = "";
        this.dropOff = "";
        this.hora = "";
        this.fecha = "";
        this.completado = 0;
        this.fechaEnvio = "";
        this.estado = 0;
    }




}