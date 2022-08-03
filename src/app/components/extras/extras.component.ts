import { Component, Input, OnInit, DoCheck, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Extra } from './../../models/Extra';
import { Ciudad } from './../../models/Ciudad';
import { ExtrasService } from './../../services/extras.service';
import { DestinosService } from './../../services/destinos.service';
import { Destino } from './../../models/Destino';
import { Canasta } from './../../models/Canasta';
import { CanastaService } from './../../services/canasta.service';
import Swal from 'sweetalert2';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { Cotizacion } from 'src/app/models/Cotizacion';
import { Version } from 'src/app/models/Version';
import { VersionesService } from '../../services/versiones.service';
import { UsuariosService } from '../../services/usuarios.service';
import { DatePipe } from '@angular/common';
import * as M from 'materialize-css/dist/js/materialize';
import { SendDataToEditService } from 'src/app/services/sendDataToEdit.service';
import { ProductosPreciosTotalesService } from 'src/app/services/productosPreciosTotales.service';
import { ProductosPreciosTotales } from 'src/app/models/ProductosPreciosTotales';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/Usuario';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.css']
})
export class ExtrasComponent implements OnInit, DoCheck, OnDestroy {

  @ViewChild('extrasForm') form;
  @Input() public editing: boolean = false;
  @Input() public adding: boolean = false;
  @Input() public editingCarrito: boolean = false;
  @Output() public refresh = new EventEmitter<boolean>();
  @Output() public redirect = new EventEmitter<number>();

  
  private suscripciones: Subscription[] = [];
  public i18nOptions: Object = {
    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
    weekdays: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    weekdaysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
    weekdaysAbbrev: ["D", "L", "M", "M", "J", "V", "S"],
  };
  public extra: any = new Extra();
  public extraBase: any = new Extra();
  public destino: any = new Destino();
  public cities: Ciudad[] = [];
  public canasta: Canasta = new Canasta();
  public cotizacion: any = new Cotizacion();
  public usuario: any = new Usuario();
  public productoPrecioTotal: ProductosPreciosTotales = new ProductosPreciosTotales;
  public dataAutocomplete: any = [];
  public extraCanasta: any = {};
  public total: number = 0;
  public idCotizacion: number = 0;
  public idTraslado: number = 0;
  public comisionAgenteBase: number = 0;
  public validando: boolean = false;

  constructor(
    private _extrasService: ExtrasService,
    private _destinosService: DestinosService,
    private _canastaService: CanastaService,
    private _cotizacionesService: CotizacionesService,
    private versionesService: VersionesService,
    private usuariosService: UsuariosService,
    private datePipe: DatePipe,
    private sendDataToEdit: SendDataToEditService,
    private productosPreciosTotalesService: ProductosPreciosTotalesService,
    private router: Router

  ) { }

  ngOnInit(): void {
    if(this.router.url.includes("cotizacionProductos") && !this.editingCarrito){
      $(".tabs").tabs("select", "extras");
    }
    this.getCotizacion();
    this.getDestino();
    this.getUsuario();
    let fecha = localStorage.getItem('fechaInicio');
    this.changeDatepicker('#fechaExtra', fecha);
    if(this.editing){
      $('#modalDetalleExtra').modal({ dismissible: false });
      this.sendDataToEdit.getProduct('extra').subscribe((res: any) => {
        this.extraToUpdate(res);
      });
    }else{
      this.getComisionAgenteByCotizacion();
    }
  }

  changeDatepicker(id: string, date?: any){
    let d = new Date(date += 'T00:00:00');
    let fecha1 = localStorage.getItem('fechaInicio');
    let fecha2 = localStorage.getItem('fechaFinal');
    let minDate: any = new Date(fecha1 += 'T00:00:00');
    let maxDate: any = new Date(fecha2 += 'T00:00:00');
    $(id).datepicker({
      minDate: minDate,
      maxDate: maxDate,
      setDefaultDate: new Date(d),
      defaultDate: new Date(d),
      format: "yyyy-mm-dd",
      i18n: this.i18nOptions
    });
  }

  getDestino(){
    this._destinosService.getActualDestino().subscribe((destino: Destino) => {
      if(Object.keys(destino).length === 0) return false;
      this.destino = destino;
      this.extra.idDestino = this.destino.idDestino;
      this.extra.idCiudad = this.destino.idCiudad;
      this.extraCanasta.ciudad = this.destino.ciudad;
    });
  }

  getCotizacion(){
    this.sendDataToEdit.getProduct('cotizacion').subscribe((cotizacion: any) => {
      if(Object.keys(cotizacion).length === 0) return false;
      this.cotizacion = cotizacion;
    });
  }

  getUsuario(){
    let s = this.usuariosService.getUser().subscribe(usuario => {
      if(Object.keys(usuario).length === 0) return false;
      this.usuario = usuario;
    });
    this.suscripciones.push(s);
  }

  ngDoCheck(): void {
    M.updateTextFields();
  }

  ngOnDestroy(): void{
    this.suscripciones.map(s => s.unsubscribe());
  }

  extraToUpdate(extra: any){
    this.extra = Object.assign({}, extra);
    this.extra.fecha = this.datePipe.transform(
      new Date(this.extra.fecha),
      "yyyy-MM-dd"
    );
    this.changeDatepicker('#fechaExtra', this.extra.fecha);
    $('#autocomplete-input').val(this.extra.ciudad);
    this.extraTotal(this.extra.tarifa);
    this.extraBase = Object.assign({}, this.extra);
  }

  abrirModalDetalle(){
    if(this.esActualizacion()){
      $('#modalDetalleExtra').modal('open');
    }else{
      $('.modalSendProducts').modal('close');
      $('#modalDetalleExtra').modal('open');
    }
  }

  onUpdate(){
    this.extra.nota = $('#detalle').val();
    this.extra.editado = true;
    if(this.extra.nota.trim() === ''){
      M.toast({
        html: 'Error: El campo es obligatorio',
        classes: 'rounded red darken-3'
      });
    }else{

      this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
      this.productoPrecioTotal.tipoProducto = 8;
      this.productoPrecioTotal.total = this.total;
      this.extra.productoPrecioTotal = this.productoPrecioTotal;

      this.sendDataToEdit.sendProductToUpdate(this.extra);
      $('#modalDetalleExtra').modal('close');
      $('.modalSendProducts').modal('close');
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Producto actualizado correctamente",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  getComisionAgenteByCotizacion(){
    this.idCotizacion = parseInt(localStorage.getItem('idCotizacion'));
    if(this.idCotizacion !== undefined && !isNaN(this.idCotizacion)){
      this._cotizacionesService.getComisionAgenteByCotizacion(this.idCotizacion, 10).subscribe((res: any) => {
        if(Object.keys(res).length === 0) return false;
        this.extra.comisionAgente = res[0].comision;
        this.comisionAgenteBase = res[0].comision;
      }, err => { console.log(err) });
    }
  }

  async onSubmit(form: any){
    this.validando = true;
    if(form.invalid) return false;
    const { value: opcional } = await Swal.fire({
      input: 'checkbox',
      inputValue: 0,
      backdrop: false,
      inputPlaceholder:
        'Es un extra opcional',
      confirmButtonText:
        'Continuar <i class="fa fa-arrow-right"></i>',
    });
    this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
    this.productoPrecioTotal.tipoProducto = 8;
    this.productoPrecioTotal.total = this.total;
    if(this.adding){
      this.extra.nuevo = true;
      this.extra.id = this.extra.idExtras;
      this.extra.type = `${this.extra.extras} (Producto extra)`;
      this.extra.precio = this.extra.tarifa;
      this.extra.valido = true;
      this.extra.idToSend = 10;
      this.extra.idCiudad = this.destino.idCiudad;
      this.extra.opcional = opcional;
      this.extra.productoPrecioTotal = this.productoPrecioTotal;
      this.sendDataToEdit.sendProductToUpdate(this.extra);
      $('.modalAddProducts').modal('close');
      this.productoPrecioTotal = new ProductosPreciosTotales();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Producto agregado correctamente`,
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      this.extraCanasta.extras = this.extra.extras;
      this.extraCanasta.fecha = this.extra.fecha;
      this.extraCanasta.tarifa = this.extra.tarifa;
      this.extraCanasta.comisionAgente = this.extra.comisionAgente;
      this.extraCanasta.comision = this.extra.comision;
      this.extraCanasta.notas = this.extra.notas;
      this.extraCanasta.tipoNombre = 'extra';
      this.extraCanasta.tipo = 8;
      this.extraCanasta.opcional = opcional;
      this.extraCanasta.ciudad = this.destino.ciudad;
      this.extraCanasta.idCiudad = this.destino.idCiudad;
      this.extra.opcional = opcional;
      this._extrasService.create(this.extra).subscribe((res: any) => {
        this.productoPrecioTotal.idProducto = res.insertId;
        this.productosPreciosTotalesService.create(this.productoPrecioTotal).subscribe((resTotal: any) => {
          this.productoPrecioTotal = new ProductosPreciosTotales();
        });
        this.insertCanasta(res.insertId);
        this.extraCanasta.idExtras = res.insertId;
        this._canastaService.addProduct(this.extraCanasta);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Producto agregado correctamente`,
          showConfirmButton: false,
          timer: 1500
        });
        this.redirect.emit(1);
        form.reset();
        this.inicializarModelo();
      }, err => { console.log(err) });
    }
  }

  inicializarModelo(){
    this.validando = false;
    this.extra = new Extra();
    $('.autocomplete-extras').val("");
    this.total = 0;
    this.extra.comisionAgente = this.comisionAgenteBase;
    this.extra.idDestino = this.destino.idDestino;
  }

  insertCanasta(insertId: number){
    this.canasta.idCotizacion = this.destino.idCotizacion;
    this.canasta.idActividad = insertId;
    this.canasta.tipo = 8;
    this._canastaService.create(this.canasta).subscribe(res => {
      this._cotizacionesService.list_one(this.destino.idCotizacion).subscribe((cotizacion: Cotizacion) => {
        let version = new Version();
        version.idActividad = insertId;
        version.tipo = 8; //Es un hotel
        // version.version = 1; //Es una insecion nueva por lo que se inicaliza en 1
        version.idCotizacion = cotizacion.idCotizacion;
        version.versionCotizacion = cotizacion.version;
        version.accion = 1;
        // this.usuariosService.list_oneByCorreo(localStorage.getItem(`correo`)).subscribe((usuario: Usuario) => {
        version.idUsuario = this.usuario.idUsuario;
        this.versionesService.create(version).subscribe((resp) => {});
      });
    }, err => { console.log(err) });
  }

  changeDate(date: any){
    this.extra.fecha = date;
    this.extraCanasta.fecha = date;
  }

  extraTotal(value: number){
    this.total = value;
    this.calcularComision();
  }

  calcularComision(){
    this.total = this.extra.tarifa;
    let comisionRives = (this.extra.comision / 100);
    let comisionAgente = (this.extra.comisionAgente / 100);
    let resMath = this.total * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    let res = (resMath - this.total);
    this.total += res;
  }

  esActualizacion(){
    if(JSON.stringify(this.extraBase) !== JSON.stringify(this.extra)){
      return true;
    }else{
      return false;
    }
  }

  updateCarrito(form) {
    if(form.invalid) return false;
    this.extra.idCotizacion = this.cotizacion.idCotizacion;
    let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
    this.extra.precioPorPersona = (this.total / viajeros);
    this.extra.total = this.total;
    this._extrasService.update(this.extra).subscribe(res => {
      this.refresh.emit(true);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Actualizado correctamente`,
        showConfirmButton: false,
        timer: 1500
      });
    }, err => console.log(err));
  }
}
