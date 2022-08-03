
export class VistaOrden {
    idCotizacion: number;
    nombreCliente: string;
    apellidoCliente: string;
    agencia: string;
    fecha : string;
    agente : string;
    mapProductos : any;
    divisa: number;
    idAgencia: number;

    correoAgente: string;
    notas: string;
    otrosCorreos: string;
    version: number;
    pdf: any;



    constructor() 
    {
        this.idCotizacion=0;
        this.nombreCliente = "";
        this.apellidoCliente= "";
        this.agencia = "";
        this.fecha = "";
        this.agente = "";
        this.correoAgente="";
        this.notas="";   
        this.otrosCorreos="";
        this.version=0;
        this.pdf=null;        

    }

}