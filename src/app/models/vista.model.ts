
export class Vista {
    idCotizacion: number;
    version: number;
    nombreCliente: string;
    apellidoCliente: string;
    titulo: string;
    agencia: string;
    fecha : string;
    agente : string;
    periodo : string;
    noches: string;
    evento: string;
    mapProductos : any;
    mapProductosExtras : any;
    mapHotelesActualizacion:any;
    mapHotelesManualesActualizacion:any;
    lista_destinos : any;
    imagenPrincipalAuxiliar : number;
    imagenPrincipalSeleccionada : any;
    imagenEventoAuxiliar : number;
    imagenEventoSeleccionada : any;
    imagenDaybydayAuxiliar : number;
    imagenFinAuxiliar : number;
    imagenDaybydaySeleccionada : any;
    imagenFinSeleccionada : any;
    imagenItinerarioFinalAuxiliar : number;
    imagenItinerarioFinalSeleccionada :  number;
    precioHoteles: number;
    precioOtros: number;
    divisa: number;
    idAgencia: number;

    correoAgente: string;
    otrosCorreos: string;
    notas: string;
    pdf: any;

    listaImagenesCiudadesPortada : any;
    listaImagenesCiudadesEvento : any;
    listaImagenesCiudadesDaybyday : any;


    constructor() 
    {
        this.idCotizacion=0;
        this.version=0;
        this.titulo = "";
        this.nombreCliente = "";
        this.apellidoCliente= "";
        this.agencia = "";
        this.fecha = "";
        this.agente = "";
        this.periodo = "";
        this.noches = "";
        this.evento = "";
        this.lista_destinos="";                   
        this.imagenPrincipalAuxiliar=0;
        this.imagenEventoAuxiliar=0;
        this.imagenDaybydayAuxiliar=0;
        this.imagenFinAuxiliar=0;        
        this.imagenFinSeleccionada=0;
        this.imagenItinerarioFinalAuxiliar=0;
        this.imagenItinerarioFinalSeleccionada=0;
        this.precioHoteles=0;
        this.precioOtros=0;
        this.divisa=1;
        this.listaImagenesCiudadesPortada=[];
        this.listaImagenesCiudadesEvento=[];    
        this.listaImagenesCiudadesDaybyday=[];    

        this.correoAgente="";
        this.otrosCorreos="";
        this.notas="";        
        this.pdf=null;        
        
        this.imagenPrincipalSeleccionada=undefined;
        this.imagenEventoSeleccionada=undefined;
        this.imagenDaybydaySeleccionada=undefined;
        this.imagenFinSeleccionada=undefined;

    }

}