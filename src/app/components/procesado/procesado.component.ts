import { Component, OnInit, ɵisDefaultChangeDetectionStrategy} from '@angular/core';
import { CotizacionesService } from './../../services/cotizaciones.service';
import {  CanastaService} from './../../services/canasta.service';
import {  CanastaExtrasService} from './../../services/canastaExtras.service';
import {  EmailsService} from './../../services/emails.service';
import { HttpClient } from '@angular/common/http';

import { Timeline } from "../../..//app/models/Timeline";


import { ActivatedRoute } from '@angular/router';
import {Vista} from '../../models/vista.model'
import {ProductoResumen} from '../../models/ProductoResumen'
import { ResizeEvent } from 'angular-resizable-element';
import {  ImagenesService} from './../../services/imagenes.service';
import { environment } from '../../../environments/environment';
import Swal from "sweetalert2";

/*   WORD    */
import { Packer, Document, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, VerticalAlign, WidthType, HeightRule, ShadingType } from 'docx'
import { saveAs } from 'file-saver'
import { GeneradorWord } from '../../../app/generador';

declare var $: any;
@Component({
  selector: 'app-procesado',
  templateUrl: './procesado.component.html',
  styleUrls: ['./procesado.component.css','./style_imprimir.css']
})
export class ProcesadoComponent implements OnInit {  
  liga: string = environment.API_URI ;
  
  timeline: Timeline = new Timeline();

  nuevo:number;
  fileToUpload: File = null;
  imagenEventoManual: any=null;
  cotizacion :any;
  idCotizacion : any;
  versionCotizacion : any;
  vista : Vista;
  idAgente : any;
  idAgencia : any;
  fechaInicio : any;
  anyoIni : any;
  mesIni : any;
  diaIni : any;
  fechaFin : any;
  anyoFin : any;
  mesFin : any;
  diaFin : any;
  lista_paises : any;
  lista_continentes :  any;
  noches : any;
  public style: object = [];
  public styleItinerario: object;
  nombreImagenHoja2 : string;
  nombreImagenDayByDay : string;
  nombreImagenItinerarioFinal : string;
  imagenesPrincipales: any[];


  numExtras:number;
  numTourOpcionales: number;
  numVuelos:number;
  numHotel:number;
 // idImagenPrincipal: any;
  //idImagenHoja2: any;
 // idImagenDayByDay: any;
 // idImagenItinerarioFinal: any;
  
  mapProductosPorHoja: Map<string,ProductoResumen[]> =new Map<string,ProductoResumen[]>();
  mapTexto: Map<string,string>=new Map<string,string>();
  mapProductosPorHojaTourExtra: Map<string,ProductoResumen[]>=new Map<string,ProductoResumen[]>();
  mapProductosPorHojaArreglo:any;
  mapProductosPorHojaTourExtraArreglo:any;
  mapProductosPorHojaHoteles: any;
  mapProductosPorHojaHotelesActualizacion : any;
  mapProductosPorHojaHotelesArreglo:any;
  mapProductosPorHojaItinerario: Map<string,ProductoResumen[]>=new Map<string,ProductoResumen[]>();
  mapProductosPorHojaItinerarioArreglo:any;

  mapProductosPorHojaExtraArreglo:any;

  guiaPortada: any;
  estadoGuiaPortada: number;
  guiaEvento: any;
  estadoGuiaEvento: any;
  guiaDaybyday: any;
  guiaFin:any;
  //guiaHotel1: any;
  //guiaHotel2: any;


  

  validate(event: ResizeEvent): boolean 
  {
    const MIN_DIMENSIONS_PX: number = 50;
    if (
      event.rectangle.width &&
      event.rectangle.height &&
      (event.rectangle.width < MIN_DIMENSIONS_PX ||
        event.rectangle.height < MIN_DIMENSIONS_PX)
    ) {
      return false;
    }
    return true;
  }
  onResizeEndItinerario(event: ResizeEvent): void {
    this.styleItinerario = {
      position: 'static',
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`
    };
  }
  onResizeEnd(event: ResizeEvent,ii): void {
    this.style[ii] = {
      position: 'static',
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`
    };
  }
  constructor(    
    private cotizacionesService: CotizacionesService,    
    private imagenesService:ImagenesService,
    private canastaService: CanastaService,
    private canastaExtraService: CanastaExtrasService,
    private emailsService: EmailsService,
    private http: HttpClient,
    private route: ActivatedRoute    ) 
  { 
    console.log(this.liga);
    this.nuevo=1;
    this.imagenesPrincipales = [];
    this.vista= new Vista();
    this.vista.imagenPrincipalAuxiliar=0;
    this.vista.imagenEventoAuxiliar=0;
    this.vista.imagenDaybydayAuxiliar=0;
    this.vista.imagenFinAuxiliar=0;    
    this.vista.imagenItinerarioFinalAuxiliar=0;

    this.guiaPortada=null;
    this.estadoGuiaPortada=2;
    this.guiaEvento=null;
    this.estadoGuiaEvento=2;
    this.guiaDaybyday=null;
    this.guiaFin=null;
  }

  guardarCotizacionAuxiliar()
  {
    let datos = {
      'idCotizacion':this.vista.idCotizacion,
      'titulo': this.vista.titulo,
      'nombreCliente': this.vista.nombreCliente,
      'agencia': this.vista.agencia,
      'idAgencia': this.vista.idAgencia,
      'fecha': this.vista.fecha,
      'agente': this.vista.agente,
      'correoAgente': this.vista.correoAgente,
      'periodo': this.vista.periodo,
      'noches': this.vista.noches,
      'evento': this.vista.evento,
      'listaDestinos': this.vista.lista_destinos,
      'imagenAuxiliar': this.vista.imagenPrincipalAuxiliar,
      'imagenSeleccionada': this.vista.imagenPrincipalSeleccionada,
      'imagenEventoAuxiliar': this.vista.imagenEventoAuxiliar,
      'imagenEventoSeleccionada': this.vista.imagenEventoSeleccionada,
      'imagenDaybydayAuxiliar': this.vista.imagenDaybydayAuxiliar,
      'imagenDaybydaySeleccionada': this.vista.imagenDaybydaySeleccionada,
      'imagenItinerarioFinalAuxiliar': this.vista.imagenItinerarioFinalAuxiliar,
      'imagenItinerarioFinalSeleccionada': this.vista.imagenItinerarioFinalSeleccionada,
      'imagenFinAuxiliar': this.vista.imagenFinAuxiliar,
      'imagenFinSeleccionada': this.vista.imagenFinSeleccionada
    };  
    console.log("this.nuevo",this.nuevo);    
    if(this.nuevo==1)
    {
      console.log("guardando cotizacionAuxiliar nueva");
      console.log(datos);
      this.cotizacionesService.guardarCotizacionAuxiliar(datos).subscribe((res: any) => 
      {
        this.guardarNuevoItinerario();
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Cambios almacenados correctamente`,
          showConfirmButton: false,
          timer: 1500,
        });
  
        this.nuevo = 0;
      },
        err => console.error(err)
      );

    }
   
    else
    {
      console.log("actualizando cotizacionAuxiliar ");
      console.log(datos);

      this.cotizacionesService.actualizar(datos).subscribe((res: any) => 
      {
        this.actualizarItinerario();
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Cambios Actualizados correctamente`,
          showConfirmButton: false,
          timer: 1500,
        });
  
      },
        err => console.error(err)
      );

    }
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
  darMesCorto(mes)
  {
    if(mes==1)
      return "ENE";
    if(mes==2)
      return "FEB";
    if(mes==3)
      return "MAR";
    if(mes==4)
      return "ABR";
    if(mes==5)
      return "MAY";
    if(mes==6)
      return "JUN";
    if(mes==7)
      return "JUL";
    if(mes==8)
      return "AGO";
    if(mes==9)
      return "SEP";
    if(mes==10)
      return "OCT";
      if(mes==11)
      return "NOV";
    if(mes==12)
      return "DIC";

  }
  obtenerMesFechaCompleta(fechita)
  {
    var cadena = fechita.split("-", 3); 
    return this.darMes(cadena[1]);
  }

  obtenerDiaFechaCompleta(fechita)
  {
    var cadena = fechita.split("-", 3); 
    return cadena[2];
  }
  obtenerDiaFechaCompletaLetra(fechita)
  {
    var cadena = fechita.split("-", 3); 
    return cadena[2] +" DE "+this.darMes(cadena[1])+" DE "+cadena[0];
  }  
  obtenerDiaFechaMesDiaLetra(fechita)
  {
    var cadena = fechita.split("-", 3); 
    return cadena[2] +" "+this.darMesCorto(cadena[1]);
  }
  obtenerTituloFecha()
  {
    var cadena = this.fechaInicio.split("-", 3); 
    this.anyoIni=cadena[0];
    this.mesIni=cadena[1];
    this.diaIni=cadena[2];
    var cadena = this.fechaFin.split("-", 3); 
    this.anyoFin=cadena[0];
    this.mesFin=cadena[1];
    this.diaFin=cadena[2];
    this.vista.periodo=this.darMes(this.mesIni)+" "+this.diaIni+" - "+this.darMes(this.mesFin)+" "+this.diaFin;
    if(this.anyoFin==this.anyoIni)
    {
      if(this.mesIni==this.mesFin)
      {
        this.vista.fecha=this.darMes(this.mesIni)+" "+this.anyoIni;
      }
      else 
      {
        this.vista.fecha=this.darMes(this.mesIni)+"-"+this.darMes(this.mesFin)+" "+this.anyoIni;
      }
    }
    else
    {
      this.vista.fecha=this.darMesCorto(this.mesIni)+" "+this.anyoIni+"-"+this.darMesCorto(this.mesFin)+" "+this.anyoFin;
    }
  }
  cambioImagenPrincipal(opcion) 
  {
    this.guiaPortada=null;
    this.estadoGuiaPortada=2;
    this.vista.imagenPrincipalAuxiliar=0;
    this.vista.imagenPrincipalSeleccionada=opcion;   
  }
  cambioImagenItinerarioFinal(opcion) 
  {
    this.vista.imagenItinerarioFinalAuxiliar=0;
    this.vista.imagenItinerarioFinalSeleccionada=opcion;
  }  
  cambioImagenEvento(opcion) 
  {
    this.guiaEvento=null;
    this.estadoGuiaEvento=2;
    this.vista.imagenEventoAuxiliar=0;
    this.vista.imagenEventoSeleccionada=opcion;   
  }
  cambioImagenDayByDay(opcion) 
  {
    this.guiaDaybyday=null;
    this.vista.imagenDaybydayAuxiliar=0;
    this.vista.imagenDaybydaySeleccionada=opcion;   
  }    
  cambioImagenFin(opcion) 
  {
    this.guiaFin=null;
    this.vista.imagenFinAuxiliar=0;
    this.vista.imagenFinSeleccionada=opcion;   
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
  public cargandoImagenPrincipalManual(files: FileList) 
  {    
    this.guiaPortada=null;
    this.fileToUpload = files.item(0);
    let imgPromise = this.getFileBlob(this.fileToUpload);
    imgPromise.then(blob => {
      
      this.imagenesService.guardarImagenPrincipal(this.idCotizacion, blob).subscribe(
        (res: any) => 
        {
          this.guiaPortada = blob;
          this.estadoGuiaPortada=0;
          this.vista.imagenPrincipalAuxiliar=1;
        }, 
        err => console.error(err));

    })
  }
  public cargandoImagenEventoManual(files: FileList) 
  {
    this.guiaEvento=null;
    this.fileToUpload = files[0];
    let imgPromise = this.getFileBlob(this.fileToUpload);
    imgPromise.then(blob => {
      this.imagenesService.guardarImagenEvento(this.idCotizacion, blob).subscribe(
        (res: any) => {
          this.guiaEvento=blob;
          this.estadoGuiaEvento=0;
          this.vista.imagenEventoAuxiliar=1;
        }, 
        err => console.error(err));
    })
  }  
  public cargandoImagenDaybydayManual(files: FileList) 
  {
    this.guiaDaybyday=null;
    this.fileToUpload = files[0];
    let imgPromise = this.getFileBlob(this.fileToUpload);
    imgPromise.then(blob => {
      let guia = blob;
      this.imagenesService.guardarImagenDaybyday(this.idCotizacion, blob).subscribe(
        (res: any) => {
         this.guiaDaybyday=blob;
          this.vista.imagenDaybydayAuxiliar=1;
        }, 
        err => console.error(err));
    })
  }
  public cargandoImagenItinerarioFinalManual(files: FileList) 
  {
    this.fileToUpload = files[0];
    let imgPromise = this.getFileBlob(this.fileToUpload);
    imgPromise.then(blob => {
      let guia = blob;
      this.imagenesService.guardarImagenItinerarioFinal(this.idCotizacion, guia).subscribe(
        (res: any) => 
        {
          this.vista.imagenItinerarioFinalAuxiliar=1;
        }, 
        err => console.error(err));

    })
  }
  public cargandoImagenFinManual(files: FileList) 
  {
    this.guiaFin=null;
    this.fileToUpload = files[0];
    let imgPromise = this.getFileBlob(this.fileToUpload);
    imgPromise.then(blob => {
      let guiaFin = blob;
      this.imagenesService.guardarImagenFin(this.idCotizacion, blob).subscribe(
        (res: any) => {
          this.guiaFin=blob;
          this.vista.imagenFinAuxiliar=1;
        }, 
        err => console.error(err));
    })
  }

  public cargandoImagenHotel1Manual(jj,ii,files: FileList,id) 
  {
    this.fileToUpload = files[0];
    let imgPromise =  this.getFileBlob(this.fileToUpload);
     imgPromise.then(blob => {
       this.imagenesService.guardarImagenHotel1(id, blob).subscribe(
        (res: any) => {
          this.vista.mapProductos[jj][1][ii].imagenHotel1=id;
        }, 
        err => console.error(err));
    })
  }
  public cargandoImagenHotel2Manual(jj,ii,files: FileList,id) 
  {
    this.fileToUpload = files[0];
    let imgPromise = this.getFileBlob(this.fileToUpload);
    imgPromise.then(blob => {
      this.imagenesService.guardarImagenHotel2(id, blob).subscribe(
        (res: any) => {
          this.vista.mapProductos[jj][1][ii].imagenHotel2=id;

        }, 
        err => console.error(err));
    })
  }
  public cargandoImagenActualizacionHotel1Manual(jj,files: FileList,id) 
  {
    this.fileToUpload = files[0];
    let imgPromise =  this.getFileBlob(this.fileToUpload);
     imgPromise.then(blob => {
      let guia = blob;
       this.imagenesService.guardarActualizacionImagenHotel1(id, guia).subscribe(
        (res: any) => {
          this.vista.mapHotelesActualizacion[jj].hotel1=id;
        }, 
        err => console.error(err));
    })
  }
  public cargandoImagenActualizacionHotel2Manual(jj,files: FileList,id) 
  {
    this.fileToUpload = files[0];
    let imgPromise = this.getFileBlob(this.fileToUpload);
    imgPromise.then(blob => {
      let guia = blob;
      this.imagenesService.guardarActualizacionImagenHotel2(id, guia).subscribe(
        (res: any) => {
          this.vista.mapHotelesActualizacion[jj].hotel2=id;

        }, 
        err => console.error(err));
    })
  }






  cambioItinerarioLugar(jj,opcion) 
  {
    this.vista.mapProductos[jj][1][0].lugar=opcion;
  }
  cambioOtrosCorreos(opcion)
  {
    this.vista.otrosCorreos=opcion;
  }
  cambioNotas(opcion)
  {
    this.vista.notas=opcion;
  }
  cambioTextoDayByDay(jj,ii,opcion) 
  {
    this.vista.mapProductos[jj][1][ii].descripcion=opcion;
  }

  cambioItinerario(jj,ii,opcion) 
  {
    this.vista.mapProductos[jj][1][ii].texto=opcion;
    this.mapTexto.set(this.vista.mapProductos[jj][1][ii].tipo+","+this.vista.mapProductos[jj][1][ii].id,opcion);
  }

 

 
  cambioImagenNuevaDayByDay(jj,ii)
  {
    this.vista.mapProductos[jj][1][ii].imagenNuevaDayByDay=!this.vista.mapProductos[jj][1][ii].imagenNuevaDayByDay;
    this.mapProductosPorHoja.clear();
    for(let data of this.vista.mapProductos)
    {    
      let letra=0;
      for(let subdata of data[1])
      {
        let fechita=subdata.fecha;
        if(subdata.hojaNuevaDayByDay==true)
        {
          letra++;
        }
        fechita=fechita+"-"+letra;
        if(this.mapProductosPorHoja.has(fechita)==false)
        {
          let prod= [];
          prod.push(subdata);

          this.mapProductosPorHoja.set(fechita,prod);
        }
        else
        {
          let prod=this.mapProductosPorHoja.get(fechita);
          prod.push(subdata);
          this.mapProductosPorHoja.set(fechita,prod);
        }
      }
    }
    this.mapProductosPorHojaArreglo= Array.from(this.mapProductosPorHoja);
  }
  cambiaOrden(jj,ii,cambiar,valor)
  {
    if(cambiar==1)
    {
      this.vista.mapProductos[jj][1][ii].orden=valor;
    }
      var datos = new Array();
      for(let data of this.vista.mapProductos[jj][1])
        datos.push(data);
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
      let i=0;
      for(let data of datos)
      {
        this.vista.mapProductos[jj][1][i]=data;
        i++;
      }      
      this.mapProductosPorHojaItinerarioArreglo=[];
      this.mapProductosPorHojaItinerarioArreglo.push(Array.from(this.vista.mapProductos));
  }
  cambioInvisible(jj,ii,cambiar)
  {
    if(cambiar==1)
      this.vista.mapProductos[jj][1][ii].visible=!this.vista.mapProductos[jj][1][ii].visible;
  }
  cambioHojaNuevaItinerario(jj,ii,cambiar)
  {
    if(cambiar==1)
      this.vista.mapProductos[jj][1][ii].hojaNuevaItinerario=!this.vista.mapProductos[jj][1][ii].hojaNuevaItinerario;
    this.mapProductosPorHojaItinerario.clear();
    let i=0;
    let cuantos=0;
    for(let data of this.vista.mapProductos)
    {
      let letra=0;
      for(let subdata of data[1])
      {
        let fechita=subdata.fecha;
        if(subdata.hojaNuevaItinerario==true)
        {
          letra++;
          cuantos++;
          i++;
        }
        fechita=fechita+"-"+letra;
        if(this.mapProductosPorHojaItinerario.has(fechita)==false)
        {
          let prod= [];
          prod.push(subdata);

          this.mapProductosPorHojaItinerario.set(fechita,prod);
        }
        else
        {
          let prod=this.mapProductosPorHojaItinerario.get(fechita);
          prod.push(subdata);
          this.mapProductosPorHojaItinerario.set(fechita,prod);
        }
      }
    }
    let mapProductosPorHojaItinerarioArregloTmp: any;
    this.mapProductosPorHojaItinerarioArreglo = [];
    mapProductosPorHojaItinerarioArregloTmp= Array.from(this.mapProductosPorHojaItinerario);
    let cuantosVan=0;
    let prod:any;
    prod= [];
    for(let data of mapProductosPorHojaItinerarioArregloTmp)
    {
      if(data[0][11]!=0)
      {
        cuantosVan++;
        this.mapProductosPorHojaItinerarioArreglo.push(Array.from(prod));
        prod= [];
        prod.push(data);
      }
      else 
        prod.push(data);
    }
    this.mapProductosPorHojaItinerarioArreglo.push(Array.from(prod));
  }
  cambioHojaNuevaDayByDay(jj,ii,cambiar)
  {
    if(cambiar==1)
    {
      this.vista.mapProductos[jj][1][ii].hojaNuevaDayByDay=!this.vista.mapProductos[jj][1][ii].hojaNuevaDayByDay;
    }
    this.mapProductosPorHoja.clear();
    for(let data of this.vista.mapProductos)
    {    
      let letra=0;
      for(let subdata of data[1])
      {
        let fechita=subdata.fecha;
        if(subdata.hojaNuevaDayByDay==true)
        {
          letra++;
        }
        fechita=fechita+"-"+letra;
        if(this.mapProductosPorHoja.has(fechita)==false)
        {
          let prod= [];
          prod.push(subdata);

          this.mapProductosPorHoja.set(fechita,prod);
        }
        else
        {
          let prod=this.mapProductosPorHoja.get(fechita);
          prod.push(subdata);
          this.mapProductosPorHoja.set(fechita,prod);
        }
      }
    }
    this.mapProductosPorHojaArreglo= Array.from(this.mapProductosPorHoja);
  }
  cambioHojaNuevaTourExtra(jj,ii,cambiar)
  {
    if(cambiar==1)
    {
      this.vista.mapProductos[jj][1][ii].hojaNuevaTourExtra=!this.vista.mapProductos[jj][1][ii].hojaNuevaTourExtra;
    }
    this.mapProductosPorHojaTourExtra.clear();
    this.mapProductosPorHojaHoteles=[];
    //this.guiaHotel1=[];
    //this.guiaHotel2=[];
    let letra=0;          
    let prodHoteles= [];
    let guiaProdHoteles1=[];
    let guiaProdHoteles2=[];
    let i=0;
    for(let data of this.vista.mapProductos)
    {    
      for(let subdata of data[1])
      {        
        let fechita=subdata.fecha;
        if(subdata.tipo==4 && subdata.opcional==0)
        {
          if(i!=0 && i%2==0)
          {
            this.mapProductosPorHojaHoteles.push(prodHoteles);
            prodHoteles=[];
            guiaProdHoteles1=[];
            guiaProdHoteles2=[];
          }
          prodHoteles.push(subdata);
          guiaProdHoteles1.push(null);
          guiaProdHoteles2.push(null);
          i++;
        }
        if(subdata.hojaNuevaTourExtra==true)
        {
          letra++;
        }
        if(this.mapProductosPorHojaTourExtra.has(letra+"")==false)
        {
          let prod= [];
          prod.push(subdata);
          this.mapProductosPorHojaTourExtra.set(letra+"",prod);
        }
        else
        {
          let prod=this.mapProductosPorHojaTourExtra.get(letra+"");
          prod.push(subdata);
          this.mapProductosPorHojaTourExtra.set(letra+"",prod);
        }
      }
    }            
    this.mapProductosPorHojaHoteles.push(prodHoteles);
    this.mapProductosPorHojaTourExtraArreglo= Array.from(this.mapProductosPorHojaTourExtra);
    console.log(this.mapProductosPorHojaTourExtraArreglo);
    this.mapProductosPorHojaHotelesArreglo= Array.from(this.mapProductosPorHojaHoteles);
  }
  actualizarItinerario()
  {
    this.cotizacionesService.deleteItinerarioAuxiliar(this.idCotizacion).subscribe((res: any) => 
    {
      console.log(res);
      let datos= [];
      for(let data of this.vista.mapProductos)
      for(let datito of data[1])
      {

        datos.push([this.idCotizacion,datito.id,datito.tipo,datito.fecha,datito.lugar,datito.texto,datito.hojaNuevaItinerario,datito.visible,datito.orden,datito.descripcion,datito.hojaNuevaDayByDay]);          
      }
      console.log(datos);
      this.cotizacionesService.guardarItinerarioAuxiliar(datos).subscribe((res: any) => 
      {
      },
      err => console.error(err)
    );
    },
      err => console.error(err)
    );
  }
  desayuno(tmp)
  {
    if(tmp!=0)
      return "No";
    return "";
  }

  guardarNuevoItinerario()
  {
    let datos= [];
    for(let data of this.vista.mapProductos)
      for(let datito of data[1])
      {
        datos.push([this.idCotizacion,datito.id,datito.tipo,datito.fecha,datito.lugar,datito.texto,datito.hojaNuevaItinerario,datito.visible,datito.orden,datito.descripcion,datito.hojaNuevaDayByDay]);          
      }
      console.log(datos);
      if(datos.length>0)
        this.cotizacionesService.guardarItinerarioAuxiliar(datos).subscribe((res: any) => 
        {
        },
          err => console.error(err)
        );
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
      'asunto': "Envío cotización de "+this.vista.nombreCliente+" con número : "+this.vista.idCotizacion+ "version : "+this.vista.version,
      'agente': this.vista.agente,
      'nombreCliente': this.vista.nombreCliente,
      'notas': this.vista.notas,
      'pdf': this.vista.pdf
    };
   
    this.emailsService.enviarPDF(datos).subscribe((res: any) => 
    {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Correo enviado correctamente`,
          showConfirmButton: false,
          timer: 1500,
        });
        this.cotizacionesService.updateEstadoAEnviado(this.idCotizacion,1).subscribe((res: any) => 
        {
            console.log(res);
            this.timeline = new Timeline();
            this.timeline.idCotizacion = this.cotizacion.idCotizacion;
            this.timeline.notas = 'Envío de correo de la cotización V'+this.versionCotizacion;
            this.timeline.tipo = 2;
            this.cotizacionesService.addTimeline(this.timeline).subscribe(res => {});
        },
          err => console.error(err)
        );
    },
      err => console.error(err));
  }
  unirEntradas(item)
  {
    if(item.entradas==null)
      return item.incluye;
    return item.incluye+"\n*"+item.entradas;


  }
  cargandoPDF(files: FileList,tmp: any)
  {
      this.fileToUpload = files.item(0);
      tmp.value='';
      let imgPromise = this.getFileBlob(this.fileToUpload);
      imgPromise.then(blob => {
        
        this.imagenesService.guardarPDF(this.idCotizacion,this.versionCotizacion, blob).subscribe(
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
  async guardarWord()
  {
    console.log("Generando word");
    const generador = new GeneradorWord()    
    let imagenesBuffer: any[] = []
  //  imagenesBuffer[0]=this.liga+"/portada/"+this.idCotizacion+".jpg"
  await this.http.get(this.liga+"/portada/"+this.vista.imagenPrincipalSeleccionada+".jpg", { responseType: 'blob' }).toPromise()
  .then(buffer => {
    imagenesBuffer.push(buffer)
    return this.http.get(this.liga+"/portada/"+this.vista.imagenPrincipalSeleccionada+".jpg", { responseType: 'blob' }).toPromise()
  })



    const destinos = [
      // Amsterdam
      {
        destino: 'Amsterdam',
        // Arreglo de actividades
        itinerario: [
          {
            fecha: {
              dia: 9,
              mes: 'marzo',
              año: 2022
            },
            instruccionInicial: 'Su chófer lo verá a su llegada en Aeropuerto de Ámsterdam-Schiphol (AMS) para trasladarlo a su hotel.',
            hospedaje: 'Super hotelazo',
            imagen: imagenesBuffer[3],
            duracion: 4,
            incluye: [
              'Acceso sin fila a la colección del museo'
            ],
            descripcion: `¡Disfrute de unas entradas sin fila al Rijksmuseum!

El Rijksmuseum alberga más de 5,000 increíbles cuadros con énfasis en el Siglo de Oro neerlandés. La colección cubre más de 800 años de historia del arte en un precioso edificio restaurado. Ubicado en el corazón del Museumplein de Amsterdam, el Rijks es imprescindible durante una estancia en Holanda.`,
            mensajeExtra: 'Su chofer lo verá en su llegada en el hotel para trasladarlo al Aeropuerto de Ámsterdam-Schiphol (AMS)'
          },
          {
            fecha: {
              dia: 10,
              mes: 'marzo',
              año: 2022
            },
            instruccionInicial: '',
            hospedaje: '',
            imagen: imagenesBuffer[4],
            duracion: 3,
            incluye: [
              'Recogida en el hotel (Si es céntrico o cerca de la zona del inicio del tour',
              'Servicio de guía privado y verificado en español'
            ],
            descripcion: `Ámsterdam es una ciudad conocida por su actitud liberal, el mejor ejemplo es la legalización de la prostitución, en su famoso Barrio Rojo, aquí está prohibido sacar fotos a las prostitutas.

Caminaremos por la calle Warmoesstraat, mejor conocida como la calle de las hierbas aromáticas. Avanzaremos por el Barrio Judío, lugar donde nació el artista Rembrandt, visitaremos la famosa Iglesia Vieja muy conocida por sus manifestaciones religiosas.

Prepárese para conocer: El Barrio Chino y el Noordemark o Mercado de las pulgas, que se caracteriza por una plaza llena de cafeterías y restaurantes. Y por último avanzaremos hacia el Mercado de las Flores.

Por razones de comodidad, su guía podrá ajustar o modificar el itinerario.`,
            mensajeExtra: ''
          },
          {
            fecha: {
              dia: 11,
              mes: 'marzo',
              año: 2022
            },
            instruccionInicial: '',
            hospedaje: '',
            imagen: imagenesBuffer[5],
            duracion: 8,
            incluye: [
              'Transportación y Recogida en el hotel (Si es céntrico o cerca de la zona de inicio del tour)',
              'Servicio de guía privado y verificado en español',
              'Cata de quesos',
              'Acceso a la zona de Molinos',
              'Tour de fábrica de zapatos suecos'
            ],
            descripcion: `Esta ruta Holandesa nos llevará a envolvernos de las bellezas naturales y culturales que reinan en los Páises Bajos.

Déjese cautivar po rlos canales y las pintorescas calles que vuelven auténtica la espectacular ciudad de Edam.

Visitaremos la Iglesia de San Nicolás, y admiraremos la maravillosa vista de la ciudad desde el puente Kwakelbrug.

Desde Edam, nos dirigiremos hacia una Villa vecina: Volendam, uno de los sitios más distinguidos en el norte del país donde descubriremos una antigua villa pesquera y admiraremos las casas que rodean y dcoran el puerto con su arquitectura.

Unos kilómetros más adelante, nos encontraremos con marken, una península que nos ofrecerá vistas panóramicas sensacionales.

Recorreremos el pueblo rústico de Zaanse Schans, un lugar donde admiraremos casas tradicionales del siglo XV y unos molinos de viento que vuelven característico este bello lugar.

Concluiremos con la visita a una fábrica de zuecos donde exploraremos más sobre estas artesanías populares. Y casi por terminar, deleitaremos nuestro paladar disfrutando del sabor único y original del queso holandés luego de conocer su entero proceso de elaboración.

Nos complace ser parte de su experiencia holandesa.


Por razones de comodidad, su guía podrá ajustar o modificar el itinerario.`,
            mensajeExtra: ''
          },
          {
            fecha: {
              dia: 13,
              mes: 'marzo',
              año: 2022
            },
            instruccionInicial: 'Vuelo',
            hospedaje: 'Cordobito',
            imagen: imagenesBuffer[6],
            duracion: 0,
            incluye: [],
            descripcion: 'Su chofer lo verá a su llegada en Aeropuerto de Córdoba (ODB) para trasladarlo a su hotel',
            mensajeExtra: '',
            vuelo: {
              origen: 'Amsterdam',
              destino: 'Córdoba',
              salida: '10:20',
              llegada: '14:30',
              compañia: '',
              cantidad: 4
            }
          }
        ]
      },
      {
        destino: 'Córdoba',
        // Arreglo de actividades
        itinerario: [
          {
            fecha: {
              dia: 14,
              mes: 'marzo',
              año: 2022
            },
            instruccionInicial: '',
            hospedaje: '',
            imagen: imagenesBuffer[7],
            duracion: 4,
            incluye: [
              'Servicio de guía privado y verificado en español',
              'Recogida en el hotel (Si es céntrico o cerca de la zona del inicio del tour',
              'Entrada al Museo',
              'Entrada a la Mezquita-Catedral',
              'Entrada a Sinagoga'
            ],
            descripcion: `Descubriremos juntos la ciudad con más titulos de Patrimonio de la Humanidad en el mundo.

Comenzaremos visitando el icónico Puente Romano de Córdoba, que ha servido como telón de fondo en algunas escenas de la famosa ser Juego de Tronos ¡No pueden faltar tus selfies aquí!

Luego de esto, descubriremos el lado judío que guardan las tierras cordobesas; sus lindos patios, calles, y la Sinagoga, construcción de estilo mudéjar que domina todo el barrio.

Después, nos dirigiremos hacia el emblema más importante de la ciudad, la Mezquita-Catedral de Córdoba. No solo el símbolo de la ciudad, sino el monumento más importante de todo el Occidente islámico. El arte de su interior de dejará maravillado.

Podrás conocer todo esto y más en nuestro divertido y alegre paseo ¡Te esperamos!

¡Quedarás enamorado de esta ciudad!`,
            mensajeExtra: ''
          },
          {
            fecha: {
              dia: 16,
              mes: 'marzo',
              año: 2022
            },
            instruccionInicial: '',
            hospedaje: '',
            imagen: imagenesBuffer[8],
            duracion: 3,
            incluye: [
              'Transportación y Recogida en el hotel (Si es céntrico o cerca de la zona de inicio del tour)',
              'Entrada',
              'Servicio de guía privado y verificado en español',
              'Transportación (según opción elegida)',
              'Entrada a la Medina de Azhara'
            ],
            descripcion: `Déjense guiar por su guía experto y disfruten al máximo esta experiencia.

Estamos por visitar uno de los yacimientos arqueológicos más importantes de España, del que actualmente se está promoviendo su candidatura para ser declarada un tesoro nacional : La Ciudad Califal de Medina Azahara.

Visitaremos la ciudad abandonada, saqueada y enterrada durante siglos, el enclave fue descubierto a znales del siglo XIX, convirtiéndose en uno de los yacimientos arqueológico más grandes de toda España. Nada más llegar realizaremos una visita por Medina Azahara para descubrir sus secretos. Las paredes de cal, su decoración con ataurique, los techos de oro y las piscinas de mercurio hicieron que Medina Azahara fuera escogida por califas, príncipes, artistas y filósofos de la época.
Recorriendo sus pasillos, torres, salones, mezquitas, salas de sirvientes y salas de guardianes viajaremos atrás en el tiempo remontándonos hasta el siglo X, la esplendorosa época omeya del Califato de Córdoba. Después de recorrer el yacimiento, conoceremos el Museo de Medina Azahara para observar de cerca sus principales hallazgos arqueológicos y conocer más secretos de este fascinante lugar.

Descenderemos desde la vivienda del califa y altos dignatarios, pasando por el cuerpo de guardia y la casa de Yafar. En este punto nos encontraremos con las viviendas de la servidumbre, así como con el salón Rico, el edificio basilical, el edizcio porticado, la plaza de Armas y la mezquita aljama.

Su guía conoce la ruta como la palma de sus manos, así que se encargará de llevarlos a cada rincón de este precioso lugar`,
            mensajeExtra: ''
          }
        ]
      }
    ]    

    const doc = generador.crear(this.vista,imagenesBuffer, destinos)

    Packer.toBlob(doc).then(blob => 
    {
      saveAs(blob, 'documento.docx')
    })
  }

  
  signo(tmp)
  {
    if(tmp>0)
      return "+";
    else
      return "-"

  }
  sinSigno(tmp)
  {
    if(tmp<0)
      return -tmp;
    else
      return tmp;

  }
  tipoHabitacion(tmp)
  {
    if(tmp==1)
      return "DOBLE";
    if(tmp==2)
      return "TRIPLE";
    else
      return "CUADRUPLE";
  }

  cambioInvisibleExtra(jj,cambiar)
  {
    if(cambiar==1)
      this.vista.mapProductosExtras[jj].hojaNuevaOrden=!this.vista.mapProductosExtras[jj].hojaNuevaOrden;


    this.mapProductosPorHojaExtraArreglo=[];

    let mapProductos : any;
    let prod= [];

    for(let data of this.vista.mapProductosExtras)
      if(data.hojaNuevaOrden==true)
      {
        this.mapProductosPorHojaExtraArreglo.push(prod);
        prod= [];
        prod.push(data);
      }
      else
        prod.push(data);

    this.mapProductosPorHojaExtraArreglo.push(prod);
    console.log(this.mapProductosPorHojaExtraArreglo);
  }
  obtenerCanasta()
  {
    this.canastaService.listOneCotizacionByUserByVersionResumen(4,this.idCotizacion,this.versionCotizacion,this.versionCotizacion).subscribe((res5: any) => 
    {
      var datos = new Array();
      console.log("Canasta:",res5);
      for(let data of res5.canasta)
      {

//        this.numExtras=0;
//        this.numTourOpcionales=0;
//        this.numVuelos=0;
    
        if(data.datos.tipo==7 && data.datos.opcional==1)
          this.numTourOpcionales++;
        if(data.datos.tipo==5)
          this.numVuelos++;
        if(data.datos.tipo==4)
          this.numHotel++;

        datos.push(data.datos);
        if(data.datos.tipo==4 && data.datos.opcional==0)
          this.vista.precioHoteles+=data.datos.precioTotal;
        else if(data.datos.tipo!=4 && data.datos.opcional==0)
          this.vista.precioOtros+=data.datos.precioTotal;
      }
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
      let mapProductos : Map<string,ProductoResumen[]> = new Map<string,ProductoResumen[]>();
      for(let data of datos)
      {
        if(mapProductos.has(data.fecha)==false)
        {
          let prod= [];
          data.texto="";
          if(data.tipo==1)
            data.texto+=" Traslado privado del "+data.desde+" al "+data.hacia;
          else if(data.tipo==2)
            data.texto+=" Disposición de chófer: "+data.nombre;
          else if(data.tipo==3)
            data.texto+=" Traslado ";
          else if(data.tipo==4)
            data.texto+=" Hospedaje: "+data.nombre;
          else if(data.tipo==5)
            data.texto+=" Vuelo: "+data.nombre;
          else if(data.tipo==6)
            data.texto+=" Tren: "+data.nombre;
          else if(data.tipo==7)
          {
            if(data.categoria==1)
              data.texto+=" Tour a pie: "+data.nombre;
            if(data.categoria==2)
              data.texto+=" Tour con transporte: "+data.nombre;
            if(data.categoria==3)
              data.texto+=" Tour en grupo: "+data.nombre;
            if(data.categoria==4)
              data.texto+=" Actividad: "+data.nombre;
          }
          else if(data.tipo==8)
              data.texto+=" Extra: "+data.nombre;
          data.hojaNuevaDayByDay=false;
          data.hojaNuevaItinerario=false;
          data.hojaNuevaTourExtra=false;
          data.visible=1;
          data.orden=1;
          data.imagenNuevaDayByDay=false;
          data.imagenHotel1=0;
          data.imagenHotel2=0;
          data.hotel1=0;
          data.hotel2=0;
          prod.push(data);
          mapProductos.set(data.fecha,prod);
          this.mapTexto.set(data.tipo+","+data.id,data.texto);
  
        }
        else
        {                      
          data.hojaNuevaDayByDay=false;          
          data.hojaNuevaItinerario=false;
          data.hojaNuevaTourExtra=false;
          data.visible=1;          
          data.orden=1;
          data.imagenNuevaDayByDay=false;
          let prod=mapProductos.get(data.fecha);
          data.texto="";
          if(data.tipo==1)
            data.texto+=" Traslado privado del "+data.desde+" al "+data.hacia;
          else if(data.tipo==2)
            data.texto+=" Disposición de chófer: "+data.nombre;
          else if(data.tipo==3)
            data.texto+=" Traslado privado del "+data.desde+" al "+data.hacia;
          else if(data.tipo==4)
            data.texto+=" Hotel: "+data.nombre;
          else if(data.tipo==5)
            data.texto+=" Vuelo: "+data.nombre;
          else if(data.tipo==6)
            data.texto+=" Tren: "+data.nombre;
          else if(data.tipo==7)
          {
            if(data.categoria==1)
              data.texto+=" Tour a pie: "+data.nombre;
            if(data.categoria==2)
              data.texto+=" Tour con transporte: "+data.nombre;
            if(data.categoria==3)
              data.texto+=" Tour en grupo: "+data.nombre;
            if(data.categoria==4)
              data.texto+=" Actividad: "+data.nombre;
            data.descripcion=data.texto;
          }
          else if(data.tipo==8)
              data.texto+=" Extra: "+data.nombre;      

          data.imagenHotel1=0;
          data.imagenHotel2=0;
          data.hotel1=0;
          data.hotel2=0;
          prod.push(data);
          mapProductos.set(data.fecha,prod);
          this.mapTexto.set(data.tipo+","+data.id,data.texto);

        }
      }

      this.vista.mapProductos= Array.from(mapProductos);
      this.vista.mapProductosExtras=[];
      let mapProductosExtras=[];
      
      this.canastaExtraService.getListTrasladosExtras(this.idCotizacion,this.versionCotizacion).subscribe((resTrasladosExtras: any) => 
      {
        mapProductosExtras=mapProductosExtras.concat(resTrasladosExtras);

        
        this.canastaExtraService.getListHotelesExtras(this.idCotizacion,this.versionCotizacion).subscribe((resHotelesExtras: any) => 
        {
          mapProductosExtras=mapProductosExtras.concat(resHotelesExtras);
          console.log(resHotelesExtras);
  //        this.canastaExtraService.getListHotelesManualesExtras(this.idCotizacion).subscribe((resHotelesManualesExtras: any) => 
  //        {
  //          mapProductosExtras=mapProductosExtras.concat(resHotelesManualesExtras);
  //          this.vista.mapHotelesActualizacion=this.vista.mapHotelesActualizacion.concat(resHotelesManualesExtras);
this.vista.mapHotelesActualizacion=resHotelesExtras;
  
            let mapHoteles=[];
            let prodHoteles=[];
            let i=0;
            for(let data of this.vista.mapHotelesActualizacion)
            {    
              if(i!=0 && i%2==0)
              {
                mapHoteles.push(prodHoteles);
                prodHoteles=[];
              }
              prodHoteles.push(data);
              i++;
            }
            mapHoteles.push(prodHoteles);
            this.mapProductosPorHojaHotelesActualizacion= Array.from(mapHoteles);
            this.canastaExtraService.getListDisposicionesExtras(this.idCotizacion,this.versionCotizacion).subscribe((resDisposicionesExtras: any) => 
            {
              console.log(resDisposicionesExtras);
              mapProductosExtras=mapProductosExtras.concat(resDisposicionesExtras);
              this.canastaExtraService.getListProductosExtras(this.idCotizacion,this.versionCotizacion).subscribe((resProductosExtras: any) => 
              {
                mapProductosExtras=mapProductosExtras.concat(resProductosExtras);
                this.canastaExtraService.getListProductosTrasporteExtras(this.idCotizacion,this.versionCotizacion).subscribe((resProductosTrasporteExtras: any) => 
                {
                  mapProductosExtras=mapProductosExtras.concat(resProductosTrasporteExtras);
                  this.canastaExtraService.getListTrenesExtras(this.idCotizacion,this.versionCotizacion).subscribe((resProductosTrenesExtras: any) => 
                  {
                    mapProductosExtras=mapProductosExtras.concat(resProductosTrenesExtras);
                    this.canastaExtraService.getListVuelosExtras(this.idCotizacion,this.versionCotizacion).subscribe((resProductosVuelosExtras: any) => 
                    {
                      mapProductosExtras=mapProductosExtras.concat(resProductosVuelosExtras);
                      this.canastaExtraService.getListOtroTrasladosExtras(this.idCotizacion,this.versionCotizacion).subscribe((resOtrosTrasladosExtras: any) => 
                      {
                        mapProductosExtras=mapProductosExtras.concat(resOtrosTrasladosExtras);
                        console.log(mapProductosExtras);
                        function naturalCompareExtras(a,  b ) 
                        {
                          if (a.tipo < b.tipo)
                            return -1;
                            
                          if(a.tipo == b.tipo)
                          {
                            if(a.fecha < b.fecha)
                              return -1;
                            else
                              return 1;
                          }
                          return 1;
                        }
                        mapProductosExtras.sort(naturalCompareExtras);
                        let prod= [];

                        for(let data of mapProductosExtras)
                          prod.push(data);  
                        this.mapProductosPorHojaExtraArreglo=[];
                        this.mapProductosPorHojaExtraArreglo.push(prod);
                          

                        this.vista.mapProductosExtras=mapProductosExtras;
                        console.log(this.mapProductosPorHojaExtraArreglo);
                      },
                      err => 
                      {
                        console.log(err);
                      });
                    },
                    err => 
                    {
                      console.log(err);
                    });
                  },
                  err => 
                  {
                    console.log(err);
                  });
                },
              err => 
              {
                console.log(err);
              });
    
              },
              err => 
              {
                console.log(err);
              });
            },
            err => 
            {
              console.log(err);
            });
          /*},
          err => 
          {
            console.log(err);
          });*/
        },
        err => 
        {
          console.log(err);
        });
        
      },
      err => 
      {
        console.log(err);
      });
      if(this.nuevo==0)
      {
        this.cotizacionesService.existeItinerarioAuxiliar(this.idCotizacion).subscribe((res: any) => 
        {
          console.log("existeItinerarioAuxiliar",res);

          for(let data of this.vista.mapProductos)
          {
            for(let datito of data[1])
            {
              for(let fila of res)
              {
                if(datito.id==fila.id && datito.tipo==fila.tipo)
                {

//        datos.push([this.idCotizacion,datito.id,datito.tipo,datito.fecha,datito.lugar,datito.texto,datito.hojaNuevaItinerario,datito.visible,datito.orden,datito.descripcion,datito.hojaNuevaDayByDay]);          

                  console.log(datito);
                  datito.texto=fila.texto;
                  datito.lugar=fila.lugar;
                  datito.hojaNuevaItinerario=fila.hojaNuevaItinerario;
                  datito.hojaNuevaDayByDay=fila.hojaNuevaDayByDay;
                  datito.cambioHojaNuevaTourExtra=fila.hojaNuevaTourExtra;
                  datito.visible=fila.visible;
                  datito.descripcion=fila.descripcion;
                  datito.orden=fila.orden;
                  this.mapTexto.set(datito.tipo+","+datito.id,datito.texto);

                }
              }
            }
          }
          for (let i = 0; i < this.vista.mapProductos.length; i++) 
            this.cambiaOrden(i,-1,0,-1);
          this.cambioHojaNuevaItinerario(-1,-1,0);
          this.cambioHojaNuevaDayByDay(-1,-1,0);
          this.cambioHojaNuevaTourExtra(-1,-1,0);
        },
        err => console.error(err)
        );
      }
      else
      {
        this.cambioHojaNuevaItinerario(-1,-1,0);
        this.cambioHojaNuevaDayByDay(-1,-1,0);
        this.cambioHojaNuevaTourExtra(-1,-1,0);

        //this.cambiaOrden(-1,-1,0,-1);
        this.mapProductosPorHojaArreglo= Array.from(mapProductos);
      this.mapProductosPorHojaItinerarioArreglo=[];
      this.mapProductosPorHojaItinerarioArreglo.push(Array.from(mapProductos));

      }
    },
    err => 
    {
      console.log(err);
    });
  }
  obtenerListaContinentesPaisesCiudades()
  {
    this.cotizacionesService.list_paises(this.idCotizacion).subscribe((res2: any) => 
    {
      this.lista_paises = res2;
      console.log(this.lista_paises);
      if(this.lista_paises.length>1)
      {
        console.log("lista_paises.length>1");
        this.cotizacionesService.list_ciudades (this.idCotizacion).subscribe((res4: any) => 
        {
          if(this.nuevo!=0)
            this.vista.lista_destinos="";
          for(let i = 0; i < res4.length; i++)
          {
            if(i==0)
            {
              if(this.nuevo==1)
              {
                this.vista.imagenItinerarioFinalSeleccionada=res4[0]['id'];
              }
            }
            if(this.nuevo!=0)
            {
              if(i)
                this.vista.lista_destinos += ' - '
              this.vista.lista_destinos += res4[i]['nombre'];
            }
            this.imagenesPrincipales.push(res4[i]);
          }
          this.cotizacionesService.listImagenesCiudadesPortada(this.idCotizacion).subscribe((res5: any) => 
          {
            this.vista.listaImagenesCiudadesPortada=res5;
            if(this.nuevo!=0)
              this.vista.imagenPrincipalSeleccionada=res5[0].idCiudad+"_"+res5[0].num;
            this.cotizacionesService.listImagenesCiudadesEvento(this.idCotizacion).subscribe((res6: any) => 
            {
              this.vista.listaImagenesCiudadesEvento=res6;
              if(this.nuevo!=0)
                this.vista.imagenEventoSeleccionada=res6[0].idCiudad+"_"+res6[0].num;
              this.cotizacionesService.listImagenesCiudadesDaybyday(this.idCotizacion).subscribe((res7: any) => 
              {
                this.vista.listaImagenesCiudadesDaybyday=res7;
                this.vista.imagenDaybydaySeleccionada=res7[0].idCiudad+"_"+res7[0].num;
                this.vista.imagenFinSeleccionada =res7[0].idCiudad+"_"+res7[0].num;
                this.obtenerCanasta();
              },
              err => 
              {
                console.log(err);
              });
            },
            err => 
            {
              console.log(err);
            });
          },
          err => 
          {
            console.log(err);
          });
        },
        err => 
        {
          console.log(err);
        });
        if(this.nuevo!=0)
        {       
          this.vista.titulo = '';
          this.cotizacionesService.list_continentes (this.idCotizacion).subscribe((res3: any) => 
          {
            this.lista_continentes = res3;
            for(let i = 0; i < this.lista_continentes.length; i++)
            {
              if(i)
                this.vista.titulo += ' & '
              this.vista.titulo += this.lista_continentes[i]['nombre'];
            }
          },
          err => 
          {
            console.log(err);
          });
        }
      }
      else
      {
        console.log("lista_paises.length==1");
        console.log(this.nuevo);
        if(this.nuevo!=0)
          this.vista.titulo=this.lista_paises[0]['nombre'];
        this.cotizacionesService.list_ciudades (this.idCotizacion).subscribe((res4: any) => 
        {
          if(this.nuevo!=0)
            this.vista.lista_destinos="";
          for(let i = 0; i < res4.length; i++)
          {
            if(i==0)
            {
              if(this.nuevo==1)
              {
                this.vista.imagenItinerarioFinalSeleccionada=res4[0]['id'];

              }
            }
            if(this.nuevo!=0)
            {
              if(i)
                this.vista.lista_destinos += ' - '
              this.vista.lista_destinos += res4[i]['nombre'];
            }
            this.imagenesPrincipales.push(res4[i]);
          }
          this.cotizacionesService.listImagenesCiudadesPortada(this.idCotizacion).subscribe((res5: any) => 
          {
            this.vista.listaImagenesCiudadesPortada=res5;
            if(this.nuevo!=0)
              this.vista.imagenPrincipalSeleccionada=res5[0].idCiudad+"_"+res5[0].num;    
            this.cotizacionesService.listImagenesCiudadesEvento(this.idCotizacion).subscribe((res6: any) => 
            {
              this.vista.listaImagenesCiudadesEvento=res6;
              if(this.nuevo!=0)
                this.vista.imagenEventoSeleccionada=res6[0].idCiudad+"_"+res6[0].num;
                this.cotizacionesService.listImagenesCiudadesDaybyday(this.idCotizacion).subscribe((res7: any) => 
                {
                  this.vista.listaImagenesCiudadesDaybyday=res7;
                //   this.vista.imagenDaybydaySeleccionada=res7[0].idCiudad+"_"+res7[0].num;
                //   this.vista.imagenFinSeleccionada =res7[0].idCiudad+"_"+res7[0].num;
                  this.obtenerCanasta();
                },
                err => 
                {
                  console.log(err);
                });
            },
            err => 
            {
              console.log(err);
            });

          },
          err => 
          {
            console.log(err);
          });



          this.obtenerCanasta();
          },
          err => 
          {
            console.log(err);
          });
        }
      },
      err => 
      {
        console.log(err);
      });
    }
    mostrarEstrellas(cadena)
    {
      cadena=cadena+"";
      var estrellitas = cadena.split("."); 
      let n=estrellitas.length;
      let nEstrellas=estrellitas[0][0];
      let res="";
      for (let i = 0; i<nEstrellas; i++) 
      {
        if(i)
          res+=" ";
        res += "star";
      }
      if(n==2)
        res+=" star_half";
     
      return res;

    }
    calcularNoches(fechaF,fechaI)
    {
      let fecha1 = new Date(fechaI);
      let fecha2 = new Date(fechaF);
      let resta = fecha2.getTime()-fecha1.getTime();
      return Math.round(resta/(1000*60*60*24))+"";


    }
  ngOnInit() 
  {  
    this.numExtras=0;
    this.numTourOpcionales=0;
    this.numVuelos=0;
    this.numHotel=0;
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
        console.log("Inicio procesado: ",res);
        if(res==null)
          this.nuevo=1;
        else
          this.nuevo=0;
        if(this.nuevo==0)
        {
          this.vista.idCotizacion=res.idCotizacion;
          this.vista.nombreCliente=res.nombreCliente;
          this.vista.agencia=res.agencia;
          this.vista.idAgencia=res.idAgencia;
          this.vista.agente=res.agente;
          this.vista.correoAgente=res.correoAgente; 
          this.vista.evento=res.evento;
          this.vista.fecha=res.fecha;
          this.vista.lista_destinos=res.listaDestinos;
          this.vista.noches=res.noches;
          this.vista.periodo=res.periodo;
          this.obtenerListaContinentesPaisesCiudades();
          this.vista.imagenPrincipalAuxiliar=res.imagenAuxiliar;
          if(res.imagenAuxiliar==1)
            this.estadoGuiaPortada=1;
          this.vista.imagenPrincipalSeleccionada=res.imagenSeleccionada;
          this.vista.imagenEventoAuxiliar=res.imagenEventoAuxiliar;
          if(res.imagenEventoAuxiliar==1)
            this.estadoGuiaEvento=1;
          this.vista.imagenEventoSeleccionada=res.imagenEventoSeleccionada;
          this.vista.imagenDaybydayAuxiliar=res.imagenDaybydayAuxiliar;
          this.vista.imagenFinAuxiliar=res.imagenFinAuxiliar;
          console.log("guiaDaybyday: ",this.guiaDaybyday);
          this.vista.imagenDaybydaySeleccionada=res.imagenDaybydaySeleccionada;
          console.log("Imagen dbd: ", res.imagenDaybydaySeleccionada);
          this.vista.imagenFinSeleccionada=res.imagenFinSeleccionada;
          this.vista.imagenItinerarioFinalAuxiliar=res.imagenItinerarioFinalAuxiliar;
          this.vista.imagenItinerarioFinalSeleccionada=res.imagenItinerarioFinalSeleccionada;
          this.vista.titulo=res.titulo;
          this.vista.divisa=res.divisa;
        }
        if(this.nuevo==1)
        {
            console.log("Entre otra opción de cargado");
          this.cotizacionesService.list_oneResumen(this.idCotizacion).subscribe((res1: any) => 
          {
            this.cotizacion = res1;
            this.vista.idCotizacion=this.idCotizacion;
            this.vista.version=this.versionCotizacion;
            this.vista.nombreCliente = res1['viajeroNombre']+" "+res1['viajeroApellido'];
            this.vista.agencia = res1['nombreAgencia'];
            this.vista.agente = res1['nombreAgente']+" "+res1['apellidosAgente'];
            this.fechaInicio = res1['fechaInicio'];
            this.fechaFin = res1['fechaFinal'];
            let fecha1 = new Date(this.fechaInicio);
            let fecha2 = new Date(this.fechaFin);
            let resta = fecha2.getTime()-fecha1.getTime();
            this.vista.noches= Math.round(resta/(1000*60*60*24))+"";
            this.noches = res1['noches'];
            this.vista.evento = res1['titulo'];
            this.vista.divisa= res1['divisa'];

            this.vista.idAgencia= res1['idAgencia'];
            this.vista.correoAgente=res1['correoAgente'];
            this.obtenerTituloFecha();
            this.obtenerListaContinentesPaisesCiudades();
          },
          err => 
          {
            console.log(err);
          }); 
        }    
      },
      err => 
      {
        console.log(err);
      });          
    });
  }
}
