import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as M from 'materialize-css/dist/js/materialize';
import Swal from 'sweetalert2';
import { Cotizacion } from 'src/app/models/Cotizacion';
import { DivisaBase } from 'src/app/models/DivisaBase';
import { DivisasService } from 'src/app/services/divisas.service';
import { PaisesService } from 'src/app/services/paises.service';
import { PusherService } from 'src/app/services/pusher.service';
import { Reembolso } from '../../models/Reembolso';
import { ProductosVentaService } from '../../services/productosVenta.service';
import { ReembolsosService } from '../../services/reembolsos.service';
import { PagosParcialesService } from 'src/app/services/pagos-parciales.service';
declare var $: any;

@Component({
  selector: 'app-productos-venta',
  templateUrl: './productos-venta.component.html',
  styleUrls: ['./productos-venta.component.css']
})
export class ProductosVentaComponent implements OnInit {

  public destinos: any[] = [];
  public cotizacion: any = new Cotizacion();
  public reembolso: any = new Reembolso();
  public divisa: DivisaBase = new DivisaBase();
  public comision5rives: number = 0;
  public comisionAgente: number = 0;
  public cantidadMXN: number = 0;
  public cantidadCom: number = 0;
  public holidaysInHotel: number = 0;
  public datesInHotel: string = '';
  public filtroActivo: number = 0;
  public productosCancelados: any = [];
  public totalGananciaEstimada: number = 0;
  public totalGananciaReal: number = 0;
  public totalPerdida: number = 0;
  public totalCostoC: number = 0;
  public totalPrecioC: number = 0;
  public totalComAgente: number = 0;
  public producto: any = {};
  public historialPagos: any[] = [];
  public indexDestino: number = 0;
  public indexProducto: number = 0;
  public porcentajeReembolso: number = 0;
  public reembolsoPorComision: boolean = true;
  public totalAReembolsar: number = 0;
  public tipoReembolso: number = 1;
  public calculoTarifa: number = 0;
  public calculoComision5: number = 0;
  public calculoComisionA: number = 0;
  public productoEliminado: number = 0;
  public costoNeto: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productosVentaService: ProductosVentaService,
    public reembolsosService: ReembolsosService,
    private pusherService: PusherService,
    private datePipe: DatePipe,
    private paisesService: PaisesService,
    private divisasService: DivisasService,
    private pagosParcialesService: PagosParcialesService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let idCotizacion = params['idCotizacion'];
      let version = params['version'];
      this.getProductosVenta(idCotizacion, version, 0);
    });
    $('select').formSelect();
  }

  getDivisaCotizacion(idDivisa: number){
    this.divisasService.divisaBase_getOne(idDivisa).subscribe((divisa: any) => {
      this.divisa = divisa;
      this.reembolso.cantidadMXN = this.reembolso.cantidadDivisa * this.divisa.valor;
    });
  }

  getProductosVenta(idCotizacion: number, version: number, filtro: number){
    this.productosVentaService.getProductosVenta(idCotizacion, version, filtro).subscribe((res: any) => {
      this.totalComAgente = 0;
      this.totalCostoC = 0;
      this.totalGananciaEstimada = 0;
      this.totalPerdida = 0;
      this.totalGananciaReal = 0;
      this.totalPrecioC = 0;
      this.destinos = res.destinos;
      this.cotizacion = res.cotizacion;
      this.destinos.forEach((destino, indexD) => {
        res.canasta.forEach(async(product: any) => {
          switch (product.tipo) {
            case 1:
              if (product.traslado === undefined || product.traslado.idCiudad !== destino.idCiudad) return false;
              destino.productos.push(product.traslado);
              product.traslado.id = product.traslado.idTrasladoAdquirido;
              product.traslado.type = 'Traslado';
              this.calcularPreciosComisiones(indexD, destino.productos.length - 1);
              break;
            case 2:
              if (product.disposicion === undefined || product.disposicion.idCiudad !== destino.idCiudad) return false;
              destino.productos.push(product.disposicion);
              product.disposicion.id = product.disposicion.idDisposicionAdquirida;
              product.disposicion.type = 'Disposición';
              this.calcularPreciosComisiones(indexD, destino.productos.length - 1);
              break;
            case 3:
              if (product.trasladoOtro === undefined || product.trasladoOtro.idCiudad !== destino.idCiudad) return false;
              destino.productos.push(product.trasladoOtro);
              product.trasladoOtro.id = product.trasladoOtro.idTrasladoOtro;
              product.trasladoOtro.type = 'Traslado Otro';
              this.calcularPreciosComisiones(indexD, destino.productos.length - 1);
              break;
            case 4:
              if (product.hotel === undefined || product.hotel.idDestino !== destino.idDestino) return false;
              destino.productos.push(product.hotel);
              product.hotel.id = product.hotel.idHotelAdquirido;
              product.hotel.type = 'Hotel';
              product.hotel.daysInHotel = Math.floor((new Date(product.hotel.checkOut).getTime() - new Date(product.hotel.checkIn).getTime()) / 1000 / 60 / 60 / 24);
              await this.getPais(new Date(product.hotel.checkIn), new Date(product.hotel.checkOut), destino.idPais);
              product.hotel.holidaysInHotel = this.holidaysInHotel;
              product.hotel.daysInHotel = (product.hotel.daysInHotel - this.holidaysInHotel);
              let tarifaBase: number = (product.hotel.cityTax + product.hotel.desayuno) * product.hotel.daysInHotel;
              let tarifaAlta: number = (product.hotel.cityTax + product.hotel.desayuno) * this.holidaysInHotel * 1.20;
              product.hotel.tarifa = (product.hotel.tarifa + tarifaBase + tarifaAlta);
              let i: number = destino.productos.findIndex(producto => producto.tipo === 4 && producto.idHotelAdquirido === producto.idHotelAdquirido);
              this.calcularPreciosComisiones(indexD, i);
              break;
            case 5:
              if (product.vuelo === undefined || product.vuelo.idDestino !== destino.idDestino) return false;
              destino.productos.push(product.vuelo);
              product.vuelo.id = product.vuelo.idVuelo;
              product.vuelo.type = 'Vuelo';
              this.calcularPreciosComisiones(indexD, destino.productos.length - 1);
              break;
            case 6:
              if (product.tren === undefined || product.tren.idDestino !== destino.idDestino) return false;
              destino.productos.push(product.tren);
              product.tren.id = product.tren.idTren;
              product.tren.type = 'Tren';
              this.calcularPreciosComisiones(indexD, destino.productos.length - 1);
              break;
            case 7:
              if (product.tourPie) {
                if (product.tourPie.idCiudad !== destino.idCiudad) return false;
                destino.productos.push(product.tourPie);
                product.tourPie.id = product.tourPie.idProductoAdquirido;
                product.tourPie.type = 'Tour privado a pie';
                this.calcularPreciosComisiones(indexD, destino.productos.length - 1);
              } else if (product.tourTransporte) {
                if (product.tourTransporte.idCiudad !== destino.idCiudad) return false;
                destino.productos.push(product.tourTransporte);
                product.tourTransporte.id = product.tourTransporte.idProductoAdquirido;
                product.tourTransporte.type = 'Tour privado en transporte';
                this.calcularPreciosComisiones(indexD, destino.productos.length - 1);
              } else if (product.tourGrupo) {
                if (product.tourGrupo.idCiudad !== destino.idCiudad) return false;
                destino.productos.push(product.tourGrupo);
                product.tourGrupo.id = product.tourGrupo.idProductoAdquirido;
                product.tourGrupo.type = 'Tour privado en grupo';
                this.calcularPreciosComisiones(indexD, destino.productos.length - 1);
              } else if (product.actividad) {
                if (product.actividad.idCiudad !== destino.idCiudad) return false;
                destino.productos.push(product.actividad);
                product.actividad.id = product.actividad.idProductoAdquirido;
                product.actividad.type = 'Actividad';
                this.calcularPreciosComisiones(indexD, destino.productos.length - 1);
              }
              break;
            case 8:
              if (product.extra === undefined || product.extra.idDestino !== destino.idDestino) return false;
              destino.productos.push(product.extra);
              product.extra.id = product.extra.idExtras;
              product.extra.type = `${product.extra.extras} (Producto extra)`;
              this.calcularPreciosComisiones(indexD, destino.productos.length - 1);
              break;
          }
        });
      });
      setTimeout(() => {
        $('.dropdown-trigger').dropdown({
          coverTrigger: false,
          constrainWidth: false
        });
      }, 0);
    }, err => console.log(err));
  }

  calcularPreciosComisiones(indexD: number, indexP: number){
    let producto = this.destinos[indexD].productos[indexP];
    this.costoNeto += producto.tarifa;
    producto.precioCotizado = this.calcularComision(producto.tarifa, producto.comision, producto.comisionAgente);
    producto.comAgente = producto.precioCotizado * (producto.comisionAgente / 100);
    this.totalComAgente += producto.comAgente;
    this.totalCostoC += producto.precioCotizado;
    if(producto.tipo === 4) producto.precioCotizado += producto.otros;
    producto.gananciaEstimada = this.round(producto.tarifa * (producto.comision / 100));
    this.totalGananciaEstimada += producto.gananciaEstimada;
    producto.perdida = this.round((producto.precioComprado + producto.gananciaEstimada) - (producto.tarifa + producto.gananciaEstimada));
    this.totalPerdida += producto.perdida;
    producto.gananciaReal = this.round(producto.gananciaEstimada - producto.perdida);
    this.totalGananciaReal += producto.gananciaReal;
    producto.precioComprado = producto.precioComprado > 0 ? producto.precioComprado + (producto.precioCotizado * (producto.comisionAgente / 100)) : 0;
    this.totalPrecioC += producto.precioComprado;
    let tarifaCom: number = this.round(producto.tarifa * (producto.comision / 100));
    let porcentaje: number = producto.gananciaReal * producto.comision;
    if(tarifaCom === 0 || tarifaCom === -0 && porcentaje === 0){
      producto.comisionGReal = 0;
    }else{
      producto.comisionGReal = this.round(porcentaje / tarifaCom);
    }
    producto.comisionPReal = this.round(producto.comision - producto.comisionGReal);
    if(producto.comision === 0 && producto.comisionAgente === 0){
      producto.comisionGReal = (producto.gananciaReal * 100) / producto.tarifa;
      producto.comisionPReal = (producto.perdida * 100) / producto.tarifa;
    }
  }

  calcularComision(tarifa: number, comision5r: number, comisionA: number){
    let comisionRives = (comision5r / 100);
    let comisionAgente = (comisionA / 100);
    let total = tarifa * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    return total;
  }

  cargarInfoReembolso(indexD: number, indexP: number){
    this.indexDestino = indexD;
    this.indexProducto = indexP;
    $('#modalReembolsarServicio').modal({ dismissible: false});
    $('#modalReembolsarServicio').modal('open');
    this.producto = this.destinos[indexD].productos[indexP];
    this.reembolso.cantidadNeta = this.producto.tarifa;
    this.reembolso.tipo = this.producto.tipo;
    this.reembolso.idProducto = this.producto.id;
    this.reembolso.reembolsoS = this.producto.type;
    this.reembolso.cantidadCotizada = this.calcularComision(this.reembolso.cantidadNeta, this.producto.comision, this.producto.comisionAgente);
    this.reembolso.cantidadDivisa = this.calcularComision(this.reembolso.cantidadNeta, this.producto.comision, this.producto.comisionAgente);
    this.totalAReembolsar = this.calcularComision(this.reembolso.cantidadNeta, this.producto.comision, this.producto.comisionAgente);
    this.reembolso.gananciaA = this.reembolso.cantidadCotizada * (this.producto.comisionAgente / 100);
    this.reembolso.ganancia5 = this.producto.tarifa * (this.producto.comision / 100);
    this.getDivisaCotizacion(this.cotizacion.idDivisaBase);
    setTimeout(() => { M.updateTextFields() }, 0);
  }

  verInfoReembolso(producto: any){
    $('#modalVerReembolso').modal();
    $('#modalVerReembolso').modal('open');
    this.producto = producto;
    this.reembolso = new Reembolso();
    this.productoEliminado = 0;
    producto.ganancia5 = this.producto.cantidadNeta * (this.producto.comision / 100);
    producto.gananciaA = this.calcularComision(producto.tarifa, producto.comision, producto.comisionAgente) * (this.producto.comisionAgente / 100);
    producto.cantidadDivisa = producto.precioCotizado;
    producto.cantidadDivisa -= (producto.ganancia5 + producto.gananciaA);
    let c5R = 100 - producto.com5R;
    let cAR = 100 - producto.comAR;
    let cT = 100 - producto.porcentaje;
    this.calculoComision5 = producto.ganancia5 * (c5R / 100);
    this.calculoComisionA = producto.gananciaA * (cAR / 100);
    this.calculoTarifa = producto.tarifa * (cT / 100);
    this.totalAReembolsar = (producto.ganancia5 * (producto.com5R / 100)) + (producto.gananciaA * (producto.comAR / 100)) + (producto.tarifa * (producto.porcentaje / 100));
  }

  tipoInput(valor: number, tipo: string){
    valor = !valor ? 0 : valor;
    switch(tipo){
      case 'montoComprado':
        this.calculoTarifa = 0;
        if(this.tipoReembolso === 1){
          this.calculoTarifa = (valor * 100) / this.producto.tarifa;
          this.reembolso.porcentaje = +this.calculoTarifa.toFixed(2);
        }else{
          this.calculoTarifa = this.producto.tarifa * (valor / 100);
          this.reembolso.porcentaje = valor;
        }
      break;
      case 'comision5':
        this.calculoComision5 = 0;
        if(this.tipoReembolso === 1){
          this.calculoComision5 = (valor * 100) / this.reembolso.ganancia5;
          this.reembolso.com5R = +this.calculoComision5.toFixed(2);
        }else{
          this.calculoComision5 = this.reembolso.ganancia5 * (valor / 100);
          this.reembolso.com5R = valor;
        }
      break;
      case 'comisionA':
        this.calculoComisionA = 0;
        if(this.tipoReembolso === 1){
          this.calculoComisionA = (valor * 100) / this.reembolso.gananciaA;
          this.reembolso.comAR = +this.calculoComisionA.toFixed(2);
        }else{
          this.calculoComisionA = this.reembolso.gananciaA * (valor / 100);
          this.reembolso.comAR = valor;
        }
      break;
    }
  }

  cambiarTipoReembolso(tipo: number){
    if(tipo != this.tipoReembolso && tipo === 1){
      this.tipoReembolso = 1;
      this.calculoTarifa = 0;
      this.calculoComision5 = 0;
      this.calculoComisionA = 0;
      this.reembolso.porcentaje = 0;
      this.reembolso.com5R = 0;
      this.reembolso.comAR = 0;
      $('.inputs').val('0');
    }

    if(tipo != this.tipoReembolso && tipo === 2){
      this.tipoReembolso = 2;
      this.calculoTarifa = 0;
      this.calculoComision5 = 0;
      this.calculoComisionA = 0;
      this.reembolso.porcentaje = 0;
      this.reembolso.com5R = 0;
      this.reembolso.comAR = 0;
      $('.inputs').val('0');
    }
  }

  agregarReembolso(){
    delete this.reembolso.gananciaA;
    delete this.reembolso.ganancia5;
    this.reembolso.idCotizacion = this.cotizacion.idCotizacion;
    this.reembolso.fecha = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.reembolso.concepto = this.reembolso.concepto.trim() === '' ? 'N/A' : this.reembolso.concepto;
    this.reembolsosService.create(this.reembolso).subscribe(reembolso => {
      this.destinos[this.indexDestino].productos.splice(this.indexProducto, 1);
      this.producto.cantidadMXN = 0;
      this.producto.cantidadDivisa = 0;
      this.reembolso = reembolso;
      this.actualizarEstadoProducto(this.producto.id, this.producto.tipo, this.productoEliminado ? 100 : 2);
      $('#modalReembolsarServicio').modal('close');
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Reembolso agregado correctamente",
        backdrop: false,
        showConfirmButton: false,
        timer: 1500,
      });
    });
  }

  actualizarEstadoProducto(idProducto: number, tipo: number, estado: number, reembolsable?: boolean){
    let primaryKey: string = '';
    let tabla: string = '';
    switch (tipo) {
      case 1:
        primaryKey = 'idTrasladoAdquirido';
        tabla = 'trasladosadquiridos';
        break;
      case 2:
        primaryKey = 'idDisposicionAdquirida';
        tabla = 'disposicionesadquiridas';
        break;
      case 3:
        primaryKey = 'idTrasladoOtro';
        tabla = 'trasladosotros';
        break;
      case 4:
        primaryKey = 'idHoteAdquirido';
        tabla = 'hotelesadquiridos';
        break;
      case 5:
        primaryKey = 'idVuelo';
        tabla = 'vuelos';
        break;
      case 6:
        primaryKey = 'idTren';
        tabla = 'trenes';
        break;
      case 7:
      case 71:
      case 72:
      case 73:
      case 74:
        primaryKey = 'idProductoAdquirido';
        tabla = 'productosadquiridos';
        break;
      case 8:
        primaryKey = 'idExtras';
        tabla = 'extras';
        break;
    }
    if(reembolsable){
      Swal.fire({
        title: `¿Esta seguro de cambiar el estado de este servicio a reembolsable?`,
        showCancelButton: true,
        cancelButtonText: 'No, volver',
        confirmButtonText: `Si, continuar`,
        confirmButtonColor: '#1b5e20',
        backdrop: false
      }).then((result) => {
        if(result.isConfirmed){
          this.productosVentaService.actualizarEstadoProducto(idProducto, tabla, primaryKey, estado).subscribe(res => {
            this.destinos.forEach(destino => {
              let index = destino.productos.findIndex(producto => producto.id == idProducto && producto.tipo == tipo);
              if(index >= 0) destino.productos.splice(index, 1);
            });
            Swal.fire({
              position: "center",
              icon: "success",
              title: "El cambio de estado se realizó correctamente",
              backdrop: false,
              showConfirmButton: false,
              timer: 1500,
            });
          });
        }
      });
    }else{
      this.productosVentaService.actualizarEstadoProducto(idProducto, tabla, primaryKey, estado).subscribe(res => {
      });
    }
  }

  filtrarProductos(filtro: string){
    this.getProductosVenta(this.cotizacion.idCotizacion, this.cotizacion.version, parseInt(filtro));
    this.filtroActivo = parseInt(filtro);
  }

  navegar(){
    this.router.navigate(['/finanzas/detalle-venta', this.cotizacion.idCotizacion]);
  }

  getPais(checkIn: Date, checkOut: Date, idPais: number){
    return new Promise<void>((resolve, reject) => {
      this.paisesService.listOne(idPais).subscribe((pais: any) => {
        if(pais[0] && pais[0].diasAltos !== ''){
          this.calcularTarifaDiasAltos(checkIn, checkOut, pais[0]);
          resolve();
        }else{
          resolve();
        }
      });
    });
  }

  calcularTarifaDiasAltos(checkIn: Date, checkOut: Date, pais: any){
    let holidaysArray: string[] = pais.diasAltos.split(',');
    let datesInHotelArray: string[] = [];
    this.datesInHotel = '';
    while(checkIn.getTime() < checkOut.getTime()){
      this.rangeConditionals(checkIn);
      checkIn.setDate(checkIn.getDate() + 1);
    }
    datesInHotelArray =  this.datesInHotel.split(',');
    this.holidaysInHotel = 0;
    datesInHotelArray.forEach((date) => {
      if(holidaysArray.includes(date)){
        this.holidaysInHotel++;
      }
    });
  }

  rangeConditionals(desde: any){
    if((desde.getMonth() + 1) < 10){
      var month = '0' + (desde.getMonth() + 1);
    }else{
      month = (desde.getMonth() + 1);
    }
    if(this.datesInHotel){
      this.datesInHotel += ',' + desde.getFullYear() + '-' + month + '-' + desde.getDate();
    }else{
      this.datesInHotel += desde.getFullYear() + '-' + month + '-' + desde.getDate();
    }
  }

  round(num: number) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
  }

  cargarInfoCompra(producto: any){
    if(producto.idProductoCosto > 0){
      this.pagosParcialesService.historialPorProducto(producto.idProductoCosto).subscribe((data: any) => {
        this.historialPagos = data.historialPagos;
      });
    }else{
      this.historialPagos = [];
    }
    $('#modalInfoCompra').modal({ dismissible: false });
    $('#modalInfoCompra').modal('open');
  }

  reembolsable(){

  }

  cambiarEstadoEliminacion(valor: number){
    this.productoEliminado = valor;
    this.reembolso.eliminado = valor;
  }

  // reanudarProducto(producto: any){
  //   Swal.fire({
  //     title: `¿Esta seguro de reanudar este producto?`,
  //     showCancelButton: true,
  //     cancelButtonText: 'No, volver',
  //     confirmButtonText: `Si, continuar`,
  //     confirmButtonColor: '#1b5e20',
  //     backdrop: false
  //   }).then((result) => {
  //     if(result.isConfirmed){
  //       this.actualizarEstadoProducto(producto.id, producto.tipo, 2);
  //     }
  //   });
  // }

}
