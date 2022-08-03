import { Component, Input, OnInit, DoCheck, AfterViewInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import { DatePipe } from "@angular/common";
import { Tren } from "../../models/Tren";
import { Destino } from "../../models/Destino";
import { Cotizacion } from "../../models/Cotizacion";
import { Canasta } from './../../models/Canasta';
import { DestinosService } from '../../services/destinos.service';
import { TrenesService } from '../../services/trenes.service';
import { CanastaService } from './../../services/canasta.service';
import Swal from 'sweetalert2';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { Version } from 'src/app/models/Version';
import { VersionesService } from '../../services/versiones.service';
import { Usuario } from 'src/app/models/Usuario';
import { UsuariosService } from '../../services/usuarios.service';
import * as M from 'materialize-css/dist/js/materialize';
import { SendDataToEditService } from 'src/app/services/sendDataToEdit.service';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { Ciudad } from 'src/app/models/Ciudad';
import { TarifasService } from './../../services/tarifas.service';
import { ProductosPreciosTotalesService } from 'src/app/services/productosPreciosTotales.service';
import { ProductosPreciosTotales } from 'src/app/models/ProductosPreciosTotales';
import { TrenUpgrade } from './../../models/TrenUpgrade';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-trenes',
  templateUrl: './trenes.component.html',
  styleUrls: ['./trenes.component.css'],
})
export class TrenesComponent implements OnInit, DoCheck, AfterViewInit, OnDestroy {
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
  public clases: any[] = [
    {
      idClase: 1,
      clase: 'Primera',
      tarifa: 0
    },
    {
      idClase: 2,
      clase: 'Segunda',
      tarifa: 0
    }
  ];
  public tren: any = new Tren();
  public trenUpgrade: any = new TrenUpgrade();
  public trenBase: any = new Tren();
  public destino: any = new Destino();
  public canasta: Canasta = new Canasta();
  public cotizacion: any = new Cotizacion();
  public usuario: any = new Usuario();
  public productoPrecioTotal: ProductosPreciosTotales = new ProductosPreciosTotales;
  public trenCanasta: any = {};
  public total: number = 0;
  public idCotizacion: number = 0;
  public dataAutocomplete: any = [];
  public cities: any[] = [];
  public trenOrigen: string = '';
  public trenDestino: string = '';
  public comisionAgenteBase: number = 0;
  public actualClase: any = {};
  public trenesUpgrade: any[] = [];
  public validando: boolean = false;

  constructor(
    private _destinosService: DestinosService,
    private _trenesService: TrenesService,
    private _canastaService: CanastaService,
    private _cotizacionesService: CotizacionesService,
    private datePipe: DatePipe,
    private versionesService: VersionesService,
    private usuariosService: UsuariosService,
    private sendDataToEditService: SendDataToEditService,
    private ciudadesService: CiudadesService,
    private tarifasService: TarifasService,
    private productosPreciosTotalesService: ProductosPreciosTotalesService,
    private router: Router

  ) {}

  ngOnInit(): void {
    if(this.router.url.includes("cotizacionProductos") && !this.editingCarrito){
      $(".tabs").tabs("select", "trenes");
    }
    $('.collapsible').collapsible();
    let fecha = localStorage.getItem('fechaInicio');
    this.changeDatepicker('#fechaTren', fecha);
    this.getCitiesDestino();
    this.getDestino();
    this.getCotizacion();
    this.getUsuario();
    if(this.editing){
      $('#modalDetalleTren').modal({ dismissible: false });
      this.sendDataToEditService.getProduct('tren').subscribe((tren: any) => {
        this.trenBase = tren;
        this.trenToUpdate(tren);
      });
    }else{
      this.getComisionAgenteByCotizacion();
    }
  }

  getDestino(){
    this._destinosService.getActualDestino().subscribe((destino: Destino) => {
      if(Object.keys(destino).length === 0) return false;
      this.destino = destino;
      this.tren.idDestino = this.destino.idDestino;
      this.trenOrigen = this.destino.ciudad;
      this.tren.origen = this.destino.idCiudad;
      $('#autocomplete_origen_tren').val(this.trenOrigen);
    });
  }

  getUsuario(){
    let s = this.usuariosService.getUser().subscribe(usuario => {
      if(Object.keys(usuario).length === 0) return false;
      this.usuario = usuario;
    });
    this.suscripciones.push(s);
  }

  getCotizacion(){
    this.sendDataToEditService.getProduct('cotizacion').subscribe((cotizacion: any) => {
      if(Object.keys(cotizacion).length === 0) return false;
      this.cotizacion = cotizacion;
      if(!this.editing){
        this.tren.noViajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
      }
    });
  }

  ngDoCheck(): void {
    M.updateTextFields();
    $('.collapsible').collapsible();
  }

  ngAfterViewInit(): void {
    $('#horarioInfo').timepicker();
  }

  ngOnDestroy(): void{
    this.suscripciones.map(s => s.unsubscribe());
  }

  changeDatepicker(id: string, date: any){
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

  getCitiesDestino() {
    this.dataAutocomplete = [];
    this.ciudadesService.list().subscribe((resp: Ciudad[]) => {
      this.cities = resp;
      let datos = '{';
      for (const ll of this.cities) {
        if (datos === '{')
          datos += '"' + ll.nombre + '": ""';
        else
          datos += ',"' + ll.nombre + '": ""';
      }
      datos += '}';
      this.dataAutocomplete = JSON.parse(datos);
      $('input#autocomplete_destino_tren').autocomplete({
        data: this.dataAutocomplete,
        onAutocomplete: (citySelected) => {
          this.trenDestino = citySelected;
          delete this.tren.valid;
          let destino = this.cities.filter((city) => city.nombre === citySelected);
          this.tren.destino = destino[0].idCiudad;
        }
      });
    });
  }

  trenToUpdate(tren: any) {
    this.tren = Object.assign({}, tren);
    this._trenesService.getTrenesUpgrade(this.tren.idTren).subscribe(
      (res: any) => {
        this.trenesUpgrade = res;
        console.log("this.trenesUpgrade", this.trenesUpgrade);
        if (this.trenesUpgrade.length > 0) {
          this.clases.map((c) => {
            if (this.trenesUpgrade.find(tu => tu.clase == c.clase) != undefined) {
              c.tarifa = this.trenesUpgrade[0].diferencia;
              console.log(c);

            }
          });
  
        }
        console.log(this.clases);
        this.tren.fecha = this.datePipe.transform(
          new Date(this.tren.fecha),
          "yyyy-MM-dd"
        );
        this.trenBase.fecha = this.tren.fecha;
        console.log("tren base ", this.tren);
        $('#autocomplete_origen_tren').val(this.tren.origenN);
        $('#autocomplete_destino_tren').val(this.tren.destinoN);
        this.changeDatepicker('#fechaTren', this.tren.fecha);
        if (!this.editingCarrito) {
          this.trenTotal(this.tren.tarifa);
        } else{
          this.calcularComision();
        }
       
        this.trenBase = Object.assign({}, this.tren);
      }
    );
  
  }

  abrirModalDetalle(){
    if(this.esActualizacion()){
      $('#modalDetalleTren').modal('open');
    }else{
      $('.modalSendProducts').modal('close');
      $('#modalDetalleTren').modal('close');
    }
  }

  onUpdate(){
    this.tren.nota = $('#detalle').val();
    this.tren.editado = true;
    if(this.tren.nota.trim() === ''){
      M.toast({
        html: 'Error: El campo es obligatorio',
        classes: 'rounded red darken-3'
      });
    }else{

      this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
      this.productoPrecioTotal.tipoProducto = 6;
      this.productoPrecioTotal.total = this.total;
      this.tren.productoPrecioTotal = this.productoPrecioTotal;

      this.sendDataToEditService.sendProductToUpdate(this.tren);
      $('#modalDetalleTren').modal('close');
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
      this._cotizacionesService.getComisionAgenteByCotizacion(this.idCotizacion, 8).subscribe((res: any) => {
        if(Object.keys(res).length === 0) return false;
        this.tren.comisionAgente = res[0].comision;
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
        'Es un tren opcional',
      confirmButtonText:
        'Continuar <i class="fa fa-arrow-right"></i>',
    });
    this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
    this.productoPrecioTotal.tipoProducto = 6;
    this.productoPrecioTotal.total = this.total;
    if (this.adding) {
      this.tren.nuevo = true;
      this.tren.id = this.tren.idTren;
      this.tren.type = 'Tren';
      this.tren.precio = this.tren.tarifa;
      this.tren.valido = true;
      this.tren.idToSend = 9;
      this.tren.idCiudad = this.destino.idCiudad;
      this.tren.opcional = opcional;
      this.tren.mejoras = this.trenesUpgrade;
      this.tren.productoPrecioTotal = this.productoPrecioTotal;
      this.sendDataToEditService.sendProductToUpdate(this.tren);
      this.inicializarModelo();
      this.clases.map(clase => {
        $(`#mejoraTren${clase.idClase}`).prop("checked", false);
        delete clase.tarifa
      });
      $('.modalAddProducts').modal('close');
      this.productoPrecioTotal = new ProductosPreciosTotales();
      this.trenesUpgrade = [];
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Producto agregado correctamente`,
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      this.trenCanasta = this.tren;
      this.trenCanasta.idProducto ? delete this.trenCanasta.idProducto : this.trenCanasta;
      this.tren.idTren = 0;
      this.tren.opcional = opcional;
      this._trenesService.create(this.tren).subscribe((res: any) => {
        this.productoPrecioTotal.idProducto = res.insertId;
        this.productosPreciosTotalesService.create(this.productoPrecioTotal).subscribe((resTotal: any) => {
          this.productoPrecioTotal = new ProductosPreciosTotales();
        });
        this.trenesUpgrade.map((trenUpgrade) => {
          trenUpgrade.idTren = res.insertId;
          trenUpgrade.fecha = this.tren.fecha;
          delete trenUpgrade.idClase;
          this._trenesService.upgrade(trenUpgrade).subscribe((res: any) => {
            this.clases.map(clase => {
              $(`#mejoraTren${clase.idClase}`).prop("checked", false);
              delete clase.tarifa
            });
          });
        });
        this.trenesUpgrade = [];
        this.insertCanasta(res.insertId);
        this.trenCanasta.idTren = res.insertId;
        this.trenCanasta.origenN = this.trenOrigen;
        this.trenCanasta.destinoN = this.trenDestino;
        this.trenCanasta.comisionAgente = this.tren.comisionAgente;
        this.trenCanasta.comision = this.tren.comision;
        this.trenCanasta.ciudad = this.destino.ciudad;
        this.trenCanasta.idCiudad = this.destino.idCiudad;
        this.trenCanasta.tipo = 6;
        this.trenCanasta.opcional = opcional;
        this.trenCanasta.tipoNombre = 'tren';
        this.trenCanasta.precio = this.total;
        this._canastaService.addProduct(this.trenCanasta);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Producto agregado correctamente`,
          showConfirmButton: false,
          timer: 2000
        });
        this.redirect.emit(1);
        form.reset();
        this.inicializarModelo();
      }, err => { console.log(err) });
    }
  }

  inicializarModelo(){
    setTimeout(() => {
      this.validando = false;
      this.tren = new Tren();
      this.getDestino();
      $('#autocomplete_origen_tren').val(this.destino.ciudad);
      $('#autocomplete_destino_tren').val("");
      this.total = 0;
      this.trenOrigen = '';
      this.trenDestino = '';
      this.tren.comisionAgente = this.comisionAgenteBase;
      this.tren.idDestino = this.destino.idDestino;
      this.tren.noViajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
    }, 0);
  }

  insertCanasta(insertId: number) {
    this.canasta.idCotizacion = this.destino.idCotizacion;
    this.canasta.idActividad = insertId;
    this.canasta.tipo = 6;
    this._canastaService.create(this.canasta).subscribe(res => {
      this._cotizacionesService.list_one(this.destino.idCotizacion).subscribe((cotizacion: Cotizacion) => {
        let version = new Version();
        version.idActividad = insertId;
        version.tipo = 6; //Es un tren
        // version.version = 1; //Es una insecion nueva por lo que se inicaliza en 1
        version.idCotizacion = cotizacion.idCotizacion;
        version.versionCotizacion = cotizacion.version;
        version.accion = 1;
        // this.usuariosService.list_oneByCorreo(localStorage.getItem(`correo`)).subscribe((usuario: Usuario) => {
        version.idUsuario = this.usuario.idUsuario;
        this.versionesService.create(version).subscribe((resp) => { });
      });
    }, err => { console.log(err) });
  }

  changeDate(){
    let date = $("#fechaTren").val();
    this.tren.fecha = date;
  }

  trenTotal(value: number){
    //this.total = value;
    this.calcularComision();
    this.clases.map(clase => {
      delete clase.tarifa;
      $(`#mejoraTren${clase.idClase}`).prop("checked", false);
    });

    this.trenesUpgrade = [];
  }

  calcularComision() {
    this.total = (this.tren.noViajerosMayores*this.tren.tarifaMayores) + (this.tren.noViajerosMenores*this.tren.tarifaMenores) ;
    this.tren.tarifa = this.total;
    let comisionRives = (this.tren.comision / 100);
    let comisionAgente = (this.tren.comisionAgente / 100);
    let resMath = this.total * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    let res = (resMath - this.total);
    this.total += res;
  }

  esActualizacion(){
    if(JSON.stringify(this.trenBase) !== JSON.stringify(this.tren)){
      return true;
    }else{
      return false;
    }
  }

  changeActualClase(input: any){
    this.actualClase = this.clases.find(clase => clase.clase === input.target.value);
  }

  async cargarMejoras(clase: any){
    let i = this.trenesUpgrade.findIndex((trenU: any) => trenU.idClase == clase.idClase);
    if(i === -1){
      const { value: tarifa } = await Swal.fire({
        input: 'number',
        showCancelButton: true,
        backdrop: false,
        inputLabel: `Ingresa la tarifa total para la clase ${clase.clase}`,
        inputValidator: (value) => {
          if (!value) {
            return 'El campo es obligatorio'
          }
        }
      });
      if(tarifa){
        let diferencia: number = (this.comisionMejoras(tarifa) - this.total);
        this.clases.map((c) => {
          if(c.idClase === clase.idClase){
            c.tarifa = diferencia;
          }
        });
        this.trenUpgrade.idCotizacion = this.cotizacion.idCotizacion;
        this.trenUpgrade.clase = clase.clase;
        this.trenUpgrade.diferencia = diferencia;
        this.trenUpgrade.idClase = clase.idClase;
        this.adding ? this.trenUpgrade.versionCotizacion = (this.cotizacion.version + 1) : '';
        this.trenesUpgrade.push(this.trenUpgrade);
        this.trenUpgrade = new TrenUpgrade();
      }else{
        $(`#mejoraTren${clase.idClase}`).prop("checked", false);
      }
    }else{
      this.trenesUpgrade.splice(i, 1);
      this.clases.map((c) => {
        if(c.idClase === clase.idClase){
          delete c.tarifa;
          $(`#mejoraTren${clase.idClase}`).prop("checked", false);
        }
      });
    }
  }

  comisionMejoras(tarifaBase: number){
    let comisionRives = (this.tren.comision / 100);
    let comisionAgente = (this.tren.comisionAgente / 100);
    let total = tarifaBase * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    return total;
  }

  updateCarrito(form) {
    if(form.invalid) return false;
    this.tren.idCotizacion = this.cotizacion.idCotizacion;
    let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
    this.tren.precioPorPersona = (this.total / viajeros);
    this.tren.total = this.total;
    this._trenesService.update(this.tren, this.trenesUpgrade).subscribe(res => {
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
