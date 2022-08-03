import { Component, OnInit, PACKAGE_ROOT_URL } from '@angular/core';
import { Router } from '@angular/router';
import { ImagenesService } from './../../services/imagenes.service';
import { Divisa } from "../../../app/models/Divisa";
import { DivisasService } from "../../services/divisas.service";
import { DomSanitizer, ɵELEMENT_PROBE_PROVIDERS } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { AgentesService } from '../../services/agentes.service';
import { HotelesService } from '../../services/hoteles.service'
import { TrenesService } from '../../services/trenes.service'
import { VuelosService } from '../../services/vuelos.service'
import { ProductosService } from '../../services/productos.service'
import { ExtrasService } from '../../services/extras.service'
import { Notificacion } from '../../../app/models/Notificacion';
import { NotificacionesService } from '../../services/notificaciones.service';
import { ChoferService } from '../../services/chofer.service';
import { environment } from '../../../environments/environment';
import { PagoParcial } from '../../models/pagoParcial';
import { PagosParcialesService } from '../../finanzas/services/pagosParciales.service';
import Swal from "sweetalert2";
import { CONNREFUSED } from 'dns';
import { ExtrasInfo } from '../../models/ExtrasInfo';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

declare var $: any;
@Component({
  selector: 'app-gerente-compras',
  templateUrl: './gerente-compras.component.html',
  // styleUrls: ['./gerente-compras.component.css']

})
export class GerenteComprasComponent implements OnInit {

  expanded: boolean = false;
  expandedAgencias: boolean = false;
  expandedTipo: boolean = false;
  versionAmplia: boolean;
  public notificacion: Notificacion = new Notificacion();
  indicesFacturas: { [index: number]: any; } = {};
  fileToUpload: File = null;
  public divisas: Divisa[] = [];
  cssUrl: string;
  banderaPDF: number;
  extFact: string;

  lista_cotizaciones: any;
  lista_agencias: any;
  lista_tipo: any;

  lista_cotizacionesFiltro: any;
  lista_agenciasFiltro: any;
  lista_tipoFiltro: any;

  lista_productos: any;
  lista_productosMostrar: any;
  lista_productosAll: any;
  lista_productosSinFactura: any;
  liga: string = environment.API_URI;
  listaTraslados: any;
  pagoParcial: PagoParcial;
  idTrasladoAdquiridoActual: number;
  historialPagos: any;
  hitorialPagosTotal: any;
  cotizacionActual: number;
  cotizacionActualFactura: number;
  listaPorFacturar: any;
  idFacturaActual: any;
  mapFacturaPorProductos: Map<number, number[]> = new Map<number, number[]>();

  fechaFin: string = "";
  fechaIni: string = "";
  cambioFechaIni() {
    this.fechaIni = $('#fechaIni').val();
    console.log(this.fechaIni);
    this.actualizarPantallaInicial();
  }
  actualizarPantallaInicial() {
    this.choferService.listTrasladosAll15(this.fechaIni, this.fechaFin).subscribe((resTraslados: any) => {
      this.listaTraslados = resTraslados;
    }, err => console.error(err));
    this.agentesService.listCotizacionesAprobadas().subscribe((resCotizaciones: any) => {
      this.getDivisas();
      this.lista_cotizaciones = resCotizaciones;
      this.lista_cotizacionesFiltro = [];
      this.lista_agenciasFiltro = [];
      this.lista_tipoFiltro = [];
      for (let data of this.lista_cotizaciones)
        this.lista_cotizacionesFiltro.push(true);
      if (this.lista_cotizacionesFiltro.length > 0) {
        this.cotizacionActual = this.lista_cotizaciones[0].idCotizacion;
        this.agentesService.listCotizacionAprobadasProductosSinFactura(this.cotizacionActual, this.fechaIni, this.fechaFin).subscribe((resProductos: any) => {
          this.lista_productosSinFactura = resProductos;
          for (let data of this.lista_productosSinFactura)
          {
            if(data.tipo==2)
              data.tipo=3;
          }

          
        }, err => console.error(err));
        let res = []
        for (let data of this.lista_cotizaciones)
          res.push(data.idCotizacion);
        this.agentesService.listCotizacionesAprobadasProductos(res, this.fechaIni, this.fechaFin).subscribe((resCotizacionesProductos: any) => {
          this.lista_productos = resCotizacionesProductos;
          this.lista_productosMostrar = resCotizacionesProductos;
          this.lista_productosAll = resCotizacionesProductos;
          console.log(this.lista_productosMostrar);
        }, err => console.error(err));
      }
    }, err => console.error(err));
  }
  cambioFechaFin() {
    this.fechaFin = $('#fechaFin').val();
    console.log(this.fechaFin);
    this.actualizarPantallaInicial();

  }
  getDia(dia: any) {
    return dia < 10 ? '0' + dia : '' + dia;
  }
  constructor(private agentesService: AgentesService,
    private choferService: ChoferService,
    private route: ActivatedRoute,
    private pagosParcialesService: PagosParcialesService,
    private router: Router,
    private imagenesService: ImagenesService,
    private divisasService: DivisasService,
    private hotelesService: HotelesService,
    private trenesService: TrenesService,
    private vuelosService: VuelosService,
    private extrasService: ExtrasService,
    private productosService: ProductosService,
    private notificacionesService: NotificacionesService,
    public sanitizer: DomSanitizer) {
    let hoy = new Date();
    let quince = new Date();
    quince.setDate(quince.getDate() + 45);
    this.fechaIni = hoy.getFullYear() + '-' + this.getDia(hoy.getMonth() + 1) + '-' + this.getDia(hoy.getDate());
    this.fechaFin = quince.getFullYear() + '-' + this.getDia(quince.getMonth() + 1) + '-' + this.getDia(quince.getDate());
    this.pagoParcial = new PagoParcial();
    this.cotizacionActual = -1;
    this.versionAmplia = true;
    this.cssUrl = 'assets/css/gerente-compras.component-amplio.css';

  }

  getDivisas() {

    this.divisasService.getAll().subscribe((resp: Divisa[]) => {
      this.divisas = resp;
    });

  }
  darLiga() {
    return this.liga + "/pdf/5_1.pdf";
  }
  darLigaOrden() {
    return this.liga + "/pdfOrdenCompra/5.pdf";
  }
  /* 
  Todo lo refenete a las facturas y el diccionario
   */
  getInfoProductos(producto) {
    console.log("getInfoProductos",producto);
    console.log(this.lista_productosAll);
    let dato = this.lista_productosAll.filter(element => element.tipoProducto == producto.tipo);
    console.log(dato);
    let datoFinal=0;
    if (producto.tipo == 8)
      datoFinal = dato.filter(element => element.idExtrasInfo == producto.productoInfo);
    else  if (producto.tipo == 5)
      datoFinal = dato.filter(element => element.idVueloInfo == producto.productoInfo);
    else  if (producto.tipo == 6)
      datoFinal = dato.filter(element => element.idTrenInfo == producto.productoInfo);
    else  if (producto.tipo == 4)
      datoFinal = dato.filter(element => element.idHotelesAdquiridosInfo == producto.productoInfo);
    else  if (producto.tipo == 7)
      datoFinal = dato.filter(element => element.idProductosAdquiridosInfo == producto.productoInfo);
    else
      datoFinal = dato.filter(element => element.idTrasladoAdquiridoInfo == producto.productoInfo);

    if (producto.tipo == 8)
    {
      datoFinal[0].idTrasladoAdquirido = datoFinal[0].idExtra;

    }
    else if (producto.tipo == 5)
      datoFinal[0].idTrasladoAdquirido = datoFinal[0].idVuelo;
    else if (producto.tipo == 6)
      datoFinal[0].idTrasladoAdquirido = datoFinal[0].idTren;
    else if (producto.tipo == 7)
      datoFinal[0].idTrasladoAdquirido = datoFinal[0].idProductoAdquirido;
    else (producto.tipo == 4)
      datoFinal[0].idTrasladoAdquirido = datoFinal[0].idHotelAdquirido;

      console.log("datoFinal[0]",datoFinal[0]);
    return datoFinal[0];

  }
  estaSeleccionado(producto) {
    if (this.listaPorFacturar == undefined)
      return "";
    let dato = this.listaPorFacturar.filter(element => element == producto);
    if (dato.length == 1)
      return "checked";
    return "";
  }
  cambioFactura(producto, estado) {
    console.log("cambioFactura");
    let prod = [];


    //if (estado.checked) 
    {
      let prod = [];
      let bandera = false;
      if (this.mapFacturaPorProductos.get(this.lista_productosSinFactura[producto].idCotizacion) == undefined) {
        prod = [];
      }
      else {
        prod = this.mapFacturaPorProductos.get(this.lista_productosSinFactura[producto].idCotizacion);
        console.log(prod);
        if (prod.filter(element => element.productoInfo == this.lista_productosSinFactura[producto].idInfo).length > 0) {
          bandera = true;
          prod = prod.filter(element => element.productoInfo !== this.lista_productosSinFactura[producto].idInfo);
        }
      }
      if (bandera == false) {
        let dato = {
          "productoInfo": this.lista_productosSinFactura[producto].idInfo,
          "tipo": this.lista_productosSinFactura[producto].tipo
        }
        prod.push(dato);
      }
      this.mapFacturaPorProductos.set(this.lista_productosSinFactura[producto].idCotizacion, prod);
      this.listaPorFacturar = [];
      for (let data of this.mapFacturaPorProductos)
        for (let subdata of data[1])
          this.listaPorFacturar.push(subdata);
    }

  }
  /*******************************************************************************************************************************************/

  getColorFactura(factura) {
    if (factura == 1)
      return "icon-green";
    return "icon-red";
  }



  cambioCotizacion(opcion) {
    console.log("cambioCotizacion");
    this.cotizacionActual = opcion;
    let res = []
    if (opcion > 0) {
      res.push(parseInt(opcion));
      this.agentesService.listCotizacionAprobadasProductos(this.cotizacionActual).subscribe((resProductos: any) => {
        this.lista_productos = resProductos;
        this.lista_productosMostrar = resProductos;
      }, err => console.error(err));
    }
    else {
      let res = []
      for (let data of this.lista_cotizaciones)
        res.push(data.idCotizacion);
      this.agentesService.listCotizacionesAprobadasProductos(res, this.fechaIni, this.fechaFin).subscribe((resCotizacionesProductos: any) => {
        this.lista_productos = resCotizacionesProductos;

      }, err => console.error(err));
    }
  }
  darColor(tipo) {
    if (tipo == 2 || tipo == 4)
      return "orange"
    if (tipo == 3 || tipo == 5)
      return "blue"
    return "red";
  }
  darIcono(tipo) {
    if (tipo == 2 || tipo == 4)
      return "markunread"
    if (tipo == 3 || tipo == 5)
      return "mail_outline"
    return "ac_unit";
  }
  darMes(mes) {
    if (mes == 1)
      return "enero";
    if (mes == 2)
      return "febrero";
    if (mes == 3)
      return "marzo";
    if (mes == 4)
      return "abril";
    if (mes == 5)
      return "mayo";
    if (mes == 6)
      return "junio";
    if (mes == 7)
      return "julio";
    if (mes == 8)
      return "agosto";
    if (mes == 9)
      return "septiembre";
    if (mes == 10)
      return "octubre";
    if (mes == 11)
      return "noviembre";
    if (mes == 12)
      return "diciembre";

  }
  cambioRadio(opcion) {
    console.log(opcion);
    if (opcion == 1)
      $('#proximoPago').attr('disabled', true);
    else
      $('#proximoPago').attr('disabled', false);

  }
  darFecha(fechita) {
    var date = new Date(fechita);
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return day + " de " + this.darMes(monthIndex + 1);
  }
  modalSumar(idProductoCosto: any) {

    $('#modalSumar').modal({ dismissible: false });
    $('#modalSumar').modal('open');
    this.pagoParcial.idProductoCosto = idProductoCosto;
    let hoy = new Date();
    this.pagoParcial.fecha = hoy.getFullYear() + '-' + ((hoy.getMonth() + 1) < 10 ? '0' + (hoy.getMonth() + 1) : '' + (hoy.getMonth() + 1)) + '-' + (hoy.getDate() < 10 ? '0' + hoy.getDate() : '' + hoy.getDate());
    console.log(this.pagoParcial);
  }
  modalSubirFactura() {
    $('#modalSubirFactura').modal({ dismissible: false });
    $('#modalSubirFactura').modal('open');

  }
  getFileBlob(file) {
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
  cargarFactura() {
    this.banderaPDF = 0;
    console.log("actualizarFactura");
    console.log(this.listaPorFacturar, this.idFacturaActual, this.extFact);
    console.log(this.listaPorFacturar);
    this.agentesService.actualizarFactura(this.listaPorFacturar, this.idFacturaActual, this.extFact).subscribe(res => {
      this.actualizarPantallaInicial();
      this.extFact = "";
      this.listaPorFacturar = [];
      this.lista_productosSinFactura = [];
      this.mapFacturaPorProductos.clear();


    }, err => console.error(err));


  }
  cargandoPDF(files: FileList, tmp: any) {
    this.banderaPDF = 0;
    this.fileToUpload = files.item(0);
    var cadena = files[0].name.split(".").pop();
    this.extFact = cadena;
    console.log(this.extFact);

    tmp.value = '';
    let imgPromise = this.getFileBlob(this.fileToUpload);
    imgPromise.then(blob => {
      console.log("imgPromise");
      this.banderaPDF = 1;

      this.imagenesService.guardarFactura(this.extFact, blob).subscribe(
        (res: any) => {
          console.log("respuesta");

          console.log(res);
          this.idFacturaActual = res;
          Swal.fire({
            position: "center",
            icon: "success",
            title: `Factura subido exitosamente`,
            showConfirmButton: false,
            timer: 1500,
          });
        },
        err => console.error(err));


    })

  }
  modalMostrar(idTrasladoAdquiridoInfo: any) {

    this.idTrasladoAdquiridoActual = idTrasladoAdquiridoInfo;
    this.pagosParcialesService.historialPorProducto(idTrasladoAdquiridoInfo).subscribe((res5: any) => {
      this.historialPagos = res5;
      this.hitorialPagosTotal = [];
      for (let pagos of this.historialPagos.historialPagos)
        this.hitorialPagosTotal.push(pagos.suma);


      $('#modalMostrar').modal({ dismissible: false });
      $('#modalMostrar').modal('open');
    },
      err => {
        console.log(err);
      });

  }

  agregarPagoParcial() {
    console.log(this.pagoParcial);
    console.log(this.pagoParcial.pagoParcial);
    if (this.pagoParcial.pagoParcial == undefined)
      this.pagoParcial.pagoParcial = 0;
    this.pagosParcialesService.create(this.pagoParcial).subscribe(res => {
      this.notificacion = new Notificacion();
      this.notificacion.receptor = 19;
      this.notificacion.asunto = "Recibo de pago parcial";
      this.notificacion.tipo = 1;
      this.notificacion.prioridad = 3;
      this.notificacion.estatus = 0;
      this.notificacion.caducidad = "3";
      this.notificacion.data.IdProductoCosto = this.pagoParcial.idProductoCosto;
      this.notificacion.data.idProductosCostosParciales = res;
      this.notificacion.data.tarea = 'Se hizo un pago del traslado ' + this.pagoParcial.idProductoCosto;
      this.notificacion.emisor = 4;
      this.notificacionesService.create(this.notificacion, 2).subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'Notificación enviada a finanzas',
          showConfirmButton: false,
          timer: 2000
        });

        this.actualizarPantallaInicial();
      });
    }, err => console.error(err));

  }
  estado(estado) {
    if (estado == 2)
      return "done";//check_circle
    else if (estado == 3)
      return "close";//highlight_off
    return "help"; //help_outline

  }
  getColorEstado(estado) {
    if (estado == 2)
      return "icon-green";
    else if (estado == 3)
      return "icon-red";
    return "icon-black"
  }
  estadoParaGerenteCompras(aceptado, rechazado) {
    if (aceptado == 1)
      return "done";//check_circle
    else if (rechazado == 1)
      return "close";//highlight_off
    return "close"; //help_outline

  }
  diasAntes(fechita) {
    let hoy = new Date();
    let fecha = new Date(fechita)
    var utc1 = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    var utc2 = Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    var MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
    return Math.floor((utc2 - utc1) / MILISENGUNDOS_POR_DIA);
  }
  darMesCorto(mes) {
    if (mes == 1)
      return "ENE";
    if (mes == 2)
      return "FEB";
    if (mes == 3)
      return "MAR";
    if (mes == 4)
      return "ABR";
    if (mes == 5)
      return "MAY";
    if (mes == 6)
      return "JUN";
    if (mes == 7)
      return "JUL";
    if (mes == 8)
      return "AGO";
    if (mes == 9)
      return "SEP";
    if (mes == 10)
      return "OCT";
    if (mes == 11)
      return "NOV";
    if (mes == 12)
      return "DIC";

  }
  obtenerMesFechaCompleta(fechita) {
    var cadena = fechita.split("-", 3);
    return cadena[2] + " " + this.darMesCorto(cadena[1]);
  }
  darTipo(tipo) {
    if (tipo == 1)
      return "T";
    if (tipo == 2)
      return "T";
    if (tipo == 3)
      return "OT";
    if (tipo == 4)
      return "H";
    if (tipo == 5)
      return "V";
    if (tipo == 6)
      return "R";
    if (tipo == 7)
      return "TT"
    if (tipo == 8)
      return "E";
  }
  infoDesde(datos) {
    if (datos.tipoDesde == 1) //Aeropuerto
      return 'Aeropuerto';
    if (datos.tipoDesde == 2) //Hotel
      return 'Hotel';
    else if (datos.tipoDesde == 3) //Dir específica
      return 'Dirección específica';
    else if (datos.tipoDesde == 4) // Estación de tren
      return 'Estación de tren';
    else
      return 'Muelle';
  }
  infoHacia(datos) {
    if (datos.tipoHacia == 1) //Aeropuerto
      return 'Aeropuerto';
    if (datos.tipoHacia == 2) //Hotel
      return 'Hotel';
    else if (datos.tipoHacia == 3) //Dir específica
      return 'Dirección específica';
    else if (datos.tipoHacia == 4) // Estación de tren
      return 'Estación de tren';
    else
      return 'Muelle';
  }
  onEnterHotel(idHotelesAdquiridosInfo, valor) {
    console.log("onEnter", idHotelesAdquiridosInfo, valor);
    let hoy = new Date();
    let fecha = hoy.getFullYear() + '-' + this.getDia(hoy.getMonth() + 1) + '-' + this.getDia(hoy.getDate());
    let dato = {
      "idHotelesAdquiridosInfo": idHotelesAdquiridosInfo,
      "empresa": valor,
      "fecha": fecha
    };
    this.hotelesService.agregarEmpresa(dato).subscribe(
      (res: any) => {
        console.log("respuesta");
        console.log(res);
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Empresa actualizada`,
        });


      },
      err => console.error(err));
  }
  onEnterProductos(idProductoAdquiridoInfo, valor) {
    console.log("onEnter", idProductoAdquiridoInfo, valor);
    let hoy = new Date();
    let fecha = hoy.getFullYear() + '-' + this.getDia(hoy.getMonth() + 1) + '-' + this.getDia(hoy.getDate());
    let dato = {
      "idProductoAdquiridoInfo": idProductoAdquiridoInfo,
      "empresa": valor,
      "fecha": fecha
    };
    this.productosService.agregarEmpresa(dato).subscribe(
      (res: any) => {
        console.log("respuesta");
        console.log(res);
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Empresa actualizada`,
        });


      },
      err => console.error(err));
  }
  onEnterVuelo(idVueloInfo, valor) {
    console.log("onEnter", idVueloInfo, valor);

    let hoy = new Date();
    let fecha = hoy.getFullYear() + '-' + this.getDia(hoy.getMonth() + 1) + '-' + this.getDia(hoy.getDate());
    let dato = {
      "idVueloInfo": idVueloInfo,
      "empresa": valor,
      "fecha": fecha
    };
    this.vuelosService.agregarEmpresa(dato).subscribe(
      (res: any) => {
        console.log("respuesta");
        console.log(res);
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Empresa actualizada`,
        });


      },
      err => console.error(err));

  }
  onEnterTren(idTrenInfo, valor) {
    console.log("onEnter", idTrenInfo, valor);

    let hoy = new Date();
    let fecha = hoy.getFullYear() + '-' + this.getDia(hoy.getMonth() + 1) + '-' + this.getDia(hoy.getDate());
    let dato = {
      "idTrenInfo": idTrenInfo,
      "empresa": valor,
      "fecha": fecha
    };
    this.trenesService.agregarEmpresa(dato).subscribe(
      (res: any) => {
        console.log("respuesta");
        console.log(res);
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Empresa actualizada`,
        });


      },
      err => console.error(err));

  }
  onEnterExtras(idExtrasInfo, valor) {
    console.log("onEnter", idExtrasInfo, valor);

    let hoy = new Date();
    let fecha = hoy.getFullYear() + '-' + this.getDia(hoy.getMonth() + 1) + '-' + this.getDia(hoy.getDate());
    let dato = {
      "idExtrasInfo": idExtrasInfo,
      "empresa": valor,
      "fecha": fecha
    };
    console.log(dato);
    this.extrasService.agregarEmpresa(dato).subscribe(
      (res: any) => {
        console.log("respuesta");
        console.log(res);
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Empresa actualizada`,
        });


      },
      err => console.error(err));

  }
  showCheckboxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (!this.expanded) {
      checkboxes.style.display = "block";
      this.expanded = true;
    }
    else {
      checkboxes.style.display = "none";
      this.expanded = false;
    }
  }
  showCheckboxesAgencias() {
    var checkboxesAgencias = document.getElementById("checkboxesAgencias");
    if (!this.expandedAgencias) {
      checkboxesAgencias.style.display = "block";
      this.expandedAgencias = true;
    }
    else {
      checkboxesAgencias.style.display = "none";
      this.expandedAgencias = false;
    }
  }
  showCheckboxesTipo() {
    var checkboxesTipo = document.getElementById("checkboxesTipo");
    if (!this.expandedTipo) {
      checkboxesTipo.style.display = "block";
      this.expandedTipo = true;
    }
    else {
      checkboxesTipo.style.display = "none";
      this.expandedTipo = false;
    }
  }
  existeCotParaFiltro(A, item) {
    let dato = A.filter(element => element == item);
    if (dato.length > 0)
      return 1;
    return 0;
  }
  existeAgenciaParaFiltro(A, item) {
    let dato = A.filter(element => element == item);
    if (dato.length > 0)
      return 1;
    return 0;
  }
  existeTipoParaFiltro(A, item) {
    let dato = A.filter(element => element == item);
    if (dato.length > 0)
      return 1;
    return 0;
  }
  cambioFiltroCotizaciones(index) {
    this.lista_cotizacionesFiltro[index] = !this.lista_cotizacionesFiltro[index];
    let cot = [], j;
    this.lista_agenciasFiltro = [];
    this.lista_tipoFiltro = [];
    for (let data of this.lista_agencias)
      this.lista_agenciasFiltro.push(true);
    for (let data of this.lista_tipo)
      this.lista_tipoFiltro.push(true);
    for (j = 0; j < this.lista_cotizaciones.length; j++)
      if (this.lista_cotizacionesFiltro[j] == true)
        cot.push(this.lista_cotizaciones[j].idCotizacion)
    this.lista_productosMostrar = [];
    for (j = 0; j < this.lista_productos.length; j++)
      if (this.existeCotParaFiltro(cot, this.lista_productos[j].idCotizacion) == 1)
        this.lista_productosMostrar.push(this.lista_productos[j]);
  }

  cambioFiltroAgencias(index) {
    this.lista_agenciasFiltro[index] = !this.lista_agenciasFiltro[index];
    let cot = [], j;
    this.lista_cotizacionesFiltro = [];
    this.lista_tipoFiltro = [];
    for (let data of this.lista_cotizaciones)
      this.lista_cotizacionesFiltro.push(true);
    for (let data of this.lista_tipo)
      this.lista_tipoFiltro.push(true);
    for (j = 0; j < this.lista_agencias.length; j++)
      if (this.lista_agenciasFiltro[j] == true)
        cot.push(this.lista_agencias[j].idAgencia)
    this.lista_productosMostrar = [];
    for (j = 0; j < this.lista_productos.length; j++)
      if (this.existeAgenciaParaFiltro(cot, this.lista_productos[j].idAgencia) == 1)
        this.lista_productosMostrar.push(this.lista_productos[j]);
  }
  cambioFiltroTipo(index) {
    this.lista_tipoFiltro[index] = !this.lista_tipoFiltro[index];
    let cot = [], j;
    this.lista_cotizacionesFiltro = [];
    this.lista_agenciasFiltro = [];
    for (let data of this.lista_cotizaciones)
      this.lista_cotizacionesFiltro.push(true);
    for (let data of this.lista_agencias)
      this.lista_agenciasFiltro.push(true);
    for (j = 0; j < this.lista_tipo.length; j++)
      if (this.lista_tipoFiltro[j] == true)
        cot.push(this.lista_tipo[j].tipoProducto)
    this.lista_productosMostrar = [];
    for (j = 0; j < this.lista_productos.length; j++)
      if (this.existeTipoParaFiltro(cot, this.lista_productos[j].tipoProducto) == 1)
        this.lista_productosMostrar.push(this.lista_productos[j]);
  }
  cambioAmplia() {
    console.log(this.cssUrl);
    this.cssUrl = (this.cssUrl === `assets/css/gerente-compras.component-amplio.css`) ? `assets/css/gerente-compras.component-reducido.css` : `assets/css/gerente-compras.component-amplio.css`;
    console.log(this.cssUrl);

    this.versionAmplia = !this.versionAmplia;
  }

  cambioCotizacionFactura(opcion) {
    console.log("cambioCotizacionFactura");
    this.cotizacionActualFactura = opcion;
    let res = []
    if (opcion > 0) {
      res.push(parseInt(opcion));
      this.agentesService.listCotizacionAprobadasProductosSinFactura(this.cotizacionActualFactura, this.fechaIni, this.fechaFin).subscribe((resProductos: any) => {
        this.lista_productosSinFactura = resProductos;
        console.log("this.lista_productosSinFactura",this.lista_productosSinFactura);

      }, err => console.error(err));
    }
  }
  ngOnInit(): void {
    this.idTrasladoAdquiridoActual = 0;
    $(document).ready(function () {
      $('.modal').modal({ dismissible: true });
    });
    this.choferService.listTrasladosAll15(this.fechaIni, this.fechaFin).subscribe((resTraslados: any) => {
      this.listaTraslados = resTraslados;
    }, err => console.error(err));
    this.agentesService.listCotizacionesAprobadas().subscribe((resCotizaciones: any) => {
      this.getDivisas();
      this.lista_cotizaciones = resCotizaciones;
      this.lista_cotizacionesFiltro = [];
      for (let data of this.lista_cotizaciones)
        this.lista_cotizacionesFiltro.push(true);
      if (this.lista_cotizacionesFiltro.length > 0) {
        this.cotizacionActual = this.lista_cotizaciones[0].idCotizacion;
        console.log(this.fechaIni, this.fechaFin);
        this.agentesService.listCotizacionAprobadasProductosSinFactura(this.cotizacionActual, this.fechaIni, this.fechaFin).subscribe((resProductos: any) => {
          this.lista_productosSinFactura = resProductos;
          console.log(this.lista_productosSinFactura)
          for (let data of this.lista_productosSinFactura)
          {
            if(data.tipo==2)
              data.tipo=3;
          }


        }, err => console.error(err));
        let res = []
        console.log("this.lista_cotizaciones", this.lista_cotizaciones);
        for (let data of this.lista_cotizaciones)
          res.push(data.idCotizacion);
        console.log(res);
        this.agentesService.listCotizacionesAprobadasProductos(res, this.fechaIni, this.fechaFin).subscribe((resCotizacionesProductos: any) => {
          console.log(resCotizacionesProductos);

          this.lista_productos = resCotizacionesProductos;
          this.lista_productosMostrar = resCotizacionesProductos;
          console.log(this.lista_productosMostrar);
          this.lista_productosAll = resCotizacionesProductos;
          this.lista_agencias = [];
          this.lista_tipo = [];
          this.lista_agenciasFiltro = [];
          this.lista_tipoFiltro = [];
          let Arreglo = [];
          let ArregloTipo = [];
          for (let data of this.lista_productos) {
            if (ArregloTipo.includes(data.tipoProducto) == false) {
              let datito =
              {
                "tipoProducto": data.tipoProducto
              }
              ArregloTipo.push(data.tipoProducto);
              this.lista_tipo.push(datito);
            }
            if (Arreglo.includes(data.nombreAgencia) == false) {
              let datito =
              {
                "idAgencia": data.idAgencia,
                "nombreAgencia": data.nombreAgencia
              }
              Arreglo.push(data.nombreAgencia);
              this.lista_agencias.push(datito);
            }
          }
          for (let data of this.lista_agencias)
            this.lista_agenciasFiltro.push(true);
          for (let data of this.lista_tipo)
            this.lista_tipoFiltro.push(true);
        }, err => console.error(err));
      }
    }, err => console.error(err));
  }
}
