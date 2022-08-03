export class ProductoInfoExtra{
    idProductosAdquiridosInfo: number;
    idProductoAdquirido: number;
    idCotizacion: number;
    idCiudad: number;
    categoria: number;
    fecha: string;
    hora: string;
    puntoEncuentro: string;
    completado: number;
    fechaEnvio: string;
    estado: number;
    nombreFactura: string;
    urgente : boolean;
    constructor() {
        this.idProductosAdquiridosInfo = 0;
        this.idProductoAdquirido = 0;
        this.idCotizacion = 0;
        this.idCiudad = 0;
        this.categoria = 0;
        this.fecha = "";
        this.hora = "";
        this.puntoEncuentro = "";
        this.completado = 0;
        this.fechaEnvio = "";
        this.estado = 0;
        this.nombreFactura="";
        this.urgente=false;
    }
}