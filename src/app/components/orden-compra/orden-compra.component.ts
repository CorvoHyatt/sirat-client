import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CotizacionesService } from './../../services/cotizaciones.service';
import {VistaOrden} from '../../models/vistaOrden.model'
import {  CanastaService} from './../../services/canasta.service';
import {ProductoResumen} from '../../models/ProductoResumen'
import {  ImagenesService} from './../../services/imagenes.service';
import Swal from "sweetalert2";
import {  EmailsService} from './../../services/emails.service';
import {  DivisasService} from './../../services/divisas.service';

import {  OrdenCompraService} from './../../services/orden-compra.services';

import { Timeline } from "../../..//app/models/Timeline";
declare var $: any;

@Component({
  selector: 'app-orden-compra',
  templateUrl: './orden-compra.component.html',
  styleUrls: ['./orden-compra.component.css','./style_imprimir.css']
})
export class OrdenCompraComponent implements OnInit {
  timeline: Timeline = new Timeline();

  fileToUpload: File = null;
  nombreAsesor : any;
  idCotizacion : any;
  versionCotizacion : any;  
  nuevo:number;
  vista : VistaOrden;
  cotizacion :any;
  fechaInicio : any;
  fechaFin : any;
  noches : any;
  totalPasajeros:any;
  porcentajeDescuento: number;
  hoy: any;
  tipoCambio: number;
  pos :number;
  total:number;
  totalSinDescuento:number;
  mapProductosPorHojaOrden: Map<string,ProductoResumen[]>=new Map<string,ProductoResumen[]>();  
  mapProductosPorHojaOrdenArreglo:any;

  porcentajes =  [
      [100,100,100,100,100,100,100,100, 100,100],
      [ 0,  0,  0,  50,100, 70, 0,  0,  100,100],
      [ 0,  0,  0,  30,100, 40, 0,  0,  100,100]
    ];
  constructor(private route: ActivatedRoute,
    private cotizacionesService: CotizacionesService,  
    private imagenesService:ImagenesService, 
    private divisasService:DivisasService, 
    private ordenCompraService:OrdenCompraService,
    private emailsService: EmailsService,
    
    private canastaService: CanastaService) 
  {
    this.nombreAsesor="";
    this.pos=0;
    this.total=0;
    this.totalSinDescuento=0;
    this.vista= new VistaOrden();

  }
  comision(tipo,categoria)
  {
    if(tipo!=7)
      return this.porcentajes[this.pos][tipo-1];
    return this.porcentajes[this.pos][tipo+categoria-2];
  }
  precioAnticipo(precio,tipo,categoria)
  {
    if(tipo!=7)
      return (precio*this.porcentajes[this.pos][tipo-1])/100;
    return (precio*this.porcentajes[this.pos][tipo+categoria-2])/100;
  }
  calcularPorcentaje()
  {
    let inicioViaje=new Date(this.fechaInicio);
    let today= new Date();
    

    this.hoy = today.getFullYear()+"-"+ (today.getMonth() +1) +"-"+today.getDate()


    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = inicioViaje.getTime() - today.getTime();
    let dias=Number(millisBetween / millisecondsPerDay)
    let days = parseInt(dias+"");
    if(days<30)
      this.pos=0;
    else if(days<90)
      this.pos=1;
    else
      this.pos=2;
  }
  darMes(mes)
  {
    if(mes==1)
      return "ENERO";
    if(mes==2)
      return "FEBRERO";
    if(mes==3)
      return "MARZO";
    if(mes==4)
      return "ABRIL";
    if(mes==5)
      return "MAYO";
    if(mes==6)
      return "JUNIO";
    if(mes==7)
      return "JULIO";
    if(mes==8)
      return "AGOSTO";
    if(mes==9)
      return "SEPTIEMBRE";
    if(mes==10)
      return "OCTUBRE";
      if(mes==11)
      return "NOVIEMBRE";
    if(mes==12)
      return "DICIEMBRE";

  }
  darTipo(tipito,categoria)
  {
    if(tipito==1)
      return "Traslado";
    if(tipito==2)
      return "Disposición";
    if(tipito==3)
      return "Traslado";
    if(tipito==4)
      return "Hospedaje";
    if(tipito==5)
      return "Vuelo";
    if(tipito==6)
      return "Tren";      
    if(tipito==7)
    {
      if(categoria==1)
        return "Tour a pie";
      if(categoria==2)
        return "Tour con transporte: ";
      if(categoria==3)
          return "Tour en grupo";
      if(categoria==4)
        return "Actividad";      
    }
    if(tipito==8)
      return "Extra";      

  }
  darFecha(fechita)
  {
    var cadena = fechita.split("-", 3); 
    return cadena[2]+" "+this.darMes(cadena[1]);

  }
  cambioInvisible(jj,cambiar)
  {
    if(cambiar==1)
      this.vista.mapProductos[jj].hojaNuevaOrden=!this.vista.mapProductos[jj].hojaNuevaOrden;


    this.mapProductosPorHojaOrdenArreglo=[];

    let mapProductos : any;
    let prod= [];

    for(let data of this.vista.mapProductos)
      if(data.hojaNuevaOrden==true)
      {
        this.mapProductosPorHojaOrdenArreglo.push(prod);
        prod= [];
        prod.push(data);
      }
      else
        prod.push(data);

    this.mapProductosPorHojaOrdenArreglo.push(prod);
    console.log(this.mapProductosPorHojaOrdenArreglo);
  }
  getFileBlob(file) 
  {
    var reader = new FileReader();
    return new Promise(function (resolve, reject) {
      reader.onload = (function (thefile) {
        return function (e) {
          resolve(e.target.result);
        };
      })(file);
      reader.readAsDataURL(file);
    });
  }
  enviarCorreo()
  {
    
    var re = /\n/gi;
    var newstr = this.vista.notas.replace(re, "<br>");
    this.vista.notas = newstr;
    let datos = {
      'cotizacion': this.vista.idCotizacion,
      'version': this.vista.version,
      'correo': this.vista.correoAgente,
      'otrosCorreos': this.vista.otrosCorreos,
      'asunto': "Envío de orden de compra para  "+this.vista.nombreCliente+" con número de cotización: "+this.vista.idCotizacion,
      'agente': this.vista.agente,
      'nombreCliente': this.vista.nombreCliente,
      'notas': this.vista.notas,
      'pdf': this.vista.pdf
    };
    this.emailsService.enviarPDFOrdenCompra(datos).subscribe((res: any) => 
    {

      
      Swal.fire({
          position: "center",
          icon: "success",
          title: `Correo enviado correctamente`,
          showConfirmButton: false,
          timer: 1500,
        });
        
        this.cotizacionesService.updateEstadoAEnviado(this.idCotizacion,101).subscribe((res: any) => 
        {
            console.log(res);
            this.timeline = new Timeline();
            this.timeline.idCotizacion = this.cotizacion.idCotizacion;
            this.timeline.notas = 'Envío de correo de la orden de pago';
            this.timeline.tipo = 4;
            this.cotizacionesService.addTimeline(this.timeline).subscribe(res => {});


            this.divisasService.divisaBase_getOne(2).subscribe((resDivisa: any) => 
            {
              this.tipoCambio=resDivisa.valor;
              let datosOrdenPago = 
              {
                'idCotizacion': this.idCotizacion,
                'versioncotizacion': this.versionCotizacion,
                'porcentajePago':(this.total/this.totalSinDescuento)*100,
                'fechaOC':this.hoy,
                'totalOC': this.total,
                'valorTipoCambio':this.tipoCambio,
                'estado':0
              };
              this.ordenCompraService.create(datosOrdenPago).subscribe((resOrden: any
                ) =>
              {
                console.log(resOrden);
              },err => console.error(err));
          
            },err => console.error(err));
        




        },
          err => console.error(err)
        );
        
    },
      err => console.error(err));
  }
  cargandoPDF(files: FileList,tmp: any)
  {
      this.fileToUpload = files.item(0);
      tmp.value='';
      let imgPromise = this.getFileBlob(this.fileToUpload);
      imgPromise.then(blob => {
        
        this.imagenesService.guardarPDFOrdenCompra(this.idCotizacion, blob).subscribe(
          (res: any) => 
          {
            console.log(res);
            Swal.fire({
              position: "center",
              icon: "success",
              title: `Archivo subido exitosamente`,
              showConfirmButton: false,
              timer: 1500,
            });
          }, 
          err => console.error(err));
  
      })
  }
  cambioNotas(opcion)
  {
    this.vista.notas=opcion;
  }
  cambioOtrosCorreos(opcion)
  {
    this.vista.otrosCorreos=opcion;
  }

  ngOnInit(): void 
  {
    $(document).ready(function()
    {
      $('.modal').modal();
      $('.collapsible').collapsible();
      $(".dropdown-trigger").dropdown();
    });
    this.route.paramMap.subscribe(params => 
      {
        this.idCotizacion = Number(params.get('idCotizacion'));
        this.versionCotizacion = Number(params.get('versionCotizacion'));
        this.cotizacionesService.existeAuxiliar(this.idCotizacion).subscribe((res: any) => 
        {
          if(res==null)
            this.nuevo=1;
          else
            this.nuevo=0;
          if(this.nuevo==1)
          {
              this.cotizacionesService.list_oneResumen(this.idCotizacion).subscribe((res1: any) => 
              {
                console.log(res1);
                console.log(this.idCotizacion,this.versionCotizacion);
                this.cotizacion = res1;
                this.vista.idCotizacion=this.idCotizacion;
                this.vista.nombreCliente = res1['viajeroNombre']+" "+res1['viajeroApellido'];
                this.vista.apellidoCliente=res1['viajeroApellido'];
                this.vista.agencia = res1['nombreAgencia'];
                this.vista.agente = res1['nombreAgente']+" "+res1['apellidosAgente'];
                this.fechaInicio = res1['fechaInicio'];
                this.calcularPorcentaje();
                this.fechaFin = res1['fechaFinal'];
                //let fecha1 = new Date(this.fechaInicio);
                //let fecha2 = new Date(this.fechaFin);
                //let resta = fecha2.getTime()-fecha1.getTime();
                this.noches = res1['noches'];
                this.vista.divisa= res1['divisa'];
   
                this.vista.idAgencia= res1['idAgencia'];
                this.vista.correoAgente=res1['correoAgente'];
                this.totalPasajeros=res1['num12']+res1['num18']+res1['numM'];
                console.log(this.vista);
                this.cotizacionesService.dameAsesor(res1['idUsuario']).subscribe((resAsesor: any) => 
                {
                  this.nombreAsesor=resAsesor['nombre'];
                  this.obtenerCanasta() ;
                },err =>  {console.log(err);});                
              },err =>  {console.log(err);}); 
          }
        },err =>  {console.log(err);}); 

      });
  }
  obtenerMesDia(fechita)
  {
    var cadena = fechita.split("-", 3); 
    return cadena[2]+"/"+cadena[1];
  }
  obtenerCanasta()
  {
    this.canastaService.listOneCotizacionByUserByVersionResumen(4,this.idCotizacion,this.versionCotizacion,this.versionCotizacion).subscribe((res5: any) => 
    {
      var datos = new Array();
      for(let data of res5.canasta)
      {
        data.datos.hojaNuevaOrden=false;
        datos.push(data.datos);  
        this.totalSinDescuento+=data.datos.precioTotal;        
        this.total+= this.precioAnticipo(data.datos.precioTotal,data.datos.tipo,data.datos.categoria);

      }
      console.log(this.totalSinDescuento)
      console.log(this.total)
      function naturalCompare(a,  b ) 
      {
        if (a.fecha < b.fecha)
          return -1;
          
        if(a.fecha == b.fecha)
        {
          if(a.orden < b.orden)
            return -1;
          else
            return 1;
        }
        return 1;
      }
      
      datos.sort(naturalCompare);         
      let mapProductos : any;
          let prod= [];

      for(let data of datos)
        prod.push(data);      


        this.vista.mapProductos= Array.from(prod);

        
        this.mapProductosPorHojaOrdenArreglo=[];

        this.mapProductosPorHojaOrdenArreglo.push(prod);
      console.log(this.mapProductosPorHojaOrdenArreglo);

    },
    err => 
    {
      console.log(err);
    });
  }
}