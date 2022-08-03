import { Component, Input, OnInit, DoCheck, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Vuelo } from "../../models/Vuelo";
import { VueloEscala } from "../../models/VueloEscala";
import { Destino } from "../../models/Destino";
import { Pais } from "../../models/Pais";
import { Ciudad } from "../../models/Ciudad";
import { Cotizacion } from "../../models/Cotizacion";
import { Canasta } from './../../models/Canasta';
import { DestinosService } from '../../services/destinos.service';
import { VuelosService } from '../../services/vuelos.service';
import { CiudadesService } from '../../services/ciudades.service';
import { VuelosEscalasService } from '../../services/vuelos-escalas.service';
import { CanastaService } from './../../services/canasta.service';
import Swal from 'sweetalert2';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { Version } from 'src/app/models/Version';
import { VersionesService } from '../../services/versiones.service';
import { Usuario } from 'src/app/models/Usuario';
import { UsuariosService } from '../../services/usuarios.service';
import { DatePipe } from '@angular/common';
import * as M from 'materialize-css/dist/js/materialize';
import { SendDataToEditService } from 'src/app/services/sendDataToEdit.service';
import { ProductosPreciosTotalesService } from 'src/app/services/productosPreciosTotales.service';
import { ProductosPreciosTotales } from 'src/app/models/ProductosPreciosTotales';
import { VueloUpgrade } from './../../models/VueloUpgrade';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-vuelos',
  templateUrl: './vuelos.component.html',
  styleUrls: ['./vuelos.component.css'],
})
export class VuelosComponent implements OnInit, DoCheck, OnDestroy {
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
      clase: 'Turista',
      tarifa: 0
    },
    {
      idClase: 2,
      clase: 'Business',
      tarifa: 0
    }
  ];
  public vuelo: any = new Vuelo();
  public vueloUpgrade: any = new VueloUpgrade();
  public vueloBase: any = new Vuelo();
  public vueloEscala: any = new VueloEscala();
  public destino: any = new Destino();
  public canasta: Canasta = new Canasta();
  public cotizacion: any = new Cotizacion();
  public flightWithStopover: boolean = false;
  public countries: Pais[] = [];
  public citiesOrigin: Ciudad[] = [];
  public citiesDestination: Ciudad[] = [];
  public usuario: any = new Usuario();
  public productoPrecioTotal: ProductosPreciosTotales = new ProductosPreciosTotales();
  public message: string = 'directo';
  public weightBag: string = '';
  public weightBagText: string = '';
  public isEscala: boolean = false;
  public vueloCanasta: any = {};
  public total: number = 0;
  public idCotizacion: number = 0;
  public dataAutocomplete: any = [];
  public cities: any[] = [];
  public vueloOrigen: string = '';
  public vueloDestino: string = '';
  public comisionAgenteBase: number = 0;
  public actualClase: any = {};
  public vuelosUpgrade: any[] = [];
  public showMaleta: boolean = false;
  public validando: boolean = false;

  constructor(
    private _destinosService: DestinosService,
    private _vuelosService: VuelosService,
    private _vuelosEscalasService: VuelosEscalasService,
    private _canastaService: CanastaService,
    private _cotizacionesService: CotizacionesService,
    private versionesService: VersionesService,
    private usuariosService: UsuariosService,
    private datePipe: DatePipe,
    private sendDataToEdit: SendDataToEditService,
    private ciudadesService: CiudadesService,
    private productosPreciosTotalesService: ProductosPreciosTotalesService,
    private router: Router

  ) { }

  ngOnInit(): void {
    if (this.router.url.includes("cotizacionProductos") && !this.editingCarrito) {
      $(".tabs").tabs("select", "vuelos");
    }
    this.getCitiesDestino();
    this.text('', '', '', '', '', '', '');
    this.getDestino();
    this.getCotizacion();
    this.getUsuario();
    $(document).ready(function () {
      $('.collapsible').collapsible();
      $('.timepicker').timepicker();
    });
    if(this.editing){
      $('#modalDetalleVuelo').modal({ dismissible: false });
      this.sendDataToEdit.getProduct('vuelo').subscribe((vuelo: any) => {
        this.changeDatepicker('.fecha-vuelo', new Date(vuelo.fecha));
        this.vueloBase = vuelo;
        this.vueloToUpdate(vuelo);
      }, (err: any) => console.log(err));
    }else{
      this.getComisionAgenteByCotizacion();
      let fecha = localStorage.getItem('fechaInicio');
      this.changeDatepicker('.fecha-vuelo', new Date(fecha += 'T00:00:00'));
      fecha = localStorage.getItem('fechaInicio');
      this.changeDatepicker('.fecha-escala', new Date(fecha += 'T00:00:00'));
    }
  }

  getDestino(){
    this._destinosService.getActualDestino().subscribe((destino: Destino) => {
      if (Object.keys(destino).length === 0) return false;
      this.destino = destino;
      this.vuelo.idDestino = this.destino.idDestino;
      this.vueloOrigen = this.destino.ciudad;
      this.text(this.message, this.vueloOrigen, this.vueloDestino, this.vuelo.clase, this.vuelo.horaSalida, this.vuelo.horaLlegada, this.weightBagText);
      this.vuelo.origen = this.destino.idCiudad;
      $('#autocomplete_origenVuelos').val(this.destino.ciudad);
    });
  }

  getCotizacion(){
    this.sendDataToEdit.getProduct('cotizacion').subscribe((cotizacion: any) => {
      if(Object.keys(cotizacion).length === 0) return false;
      this.cotizacion = cotizacion;
      if(!this.editing){
        this.vuelo.noViajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
      }
    });
  }

  getUsuario(){
    let s = this.usuariosService.getUser().subscribe(usuario => {
      if(Object.keys(usuario).length === 0) return false;
      this.usuario = usuario;
    });
    this.suscripciones.push(s);
  }

  ngOnDestroy(): void{
    this.suscripciones.map(s => s.unsubscribe());
  }

  ngDoCheck(): void {
    M.updateTextFields();
    $('.collapsible').collapsible();
  }

  changeDatepicker(id: string, date: Date) {
    let fecha1 = localStorage.getItem('fechaInicio');
    let fecha2 = localStorage.getItem('fechaFinal');
    let minDate: any = new Date(fecha1 += 'T00:00:00');
    let maxDate: any = new Date(fecha2 += 'T00:00:00');
    $(id).datepicker({
      minDate: minDate,
      maxDate: maxDate,
      setDefaultDate: date,
      defaultDate: date,
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
      $('input#autocomplete_destinoVuelos').autocomplete({
        data: this.dataAutocomplete,
        onAutocomplete: (citySelected) => {
          this.vueloDestino = citySelected;
          delete this.vuelo.valid;
          this.text(this.message, this.vueloOrigen, this.vueloDestino, this.vuelo.clase, this.vuelo.horaSalida, this.vuelo.horaLlegada, this.weightBagText);
          let destino = this.cities.filter((city) => city.nombre === citySelected);
          this.vuelo.destino = destino[0].idCiudad;
        }
      });
    });
  }

  vueloToUpdate(vuelo: any) {
    this.vuelo = Object.assign({}, vuelo);
    this.vueloTotal(this.vuelo.tarifa);
    this.vuelo.fecha = this.datePipe.transform(
      new Date(this.vuelo.fecha),
      "yyyy-MM-dd"
    );
    this.vueloBase.fecha = this.vuelo.fecha;
    this.actualClase = this.clases.find(clase => clase.clase === this.vueloBase.clase);
    $('#autocomplete_origenVuelos').val(this.vuelo.origenN);
    $('#autocomplete_destinoVuelos').val(this.vuelo.destinoN);
    this.vuelo.clase !== '' && this.vuelo.clase === 'Turista' ? $('#vueloClase').val("Turista") : $('#vueloClase').val("Business");
    this._vuelosService.getVuelosUpgrade(this.vueloBase.idVuelo).subscribe((res: any) => {
      this.vuelosUpgrade = res;
      if (this.vuelosUpgrade.length > 0) {
        this.clases.map((c) => {
          if(c.clase === this.vuelosUpgrade[0].clase){
            c.tarifa = this.vuelosUpgrade[0].diferencia;
          }
        });
      }
      if (this.vuelo.escala) {
        $("#flightWithStopoverButton").text('Vuelo sin escala');
        this.isEscala = true;
        $("#flightWithStopover").css('display', 'block');
        this.vueloEscala = {
          idVueloEscala: vuelo.idVueloEscala,
          idVuelo: vuelo.idVuelo,
          tiempo: vuelo.tiempoEscala,
          lugar: vuelo.lugarEscala,
          fecha: vuelo.fechaEscala
        }
        this.changeDatepicker('.fecha-escala', this.vueloEscala.fecha);
        this.vueloEscala.fecha = this.datePipe.transform(
          new Date(this.vuelo.fechaEscala),
          "yyyy-MM-dd"
        );
      } else { 
        $("#flightWithStopoverButton").text('Vuelo con escala');
        this.isEscala = false;
        $("#flightWithStopover").css('display', 'none');
        this.vueloEscala = new VueloEscala();
      }
      if (this.vuelo.maletaPeso !== 0) {
        this.showMaleta = true;
        $("#showMaletaPeso").css('display', 'block');
        $('#checkMaleta').prop('checked', true);
      } else {
        this.showMaleta = false;
        $("#showMaletaPeso").css('display', 'none');
        $('#checkMaleta').prop('checked', false);
      }
      this.vueloBase = Object.assign({}, this.vuelo);
    });
  }

  abrirModalDetalle(){
    if(this.esActualizacion()){
      $('#modalDetalleVuelo').modal('open');
    }else{
      $('.modalSendProducts').modal('close');
      $('#modalDetalleVuelo').modal('close');
    }
  }

  async onUpdate() {
    this.vuelo.nota = $('#detalle').val();
    this.vuelo.editado = true;
    if(this.vuelo.nota.trim() === ''){
      M.toast({
        html: 'Error: El campo es obligatorio',
        classes: 'rounded red darken-3'
      });
    }else{
      
      this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
      this.productoPrecioTotal.tipoProducto = 5;
      let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
      this.productoPrecioTotal.precioPorPersona = (this.total / viajeros);
      this.productoPrecioTotal.total = this.total;
      this.vuelo.productoPrecioTotal = this.productoPrecioTotal;

      this.vueloEscala.idVuelo = 0;
      this.vueloEscala.idVueloEscala = 0;
      this.isEscala ? this.vuelo.escala = this.vueloEscala : false;
      this.sendDataToEdit.sendProductToUpdate(this.vuelo);
      $('#modalDetalleVuelo').modal('close');
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

  getComisionAgenteByCotizacion() {
    this.idCotizacion = parseInt(localStorage.getItem('idCotizacion'));
    if (this.idCotizacion !== undefined && !isNaN(this.idCotizacion)) {
      this._cotizacionesService.getComisionAgenteByCotizacion(this.idCotizacion, 8).subscribe((res: any) => {
        if(Object.keys(res).length === 0) return false;
        this.vuelo.comisionAgente = res[0].comision;
        this.comisionAgenteBase = res[0].comision;
      }, err => { console.log(err) });
    }
  }

  text(message: string, origen: string, destino: string, clase: string, salida: string, llegada: string, peso: string) {
    this.vuelo.descripcion = `Tomarán su vuelo ${message} desde ${origen} hacía ${destino} que sale a las ${salida} y llega a las ${llegada}\nClase: ${clase}\n${peso}`;
  }

  async onSubmit(form: any) {
    this.validando = true;
    if(form.invalid) return false;
    const { value: opcional } = await Swal.fire({
      input: 'checkbox',
      inputValue: 0,
      backdrop: false,
      inputPlaceholder:
        'Es un vuelo opcional',
      confirmButtonText:
        'Continuar <i class="fa fa-arrow-right"></i>',
    });
    this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
    this.productoPrecioTotal.tipoProducto = 5;
    let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
    this.productoPrecioTotal.precioPorPersona = (this.total / viajeros);
    this.productoPrecioTotal.total = this.total;
    if(this.adding){
      this.vuelo.nuevo = true;
      this.vuelo.id = this.vuelo.idVuelo;
      this.vuelo.type = 'Vuelo';
      this.vuelo.precio = this.vuelo.tarifa;
      this.vuelo.valido = true;
      this.vuelo.idToSend = 8;
      this.vuelo.idCiudad = this.destino.idCiudad;
      this.vuelo.opcional = opcional;
      this.vuelo.mejoras = this.vuelosUpgrade;
      this.isEscala ? this.vuelo.escala = this.vueloEscala : false;
      this.vuelo.productoPrecioTotal = this.productoPrecioTotal;
      this.sendDataToEdit.sendProductToUpdate(this.vuelo);
      form.reset();
      this.inicializarModelo();
      this.clases.map(clase => {
        $(`#mejoraVuelo${clase.idClase}`).prop("checked", false); 
        delete clase.tarifa
      });
      $('.modalAddProducts').modal('close');
      this.productoPrecioTotal = new ProductosPreciosTotales();
      this.vuelosUpgrade = [];
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Producto agregado correctamente`,
        showConfirmButton: false,
        timer: 1500
      });
    }else{
      this.vueloCanasta = this.vuelo;
      this.vueloCanasta.idProducto ? delete this.vueloCanasta.idProducto : this.vueloCanasta;
      this.vuelo.idVuelo = 0;
      this.vuelo.opcional = opcional;
      this._vuelosService.create(this.vuelo).subscribe((res1: any) => {
        this.productoPrecioTotal.idProducto = res1.insertId;
        // this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
        // this.productoPrecioTotal.tipoProducto = 5;
        // let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
        // this.productoPrecioTotal.precioPorPersona = (this.total / viajeros);
        // this.productoPrecioTotal.total = this.total;
        this.productosPreciosTotalesService.create(this.productoPrecioTotal).subscribe((resTotal: any) => {
          this.productoPrecioTotal = new ProductosPreciosTotales();
        });
        this.vuelosUpgrade.map((vueloUpgrade) => {
          vueloUpgrade.idVuelo = res1.insertId;
          vueloUpgrade.fecha = this.vuelo.fecha;
          delete vueloUpgrade.idClase;
          this._vuelosService.upgrade(vueloUpgrade).subscribe((res: any) => {
            this.clases.map(clase => {
              $(`#mejoraVuelo${clase.idClase}`).prop("checked", false); 
              delete clase.tarifa
            });
          });
        });
        this.vuelosUpgrade = [];
        this.insertCanasta(res1.insertId, opcional);
        this.vueloCanasta.idVuelo = res1.insertId;
        this.vueloCanasta.origenN = this.vueloOrigen;
        this.vueloCanasta.destinoN = this.vueloDestino;
        this.vueloCanasta.precio = this.vuelo.precio;

        if(this.isEscala){
          this.vueloEscala.idVuelo = res1.insertId;
          this.vueloCanasta.fechaEscala = this.vueloEscala.fecha;
          this.vueloCanasta.lugarEscala = this.vueloEscala.lugar;
          this.vueloCanasta.tiempoEscala = this.vueloEscala.tiempo;
          this.vueloCanasta.maletaPeso = this.vuelo.maletaPeso === '' ? '0' : this.vuelo.maletaPeso;
          this._vuelosEscalasService.create(this.vueloEscala).subscribe((res2: any) => {
            this.vueloCanasta.tipo = 5;
            this.vueloCanasta.opcional = opcional;
            this.vueloCanasta.idCiudad = this.destino.idCiudad;
            this.vueloCanasta.tipoNombre = 'vuelo';
            this.vueloCanasta.comisionAgente = this.vuelo.comisionAgente;
            this.vueloCanasta.comision = this.vuelo.comision;
            this.vueloCanasta.tarifa = this.vuelo.tarifa;
            this.vueloCanasta.escala = 1;
            this.vueloCanasta.idVueloEscala = res2.insertId;
            this._canastaService.addProduct(this.vueloCanasta);
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
        }else{
          this.vueloCanasta.tipo = 5;
          this.vueloCanasta.idCiudad = this.destino.idCiudad;
          this.vueloCanasta.maletaPeso = this.vuelo.maletaPeso === 0 ? 0 : this.vuelo.maletaPeso;
          this.vueloCanasta.tipoNombre = 'vuelo';
          this.vueloCanasta.comisionAgente = this.vuelo.comisionAgente;
          this.vueloCanasta.comision = this.vuelo.comision;
          this.vueloCanasta.tarifa = this.vuelo.tarifa;
          this._canastaService.addProduct(this.vueloCanasta);
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
        }
      }, err => { console.log(err) });
    }
  }

  inicializarModelo(){
    setTimeout(() => {
      this.vuelo = new Vuelo();
      this.vueloEscala = new VueloEscala();
      this.validando = false;
      $('#autocomplete_origenVuelos').val("");
      $('#autocomplete_destinoVuelos').val("");
      $("#showMaletaPeso").css('display', 'none');
      $("#flightWithStopover").css('display', 'none');
      $('#checkMaleta').prop('checked', false);
      this.isEscala = false;
      this.total = 0;
      this.vueloCanasta = {};
      this.vuelo.comisionAgente = this.comisionAgenteBase;
      this.vuelo.idDestino = this.destino.idDestino;
      this.vuelo.origen = this.destino.idCiudad;
      this.vueloDestino = '';
      $('#autocomplete_origenVuelos').val(this.destino.ciudad);
      this.vuelo.noViajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
      this.text(this.message, this.vueloOrigen, this.vueloDestino, this.vuelo.clase, this.vuelo.horaSalida, this.vuelo.horaLlegada, this.weightBagText);
    }, 0);
  }

  showFlightWithStopover() {
    let buttonText = $("#flightWithStopoverButton").text();
    if(buttonText == "Vuelo con escala"){
      this.isEscala = true;
      $("#flightWithStopoverButton").text('Vuelo sin escala');
      this.message = `con escala en ${this.vueloEscala.lugar} con una duración de ${this.vueloEscala.tiempo}`;
    }else{
      this.isEscala = false;
      $("#flightWithStopoverButton").text('Vuelo con escala');
      this.message = `directo`;
      // let pesoText = `Maleta de ${this.weightBag}kg incluida`;
    }
    this.text(this.message, this.vueloOrigen, this.vueloDestino, this.vuelo.clase, this.vuelo.horaSalida, this.vuelo.horaLlegada, this.weightBagText);
  }

  insertCanasta(insertId: number, opcional: number) {
    this.canasta.idCotizacion = this.destino.idCotizacion;
    this.canasta.idActividad = insertId;
    this.canasta.tipo = 5;
    this._canastaService.create(this.canasta).subscribe(
      res => {
        this._cotizacionesService
        .list_one(this.destino.idCotizacion)
        .subscribe((cotizacion: Cotizacion) => {
          let version = new Version();
          version.idActividad = insertId;
          version.tipo = 5; //Es un hotel
          // version.version = 1; //Es una insecion nueva por lo que se inicaliza en 1
          version.idCotizacion = cotizacion.idCotizacion;
          version.versionCotizacion = cotizacion.version;
          version.accion = 1;
          // this.usuariosService.list_oneByCorreo(localStorage.getItem(`correo`)).subscribe((usuario: Usuario) => {
          version.idUsuario = this.usuario.idUsuario;
          this.versionesService.create(version).subscribe((resp) => { });
        });
      },
      err => {
        console.log(err);
      }
    )
  }

  changeDateViaje(){
    let date = $("#fechaViaje").val();
    this.vuelo.fecha = date;
  }

  changeDateEscala(){
    let date = $("#fechaEscala").val();
    this.vueloEscala.fecha = date;
  }

  buildDescription(input: any, id: string){
    switch(id){
      case 'clase':
        this.actualClase = this.clases.find(clase => clase.clase === input);
        this.vuelo.clase = input;
        this.text(this.message, this.vueloOrigen, this.vueloDestino, this.vuelo.clase, this.vuelo.horaSalida, this.vuelo.horaLlegada, this.weightBagText);
        break;
      case 'horaSalida':
        this.vuelo.horaSalida = input.target.value;
        this.text(this.message, this.vueloOrigen, this.vueloDestino, this.vuelo.clase, this.vuelo.horaSalida, this.vuelo.horaLlegada, this.weightBagText);
        break;
      case 'horaLlegada':
        this.vuelo.horaLlegada = input.target.value;
        this.text(this.message, this.vueloOrigen, this.vueloDestino, this.vuelo.clase, this.vuelo.horaSalida, this.vuelo.horaLlegada, this.weightBagText);
        break;
      case 'maletaPeso':
        this.weightBag = input;
        this.weightBagText = `Maleta de ${this.weightBag}kg incluida`;
        this.vuelo.maletaPeso = input;
        this.text(this.message, this.vueloOrigen, this.vueloDestino, this.vuelo.clase, this.vuelo.horaSalida, this.vuelo.horaLlegada, this.weightBagText);
        break;
      case 'tiempoEscala':
        this.vueloEscala.tiempo = input;
        this.message = `con escala en ${this.vueloEscala.lugar} con una duración de ${this.vueloEscala.tiempo}`;
        this.text(this.message, this.vueloOrigen, this.vueloDestino, this.vuelo.clase, this.vuelo.horaSalida, this.vuelo.horaLlegada, this.weightBagText);
        break;
      case 'lugarEscala':
        this.vueloEscala.lugar = input;
        this.message = `con escala en ${this.vueloEscala.lugar} con una duración de ${this.vueloEscala.tiempo}`;
        this.text(this.message, this.vueloOrigen, this.vueloDestino, this.vuelo.clase, this.vuelo.horaSalida, this.vuelo.horaLlegada, this.weightBagText);
        break;
    }
  }

  showInputMaletaPeso(){
    $("#showMaletaPeso").css('display', 'block');
    if(this.showMaleta){
      this.weightBagText = `Maleta de ${this.vuelo.maletaPeso}kg incluida`;
    }else{
      this.weightBagText = ``;
      this.vuelo.maletaPeso = 0;
    }
    this.text(this.message, this.vueloOrigen, this.vueloDestino, this.vuelo.clase, this.vuelo.horaSalida, this.vuelo.horaLlegada, this.weightBagText);
  }

  vueloTotal(value: number){
    this.total = value;
    this.calcularComision();
    this.clases.map(clase => {
      delete clase.tarifa;
      $(`#mejoraVuelo${clase.idClase}`).prop("checked", false);
    });
    this.vuelosUpgrade = [];
  }

  calcularComision(){
    this.total = this.vuelo.tarifa;
    let comisionRives = (this.vuelo.comision / 100);
    let comisionAgente = (this.vuelo.comisionAgente / 100);
    let resMath = this.total * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    let res = (resMath - this.total);
    this.total += res;
  }

  esActualizacion(){
    if(JSON.stringify(this.vueloBase) !== JSON.stringify(this.vuelo)){
      return true;
    }else{
      return false;
    }
  }

  async cargarMejoras(clase: any){
    let i = this.vuelosUpgrade.findIndex((trenU: any) => trenU.idClase == clase.idClase);
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
      if (tarifa) {
        let diferencia: number = (this.comisionMejoras(tarifa) - this.total);
        this.clases.map((c) => {
          if(c.idClase === clase.idClase){
            c.tarifa = diferencia;
          }
        });
        this.vueloUpgrade.idCotizacion = this.cotizacion.idCotizacion;
        this.vueloUpgrade.clase = clase.clase;
        this.vueloUpgrade.diferencia = diferencia;
        this.vueloUpgrade.idClase = clase.idClase;
        this.adding ? this.vueloUpgrade.versionCotizacion = (this.cotizacion.version + 1) : '';
        this.vuelosUpgrade.push(this.vueloUpgrade);
        console.log("vuelosUpgrade", this.vuelosUpgrade);
        this.vueloUpgrade = new VueloUpgrade();
      }else{
        $(`#mejoraVuelo${clase.idClase}`).prop("checked", false);
      }
    }else{
      this.vuelosUpgrade.splice(i, 1);
      this.clases.map((c) => {
        if(c.idClase === clase.idClase){
          delete c.tarifa;
          $(`#mejoraVuelo${clase.idClase}`).prop("checked", false);
        }
      });
    }

    console.log(clase);
  }

  comisionMejoras(tarifaBase: number){
    let comisionRives = (this.vuelo.comision / 100);
    let comisionAgente = (this.vuelo.comisionAgente / 100);
    let total = tarifaBase * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    return total;
  }

  updateCarrito(form) {
    if(form.invalid) return false;
    this.vuelo.idCotizacion = this.cotizacion.idCotizacion;
    let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
    this.vuelo.precioPorPersona = (this.total / viajeros);
    this.vuelo.total = this.total;

    this._vuelosService.update(this.vuelo, this.vuelosUpgrade).subscribe(
      res => {
        this.refresh.emit(true);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Actualizado correctamente`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }
}
