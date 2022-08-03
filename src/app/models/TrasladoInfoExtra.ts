
export class TrasladoInfoExtra{
    
    idTrasladoAdquiridoInfo: number;
    idTrasladoAdquirido: number;
    idCotizacion: number;
    idCiudad: number;
    tipoDesde: number;
    tipoHacia: number;
    fechaDesde: string;
    fechaHacia: string;
    vehiculoDesde: number;
    vehiculoHacia: number;
    horarioDesde: string;
    horarioHacia: string;
    nombreDesde: string;
    nombreHacia: string;
    numeroServicioDesde: string;
    numeroServicioHacia: string;
    direccionDesde: string;
    direccionHacia: string;
    completado: number;
    tipo: number;
    estado: number;
    fechaEnvio: string;
    notas: string;
    nombreFactura: string;
    urgente : boolean;

    constructor() {
        this.idTrasladoAdquiridoInfo = 0;
        this.idTrasladoAdquirido = 0;
        this.idCotizacion = 0;
        this.idCiudad = 0;
        this.tipoDesde = 0;
        this.tipoHacia = 0;
        this.fechaDesde = "";
        this.fechaHacia = "";
        this.vehiculoDesde = 0;
        this.vehiculoHacia = 0;
        this.horarioDesde = "";
        this.horarioHacia = "";
        this.nombreDesde = "";
        this.nombreHacia = "";
        this.numeroServicioDesde = "";
        this.numeroServicioHacia = "";
        this.direccionDesde = "";
        this.direccionHacia = "";
        this.tipo = 0;
        this.completado = 0;
        this.estado = 0;
        this.fechaEnvio = "";
        this.notas = "";
        this.nombreFactura="";
        this.urgente=false;
    }
}
