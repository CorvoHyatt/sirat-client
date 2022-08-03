import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cotizacion } from 'src/app/models/Cotizacion';
import { Notificacion } from 'src/app/models/Notificacion';
import { Timeline } from 'src/app/models/Timeline';
import { Usuario } from 'src/app/models/Usuario';
import { CanastaService } from 'src/app/services/canasta.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { PusherService } from 'src/app/services/pusher.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import * as M from 'materialize-css/dist/js/materialize';
import Swal from "sweetalert2";
import { Nota } from 'src/app/finanzas/models/Nota';
import { HelperService } from 'src/app/finanzas/services/helper.service';
declare var $: any;

@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.component.html',
  styleUrls: ['./listado-ventas.component.css'],
  providers: [HelperService]
})
export class ListadoVentasComponent implements OnInit {

  public usuario: Usuario = new Usuario();
  public timeline: Timeline = new Timeline();
  public notificacion: Notificacion = new Notificacion();
  public notaC: any = new Nota();
  public cotizacion: any = new Cotizacion();
  public cotizacionesPorVerificar: any[] = [];
  public cotizacionesVerificadas: any[] = [];
  public cotizacionesCerradas: any[] = [];
  public notas: any[] = [];
  public pagos: any[] = [];
  public filtroActivo: number = 1;
  public activo: number = 0;
  public totalPagosPorVerificar: number = 0;
  public totalPagosVerificados: number = 0;
  public porcentajePagadoV: number = 0;
  public porcentajePagadoPorV: number = 0;
  public porcentajeRestante: number = 0;
  public cotizacionesPrioridadAlta: any[] = [];
  public cotizacionesPrioridadMedia: any[] = [];
  public cotizacionesPrioridadBaja: any[] = [];

  constructor(
    private cotizacionesService: CotizacionesService,
    private usuariosService: UsuariosService,
    private canastaService: CanastaService,
    private router: Router,
    private pusherService: PusherService,
    private notificacionesService: NotificacionesService,
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
    $('select').formSelect();
    this.getUsuario();
    this.getCotizaciones(4);
  }

  getUsuario() {
    this.usuariosService.getUser().subscribe(usuario => {
      if(Object.keys(usuario).length === 0) return false;
      this.usuario = usuario;
      this.pusher();
    });
  }

  getCotizaciones(filter: any){
    this.cotizacionesPorVerificar = [];
    this.cotizacionesVerificadas = [];
    this.cotizacionesCerradas = [];
    this.cotizacionesService.listByFilter(filter).subscribe(async(cotizaciones: any) => {
      for(let cotizacion of cotizaciones){
        cotizacion.valoresVenta = await this.helperService.getValoresVenta(cotizacion.idCotizacion, cotizacion.version);
        cotizacion.valoresReembolsos = await this.helperService.getValoresReembolsos(cotizacion.idCotizacion, cotizacion.version);
        cotizacion.valoresExtras = await this.helperService.getValoresExtras(cotizacion.idCotizacion);
      }
      switch(parseInt(filter)){
        case 0:
          this.cotizacionesVerificadas = cotizaciones;
          break;
        case 4:
          this.cotizacionesPorVerificar = cotizaciones;
          break;
        case 7:
          this.cotizacionesCerradas = cotizaciones;
          break;
      }
      setTimeout(() => { $('.dropdown-trigger').dropdown({
        alignment: 'left',
        coverTrigger: false,
        constrainWidth: false
      }) }, 0);
    }, err => console.log(err));
  }

  validarVenta(cotizacion: any, index: number){
    Swal.fire({
      title: `¿Esta seguro de validar la venta ${cotizacion.ref}?`,
      showCancelButton: true,
      cancelButtonText: 'No, volver',
      confirmButtonText: `Si, validar`,
      confirmButtonColor: '#1b5e20',
      backdrop: false
    }).then((result) => {
      if(result.isConfirmed){
        let data: any = { estatus: 6 };
        this.canastaService.updateStatus(cotizacion.idCotizacion, data).subscribe((res: any) => {
          this.timeline = new Timeline();
          this.timeline.idCotizacion = cotizacion.idCotizacion;
          this.timeline.notas = 'Venta validada por finanzas';
          this.timeline.tipo = 6;
          this.cotizacionesService.addTimeline(this.timeline).subscribe(res => {
            cotizacion.estado = 6;
            this.filtroActivo = 1;
            this.cotizacionesPorVerificar.splice(index, 1);
            this.cotizacionesVerificadas.unshift(cotizacion);

            this.notificacion = new Notificacion();
            this.notificacion.receptor = cotizacion.idUsuario;
            this.notificacion.asunto = "Completar información restante";
            this.notificacion.tipo = 1;
            this.notificacion.prioridad = 3;
            this.notificacion.estatus = 0;
            this.notificacion.caducidad = "3";
            this.notificacion.data.tarea = `La venta ${cotizacion.ref} ha sido validada por finanzas, por favor completa la información restante por cada servicio`;
            this.notificacion.emisor = this.usuario.idUsuario;
            this.notificacionesService.create(this.notificacion, 2).subscribe(res => {
              Swal.fire({
                icon: 'success',
                title: 'Venta validada',
                showConfirmButton: false,
                timer: 2000
              });
            });
          });
        }, err => { console.log(err) });
      }
    });
  }

  verDetallesVenta(idCotizacion: number){
    this.router.navigate(['/finanzas/detalle-venta', idCotizacion]);
  }

  verProductos(idCotizacion: number, version: number){
    this.router.navigate(['/finanzas/productos-venta', idCotizacion, version]);
  }

  posponerPago(Cotizacion: any, index: number){

  }

  cancelarReactivarVenta(Cotizacion: any, index: number){

  }

  filterCotizaciones(estado: number){
    this.filtroActivo = estado == 4 ? 1 : estado == 0 ? 2 : 3;
    this.getCotizaciones(estado);
  }

  reembolsos(cotizacion: any){
    $('#modalReembolso').modal({ dismissible: false});
    $('#modalReembolso').modal('open');
  }

  comisionPagada(cotizacion: any){
    $('#modalComisionPagada').modal({ dismissible: false});
    $('#modalComisionPagada').modal('open');
  }

  pusher(){
    let channel = `channel-notification-${this.usuario.idUsuario}`;
    let event = `new-notification-${this.usuario.idUsuario}`;
    this.pusherService.subscribeToChannel(channel, [event], (data: any) => {
      // data.notificacion.data = JSON.parse(data.notificacion.data);
      if(data.notificacion.data.idCotizacion){
        this.cotizacionesService.listOneOC(data.notificacion.data.idCotizacion).subscribe(cotizacion => {
          this.cotizacionesPorVerificar.unshift(cotizacion);
        });
      }
    });
  }

  modalNotas(cotizacion: any){
    this.cotizacion = cotizacion;
    $('#modalNotas').modal({dismissible: false});
    $('#modalNotas').modal('open');
    M.updateTextFields();
    this.listNotas(cotizacion.idCotizacion);
  }

  insertNota(){
    this.notaC.idCotizacion = this.cotizacion.idCotizacion;
    this.notaC.idUsuario = this.usuario.idUsuario;
    this.cotizacionesService.createNota(this.notaC).subscribe(nota => {
      this.notas.unshift(nota[0]);
      this.notaC = new Nota();
      Swal.fire({
        icon: 'success',
        title: 'Nota agregada',
        showConfirmButton: false,
        timer: 2000
      });
      this.activo = 0;
      $('#collapsibleNuevaNota').collapsible('close');
    });
  }

  listNotas(idCotizacion: number){
    this.cotizacionesService.getNotasByCotizacion(idCotizacion).subscribe((notas: any) => {
      this.notas = notas;
    });
  }

  cargarCollapsible(){
    $('#collapsibleNuevaNota').collapsible();
    if(this.activo){
      $('#collapsibleNuevaNota').collapsible('close');
    }else{
      $('#collapsibleNuevaNota').collapsible('open');
    }
    this.activo = this.activo ? 0 : 1;
  }

  cargarPendientes(){
    $('#modalPendientes').modal({dismissible: false});
    $('#modalPendientes').modal('open');
  }

  round(num: number) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
  }

  balancePorComision(cotizacion: any){
    let comisonAPagar: number = cotizacion.valoresVenta.comisionAgente + cotizacion.valoresReembolsos.comisionAgente + cotizacion.valoresExtras.comisionAgente;
    let comisonPagada: number = cotizacion.comisionesPagadas.reduce((acc: number, comision: any) => acc + comision.cantidadDivisa, 0);
    let resultado: number = comisonAPagar - comisonPagada;
    return resultado;
  }

  balancePorPago(cotizacion: any){
    let pagosExtras: any[] = cotizacion.pagos.filter(pago => pago.pagoExtra == 1);
    let totalReembolsoPagado: number = pagosExtras.reduce((acc: number, pago: any) => acc + pago.cantidadMXN, 0);
    let resta1: number = cotizacion.valoresReembolsos.totalAReembolsar - cotizacion.valoresReembolsos.reembolsoFinal;
    let resta2: number = cotizacion.valoresExtras.totalExtrasViajero - totalReembolsoPagado;
    let resultado: number = resta2 - resta1;
    return resultado;
  }

  cerrarVenta(cotizacion: any, index: number){
    Swal.fire({
      title: `¿Esta seguro de cerrar la venta ${cotizacion.ref}?`,
      showCancelButton: true,
      cancelButtonText: 'No, volver',
      confirmButtonText: `Si, validar`,
      confirmButtonColor: '#1b5e20',
      backdrop: false
    }).then((result) => {
      if(result.isConfirmed){
        let data: any = { estatus: 7 };
        this.canastaService.updateStatus(cotizacion.idCotizacion, data).subscribe((res: any) => {
          this.timeline = new Timeline();
          this.timeline.idCotizacion = cotizacion.idCotizacion;
          this.timeline.notas = 'Venta cerrada por finanzas';
          this.timeline.tipo = 7;
          this.cotizacionesService.addTimeline(this.timeline).subscribe(res => {
            cotizacion.estado = 7;
            this.filtroActivo = 2;
            this.cotizacionesPorVerificar.splice(index, 1);
            this.cotizacionesCerradas.unshift(cotizacion);
            Swal.fire({
              icon: 'success',
              title: 'Venta cerrada',
              showConfirmButton: false,
              timer: 1500
            });
          });
        }, err => { console.log(err) });
      }
    });
  }
}

