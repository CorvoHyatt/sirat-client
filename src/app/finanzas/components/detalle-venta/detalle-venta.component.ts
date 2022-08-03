import { DatePipe } from '@angular/common';
import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as M from 'materialize-css/dist/js/materialize';
import Swal from 'sweetalert2';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ComisionPagada } from '../../models/ComisionPagada';
import { Pago } from '../../models/Pago';
import { Reembolso } from '../../models/Reembolso';
import { PagosService } from '../../services/pagos.service';
import { ReembolsosService } from '../../services/reembolsos.service';
import { ComisionesPagadasService } from '../../services/comisionesPagadas.service';
import { OrdenCompraService } from 'src/app/services/orden-compra.services';
import { PusherService } from 'src/app/services/pusher.service';
import { ProductosExtrasConciergeService } from 'src/app/services/productosExtrasConcierge.service';
import { DivisasService } from 'src/app/services/divisas.service';
import { DivisaBase } from 'src/app/models/DivisaBase';
import { environment } from 'src/environments/environment';
import { ArchivosFacturasService } from '../../services/archivosFacturas.service';
import { PagosParcialesService } from '../../services/pagosParciales.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/models/Usuario';
import { HelperService } from 'src/app/finanzas/services/helper.service';
declare var $: any;

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.css'],
  providers: [HelperService]
})
export class DetalleVentaComponent implements OnInit, DoCheck {

  public destinos: any[] = [];
  public cotizacion: any;
  public pago: any = new Pago();
  public pagos: any[] = [];
  public reembolso: any = new Reembolso();
  public reembolsoCom5rives: number = 0;
  public reembolsoComAgente: number = 0;
  public reembolsos: any[] = [];
  public totalReembolsos: number = 0;
  public comisionPagada: any = new ComisionPagada();
  public divisa: DivisaBase = new DivisaBase();
  public divisaCotizacion: DivisaBase = new DivisaBase();
  public usuario: any = new Usuario();
  public comisionesPagadas: any[] = [];
  public totalComisionesVerificadas: number = 0;
  public totalComisionesPorVerificar: number = 0;
  public totalPagosVerificados: number = 0;
  public totalPagosPorVerificar: number = 0;
  public totalPagosPorFacturar: number = 0;
  public totalPagosPorFacturarE: number = 0;
  public porcentajePagado: number = 0;
  public totalPagosVerificadosE: number = 0;
  public totalPagosPorVerificarE: number = 0;
  public porcentajePagadoE: number = 0;
  public infoOC: any = {};
  public totalMontoComprado: number = 0;//
  public comisionACostoVenta: number = 0;
  public comisionVentaAgente: number = 0;
  public comAExtrasViajero: number = 0;
  public archivosFactura: any[] = [];
  public filePath: string = environment.API_URI_IMAGES;
  public index: number = 0;
  public tipo: number = 0;
  public productos: any[] = [];
  public tipoReembolso: number = 1;
  public calculoTarifa: number = 0;
  public calculoComision5: number = 0;
  public calculoComisionA: number = 0;
  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cotizacionesServices: CotizacionesService,
    private datePipe: DatePipe,
    private pagosService: PagosService,
    private reembolsosService: ReembolsosService,
    private comisionesPagadasService: ComisionesPagadasService,
    private ordenCompraService: OrdenCompraService,
    private pusherService: PusherService,
    private productosExtrasService: ProductosExtrasConciergeService,
    private divisasService: DivisasService,
    private archivosFacturasService: ArchivosFacturasService,
    private pagosParcialesService: PagosParcialesService,
    private usuariosService: UsuariosService,
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let idCotizacion = params['idCotizacion'];
      this.getCotizacion(idCotizacion);
    });
    this.getProductoExtraConcierge();
    this.getValorDivisa(1, 1);
    this.getUsuario();
  }

  getUsuario(){
    this.usuariosService.getUser().subscribe(usuario => {
      if(Object.keys(usuario).length === 0) return false;
      this.usuario = usuario;
      this.pagoParcialProducto();
    });
  }

  ngDoCheck(): void {}

  getCotizacion(idCotizacion){
    this.cotizacionesServices.list_one(idCotizacion).subscribe(async(cotizacion: any) => {
      cotizacion.nombreDivisa = cotizacion.divisa === 1 ? 'USD' : cotizacion.divisa === 2 ? 'EUR' : 'MXN';
      // cotizacion.nombreDivisa = 'EUR';
      this.cotizacion = cotizacion;
      this.getDivisaCotizacion(this.cotizacion.divisa);
      // this.getDivisaCotizacion(3);
      this.listOneOC(idCotizacion);
      this.getReembolsos(idCotizacion);
      this.getPagos(idCotizacion);
      this.getComisionesPagadas(idCotizacion);
      this.nuevoReembolso(idCotizacion);
      this.cotizacion.valoresVenta = await this.helperService.getValoresVenta(cotizacion.idCotizacion, cotizacion.version);
      this.cotizacion.valoresReembolsos = await this.helperService.getValoresReembolsos(cotizacion.idCotizacion, cotizacion.version);
      this.cotizacion.valoresExtras = await this.helperService.getValoresExtras(cotizacion.idCotizacion);
      this.cotizacion.diasAntes = this.calcularTiempo(this.cotizacion.fechaInicio, this.cotizacion.fechaFinal);
    });
  }

  getProductoExtraConcierge(){
    this.productosExtrasService.getProductoExtraConcierge(1, 8).subscribe(productoExtra => {
      // console.log('productoExtra', productoExtra);
    });
  }

  getValorDivisa(idDivisa: number, tipo: number){
    this.divisasService.divisaBase_getOne(idDivisa).subscribe((divisa: any) => {
      this.divisa = divisa;
      if(tipo === 1){
        this.pago.cantidadMXN = this.pago.cantidadNeta * this.divisa.valor;
        this.comisionPagada.cantidadMXN = this.comisionPagada.cantidadDivisa * this.divisa.valor;
      }else{
        this.reembolso.cantidadMXN = this.reembolso.cantidadDivisa * this.divisa.valor;
      }
    });
  }

  getDivisaCotizacion(idDivisaBase: number){
    this.divisasService.divisaBase_getOne(idDivisaBase).subscribe((divisa: any) => {
      this.divisaCotizacion = divisa;
    });
  }

  getPagos(idCotizacion: number){
    this.pagosService.listPorCotizacion(idCotizacion).subscribe((pagos: any) => {
      this.pagos = pagos;
      this.pagos.forEach(pago => {
        if(!pago.facturaE){
          if(!pago.pagoExtra){
            this.totalPagosPorFacturar += pago.cantidadMXN;
          }else{
            this.totalPagosPorFacturarE += pago.cantidadMXN;
          }
        }
        switch(pago.pagoVerificado){
          case 0:
            if(!pago.pagoExtra){
              this.totalPagosPorVerificar += pago.cantidadMXN;
            }else{
              this.totalPagosPorVerificarE += pago.cantidadMXN;
            }
            break;
          case 1:
            if(!pago.pagoExtra){
              this.totalPagosVerificados += pago.cantidadMXN;
            }else{
              this.totalPagosVerificadosE += pago.cantidadMXN;
            }
            break;
        }
      });
      this.porcentajePagado = this.round((this.totalPagosVerificados * 100) / this.infoOC.totalOC);
    }, err => console.log(err));
  }

  getReembolsos(idCotizacion: number){
    this.reembolsosService.listPorCotizacion(idCotizacion).subscribe((reembolsos: any) => {
      this.reembolsos = reembolsos;
      this.reembolsos.forEach(reembolso => {
        this.totalReembolsos += reembolso.cantidadMXN;
      });
    });
  }

  nuevoReembolso(idCotizacion: number){
    let channelName: string = `reembolsos-${idCotizacion}`;
    let event: string = `nuevo-reembolso-${idCotizacion}`;
    this.pusherService.subscribeToChannel(channelName, [event], data => {
      this.totalReembolsos += data.reembolso.cantidadMXN;
      this.reembolsoCom5rives += (data.reembolso.cantidadNeta * (data.reembolso.com5R / 100));
      this.reembolsoComAgente += (data.reembolso.cantidadCotizada * (data.reembolso.comAR / 100));
      this.reembolsos.unshift(data.reembolso);
    });
  }

  pagoParcialProducto(){
    let channelName: string = `channel-notification-${this.usuario.idUsuario}`;
    let event: string = `new-notification-${this.usuario.idUsuario}`;
    this.pusherService.subscribeToChannel(channelName, [event], data => {
      if(!data.notificacion.data.idProductosCostosParciales) return false;
      const { idProductosCostosParciales } = data.notificacion.data;
      this.pagosParcialesService.listPagoParcial(idProductosCostosParciales).subscribe((data: any) => {
        const { pago } = data;
        this.cotizacion.valoresVenta.totalMontoComprado  += pago.pagoParcial;
      });
    });
  }

  getComisionesPagadas(idCotizacion: number){
    this.comisionesPagadasService.listPorCotizacion(idCotizacion).subscribe((comisionesPagadas: any) => {
      this.comisionesPagadas = comisionesPagadas;
      this.comisionesPagadas.forEach(comisionPagada => {
        switch(comisionPagada.verificada){
          case 0:
            this.totalComisionesPorVerificar += comisionPagada.divisa = 'MXN' ? comisionPagada.cantidadDivisa : comisionPagada.cantidadMXN;
            break;
          case 1:
            this.totalComisionesVerificadas += comisionPagada.divisa = 'MXN' ? comisionPagada.cantidadDivisa : comisionPagada.cantidadMXN;
            break;
        }
      });
    });
  }

  listOneOC(idCotizacion: number){
    this.ordenCompraService.listOne(idCotizacion).subscribe(infoOC => {
      this.infoOC = infoOC[0];
    });
  }

  calcularTiempo(fechaInicio: string, fechaFin: string){
    let valor: any = '';
    if(new Date().getTime() < new Date(fechaInicio).getTime()){
      valor = Math.abs(Math.floor((new Date(fechaInicio).getTime() - new Date().setDate(new Date().getDate() - 1)) / 1000 / 60 / 60 / 24));
    }else if(new Date().getTime() > new Date(fechaInicio).getTime() && new Date().getTime() < new Date(fechaFin).getTime()){
      valor = 'En curso';
    }else{
      valor = 'Terminado'
    }
    return valor;
  }

  abrirModal(tipo: number){
    switch(tipo){
      case 1:
        $('#collapsibleFactura').collapsible();
        $('#collapsibleFactura').collapsible('close');
        $('#pagoVerificado').prop("checked", false);
        $('#facturaPago').prop("checked", false);
        this.pago = new Pago();
        this.archivosFactura = [];
        $('#modalPagos').modal({ dismissible: false});
        $('#modalPagos').modal('open');
        break;
      case 2:
        this.reembolso = new Reembolso();
        this.reembolso.reembolsoS = 'Reembolso final';
        this.reembolso.reembolsoFinal = 1;
        this.archivosFactura = [];
        $('#modalReembolsos').modal({ dismissible: false});
        $('#modalReembolsos').modal('open');
        break;
      case 3:
        $('#collapsibleFacturaCP').collapsible();
        $('#collapsibleFacturaCP').collapsible('close');
        $('#comisionVerificada').prop("checked", false);
        $('#facturaCP').prop("checked", false);
        this.comisionPagada = new ComisionPagada();
        this.archivosFactura = [];
        $('#modalComisionPagada').modal({ dismissible: false});
        $('#modalComisionPagada').modal('open');
        break;
    }
    setTimeout(() => {
      M.updateTextFields();
    }, 0);
  }

  agregarPago(){
    this.pago.idCotizacion = this.cotizacion.idCotizacion;
    this.pago.fecha = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.pago.notas = this.pago.notas.trim() === '' ? 'N/A' : this.pago.notas;
    this.pago.facturaE = this.archivosFactura.length > 0 ? 1 : 0;
    this.pagosService.create(this.pago).subscribe(pago => {
      this.pago = pago;
      this.archivosFactura.forEach(archivo => {
        let name: string = `${new Date().getTime()}-${archivo.ext.split('')[0].toUpperCase()}V${this.cotizacion.idCotizacion}P${this.pago.idPago}.${archivo.ext}`;
        this.archivosFacturasService.uploadArchivosFactura(archivo.blob, name, this.pago.idPago, 1).subscribe(res => {});
      });

      if(!this.pago.facturaE){
        if(!this.pago.pagoExtra){
          this.totalPagosPorFacturar += this.pago.cantidadMXN;
        }else{
          this.totalPagosPorFacturarE += this.pago.cantidadMXN;
        }
      }
       
      switch(this.pago.pagoVerificado){
        case 0:
          if(!this.pago.pagoExtra){
            this.totalPagosPorVerificar += this.pago.cantidadMXN;
          }else{
            this.totalPagosPorVerificarE += this.pago.cantidadMXN;
          }
          break;
        case 1:
          if(!this.pago.pagoExtra){
            this.totalPagosVerificados += this.pago.cantidadMXN;
          }else{
            this.totalPagosVerificadosE += this.pago.cantidadMXN;
          }
          break;
      }
      this.pagos.unshift(this.pago);
      $('#pagoVerificado').prop("checked", false);
      $('#facturaPago').prop("checked", false);
      $('#collapsibleFactura').collapsible('close');
      $('#modalPagos').modal('close');
      this.pago = new Pago();
      this.archivosFactura = [];
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Pago agregado correctamente",
        backdrop: false,
        showConfirmButton: false,
        timer: 1500,
      });
    }, err => console.log(err));
  }

  accionesPagos(tipo: string){
    switch(tipo){
      case 'pagoVerificado':
        this.pago.pagoVerificado = this.pago.pagoVerificado === 0 ? 1 : 0;
        break;
      case 'factura':
        if(this.pago.facturaE){
          $('#collapsibleFactura').collapsible('close');
        }else{
          $('#collapsibleFactura').collapsible('open');
        }
        this.pago.facturaE = this.pago.facturaE ? 0 : 1;
        break;
    }
  }

  accionesComisionesP(tipo: string){
    switch(tipo){
      case 'verificada':
        this.comisionPagada.verificada = this.comisionPagada.verificada === 0 ? 1 : 0;
        break;
      case 'factura':
        if(this.comisionPagada.facturaE){
          $('#collapsibleFacturaCP').collapsible('close');
        }else{
          $('#collapsibleFacturaCP').collapsible('open');
        }
        this.comisionPagada.facturaE = this.comisionPagada.facturaE ? 0 : 1;
        break;
    }
  }

  validarPago(index: number){
    Swal.fire({
      title: `¿Esta seguro de validar el pago ${this.pagos[index].refPago}?`,
      showCancelButton: true,
      cancelButtonText: 'No, volver',
      confirmButtonText: `Si, validar`,
      confirmButtonColor: '#1b5e20',
      backdrop: false
    }).then((result) => {
      if(result.isConfirmed){
        this.pagosService.update(this.pagos[index].idPago, 'pago').subscribe(res => {
          this.pagos[index].pagoVerificado = 1;
          this.totalPagosPorVerificar -= this.pagos[index].cantidadMXN;
          this.totalPagosVerificados += this.pagos[index].cantidadMXN;
          this.porcentajePagado = this.round((this.totalPagosVerificados * 100) / this.infoOC.totalOC);
          Swal.fire({
            icon: 'success',
            title: 'Pago validado',
            showConfirmButton: false,
            timer: 1500
          });
        });
      }
    });
  }

  abrirModalAgregarArchivos(i: number, tipo: number){
    this.index = i;
    this.tipo = tipo;
    this.archivosFactura = [];
    $('#modalAgregarArchivosFacturas').modal({dismissible: false});
    $('#modalAgregarArchivosFacturas').modal('open');
  }

  guardarArchivos(){
    switch(this.tipo){
      case 1:
        this.pagosService.update(this.pagos[this.index].idPago, 'factura').subscribe(res => {
          this.pagos[this.index].facturaE = 1;
          this.helperGuardarArchivos(this.pagos[this.index].idPago, 1);
        });
        break;
      case 2:
        this.reembolsosService.update(this.reembolsos[this.index].idReembolso).subscribe(res => {
          this.reembolsos[this.index].facturaE = 1;
          this.helperGuardarArchivos(this.reembolsos[this.index].idReembolso, 2);
        });
        break;
      case 3:
        this.comisionesPagadasService.update(this.comisionesPagadas[this.index].idComision, 'factura').subscribe(res => {
          this.comisionesPagadas[this.index].facturaE = 1;
          this.helperGuardarArchivos(this.comisionesPagadas[this.index].idComision, 3);
        });
        break;
    }
  }

  helperGuardarArchivos(idReintegro: number, tipoReintegro: number){
    let l: string = tipoReintegro === 1 ? 'P' : tipoReintegro === 2 ? 'R' : 'C';
    this.archivosFactura.forEach(archivo => {
      let name: string = `${new Date().getTime()}-${archivo.ext.split('')[0].toUpperCase()}V${this.cotizacion.idCotizacion}${l}${idReintegro}.${archivo.ext}`;
      this.archivosFacturasService.uploadArchivosFactura(archivo.blob, name, idReintegro, tipoReintegro).subscribe(res => {
        this.index = 0;
        this.archivosFactura = [];
        $('#modalAgregarArchivosFacturas').modal('close');
        Swal.fire({
          icon: 'success',
          title: 'Archivos guardados',
          showConfirmButton: false,
          timer: 1500
        });
      });
    });
  }

  agregarComisionPagada(){
    this.comisionPagada.idCotizacion = this.cotizacion.idCotizacion;
    this.comisionPagada.fecha = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.comisionPagada.notas = this.comisionPagada.notas.trim() === '' ? 'N/A' : this.comisionPagada.notas;
    this.comisionPagada.cantidadMXN = this.comisionPagada.idDivisaBase === 1 ? this.comisionPagada.cantidadDivisa : this.comisionPagada.cantidadMXN;
    this.comisionesPagadasService.create(this.comisionPagada).subscribe(comisionPagada => {
      this.comisionPagada = comisionPagada;
      this.archivosFactura.forEach(archivo => {
        let name: string = `${new Date().getTime()}-${archivo.ext.split('')[0].toUpperCase()}V${this.cotizacion.idCotizacion}C${this.comisionPagada.idComision}.${archivo.ext}`;
        this.archivosFacturasService.uploadArchivosFactura(archivo.blob, name, this.comisionPagada.idComision, 3).subscribe(res => {});
      });
      switch(this.comisionPagada.verificada){
        case 0:
          this.totalComisionesPorVerificar += this.comisionPagada.cantidadMXN;
          break;
        case 1:
          this.totalPagosVerificados += this.comisionPagada.cantidadMXN;
          break;
      }
      this.comisionesPagadas.unshift(this.comisionPagada);
      $('#comisionVerificada').prop("checked", false);
      $('#facturaComision').prop("checked", false);
      $('#modalComisionPagada').modal('close');
      this.comisionPagada = new Pago();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Comisión agregada correctamente",
        backdrop: false,
        showConfirmButton: false,
        timer: 1500,
      });
    });
  }

  validarComisionPagada(index: number){
    Swal.fire({
      title: `¿Esta seguro de validar la comisión ${this.comisionesPagadas[index].refComision}?`,
      showCancelButton: true,
      cancelButtonText: 'No, volver',
      confirmButtonText: `Si, validar`,
      confirmButtonColor: '#1b5e20',
      backdrop: false
    }).then((result) => {
      if(result.isConfirmed){
        this.comisionesPagadasService.update(this.comisionesPagadas[index].idComision, 'pago').subscribe(res => {
          this.comisionesPagadas[index].verificada = 1;
          this.totalComisionesPorVerificar -= this.comisionesPagadas[index].cantidadMXN;
          this.totalComisionesVerificadas += this.comisionesPagadas[index].cantidadMXN;
          Swal.fire({
            icon: 'success',
            title: 'Comisión validada',
            showConfirmButton: false,
            timer: 1500
          });
        });
      }
    });
  }

  validarComisionPagadaFactura(tipo: string, index: number){
    Swal.fire({
      title: `¿Esta seguro de validar la comisión ${this.comisionesPagadas[index].refComision}?`,
      showCancelButton: true,
      cancelButtonText: 'No, volver',
      confirmButtonText: `Si, validar`,
      confirmButtonColor: '#1b5e20',
      backdrop: false
    }).then((result) => {
      if(result.isConfirmed){
        switch(tipo){
          case 'pago':
            this.comisionesPagadasService.update(this.comisionesPagadas[index].idComision, 'pago').subscribe(res => {
              this.comisionesPagadas[index].verificada = 1;
              this.totalComisionesPorVerificar -= this.comisionesPagadas[index].cantidadMXN;
              this.totalComisionesVerificadas += this.comisionesPagadas[index].cantidadMXN;
              Swal.fire({
                icon: 'success',
                title: 'Comisión validada',
                showConfirmButton: false,
                timer: 1500
              });
            });
            break;
          case 'factura':
            this.comisionesPagadasService.update(this.comisionesPagadas[index].idComision, 'factura').subscribe(res => {
              this.comisionesPagadas[index].facturaE = 1;
              Swal.fire({
                icon: 'success',
                title: 'Factura validada',
                showConfirmButton: false,
                timer: 1500
              });
            });
            break;
        }
      }
    });
  }

  validarFacturaReembolso(index: number){
    Swal.fire({
      title: `¿Esta seguro de validar la factura electrónica para el reembolso ${this.reembolsos[index].refReembolso}?`,
      showCancelButton: true,
      cancelButtonText: 'No, volver',
      confirmButtonText: `Si, validar`,
      confirmButtonColor: '#1b5e20',
      backdrop: false
    }).then((result) => {
      if(result.isConfirmed){
        // this.comisionesPagadasService.update(this.comisionesPagadas[index].idComision, 'factura').subscribe(res => {
        //   this.comisionesPagadas[index].facturaE = 1;
        //   Swal.fire({
        //     icon: 'success',
        //     title: 'Factura validada',
        //     showConfirmButton: false,
        //     timer: 1500
        //   });
        // });
      }
    });
  }

  round(num: number) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
  }

  calcularComision(tarifa: number, comision5r: number, comisionA: number){
    let comisionRives = (comision5r / 100);
    let comisionAgente = (comisionA / 100);
    let total = tarifa * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    return total;
  }

  calcularCantidadesPago(){
    this.pago.cantidadDivisa = this.pago.cantidadDivisa ? this.pago.cantidadDivisa : 0;
    this.pago.cantidadNeta = this.round((this.pago.cantidadDivisa * 100) / (100 + this.pago.tasa));
    this.pago.cantidadMXN = this.round(this.pago.cantidadNeta * this.divisa.valor);
  }

  cargarFormaPago(data: string){
    switch(data){
      case 'VISA':
        this.pago.tasa = 3.2;
        break;
      case 'AMERICAN EXPRESS':
        this.pago.tasa = 4.35;
        break;
      default:
        this.pago.tasa = 0;
        break;
    }
    this.pago.cantidadNeta = this.round((this.pago.cantidadDivisa * 100) / (100 + this.pago.tasa));
    this.pago.cantidadMXN = this.round(this.pago.cantidadNeta * this.divisa.valor);
  }

  aplicarNuevaTasaBancaria(tasa){
    tasa = !tasa ? 0 : tasa;
    this.pago.tasa = tasa;
    this.pago.cantidadNeta = this.round((this.pago.cantidadDivisa * 100) / (100 + this.pago.tasa));
    this.pago.cantidadMXN = this.round(this.pago.cantidadNeta * this.divisa.valor);
  }

  navegar(){
    this.router.navigate(['/finanzas/productos-venta', this.cotizacion.idCotizacion, this.cotizacion.version]);
  }

  async cargarArchivosFactura(files: FileList){
    let fileToUpload = files[0];
    await this.getFileBlob(fileToUpload);
  }

  getFileBlob(file) {
    var reader = new FileReader();
    let a: any =  new Promise(function (resolve, reject) {
      reader.onload = (function (thefile) {
        return function (e) {
          resolve(e.target.result);
        };
      })(file);
      reader.readAsDataURL(file);
    });
    a.then((data) => {
      let d = data.split(',');
      d = d[0].split(';');
      d = d[0].split('/');
      d = d[1];
      switch(d){
        case 'pdf':
          let objPDF = {
            ext: d,
            blob: data
          }
          this.archivosFactura.push(objPDF);
          break;
        case 'xml':
          let objXML = {
            ext: d,
            blob: data
          }
          this.archivosFactura.push(objXML);
          break;
        default:
          Swal.fire({
            icon: 'error',
            title: 'Archivo no valido',
            text: 'Extensiones permitidas: .pdf, .xml',
            backdrop: false
          });
          break;
      }
    }).catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Su archivo no pudo ser procesado, por favor intentelo nuevamente.',
        backdrop: false,
      });
    });
    return a;
  }

  eliminarArchivos(index: number){
    this.archivosFactura.splice(index, 1);
  }

  abrirModalVerArchivos(idPago: number, tipo: number){
    this.archivosFactura = [];
    this.archivosFacturasService.listNombreArchivosFactura(idPago, tipo).subscribe((archivos: any) => {
      this.archivosFactura = archivos;
      this.archivosFactura.map(archivo => {
        archivo.ext = archivo.nombre.split('.')[1];
        archivo.path = `${this.filePath}/archivosFacturas/${archivo.nombre}`;
      });
      $('#modalArchivosFacturas').modal({dismissible: false});
      $('#modalArchivosFacturas').modal('open');
    });
  }

  abrirArchivoFactura(archivo: any){
    window.open(archivo.path);
  }

  calcularTotal(){
    let total: number = this.cotizacion?.valoresVenta?.comision + this.cotizacion?.valoresExtras?.comision + (this.cotizacion?.valoresReembolsos?.comision / this.divisaCotizacion.valor);
    if(this.cotizacion?.valoresVenta?.pagoIncompleto){
      return total;
    }else{
      let diff: number = this.cotizacion?.valoresVenta?.totalNetoCotizado - this.cotizacion?.valoresVenta?.totalMontoComprado;
      return total + diff;
    }
  }

  agregarReembolso(){
    delete this.reembolso.gananciaA;
    delete this.reembolso.ganancia5;
    this.reembolso.idCotizacion = this.cotizacion.idCotizacion;
    this.reembolso.fecha = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.reembolso.concepto = this.reembolso.concepto.trim() === '' ? 'N/A' : this.reembolso.concepto;
    this.reembolsosService.create(this.reembolso).subscribe(reembolso => {
      $('#modalReembolsos').modal('close');
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

  totalAReembolsar(){
    let total: any = this.cotizacion?.valoresReembolsos?.totalAReembolsar + this.cotizacion?.valoresReembolsos?.comision + this.cotizacion?.valoresReembolsos?.comisionAgente;
    return total;
  }

  convertirDivisaMXN(valor: number){
    this.reembolso.cantidadMXN = valor * this.cotizacion.divisa;
  }

}
