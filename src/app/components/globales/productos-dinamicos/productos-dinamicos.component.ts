import { Component, EventEmitter, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario';
import { AgenciasService } from 'src/app/services/agencias.service';
import { AgentesService } from 'src/app/services/agentes.service';
import { CanastaService } from 'src/app/services/canasta.service';
import { SendDataToEditService } from 'src/app/services/sendDataToEdit.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import * as M from 'materialize-css/dist/js/materialize';
import Swal from 'sweetalert2';
import { Agencia } from 'src/app/models/Agencia';
import { Agente } from 'src/app/models/Agente';
import { HotelesService } from 'src/app/services/hoteles.service';
import { VuelosService } from 'src/app/services/vuelos.service';
import { TrenesService } from 'src/app/services/trenes.service';
import { ExtrasService } from 'src/app/services/extras.service';
import { VersionesService } from 'src/app/services/versiones.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { TrasladosAdquiridosService } from '../../../services/traslados-adquiridos.service';
import { DisposicionesAdquiridasService } from '../../../services/disposiciones-adquiridas.service';
import { ProductosAdquiridosService } from '../../../services/productos-adquiridos.service';
import { TarifasService } from 'src/app/services/tarifas.service';
import { DestinosService } from 'src/app/services/destinos.service';
import { Subscription } from 'rxjs';
import { TrasladosOtrosService } from '../../../services/traslados-otros.service';
import { Cotiz_dest_version } from 'src/app/models/cotiz_dest_version';
import { ProductosPreciosTotalesService } from 'src/app/services/productosPreciosTotales.service';
import { HotelHabitacionUpgrade } from 'src/app/models/HotelHabitacionUpgrade';
import { VuelosEscalasService } from 'src/app/services/vuelos-escalas.service';
import { PaisesService } from 'src/app/services/paises.service';
import { RentaVehiculosService } from 'src/app/services/rentaVehiculos.service';
import { ImagenesService } from 'src/app/services/imagenes.service';
declare var $: any;

@Component({
  selector: 'app-productos-dinamicos',
  templateUrl: './productos-dinamicos.component.html',
  styleUrls: ['./productos-dinamicos.component.css'],
  providers: []
})
export class ProductosDinamicosComponent implements OnInit, OnDestroy {
  @Input() public isNewVersion: boolean = false;
  @Output() public totalSC: any = new EventEmitter<number>();
  @Output() public totalSN: any = new EventEmitter<number>();
  @Output() public totalHC: any = new EventEmitter<number>();
  @Output() public totalHN: any = new EventEmitter<number>();
  @Output() public tarifaSNeta: any = new EventEmitter<number>();
  @Output() public tarifaHNeta: any = new EventEmitter<number>();
  @Output() public tarifaSComision: any = new EventEmitter<number>();
  @Output() public tarifaHComision: any = new EventEmitter<number>();
  @Output() public restarTarifaSNeta: any = new EventEmitter<number>();
  @Output() public restarTarifaHNeta: any = new EventEmitter<number>();
  @Output() public restarTarifaSComision: any = new EventEmitter<number>();
  @Output() public restarTarifaHComision: any = new EventEmitter<number>();

  private subscriptionDestinoN: Subscription = new Subscription();
  private subscriptionToProducts: Subscription = new Subscription();
  public usuario: any = new Usuario();
  public agencias: Agencia[] = [];
  public agentes: Agente[] = [];
  public cotizacion: any;
  public idCotizacion: any;
  public versionCotizacion: number = 0;
  public type: number = 0;
  public typeToSend: number = 0;
  public productName: string = '';
  public products: any[] = [];
  public idAgencia: number = 0;
  public cambioPasajeros: boolean = false;
  public productsToUpdate: any[] = [];
  public newVersion: any = {};
  public totalPasajeros = 0;
  public canasta: any = {};
  public productosNoEditados: any[] = [];
  public productosEliminados: any[] = [];
  public modificacionCot: boolean = false;
  public productosNoValidos: any[] = [];
  public countProductosEliminados: number = 0;
  public tarifaSN: number = 0;
  public tarifaHN: number = 0;
  public tarifaSC: number = 0;
  public tarifaHC: number = 0;
  public totalNeto: number = 0;
  public totalComision: number = 0;
  public diferenciaTarifa: number = 0;
  public destinos: any[] = [];
  public destinosToInsert: any[] = [];
  public destinosNoModificados: any[] = [];
  public nd: boolean = true;
  public holidaysInHotel: number = 0;
  public datesInHotel: string = '';

  constructor(
    private canastaService: CanastaService,
    private usuariosService: UsuariosService,
    private sendDataToEdit: SendDataToEditService,
    private route: ActivatedRoute,
    private router: Router,
    private agenciasService: AgenciasService,
    private agentesService: AgentesService,
    private hotelesService: HotelesService,
    private extrasService: ExtrasService,
    private vuelosService: VuelosService,
    private trenesService: TrenesService,
    private versionesService: VersionesService,
    private cotizacionesService: CotizacionesService,
    private trasladosAdquiridosService: TrasladosAdquiridosService,
    private disposicionesAdquiridasService: DisposicionesAdquiridasService,
    private productosAdquiridosService: ProductosAdquiridosService,
    private destinosService: DestinosService,
    private tarifasService: TarifasService,
    private cp: CurrencyPipe,
    private trasladosOtrosService: TrasladosOtrosService,
    private productosPreciosTotalesService: ProductosPreciosTotalesService,
    private vuelosEscalasServices: VuelosEscalasService,
    private paisesService: PaisesService,
    private rentaVehiculosService: RentaVehiculosService,
    private imagenesService: ImagenesService
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getAgencias();
    this.onUpdate(false);
    $('.modalValidation').modal();
    $('.modalValidation').modal({ dismissible: false });
    $('.modalAddProducts').modal();
    $('.modalAddProducts').modal({ dismissible: false });
    $('.modalSendProducts').modal();
    $('.modalSendProducts').modal({ dismissible: false });
    $('.modalDetalleVersion').modal();
    $('.modalDetalleVersion').modal({ dismissible: false });
    $('.modalNuevaVersion').modal();
    $('.modalNuevaVersion').modal({ dismissible: false });
    $('.modal').modal({
      dismissible: false
    });
    $('.modalNuevaVersion').modal('open');
    this.subscriptionDestinoN = this.destinosService.getNuevoDestinoNV().subscribe((destino) => {
      if(Object.keys(destino).length === 0) return false;
      this.nd = false;
      this.destinos.push(destino);
    });
  }

  ngDoCheck(): void {
    M.updateTextFields();
  }

  ngOnDestroy(): void {
    this.subscriptionDestinoN.unsubscribe();
    this.subscriptionToProducts.unsubscribe();
    this.tarifasService.setTarifa({}, 'cotizacion');
    this.tarifasService.setTarifa(0, 'tarifaSNeta');
    this.tarifasService.setTarifa(0, 'tarifaHNeta');
    this.tarifasService.setTarifa(0, 'tarifaSComision');
    this.tarifasService.setTarifa(0, 'tarifaHComision');
    this.tarifasService.setTarifa(0, 'diferenciaTarifa');
    this.sendDataToEdit.sendProductToUpdate({});
  }

  getUser() {
    this.usuariosService.getUser().subscribe((user: any) => {
      if(Object.keys(user).length === 0) return false;
      this.usuario = user;
      this.listOneCotizacionByUserByVersion(user);
    }, err => { console.log(err) });
  }

  getAgencias() {
    this.agenciasService.list().subscribe((agencias: Agencia[]) => { this.agencias = agencias });
  }

  getAgentes(idAgencia: number) {
    this.agentesService.listByIdAgencia(idAgencia).subscribe((agentes: Agente[]) => { this.agentes = agentes; $('#divisa').val(this.cotizacion.idDivisaBase); });
  }

  listOneCotizacionByUserByVersion(usuario: any) {
    this.route.params.subscribe((params) => {
      this.idCotizacion = params["idCotizacion"];
      this.versionCotizacion = params["versionCotizacion"];
      this.canastaService.listOneCotizacionByUserByVersion(usuario.idUsuario, this.idCotizacion, this.versionCotizacion).subscribe((res: any) => {
        this.destinos = res.destinos;
        this.destinosService.setActualDestino(this.destinos[0]);
        this.cotizacion = res.cotizacion;
        if(Object.keys(this.cotizacion).length !== 0){
          this.getAgentes(this.cotizacion.idAgencia);
          this.sendData(res.cotizacion, 'cotizacion');
        }
        this.destinos.forEach((destino) => {
          res.canasta.forEach(async(product: any) => {
            switch (product.tipo) {
              case 1:
                if (product.traslado && product.traslado.idCiudad !== destino.idCiudad) return false;
                destino.productos.push(product.traslado);
                product.traslado.id = product.traslado.idTrasladoAdquirido;
                product.traslado.type = 'Traslado';
                product.traslado.idToSend = 1;
                product.traslado.valido = true;
                product.traslado.precio = this.calcularComision(product.traslado.comision, product.traslado.comisionAgente, product.traslado.tarifa);
                if(product.traslado.opcional === 0) this.enviarComisionServicios(product.traslado.tarifa, product.traslado.comision, product.traslado.comisionAgente);
                break;
              case 2:
                if (product.disposicion && product.disposicion.idCiudad !== destino.idCiudad) return false;
                destino.productos.push(product.disposicion);
                product.disposicion.id = product.disposicion.idDisposicionAdquirida;
                product.disposicion.type = 'Disposición';
                product.disposicion.idToSend = 2;
                product.disposicion.valido = true;
                product.disposicion.precio = this.calcularComision(product.disposicion.comision, product.disposicion.comisionAgente, product.disposicion.tarifa);
                if(product.disposicion.opcional === 0) this.enviarComisionServicios(product.disposicion.tarifa, product.disposicion.comision, product.disposicion.comisionAgente);
                break;
              case 3:
                if (product.trasladoOtro && product.trasladoOtro.idCiudad !== destino.idCiudad) return false;
                destino.productos.push(product.trasladoOtro);
                product.trasladoOtro.id = product.trasladoOtro.idTrasladoOtro;
                product.trasladoOtro.type = 'Traslado Otro';
                product.trasladoOtro.idToSend = 11;
                product.trasladoOtro.valido = true;
                product.trasladoOtro.precio = this.calcularComision(product.trasladoOtro.comision, product.trasladoOtro.comisionAgente, product.trasladoOtro.tarifa);
                if(product.trasladoOtro.opcional === 0) this.enviarComisionServicios(product.trasladoOtro.tarifa, product.trasladoOtro.comision, product.trasladoOtro.comisionAgente);
                break;
              case 4:
                if (product.hotel && product.hotel.idDestino !== destino.idDestino) return false;
                destino.productos.push(product.hotel);
                product.hotel.id = product.hotel.idHotelAdquirido;
                product.hotel.type = 'Hotel';
                product.hotel.idToSend = 7;
                product.hotel.valido = true;
                product.hotel.daysInHotel = Math.floor((new Date(product.hotel.checkOut).getTime() - new Date(product.hotel.checkIn).getTime()) / 1000 / 60 / 60 / 24);
                await this.getPais(new Date(product.hotel.checkIn), new Date(product.hotel.checkOut), destino.idPais);
                product.hotel.holidaysInHotel = this.holidaysInHotel;
                product.hotel.daysInHotel = (product.hotel.daysInHotel - this.holidaysInHotel);
                let tarifaBase: number = (product.hotel.cityTax + product.hotel.desayuno + product.hotel.tarifaTotal) * product.hotel.daysInHotel;
                let tarifaAlta: number = (product.hotel.cityTax + product.hotel.desayuno + product.hotel.tarifaTotal) * this.holidaysInHotel * 1.20;
                let tarifaTotal: number = (tarifaBase + tarifaAlta);
                product.hotel.precio = this.calcularComision(product.hotel.comision, product.hotel.comisionAgente, tarifaTotal);
                product.hotel.precio += product.hotel.otros;
                if(product.hotel.opcional === 0) this.enviarComisionHoteles(tarifaTotal, product.hotel.comision, product.hotel.comisionAgente);
                break;
              case 5:
                if (product.vuelo && product.vuelo.idDestino !== destino.idDestino) return false;
                destino.productos.push(product.vuelo);
                product.vuelo.id = product.vuelo.idVuelo;
                product.vuelo.type = 'Vuelo';
                product.vuelo.idToSend = 8;
                product.vuelo.valido = true;
                product.vuelo.precio = this.calcularComision(product.vuelo.comision, product.vuelo.comisionAgente, product.vuelo.tarifa);
                if(product.vuelo.opcional === 0) this.enviarComisionServicios(product.vuelo.tarifa, product.vuelo.comision, product.vuelo.comisionAgente);
                break;
              case 6:
                if (product.tren && product.tren.idDestino !== destino.idDestino) return false;
                destino.productos.push(product.tren);
                product.tren.id = product.tren.idTren;
                product.tren.type = 'Tren';
                product.tren.idToSend = 9;
                product.tren.valido = true;
                product.tren.precio = this.calcularComision(product.tren.comision, product.tren.comisionAgente, product.tren.tarifa);
                if(product.tren.opcional === 0) this.enviarComisionServicios(product.tren.tarifa, product.tren.comision, product.tren.comisionAgente);
                break;
              case 7:
                if (product.tourPie) {
                  if (product.tourPie.idCiudad !== destino.idCiudad) return false;
                  destino.productos.push(product.tourPie);
                  product.tourPie.id = product.tourPie.idProductoAdquirido;
                  product.tourPie.type = 'Tour privado a pie';
                  product.tourPie.idToSend = 3;
                  product.tourPie.valido = true;
                  product.tourPie.precio = this.calcularComision(product.tourPie.comision, product.tourPie.comisionAgente, product.tourPie.tarifa);
                  if(product.tourPie.opcional === 0) this.enviarComisionServicios(product.tourPie.tarifa, product.tourPie.comision, product.tourPie.comisionAgente);
                } else if (product.tourTransporte) {
                  if (product.tourTransporte.idCiudad !== destino.idCiudad) return false;
                  destino.productos.push(product.tourTransporte);
                  product.tourTransporte.id = product.tourTransporte.idProductoAdquirido;
                  product.tourTransporte.type = 'Tour privado en transporte';
                  product.tourTransporte.idToSend = 4;
                  product.tourTransporte.valido = true;
                  product.tourTransporte.precio = this.calcularComision(product.tourTransporte.comision, product.tourTransporte.comisionAgente, product.tourTransporte.tarifa);
                  if(product.tourTransporte.opcional === 0) this.enviarComisionServicios(product.tourTransporte.tarifa, product.tourTransporte.comision, product.tourTransporte.comisionAgente);
                } else if (product.tourGrupo) {
                  if (product.tourGrupo.idCiudad !== destino.idCiudad) return false;
                  destino.productos.push(product.tourGrupo);
                  product.tourGrupo.id = product.tourGrupo.idProductoAdquirido;
                  product.tourGrupo.type = 'Tour privado en grupo';
                  product.tourGrupo.idToSend = 5;
                  product.tourGrupo.valido = true;
                  product.tourGrupo.precio = this.calcularComision(product.tourGrupo.comision, product.tourGrupo.comisionAgente, product.tourGrupo.tarifa);
                  if(product.tourGrupo.opcional === 0) this.enviarComisionServicios(product.tourGrupo.tarifa, product.tourGrupo.comision, product.tourGrupo.comisionAgente);
                } else if (product.actividad) {
                  if (product.actividad.idCiudad !== destino.idCiudad) return false;
                  destino.productos.push(product.actividad);
                  product.actividad.id = product.actividad.idProductoAdquirido;
                  product.actividad.type = 'Actividad';
                  product.actividad.idToSend = 6;
                  product.actividad.valido = true;
                  product.actividad.precio = this.calcularComision(product.actividad.comision, product.actividad.comisionAgente , product.actividad.tarifa);
                  if(product.actividad.opcional === 0) this.enviarComisionServicios(product.actividad.tarifa, product.actividad.comision, product.actividad.comisionAgente);
                }
                break;
              case 8:
                if (product.extra && product.extra.idDestino !== destino.idDestino) return false;
                destino.productos.push(product.extra);
                product.extra.id = product.extra.idExtras;
                product.extra.type = `${product.extra.extras} (Producto extra)`;
                product.extra.idToSend = 10;
                product.extra.valido = true;
                product.extra.precio = this.calcularComision(product.extra.comision, product.extra.comisionAgente , product.extra.tarifa);
                if(product.extra.opcional === 0) this.enviarComisionServicios(product.extra.tarifa, product.extra.comision, product.extra.comisionAgente);
                break;
              case 12:
                if (product.rentaVehiculo && product.rentaVehiculo.idDestino !== destino.idDestino) return false;
                destino.productos.push(product.rentaVehiculo);
                product.rentaVehiculo.id = product.rentaVehiculo.idRentaVehiculo;
                product.rentaVehiculo.type = 'Vehículo en renta';
                product.rentaVehiculo.idToSend = 12;
                product.rentaVehiculo.valido = true;
                product.rentaVehiculo.precio = this.calcularComision(product.rentaVehiculo.comision, product.rentaVehiculo.comisionAgente , product.rentaVehiculo.tarifa * product.rentaVehiculo.diasRentado);
                if(product.rentaVehiculo.opcional === 0) this.enviarComisionServicios(product.rentaVehiculo.tarifa * product.rentaVehiculo.diasRentado, product.rentaVehiculo.comision, product.rentaVehiculo.comisionAgente);
                break;
            }
          });
        });
      }, err => console.log(err));
    });
  }

  enviarComisionHoteles(tarifa: number, comision5R: number, comisionA, otros: number = 0) {
    this.tarifaHN += tarifa;
    this.sendData(this.tarifaHN, 'tarifaHNeta');
    this.calcularComisionHoteles(comision5R, comisionA, tarifa, otros);
  }

  calcularComisionHoteles(com: number, comAgente: number, tarifa: number, otros: number) {
    let comisionRives = (com / 100);
    let comisionAgente = (comAgente / 100);
    let resMath = tarifa * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    let res = (resMath - tarifa);
    this.tarifaHC += (res + tarifa);
    this.tarifaHC += otros;
    this.sendData(this.tarifaHC, 'tarifaHComision');
  }

  enviarComisionServicios(tarifa: number, comision5R: number, comisionA: number) {
    this.tarifaSN += tarifa;
    this.sendData(this.tarifaSN, 'tarifaSNeta');
    this.calcularComisionServicios(comision5R, comisionA, tarifa);
  }

  calcularComisionServicios(com: number, comAgente: number, tarifa: number) {
    let comisionRives = (com / 100);
    let comisionAgente = (comAgente / 100);
    let resMath = tarifa * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    let res = (resMath - tarifa);
    this.tarifaSC += (res + tarifa);
    this.sendData(this.tarifaSC, 'tarifaSComision');
  }
  
  calcularComision(com: number, comAgente: number, tarifa: number){
    let comisionRives = (com / 100);
    let comisionAgente = comAgente / 100;
    let resMath = tarifa * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    let res = (resMath - tarifa);
    let total = (res + tarifa);
    return total;
  }

  sendData(data: any, type: string){
    switch(type){
      case 'cotizacion':
        this.tarifasService.setTarifa(data, 'cotizacion');
        this.sendDataToEdit.sendProductToEdit(data, 'cotizacion');
        break;
      case 'tarifaSNeta':
        this.tarifasService.setTarifa(data, 'tarifaSNeta');
        break;
      case 'tarifaHNeta':
        this.tarifasService.setTarifa(data, 'tarifaHNeta');
        break;
      case 'tarifaSComision':
        this.tarifasService.setTarifa(data, 'tarifaSComision');
        break;
      case 'tarifaHComision':
        this.tarifasService.setTarifa(data, 'tarifaHComision');
        break;
    }
  }

  restarCantidadHoteles(com: number, comAgente: number, tarifa: number, otros: number = 0){
    this.tarifaHN -= tarifa;
    this.tarifasService.setTarifa(tarifa, 'restarTarifaHNeta');
    let comisionRives = (com / 100);
    let comisionAgente = (comAgente / 100);
    let tarifaC = tarifa * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    tarifaC += otros;
    this.tarifaHC -= tarifaC;
    this.tarifasService.setTarifa(tarifaC, 'restarTarifaHComision');
  }

  restarCantidadServicios(com: number, comAgente: number, tarifa: number){
    this.tarifaSN -= tarifa;
    this.tarifasService.setTarifa(tarifa, 'restarTarifaSNeta');
    let comisionRives = (com / 100);
    let comisionAgente = (comAgente / 100);
    let resMath = tarifa * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    let res = (resMath - tarifa);
    let tarifaC = (res + tarifa);
    this.tarifaSC -= tarifaC;
    this.tarifasService.setTarifa(tarifaC, 'restarTarifaSComision');
  }

  addProduct(value: string, destino: any, i: number){
    this.type = 0;
    let type = parseInt(value);
    this.type = type;
    setTimeout(() => {
      $('.modalAddProducts').modal();
      $('.modalAddProducts').modal({ dismissible: false });
      $('.modalAddProducts').modal('open');
      $(`#addP${i}`).val("0");
    }, 0);
    let d = Object.assign({}, destino);
    d.productos = [];
    this.destinosService.setActualDestino(d);
  }

  changeProductToUpdate(product: any, destino: any){
    this.typeToSend = 0;
    this.destinosService.setActualDestino(destino);
    switch(product.idToSend){
      case 1:
        this.sendDataToEdit.sendProductToEdit(product, 'traslado');
        break;
      case 2:
        this.sendDataToEdit.sendProductToEdit(product, 'disposicion');
        break;
      case 3:
        this.sendDataToEdit.sendProductToEdit(product, 'tourPie');
        break;
      case 4:
        this.sendDataToEdit.sendProductToEdit(product, 'tourTransporte');
        break;
      case 5:
        this.sendDataToEdit.sendProductToEdit(product, 'tourGrupo');
        break;
      case 6:
        this.sendDataToEdit.sendProductToEdit(product, 'actividad');
        break;
      case 7:
        this.sendDataToEdit.sendProductToEdit(product, 'hotel');
        break;
      case 8:
        this.sendDataToEdit.sendProductToEdit(product, 'vuelo');
        break;
      case 9:
        this.sendDataToEdit.sendProductToEdit(product, 'tren');
        break;
      case 10:
        this.sendDataToEdit.sendProductToEdit(product, 'extra');
        break;
      case 11:
      this.sendDataToEdit.sendProductToEdit(product, 'trasladoOtro');
      break;
      case 12:
      this.sendDataToEdit.sendProductToEdit(product, 'rentaVehiculo');
      break;
    }
    this.typeToSend = product.idToSend;
    setTimeout(() => {
      $('.modalSendProducts').modal();
      $('.modalSendProducts').modal({ dismissible: false });
      $('.modalSendProducts').modal('open');
    }, 0);
  }

  redirect(){
    this.router.navigate(["/home/disenoCotizacion"]);
  }

  modificacion(value: boolean){
    this.cambioPasajeros = value;
    this.modificacionCot = value;
  }

  continuar() {
    $('.modalNuevaVersion').modal('close');
    this.validarPasajeros();
    this.buscarProductosNoValidos();
  }

  validarPasajeros(){
    $('.modalValidation').modal('open');
    this.totalPasajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
    this.destinos.forEach((destino) => {
      destino.productos.forEach((product) => {
        if([1, 3, 4, 5, 11].includes(product.idToSend) && (this.totalPasajeros > product.pasajerosMax || this.totalPasajeros < product.minimunViajeros || this.totalPasajeros > product.maximunViajeros)){
          product.valido = false;
        }else{
          product.valido = true;
        }
      });
    });
    $('.modalValidation').modal('close');
  }

  async onUpdate(save: any){
    if(!save){
      this.subscriptionToProducts = this.sendDataToEdit.getProductToUpdate().subscribe((res: any) => {
        if(Object.keys(res).length === 0) return false;
        this.type = 0;
        let productToInsert = Object.assign({}, res);
        let actualProduct: any;
        res[0] !== undefined ? actualProduct = res[0] : actualProduct = res;
        this.helper(actualProduct, productToInsert);
      });
    }else{
      if(
        this.modificacionCot ||
        this.productosEliminados.length > 0 ||
        this.productsToUpdate.length > 0 ||
        this.destinosToInsert.length > 0
      ){
        this.productosNoValidos.length !== 0 ? this.procesarProductosNoValidos() : await this.insertar();
      }else{
        Swal.fire({
          title: `No se encontraron cambios en la cotización, ¿Desea salir al inicio?`,
          showCancelButton: true,
          cancelButtonText: 'No, volver',
          confirmButtonText: `Si, salir`,
          confirmButtonColor: '#b71c1c'
        }).then((result) => {
          if(result.isConfirmed){
            this.redirectToHome();
          }
        });
      }
    }
  }

  procesarProductosNoValidos(){
    Swal.fire({
      title: `
      La cotización contiene ${this.productosNoValidos.length} ${this.productosNoValidos.length > 1 ? 'productos' : 'producto'} que no cumplen con los rangos de pasajeros
      (Se muestran tachados y con un sombreado en color rojo tenue),
      si continua ${this.productosNoValidos.length > 1 ? 'serán' : 'será'} eliminados,
      ¿Desea continuar?`,
      showCancelButton: true,
      cancelButtonText: 'No, volver',
      confirmButtonText: `Si, continuar`,
      confirmButtonColor: '#b71c1c'
    }).then(async(result) => {
      if(result.isConfirmed){
        await this.insertar();
      }
    });
  }

  helper(actualProduct: any, productToInsert: any){
    if(actualProduct.nuevo){//NUEVO PRODUCTO
      switch(actualProduct.type){
        case 'Hotel':
          let total: number = (+actualProduct.tarifaTotal + +actualProduct.cityTax + +actualProduct.desayuno);
          let tarifa = (total * (actualProduct.daysInHotel + actualProduct.holidaysInHotel));
          actualProduct.precio = this.calcularComision(actualProduct.comision, actualProduct.comisionAgente, tarifa);
          if(actualProduct.opcional === 0){
            this.enviarComisionHoteles(tarifa, actualProduct.comision,  actualProduct.comisionAgente);
          }
          break;
        case 'Vehículo en renta':
          actualProduct.precio = this.calcularComision(actualProduct.comision , actualProduct.comisionAgente, actualProduct.tarifa * actualProduct.diasRentado);
          if(actualProduct.opcional === 0){
            this.enviarComisionServicios(actualProduct.tarifa * actualProduct.diasRentado, actualProduct.comision, actualProduct.comisionAgente);
          }
          break;
        default:
          actualProduct.precio = this.calcularComision(actualProduct.comision , actualProduct.comisionAgente, actualProduct.tarifa);
          if(actualProduct.opcional === 0){
            this.enviarComisionServicios(actualProduct.tarifa, actualProduct.comision, actualProduct.comisionAgente);
          }
          break;
      }
      this.destinos.forEach((destino: any) => {
        if(this.destinosNoModificados.length === 0){
          this.destinosNoModificados.push(destino);
        }else{
          let d: any = this.destinosNoModificados.filter((des: any) => destino.idDestino == des.idDestino);
          if(d.length === 0 && destino.idDestino !== 0){
            this.destinosNoModificados.push(destino);
          }
        }
        if(destino.idCiudad !== actualProduct.idCiudad) return false;
        if(destino.idDestino === 0){
          let d: any = Object.assign({}, destino);
          d.productos = destino.productos.slice();
          d.productos.push(productToInsert);
          destino.productos.unshift(actualProduct);
          if(this.destinosToInsert.length === 0){
            this.destinosToInsert.push(d);
          }else{
            this.destinosToInsert.forEach((DTI: any, i) => {
              if(destino.idCiudad === DTI.idCiudad){
                DTI.productos.push(productToInsert);
              }else{
                this.destinosToInsert.push(d);
              }
            });
          }
        }else{
          destino.productos.unshift(actualProduct);
          this.productsToUpdate.push(productToInsert);
        }
      });
    }else{//PRODUCTO EDITADO
      this.destinos.forEach((destino: any) => {
        if(this.destinosNoModificados.length === 0){
          this.destinosNoModificados.push(destino);
        }else{
          this.destinosNoModificados.forEach((DNM: any) => {
            if(destino.idDestino !== 0 && destino.idDestino !== DNM.idDestino){
              this.destinosNoModificados.push(destino);
            }
          });
        }
        destino.productos.forEach((product: any, index: number) => {
          if(product.id === actualProduct.id && product.type === actualProduct.type){
            switch(product.type){
              case 'Hotel':
                let total: number = (+actualProduct.tarifaTotal + +actualProduct.cityTax + +actualProduct.desayuno);
                let tarifa = (total * (actualProduct.daysInHotel + actualProduct.holidaysInHotel));
                let tarifaActual = (destino.productos[index].tarifaTotal * destino.productos[index].daysInHotel);
                actualProduct.precio = this.calcularComision(actualProduct.comision, actualProduct.comisionAgente , tarifa);
                if(actualProduct.opcional === 0){
                  this.enviarComisionHoteles((tarifa - tarifaActual), actualProduct.comision, actualProduct.comisionAgente);
                }
                break;
              case 'Traslado':
                actualProduct.precio = this.calcularComision(actualProduct.comision, actualProduct.comisionAgente, actualProduct.tarifa);
                productToInsert.precio = this.calcularComision(productToInsert.comision, productToInsert.comisionAgente, productToInsert.tarifa);
                if(actualProduct.opcional === 0){
                  this.enviarComisionServicios((actualProduct.tarifa - destino.productos[index].tarifa), actualProduct.comision, actualProduct.comisionAgente);
                }
                break;
              case 'Vehículo en renta':
                actualProduct.precio = this.calcularComision(actualProduct.comision, actualProduct.comisionAgente, actualProduct.tarifa * actualProduct.diasRentado);
                if(actualProduct.opcional === 0){
                  let tarifaActual: number = destino.productos[index].tarifa * destino.productos[index].diasRentado;
                  let tarifaUpdate: number = actualProduct.tarifa * actualProduct.diasRentado;
                  this.enviarComisionServicios(tarifaUpdate - tarifaActual, actualProduct.comision, actualProduct.comisionAgente);
                }
                break;
              default:
                actualProduct.precio = this.calcularComision(actualProduct.comision, actualProduct.comisionAgente, actualProduct.tarifa);
                if(actualProduct.opcional === 0){
                  this.enviarComisionServicios((actualProduct.tarifa - destino.productos[index].tarifa), actualProduct.comision, actualProduct.comisionAgente);
                }
                break;
            }
            this.recalcularTotal(actualProduct.precio - destino.productos[index].precio);
            destino.productos[index] = actualProduct;
          }
        });
      });
      this.productsToUpdate.push(productToInsert);
    }
  }

  recalcularTotal(diferencia: number){
    this.diferenciaTarifa += diferencia
    this.tarifasService.setTarifa(this.diferenciaTarifa, 'diferenciaTarifa');
  }

  async insertar(){
    if(
      this.modificacionCot ||
      this.productosEliminados.length > 0 ||
      this.productsToUpdate.length > 0 ||
      this.destinosToInsert.length > 0
    ){
      const { value: text } = await Swal.fire({
        input: 'textarea',
        inputLabel: `Se detectaron cambios en su cotización, se generará una nueva versión, por favor ingrese un detalle que describa dichos cambios`,
        inputValidator: (value) => {
          if(!value){
            return 'El campo es obligatorio'
          }
        }
      });
      this.versionCotizacion++;
      this.cotizacion.notas = text;
      this.actualizarVersionCotizacion();
    }
  }

  actualizarVersionCotizacion(){
    this.cotizacion.version = this.versionCotizacion;
    this.cotizacion.divisa = this.cotizacion.divisa === 'MXN' ? 1 : this.cotizacion.divisa === 'USD' ? 2 : 3;
    this.cotizacion.ref = this.cotizacion.ref.slice(0, -1) + this.cotizacion.version;
    this.cotizacionesService.createNewVersionCotizacion(this.cotizacion).subscribe((res: any) => {
      this.cotizacion = res;
      this.inserciones();
      this.insertarVersionProductosNoEditados();
      this.insertarVersionProductosEliminados();
      this.mensajeValidacion(`La nueva version para la cotización ${this.cotizacion.ref} fue creada correctamente`, 2000);
      this.redirect();
    }, err => console.log(err) );
  }

  inserciones() {
    this.insertarDestinosConProductos();
    this.productsToUpdate.forEach((product) => {
      this.insertarProductos(product);
    });
  }

  insertarDestinosConProductos(){
    this.destinosToInsert.forEach((destino) => {
      let dtno = {
        idDestino: 0,
        idCotizacion: destino.idCotizacion,
        idCiudad: destino.idCiudad,
        versionCotizacion: this.cotizacion.version
      }
      this.destinosService.create(dtno).subscribe((res: any) => {
        destino.productos.forEach((producto: any) => {
          switch(producto.idToSend){
            case 7:
            case 8:
            case 9:
            case 10:
              producto.idDestino = res.idDestino;
              break;
          }
          this.insertarProductos(producto);
        });
      });
    });
  }

  insertarProductos(product: any){
    let notasVersion: any = '';
    let PTU = product[0] !== undefined ? product[0] : product;
    switch(PTU.idToSend){
      case 1:
        notasVersion = PTU.notasVersion !== undefined ? PTU.notasVersion : '';
        this.trasladosAdquiridosService.create(product[0], product[1]).subscribe((res: any) => {
          if(product[0].productoPrecioTotal){
            product[0].productoPrecioTotal.idProducto = res.insertId;
            this.productosPreciosTotalesService.create(product[0].productoPrecioTotal).subscribe((resTotal: any) => {});
          }
          this.rellenarNuevaVersion(res.insertId, 1, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, notasVersion);
          this.saveVersion(this.newVersion);
          this.insertarCanasta(this.cotizacion.idCotizacion, res.insertId, 1);
        }, err => { console.log(err) });
        break;
      case 2:
        notasVersion = PTU.notasVersion !== undefined ? PTU.notasVersion : '';
        this.disposicionesAdquiridasService.create(product[0],product[1]).subscribe((res: any) => {
          if(product[0].productoPrecioTotal){
            product[0].productoPrecioTotal.idProducto = res.insertId;
            this.productosPreciosTotalesService.create(product[0].productoPrecioTotal).subscribe((resTotal: any) => {});
          }
          this.rellenarNuevaVersion(res.insertId, 2, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, notasVersion);
          this.saveVersion(this.newVersion);
          this.insertarCanasta(this.cotizacion.idCotizacion, res.insertId, 2);
        }, err => { console.log(err) });
        break;
      case 11:
        notasVersion = PTU.notasVersion !== undefined ? PTU.notasVersion : '';
        this.trasladosOtrosService.create(product[0], product[1]).subscribe((res: any) => { 
          if(product[0].productoPrecioTotal){
            product[0].productoPrecioTotal.idProducto = res.insertId;
            this.productosPreciosTotalesService.create(product[0].productoPrecioTotal).subscribe((resTotal: any) => {});
          }
          this.rellenarNuevaVersion(res.insertId, 3, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, notasVersion);
          this.saveVersion(this.newVersion);
          this.insertarCanasta(this.cotizacion.idCotizacion, res.insertId, 3);
        });
          break;
      case 7:
        let h: any[] = [...product.habitaciones];
        delete product.habitaciones;
        this.hotelesService.create(product).subscribe((res: any) => {
          h.forEach((habitacion: any) => {
            let tarifaBase: number = habitacion.tarifa * product.daysInHotel;
            let tarifaAlta: number = habitacion.tarifa * product.holidaysInHotel * 1.20;
            let tarifa: number = tarifaBase + tarifaAlta;
            habitacion.tarifa = tarifa;
            habitacion.idHotelAdquirido = res.insertId;
            this.hotelesService.agreagrHabitacion(habitacion).subscribe((resHabitacion: any) => {
              habitacion.idHotelHabitacion = resHabitacion.insertId;
              if(product.hotelHabitacionesUDB){
                let hUDB: any = product.hotelHabitacionesUDB.find(habitacionUDB => habitacionUDB.conMejoras && habitacionUDB.i == habitacion.i);
                if(!hUDB) return false;
                hUDB.idCotizacion = this.cotizacion.idCotizacion;
                hUDB.idHotelAdquirido = res.insertId;
                hUDB.fecha = product.checkIn;
                hUDB.idHabitacion = resHabitacion.insertId;
                this.hotelesService.upgradeHabitacion(hUDB).subscribe(res => {}, err => console.log(err));
              }

              if(product.hotelHabitacionesUM){
                if(product.hotelHabitacionesUM.length === 0) return false;
                let hUM: any = product.hotelHabitacionesUM.find(habitacionUM => habitacionUM.i == habitacion.i);
                hUM.idCotizacion = this.cotizacion.idCotizacion;
                hUM.idHotelAdquirido = res.insertId;
                hUM.fecha = product.checkIn;
                hUM.idHabitacion = resHabitacion.insertId;
                this.hotelesService.upgradeHabitacion(hUM).subscribe(res => {}, err => console.log(err));
              }
            }, err => console.log(err));
          });

          if(product.hotelManualUpgrade){
            product.hotelManualUpgrade.tarifa = product.hotelHabitacionesUM.reduce((acc: number, upgrade: any) => acc + upgrade.tarifa, 0);
            product.hotelManualUpgrade.fecha = product.checkIn;
            product.hotelManualUpgrade.idHotelAdquirido = res.insertId;
            this.hotelesService.upgradeHotel(product.hotelManualUpgrade).subscribe((resUH: any) => {}, err => console.log(err));
          }

          if(product.productoPrecioTotal){
            product.productoPrecioTotal.idProducto = res.insertId;
            this.productosPreciosTotalesService.create(product.productoPrecioTotal).subscribe((resTotal: any) => {});
          }

          if(product.tipoHotel === 0){
            if(product.imagen1) this.imagenesService.guardarImagenHotel1(res.insertId, product.imagen1.blob).subscribe(imagen => {}, err => console.log(err));
            if(product.imagen2) this.imagenesService.guardarImagenHotel2(res.insertId, product.imagen2.blob).subscribe(imagen => {}, err => console.log(err));
          }else{
            if(product.imagen1) this.imagenesService.guardarActualizacionImagenHotel1(res.insertId, product.imagen1.blob).subscribe(imagen => {}, err => console.log(err));
            if(product.imagen2) this.imagenesService.guardarActualizacionImagenHotel2(res.insertId, product.imagen2.blob).subscribe(imagen => {}, err => console.log(err));
          }

          this.rellenarNuevaVersion(res.insertId, 4, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, product.notas);
          this.saveVersion(this.newVersion);
          this.insertarCanasta(this.cotizacion.idCotizacion, res.insertId, 4);
        }, err => { console.log(err) });
        break;
      case 8:
        this.vuelosService.create(product).subscribe((res: any) => {
          if(product.productoPrecioTotal){
            product.productoPrecioTotal.idProducto = res.insertId;
            this.productosPreciosTotalesService.create(product.productoPrecioTotal).subscribe((resTotal: any) => {});
          }
          if(product.mejoras){
            product.mejoras.forEach((vueloUpgrade) => {
              vueloUpgrade.idVuelo = res.insertId;
              vueloUpgrade.fecha = product.fecha;
              delete vueloUpgrade.idClase;
              this.vuelosService.upgrade(vueloUpgrade).subscribe((res: any) => {});
            });
          }
          if(product.escala){
            product.escala.idVuelo = res.insertId;
            this.vuelosEscalasServices.create(product.escala).subscribe((res: any) => {});
          }
          this.rellenarNuevaVersion(res.insertId, 5, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, product.notas);
          this.saveVersion(this.newVersion);
          this.insertarCanasta(this.cotizacion.idCotizacion, res.insertId, 5);
        }, err => { console.log(err) });
        break;
      case 9:
        this.trenesService.create(product).subscribe((res: any) => {
          if(product.productoPrecioTotal){
            product.productoPrecioTotal.idProducto = res.insertId;
            this.productosPreciosTotalesService.create(product.productoPrecioTotal).subscribe((resTotal: any) => {});
          }
          if(product.mejoras){
            product.mejoras.forEach((trenUpgrade) => {
              trenUpgrade.idTren = res.insertId;
              trenUpgrade.fecha = product.fecha;
              delete trenUpgrade.idClase;
              this.trenesService.upgrade(trenUpgrade).subscribe((res: any) => {});
            });
          }
          this.rellenarNuevaVersion(res.insertId, 6, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, product.notas);
          this.saveVersion(this.newVersion);
          this.insertarCanasta(this.cotizacion.idCotizacion, res.insertId, 6);
        }, err => { console.log(err) });
        break;
      case 10:
        this.extrasService.create(product).subscribe((res: any) => {
          if(product.productoPrecioTotal){
            product.productoPrecioTotal.idProducto = res.insertId;
            this.productosPreciosTotalesService.create(product.productoPrecioTotal).subscribe((resTotal: any) => {});
          }
          this.rellenarNuevaVersion(res.insertId, 8, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, product.notas);
          this.saveVersion(this.newVersion);
          this.insertarCanasta(this.cotizacion.idCotizacion, res.insertId, 8);
        }, err => { console.log(err) });
        break;
      case 12:
        product.idRentaVehiculo = 0;
        this.rentaVehiculosService.create(product).subscribe((res: any) => {
          let nombre: string = `${res.insertId}-${new Date().getTime()}.${product.imagenVehiculo.ext}`;
          this.imagenesService.uploadImagenesRentaVehiculos(res.insertId, product.imagenVehiculo.blob, nombre).subscribe((resRV: any) => {
            if(product.upgrade){
              product.upgrade.idRentaVehiculo = res.insertId;
              this.rentaVehiculosService.createUpgrade(product.upgrade).subscribe((resU: any) => {
                let nombre: string = `${resU.insertId}M-${new Date().getTime()}.${product.imagenVehiculoMejora.ext}`;
                this.imagenesService.uploadImagenesRentaVehiculosUpgrade(resU.insertId, product.imagenVehiculoMejora.blob, nombre).subscribe((resVU: any) => {});
              });
            }
            this.rellenarNuevaVersion(res.insertId, 12, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, product.notas);
            this.saveVersion(this.newVersion);
            this.insertarCanasta(this.cotizacion.idCotizacion, res.insertId, 12);
          }, err => console.log(err));
        }, err => console.log(err));
        break;
      default:
        notasVersion =  product[0] ? product[0].notas : '';
        this.productosAdquiridosService.create(product[0], product[1], product[2],product[3],product[4]).subscribe((res: any) => {
          if(product[0].productoPrecioTotal){
            product[0].productoPrecioTotal.idProducto = res.insertId;
            this.productosPreciosTotalesService.create(product[0].productoPrecioTotal).subscribe((resTotal: any) => {});
          } 
          this.rellenarNuevaVersion(res.insertId, 7, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, notasVersion);
          this.saveVersion(this.newVersion);
          this.insertarCanasta(this.cotizacion.idCotizacion, res.insertId, 7);
        });
        break;
    }
  }

  insertarVersionProductosNoEditados(){
    if(this.productsToUpdate.length !== 0){
      this.destinos.forEach((destino, i) => {
        if(destino.idDestino !== 0){
          if(i === 0){
            this.productosNoEditados = destino.productos.slice();
          }else{
            this.productosNoEditados = this.productosNoEditados.concat(destino.productos.slice());
          }
          this.productsToUpdate.forEach((productToUpdate: any) => {
            let PTU = productToUpdate[0] !== undefined ? productToUpdate[0] : productToUpdate;
            this.productosNoEditados.forEach((p: any, ii) => {
              if(p.id === 0) delete this.productosNoEditados[ii];
              if(p.id === PTU.id && p.tipo === PTU.tipo) delete this.productosNoEditados[ii];
              if(p.valido === false) delete this.productosNoEditados[ii];
            });
          });
        }
      });
    }else{
      this.buscarProductosNoValidos(true);
    }
    this.productosNoEditados.forEach((product) => {
      switch(product.idToSend){
        case 1:
          this.rellenarNuevaVersion(product.id, 1, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, '');
          this.saveVersion(this.newVersion);
          break;
        case 2:
          this.rellenarNuevaVersion(product.id, 2, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, '');
          this.saveVersion(this.newVersion);
          break;
        case 3:
        case 4:
        case 5:
        case 6:
          this.rellenarNuevaVersion(product.id, 7, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, '');
          this.saveVersion(this.newVersion);
          break;
        case 7:
          this.rellenarNuevaVersion(product.id, 4, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, '');
          this.saveVersion(this.newVersion);
          break;
        case 8:
          this.rellenarNuevaVersion(product.id, 5, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, '');
          this.saveVersion(this.newVersion);
          break;
        case 9:
          this.rellenarNuevaVersion(product.id, 6, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, '');
          this.saveVersion(this.newVersion);
          break;
        case 10:
          this.rellenarNuevaVersion(product.id, 8, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, '');
          this.saveVersion(this.newVersion);
          break;
        case 11:
          this.rellenarNuevaVersion(product.id, 3, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, '');
          this.saveVersion(this.newVersion);
          break;
        case 12:
          this.rellenarNuevaVersion(product.id, 12, this.cotizacion.idCotizacion, this.versionCotizacion, 1, this.usuario.idUsuario, '');
          this.saveVersion(this.newVersion);
          break;
      }
    });
  }

  insertarVersionProductosEliminados(){
    this.productosEliminados.forEach((product) => {
      switch(product.idToSend){
        case 1:
          this.rellenarNuevaVersion(product.id, 1, this.cotizacion.idCotizacion, this.versionCotizacion, 2, this.usuario.idUsuario, product.nota);
          this.saveVersion(this.newVersion);
          this.restarCantidadServicios(product.comision, product.comisionAgente, product.tarifa);
          break;
        case 2:
          this.rellenarNuevaVersion(product.id, 2, this.cotizacion.idCotizacion, this.versionCotizacion, 2, this.usuario.idUsuario, product.nota);
          this.saveVersion(this.newVersion);
          this.restarCantidadServicios(product.comision, product.comisionAgente, product.tarifa);
          break;
        case 3:
        case 4:
        case 5:
        case 6:
          this.rellenarNuevaVersion(product.id, 7, this.cotizacion.idCotizacion, this.versionCotizacion, 2, this.usuario.idUsuario, product.nota);
          this.saveVersion(this.newVersion);
          this.restarCantidadServicios(product.comision, product.comisionAgente, product.tarifa);
          break;
        case 7:
          this.rellenarNuevaVersion(product.id, 4, this.cotizacion.idCotizacion, this.versionCotizacion, 2, this.usuario.idUsuario, product.nota);
          this.saveVersion(this.newVersion);
          let tarifa = (product.tarifaTotal * product.daysInHotel);
          this.restarCantidadHoteles(product.comision, product.comisionAgente, tarifa);
          break;
        case 8:
          this.rellenarNuevaVersion(product.id, 5, this.cotizacion.idCotizacion, this.versionCotizacion, 2, this.usuario.idUsuario, product.nota);
          this.saveVersion(this.newVersion);
          this.restarCantidadServicios(product.comision, product.comisionAgente, product.tarifa);
          break;
        case 9:
          this.rellenarNuevaVersion(product.id, 6, this.cotizacion.idCotizacion, this.versionCotizacion, 2, this.usuario.idUsuario, product.nota);
          this.saveVersion(this.newVersion);
          this.restarCantidadServicios(product.comision, product.comisionAgente, product.tarifa);
          break;
        case 10:
          this.rellenarNuevaVersion(product.id, 8, this.cotizacion.idCotizacion, this.versionCotizacion, 2, this.usuario.idUsuario, product.nota);
          this.saveVersion(this.newVersion);
          this.restarCantidadServicios(product.comision, product.comisionAgente, product.tarifa);
          break;
        case 11:
          this.rellenarNuevaVersion(product.id, 3, this.cotizacion.idCotizacion, this.versionCotizacion, 2, this.usuario.idUsuario, product.nota);
          this.saveVersion(this.newVersion);
          this.restarCantidadServicios(product.comision, product.comisionAgente, product.tarifa);
          break;
        case 12:
          this.rellenarNuevaVersion(product.id, 12, this.cotizacion.idCotizacion, this.versionCotizacion, 2, this.usuario.idUsuario, product.nota);
          this.saveVersion(this.newVersion);
          let tarifaTotal: number = product.tarifa * product.diasRentado;
          this.restarCantidadServicios(product.comision, product.comisionAgente, tarifaTotal);
          break;
      } 
    });
  }

  buscarProductosNoValidos(entrarNM: boolean = false){
    this.destinos.forEach((destino) => {
      if(destino.idDestino === 0) return false;
      destino.productos.forEach((product) => {
        if(!product.valido){
          this.productosEliminados.push(product);
          this.productosNoValidos.push(product);
        }else{
          if(entrarNM) this.productosNoEditados.push(product);
        }
      });
    });
  }

  insertarCanasta(idCotizacion: any, idActividad: number, tipo: number){
    this.canasta.idCotizacion = idCotizacion;
    this.canasta.idActividad = idActividad;
    this.canasta.tipo = tipo;
    this.canasta.estatus = 1;
    this.canastaService.create(this.canasta).subscribe((res: any) => {}, err => { console.log(err) });
  }

  rellenarNuevaVersion(id: number, tipo: number, idCotizacion: number, versionC: number, accion: number, idUsuario: number, notas: string){
    this.newVersion = {
      idActividad: id,
      tipo: tipo,
      idCotizacion: idCotizacion,
      versionCotizacion: versionC,
      accion: accion,
      idUsuario: idUsuario,
      notas: notas
    };
  }

  saveVersion(data: any) {
    this.versionesService.create(data).subscribe((res: any) => {}, err => { console.log(err) });
  }

  eliminarProducto(product: any, indexD: number, indexP: number){
    switch(product.id){
      case 0:
        Swal.fire({
          title: '¿Está seguro que desea eliminar el producto de la cotización?',
          showCancelButton: true,
          cancelButtonText: 'No, volver',
          confirmButtonText: `Si, eliminar`,
          backdrop: false,
          confirmButtonColor: '#b71c1c'
        }).then(async (result) => {
          if(result.isConfirmed){
            this.productsToUpdate.forEach((p: any, i) => {
              let p1: any = Object.assign({}, p);
              let p2: any = Object.assign({}, product);
              delete p1.precio;
              delete p2.precio;
              if(JSON.stringify(p1) === JSON.stringify(p2)){
                this.productsToUpdate.splice(i, 1);
              }
            });
            this.destinosToInsert.forEach((d: any, i) => {
              let d1: any = Object.assign({}, d);
              let d2: any = Object.assign({}, this.destinos[indexD]);
              delete d1.productos;
              delete d2.productos;
              if(JSON.stringify(d1) === JSON.stringify(d2)){
                this.destinosToInsert[i].productos.map((p: any, ii) => {
                  let p1: any = Object.assign({}, p);
                  let p2: any = Object.assign({}, product);
                  delete p1.precio;
                  delete p2.precio;
                  if(JSON.stringify(p1) === JSON.stringify(p2)){
                    this.destinosToInsert[i].productos.splice(ii, 1);
                  }
                });
              }
            });
            this.destinos[indexD].productos.splice(indexP, 1);
            this.mensajeValidacion('Producto eliminado con éxito', 1500);
            switch(product.type){
              case 'Hotel':
                let tarifaBase: number = (product.cityTax + product.desayuno) * product.daysInHotel;
                let tarifaAlta: number = (product.cityTax + product.desayuno) * product.holidaysInHotel * 1.20;
                let tarifaTotal: number = (product.tarifaTotal + tarifaBase + tarifaAlta);
                if(product.opcional === 0) this.restarCantidadHoteles(product.comision, product.comisionAgente, tarifaTotal, product.otros);
                break;
              default:
                if(product.opcional === 0) this.restarCantidadServicios(product.comision, product.comisionAgente, product.tarifa);
                break;
            }
          }
        });
        break;
      default:
        Swal.fire({
          title: '¿Está seguro que desea eliminar el producto de la cotización?',
          showCancelButton: true,
          cancelButtonText: 'No, volver',
          confirmButtonText: `Si, eliminar`,
          backdrop: false,
          confirmButtonColor: '#b71c1c'
        }).then(async (result) => {
          if(result.isConfirmed){
            const { value: text } = await Swal.fire({
              input: 'textarea',
              inputLabel: '¿Por qué realizaste ésta eliminación?',
              inputValidator: (value) => {
                if (!value) {
                  return 'El campo es obligatorio'
                }
              }
            });
            product.nota = text;
            this.productosEliminados.push(product);
            if(!this.destinos[indexD].productos[indexP].valido){
              let i = this.productosNoValidos.findIndex(product => product.id === this.destinos[indexD].productos[indexP].id);
              this.productosNoValidos.splice(i, 1);
            }
            this.destinos[indexD].productos.splice(indexP, 1);
            this.destinos.forEach((destino: any) => {
              if(this.destinosNoModificados.length === 0){
                this.destinosNoModificados.push(destino);
              }else{
                this.destinosNoModificados.forEach((DNM: any) => {
                  if(destino.idDestino !== 0 && destino.idDestino !== DNM.idDestino){
                    this.destinosNoModificados.push(destino);
                  }
                });
              }
            });
            this.mensajeValidacion('Producto eliminado con éxito', 1500);
            switch(product.type){
              case 'Hotel':
                let tarifaBase: number = (product.cityTax + product.desayuno) * product.daysInHotel;
                let tarifaAlta: number = (product.cityTax + product.desayuno) * product.holidaysInHotel * 1.20;
                let tarifaTotal: number = (product.tarifaTotal + tarifaBase + tarifaAlta);
                if(product.opcional === 0) this.restarCantidadHoteles(product.comision, product.comisionAgente, tarifaTotal, product.otros);
                break;
              default:
                if(product.opcional === 0) this.restarCantidadServicios(product.comision, product.comisionAgente, product.tarifa);
                break;
            }
          }
        });
        break;
    }
  }

  mensajeValidacion(mensaje: string, tiempo: number){
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: mensaje,
      showConfirmButton: false,
      timer: tiempo
    });
  }

  // async onComplete(){
  //   var valido: any = true;
  //   this.destinos.map((destino) => {
  //     destino.productos.map((product) => {
  //       if(!product.complete){
  //         valido = false
  //       }
  //     });
  //   });
  //   if(!valido){
  //     Swal.fire({
  //       position: 'center',
  //       icon: 'error',
  //       title: `Debe completar la información de todos los productos`
  //     });
  //   }else{
  //     // this.cotizacion.divisa = 'EUR';
  //     if(this.cotizacion.divisa === 'MXN' && this.diferenciaTarifa >= 5000){
  //       this.validarDiferenciaTarifa();
  //     }else if(this.cotizacion.divisa === 'USD' && this.diferenciaTarifa >= 500){
  //       this.validarDiferenciaTarifa();
  //     }else if(this.cotizacion.divisa === 'EUR' && this.diferenciaTarifa >= 500){
  //       this.validarDiferenciaTarifa();
  //     }else{
  //       await this.buscarProductosNoValidos();
  //       await this.insertar(1);
  //       let data: any = {
  //         estatus: 5
  //       };
  //       this.canastaService.updateStatus(this.cotizacion.idCotizacion, data).subscribe(
  //         res => {
  //           Swal.fire({
  //             position: 'center',
  //             icon: 'success',
  //             title: `¡Cotización completada!`,
  //             showConfirmButton: false,
  //             timer: 2000
  //           });
  //           localStorage.removeItem('idDestino');
  //           localStorage.removeItem('idCotizacion');
  //           this.router.navigate(["home/disenoCotizacion"]);
  //         },
  //         err => {
  //           console.log(err);
  //         }
  //       );
  //     }
  //   }
  // }

  // validarDiferenciaTarifa(){
  //   let diff = this.cp.transform(this.diferenciaTarifa, this.cotizacion.divisa);
  //   Swal.fire({
  //     title: `Se encontró un saldo en contra de <strong class="red-text">${diff}</strong>, por lo cual se debe generar una nueva orden de compra.`,
  //     showCancelButton: true,
  //     cancelButtonText: 'Volver',
  //     confirmButtonText: `Generar nueva orden de compra`,
  //     confirmButtonColor: '#388e3c',
  //     allowOutsideClick: false
  //   }).then(async (result) => {
  //     if(result.isConfirmed){
  //       await this.buscarProductosNoValidos();
  //       await this.insertar();
  //       this.router.navigate(["home/ordenCompra", this.cotizacion.idCotizacion, this.cotizacion.version]);
  //     }
  //   });
  // }

  mostrarMAD(){
    this.nd = true;
  }

  redirectToHome(){
    localStorage.removeItem('fechaInicio');
    localStorage.removeItem('fechaFinal');
    localStorage.removeItem('idDestino');
    localStorage.removeItem('idCotizacion');
    this.router.navigate(["/home/disenoCotizacion"]);
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

}

