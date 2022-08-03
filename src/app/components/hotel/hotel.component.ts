import { Component, Input, OnInit, DoCheck, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { DatePipe } from "@angular/common";
import { Hotel } from '../../models/hotel';
import { Destino } from "../../models/Destino";
import { Cotizacion } from "../../models/Cotizacion";
import { Canasta } from './../../models/Canasta';
import { HotelTarifa } from './../../models/HotelTarifa';
import { HotelesService } from './../../services/hoteles.service';
import { DestinosService } from '../../services/destinos.service';
import { CanastaService } from './../../services/canasta.service';
import { HotelesTarifasService } from './../../services/hoteles-tarifas.service';
import * as M from 'materialize-css/dist/js/materialize';
import { PaisesService } from './../../services/paises.service';
import { Pais } from './../../models/Pais';
import { CiudadesService } from './../../services/ciudades.service';
import Swal from 'sweetalert2';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { VersionesService } from 'src/app/services/versiones.service';
import { Version } from 'src/app/models/Version';
import { Usuario } from 'src/app/models/Usuario';
import { UsuariosService } from '../../services/usuarios.service';
import { SendDataToEditService } from 'src/app/services/sendDataToEdit.service';
import { ProductosPreciosTotalesService } from 'src/app/services/productosPreciosTotales.service';
import { ProductosPreciosTotales } from 'src/app/models/ProductosPreciosTotales';
import { HotelHabitacionUpgrade } from '../../models/HotelHabitacionUpgrade';
import { HotelUpgrade } from 'src/app/models/HotelUpgrade';
import { HotelHabitacion } from 'src/app/models/HotelHabitacion';
import { Subscription } from 'rxjs';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
declare var $: any;
interface NuevaCategoria {
  nombre: string,
  estrellas: number,
  tarifa: number
}

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css'],
})
export class HotelComponent implements OnInit, DoCheck, AfterViewInit, OnDestroy {
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
  public validaciones: any = {
    nombre: -1,
    comision5: -1,
    comisionA: -1,
  }
  public nuevaCategoria: NuevaCategoria = {
    nombre: '',
    estrellas: 0,
    tarifa: 0
  }

  public customStyle = {
    selectButton: {
      "background-color": "#3C9",
      "color": "#fff"
    },
  
    layout: {
      "background-color": "whitesmoke",
      "color": "#9b9b9b",
      "border": "1px dashed #d0d0d0"   ,
      "width": "240px" 
    },
   
  }
  public hotel: any = new Hotel();
  public hotelBase: any = new Hotel();
  public hotelHabitacion: any = new HotelHabitacion();
  public hotelHabitaciones: any[] = [];
  public hotelHabitacionesUDB: any[] = [];
  public hotelManualUpgrade: any = new HotelUpgrade();
  public hotelHabitacionesUM: any[] = [];
  public hotelHabitacionesUMB: any[] = [];
  public destino: any = new Destino();
  public canasta: Canasta = new Canasta();
  public actualHotel: any = [];
  public cotizacion: any = new Cotizacion();
  public usuario: any = new Usuario();
  public productoPrecioTotal: ProductosPreciosTotales = new ProductosPreciosTotales();
  public actualCountry: any[] = [];
  public actualCity: any[] = [];
  public hotelesTarifas: any[] = [];
  public opcionesHotelesTarifas: any[] = [];
  public countries: any[] = [];
  public cities: any[] = [];
  public dataAutocomplete: any = [];
  public dataAutocompleteCountry: any = [];
  public hotelesTarifasObject: Object = {};
  public title: string = 'Datos Precargados';
  public actualCategory: string = '';
  public datesInHotel: string = '';
  public totalStatic: number = 0;
  public totalStaticByNight: number = 0;
  public totalDynamic: number = 0;
  public totalDynamicByNight: number = 0;
  public valueBaseTarifa: number = 0;
  public sectionActivated: number = 1;
  public checkIn: Date;
  public checkOut: Date;
  public daysInHotel: number = 1;
  public holidaysInHotel: number = 0;
  public hotelCanasta: any = {};
  public idCotizacion: number = 0;
  public changeDates: boolean = false;
  public fechaInicio: any = '';
  public fechaFinal: any = '';
  public comisionAgenteBase: number = 0;
  public categorias: any[] = [];
  public actualCategoria: any = {};
  public totalHotelMM: number = 0;
  public totalViajeros: number = 0;
  public personasRestates: number = 0;
  public totalHabitacion: number  = 0;
  public totalHabitacionBase: number = 0;
  public countMejoras: number = 0;
  public dividirTarifa: boolean = false;
  public imagenesHotel: any[] = [];
  public cargarImagen: boolean = false;
  public validando: boolean = false;
  public validandoUpgrade: boolean = false;
  public validandoCategoria: boolean = false;
  public filePath: string = environment.API_URI_IMAGES;
  public imagen1: any = {};
  public imagen2: any = {};
  public actualModule: string = '';

  constructor(
    private _hotelesService: HotelesService,
    private _destinosService: DestinosService,
    private _canastaService: CanastaService,
    private _hotelesTarifasService: HotelesTarifasService,
    private _paisService: PaisesService,
    private _ciudadesService: CiudadesService,
    private _cotizacionesService: CotizacionesService,
    private datePipe: DatePipe,
    private versionesService: VersionesService,
    private usuariosService: UsuariosService,
    private sendDataToEdit: SendDataToEditService,
    private productosPreciosTotalesService: ProductosPreciosTotalesService,
    private imagenesService: ImagenesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.router.url.includes("cotizacionProductos") && !this.editingCarrito){
      $(".tabs").tabs("select", "hotel");
    }
    this.hotel.desayunoBase = 0;
    this.hotel.cantidadDesayunos = 0;
    this.hotel.opcionTarifa = null;
    this.hotel.opcionCategoria = null;
    this.hotelManualUpgrade.categoriaM = '';
    this.hotelManualUpgrade.estrellasM = 0;
    this.getDestino();
    this.getCotizacion();
    this.getCountries();
    this.getUsuario();
    if(!this.editingCarrito) $('.modal').modal({dismissible: false});
    $('#modalMejoras').modal({ dismissible: false });
    if(this.editing  || this.editingCarrito){
     $('.modalSendProducts').modal('open');
      let s = this.sendDataToEdit.getProduct('hotel').subscribe((hotel: any) => {
        this.getCategorias(hotel);
        setTimeout(() => {
          this.changeDatepicker('.datepicker-checkIn', new Date(hotel.checkIn + 'T00:00:00'));
          this.changeDatepicker('.datepicker-checkOut', new Date(hotel.checkOut + 'T00:00:00'), 1);
        }, 1000);
      });
      this.suscripciones.push(s);
    }else{
      this.getCategorias();
      this.getComisionAgenteByCotizacion();
      $('.modalAddProducts').modal('open');
      setTimeout(() => {
        this.initDatepicker();
      }, 2000);
    }
  }

  getUsuario(){
    let s = this.usuariosService.getUser().subscribe(usuario => {
      if(Object.keys(usuario).length === 0) return false;
      this.usuario = usuario;
    });
    this.suscripciones.push(s);
  }

  ngOnDestroy(): void {
    this.suscripciones.forEach((s: any) => s.unsubscribe());
  }

  getDestino(){
    let s = this._destinosService.getActualDestino().subscribe((destino: Destino) => {
      if(Object.keys(destino).length === 0) return false;
      this.destino = destino;
      this.hotel.idDestino = this.destino.idDestino;
      this.hotelCanasta.ciudad = this.destino.ciudad;
      this.sectionActivated === 1 && this.getHotelesTarifas();
      this.getCityWithCountry(this.destino.idCiudad);
      $('#ciudadS2').val(this.destino.ciudad);
      setTimeout(() => { 
        $('#autocomplete_ciudad').val(this.destino.ciudad);
        this.initDatepicker();
       }, 1000);
    });
    this.suscripciones.push(s);
  }

  getHotelesTarifas(){
    this._hotelesTarifasService.list().subscribe((resp: HotelTarifa[]) => {
      this.hotelesTarifas = resp;
      this.hotelCanasta.ciudad = this.destino.ciudad;
      this.opcionesHotelesTarifas = this.hotelesTarifas.filter((hotel) => hotel.nombre === this.destino.ciudad);
      this.changeCategory(this.actualCategory);
    });
  }

  getCotizacion(){
    this.sendDataToEdit.getProduct('cotizacion').subscribe((cotizacion: any) => {
      if(Object.keys(cotizacion).length === 0) return false;
      this.cotizacion = cotizacion;
      this.totalViajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
      this.personasRestates = this.totalViajeros;
      this.hotel.noPersonas = this.totalViajeros;
      this.hotelManualUpgrade.noPersonas = this.totalViajeros;
    });
  }

  getCategorias(hotel?: any){
    this._hotelesService.getCategorias().subscribe((categorias: any) => {
      this.categorias = categorias;
      this.categorias.push({
        idCategoria: 0,
        categoria: 'Otra',
        estrellas: 6
      });
      if(hotel && this.editing || this.editingCarrito){
        this.hotelToUpdate(hotel);
      }
    }, err => console.log(err));
  }

  ngDoCheck(): void {
    M.updateTextFields();
  }

  ngAfterViewInit(): void {
    this.changeDates = false;
  }

  async hotelToUpdate(hotel: any){
    hotel.daysInHotel = 0;
    this.dividirTarifa = true;
    hotel.checkIn = this.datePipe.transform(new Date(hotel.checkIn), "yyyy-MM-dd");
    hotel.checkOut = this.datePipe.transform(new Date(hotel.checkOut), "yyyy-MM-dd");
    this.hotel = Object.assign({}, hotel);
    this.hotelBase = Object.assign({}, hotel);
    this.hotelHabitaciones = JSON.parse(JSON.stringify(hotel.habitaciones));
    this.personasRestates = this.hotel.noPersonas - this.hotel.habitaciones.reduce((acc: number, h: any) => acc + h.noPersonas, 0);
    switch(this.hotel.tipoHotel){
      case 0:
        this.sectionActivated = 1;
        this.actualCategoria = this.categorias.find((c) => c.categoria == this.hotel.categoria);
        this.actualHotel = this.opcionesHotelesTarifas[0];
        this.hotel.opcionTarifa = this.actualHotel.idHotelTarifa;
        this.hotel.opcionCategoria = this.hotel.categoria;
        await this.getCityWithCountry(this.actualHotel.idCiudad);
        this.staticOptions();
        setTimeout(() => { $('#autocomplete_ciudad').val(this.hotel.ciudad) }, 0);
        this.changeCategory(this.hotel.categoria);
        break;
      case 1:
        this.sectionActivated = 2;
        this.hotel.cantidadDesayunos = 1;
        this.dynamicPlan(this.hotel.cityTax, 'cityTax');
        this.dynamicPlan(this.hotel.desayuno, 'desayuno');
        this.checkHotel(0);
        this.dynamicOptions();
        $('#autocomplete_ciudad1').val(this.hotel.ciudad);
        break;
    }
    this.dividirTarifa = false;
    if(this.editingCarrito){
      this.getUpgrades();
    }else{
      if(this.sectionActivated === 1){
        if(this.imgExist('hotel1', this.hotel.idHotelAdquirido)) this.imagen1.img = `${this.filePath}/hotel1/${this.hotel.idHotelAdquirido}.jpg`;
        if(this.imgExist('hotel2', this.hotel.idHotelAdquirido)) this.imagen2.img = `${this.filePath}/hotel2/${this.hotel.idHotelAdquirido}.jpg`;
      }else{
        if(this.imgExist('actualizacionHotel1', this.hotel.idHotelAdquirido)) this.imagen1.img = `${this.filePath}/actualizacionHotel1/${this.hotel.idHotelAdquirido}.jpg`;
        if(this.imgExist('actualizacionHotel2', this.hotel.idHotelAdquirido)) this.imagen2.img = `${this.filePath}/actualizacionHotel2/${this.hotel.idHotelAdquirido}.jpg`;
      }
    }
    setTimeout(() => {
      $('.dropdown-trigger').dropdown({alignment: 'center'});
    }, 0);
  }

  imgExist(folder: string, idHotel: number) {
    let path: string = `${this.filePath}/${folder}/${idHotel}.jpg`;
    let http = new XMLHttpRequest();
    http.open('HEAD', path, false);
    http.send();
    return http.status !== 404;
  }

  getUpgrades(){
    this.hotelHabitacionesUDB = [];
    this.imagen1 = {};
    this.imagen2 = {};
    this._hotelesService.getUpgrades(this.hotel.tipoHotel, this.hotel.idHotelAdquirido, this.cotizacion.idCotizacion).subscribe(async(res: any) => {
      $('.collapsible').collapsible();
      if(this.hotel.tipoHotel === 1){
        if(this.imgExist('actualizacionHotel1', this.hotel.idHotelAdquirido)) this.imagen1.img = `${this.filePath}/actualizacionHotel1/${this.hotel.idHotelAdquirido}.jpg`;
        if(this.imgExist('actualizacionHotel2', this.hotel.idHotelAdquirido)) this.imagen2.img = `${this.filePath}/actualizacionHotel2/${this.hotel.idHotelAdquirido}.jpg`;
        this.hotelManualUpgrade = Object.assign({}, res.hotelUpgrade[0]);
        this.hotelHabitacionesUM = [...res.hotelHabitacionesUpgrade];
        this.hotelHabitacionesUMB = [...res.hotelHabitacionesUpgrade];
      }else{
        if(this.imgExist('hotel1', this.hotel.idHotelAdquirido)) this.imagen1.img = `${this.filePath}/hotel1/${this.hotel.idHotelAdquirido}.jpg`;
        if(this.imgExist('hotel2', this.hotel.idHotelAdquirido)) this.imagen2.img = `${this.filePath}/hotel2/${this.hotel.idHotelAdquirido}.jpg`;
        for(let habitacion of this.hotelHabitaciones){
          let matchUpgrade: any = await res.hotelHabitacionesUpgrade.find(h => h.idHabitacion == habitacion.idHotelHabitacion);
          if(matchUpgrade){
            habitacion.conMejoras = 1;
            this.hotelHabitacionesUDB.push(matchUpgrade);
          }else{
            habitacion.conMejoras = 0;
            var hh: any = Object.assign({}, habitacion);
            hh.fecha = this.hotel.checkIn;
            hh.idHabitacion = habitacion.idHotelHabitacion;
            switch(this.hotelHabitacion.tipoHabitacion){
              case 'Doble':
                this.hotel.tarifaTotal += (habitacion.tarifa * habitacion.cantidadHabitaciones);
                hh.diferencia = this.calcularDiferenciaUpgradeHabitacion(hh, habitacion.tarifa, 1, 1.45);
                hh.tipoHabitacion = 'Triple';
                hh.i = this.countMejoras;
                this.hotelHabitacionesUDB.push(hh);
                break;
              case 'Triple':
                hh.diferencia = this.calcularDiferenciaUpgradeHabitacion(hh, habitacion.tarifa, 1.45, 1);
                habitacion.tarifa = habitacion.tarifa * 1.45;
                this.hotel.tarifaTotal += (habitacion.tarifa * habitacion.cantidadHabitaciones);
                habitacion.tarifa = this.editing ? (habitacion.tarifa * 100) / 145 : habitacion.tarifa;
                hh.tipoHabitacion = 'Doble';
                hh.i = this.countMejoras;
                this.hotelHabitacionesUDB.push(hh);
                break;
            }
          }
        }
      }
    });
  }

  async onUpdate(form){
    this.validando = true;
    if(form.invalid || this.hotelHabitaciones.length === 0) return false;
    if(this.esActualizacion()){
      const { value: text } = await Swal.fire({
        input: 'textarea',
        inputLabel: '¿Por qué realizaste ésta actualización?',
        backdrop: false,
        inputValidator: (value) => {
          if (!value) {
            return 'El campo es obligatorio'
          }
        }
      });

      this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
      this.productoPrecioTotal.tipoProducto = 4;
      this.productoPrecioTotal.total = this.sectionActivated === 1 ? this.totalStatic : this.totalDynamic;
      this.hotel.productoPrecioTotal = this.productoPrecioTotal;

      if(this.holidaysInHotel > 0){
        this.hotel.tarifaTotal = 0;
        this.hotelHabitaciones.forEach((h: any) => {
          if(this.sectionActivated === 1 && h.tipoHabitacion === 'Triple'){
            h.tarifa = h.tarifa * 1.45;
          }
          let tarifaBase: number = h.tarifa * this.daysInHotel;
          let tarifaAlta: number = h.tarifa * this.holidaysInHotel * 1.20;
          let tarifa: number = tarifaBase + tarifaAlta;
          this.hotel.tarifaTotal += (tarifa * h.cantidadHabitaciones);
        });
      }
      this.hotel.daysInHotel = this.daysInHotel;
      this.hotel.holidaysInHotel = this.holidaysInHotel;
      this.hotel.nota = text;
      this.hotel.editado = true;
      delete this.hotel.nuevo;
      this.sendDataToEdit.sendProductToUpdate(this.hotel);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Producto actualizado correctamente",
        showConfirmButton: false,
        timer: 2000,
      });
    }
    $('.modalSendProducts').modal('close');
  }

  changeDatepicker(id: string, date: Date, minD?: any){
    let fecha1 = localStorage.getItem('fechaInicio');
    let fecha2 = localStorage.getItem('fechaFinal');
    let minDate: any = new Date(fecha1 + 'T00:00:00');
    let maxDate: any = new Date(fecha2 + 'T00:00:00');
    switch(minD){
      case 1:
        minDate = new Date(new Date(minDate).setDate(new Date(minDate).getDate() + 1));
        break;
      case 2:
        minDate = date;
        if(!this.editing) this.hotel.checkOut = this.datePipe.transform(new Date(date), "yyyy-MM-dd");
        break;
      case 3:
        minDate = new Date(new Date(fecha1 + 'T00:00:00').setDate(new Date(fecha1 + 'T00:00:00').getDate() + 1));
        break;
    }
    $(id).datepicker({
      minDate: minDate,
      maxDate: maxDate,
      setDefaultDate: date,
      defaultDate: date,
      format: "yyyy-mm-dd",
      i18n: this.i18nOptions,
      onSelect: (actualDate) => {
        actualDate = this.datePipe.transform(
          new Date(actualDate),
          "yyyy-MM-dd"
        );
        switch(id){
          case '.datepicker-checkIn':
            this.hotel.checkIn = actualDate;
            this.checkHotel(1);
            break;
          case '.datepicker-checkOut':
            this.hotel.checkOut = actualDate;
            this.checkHotel(2);
            break;
        }
      }
    });
  }

  initDatepicker(){
    let fecha1 = localStorage.getItem('fechaInicio');
    let date: any = new Date(fecha1 + 'T00:00:00');
    this.changeDatepicker('.datepicker-checkIn', date);
    let addDay = date.setDate(date.getDate() + 1);
    this.changeDatepicker('.datepicker-checkOut', new Date(addDay), 1);
    this.hotel.checkOut = this.datePipe.transform(new Date(addDay), "yyyy-MM-dd");
  }

  getComisionAgenteByCotizacion(){
    this.idCotizacion = parseInt(localStorage.getItem('idCotizacion'));
    if(this.idCotizacion !== undefined && !isNaN(this.idCotizacion)){
      this._cotizacionesService.getComisionAgenteByCotizacion(this.idCotizacion, 7).subscribe((res: any) => {
        if(Object.keys(res).length === 0) return false;
        this.hotel.comisionAgente = res[0].comision;
        this.comisionAgenteBase = res[0].comision;
        this.hotelManualUpgrade.comisionAgente = this.hotel.comisionAgente;
        $('#comisionAHUpgrade').val(this.hotel.comisionAgente);
      }, err => { console.log(err) });
    }
  }

  cargarOpcionTarifa(opcionHotelTarifa: any){
    this.actualHotel = this.hotelesTarifas.find((hotel) => hotel.idHotelTarifa == opcionHotelTarifa);
    this.getCityWithCountry(this.actualHotel.idCiudad);
  }

  getCountries(){
    this._paisService.list().subscribe((resp: Pais[]) => {
      this.countries = resp;
      let datos = '{';
      for (const ll of this.countries) {
        if (datos === '{')
          datos += '"' + ll.nombre + '": ""';
        else
          datos += ',"' + ll.nombre + '": ""';
      }
      datos += '}';
      this.dataAutocompleteCountry = JSON.parse(datos);
      $('input#autocomplete_pais').autocomplete({
        data: this.dataAutocompleteCountry,
        onAutocomplete: (countrySelected) => {
          this.actualCountry = this.countries.filter((country) => country.nombre === countrySelected);
        }
      });
    });
  }

  getCityWithCountry(id: number){
    return new Promise<void>((resolve, reject) => {
      this.actualCountry = [];
      this._ciudadesService.listOneWithCountry(id).subscribe((res: any) => {
        this.actualCountry = res;
        resolve();
      });
    });
  }
  
  async onSubmit(form: any){
    this.validando = true;
    if(form.invalid || this.hotelHabitaciones.length === 0) return;
    this.hotel.tipoHotel = this.sectionActivated === 1 ? 0 : 1;
    this.hotel.categoria = this.hotel.tipoHotel === 0 ? this.hotel.categoria : 'N/A';
    this.hotel.noPersonas = (this.totalViajeros - this.personasRestates);
    const { value: opcional } = await Swal.fire({
      input: 'checkbox',
      inputValue: 0,
      backdrop: false,
      inputPlaceholder: 'Es un hotel opcional',
      confirmButtonText: 'Continuar <i class="fa fa-arrow-right"></i>',
    });
    this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
    this.productoPrecioTotal.tipoProducto = 4;
    this.productoPrecioTotal.total = this.sectionActivated === 1 ? this.totalStatic : this.totalDynamic;
    if(this.adding){
      this.hotel.nuevo = true;
      this.hotel.id = this.hotel.idHotelAdquirido;
      this.hotel.type = 'Hotel';
      this.hotel.precio = this.valueBaseTarifa;
      this.hotel.valido = true;
      this.hotel.idToSend = 7;
      this.hotel.idCiudad = this.destino.idCiudad;
      this.hotel.opcional = opcional;
      this.hotel.habitaciones = this.hotelHabitaciones;
      this.hotel.productoPrecioTotal = this.productoPrecioTotal;
      if(this.imagen1.blob) this.hotel.imagen1 = this.imagen1;
      if(this.imagen2.blob) this.hotel.imagen2 = this.imagen2;
      switch(this.sectionActivated){
        case 1:
          this.hotel.hotelHabitacionesUDB = this.hotelHabitacionesUDB;
          break;
        case 2:
          this.hotel.hotelManualUpgrade = this.hotelManualUpgrade;
          this.hotel.hotelHabitacionesUM = this.hotelHabitacionesUM;
          break;
      }
      if(this.holidaysInHotel > 0){
        this.hotel.tarifaTotal = 0;
        this.hotelHabitaciones.forEach((h: any) => {
          delete h.edit;
          let tarifaBase: number = h.tarifa * this.daysInHotel;
          let tarifaAlta: number = h.tarifa * this.holidaysInHotel * 1.20;
          let tarifa: number = tarifaBase + tarifaAlta;
          this.hotel.tarifaTotal += (tarifa * h.cantidadHabitaciones);
        });
      }
      this.hotel.daysInHotel = this.daysInHotel;
      this.hotel.holidaysInHotel = this.holidaysInHotel;
      this.sendDataToEdit.sendProductToUpdate(this.hotel);
      this.inicializarModelo();
      this.adding = false;
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
      // this.hotelCanasta = Object.assign(this.hotelCanasta, this.hotel);
      this.hotel.opcional = opcional;
      if(this.holidaysInHotel > 0){
        this.hotel.tarifaTotal = 0;
        this.hotelHabitaciones.forEach((h: any) => {
          h.tarifa = h.tipoHabitacion === 'Triple' && this.sectionActivated === 1 ? h.tarifa * 1.45 : h.tarifa;
          let tarifaBase: number = h.tarifa * this.daysInHotel;
          let tarifaAlta: number = h.tarifa * this.holidaysInHotel * 1.20;
          let tarifa: number = tarifaBase + tarifaAlta;
          this.hotel.tarifaTotal += (tarifa * h.cantidadHabitaciones);
        });
      }
      this._hotelesService.create(this.hotel).subscribe((res: any) => {
        this.hotelCanasta.idHotelAdquirido = res.insertId;
        this.hotelCanasta.nombre = this.hotel.nombre;
        this.hotelCanasta.direccion = this.hotel.direccion;
        this.hotelCanasta.telefono = this.hotel.telefono;
        this.hotelCanasta.checkIn = this.hotel.checkIn + 'T00:00:00';
        this.hotelCanasta.checkOut = this.hotel.checkOut + 'T00:00:00';
        this.hotelCanasta.idHotelTarifa = this.hotel.idHotelTarifa;
        this.hotelCanasta.cantidadHabitaciones = this.hotel.cantidadHabitaciones;
        this.hotelCanasta.noPersonas = this.hotel.noPersonas;
        this.hotelCanasta.descripcion = this.hotel.descripcion;
        this.hotelCanasta.categoria = this.sectionActivated === 1 ? this.hotelCanasta.categoria : this.hotel.categoria;
        this.hotelCanasta.notas = this.hotel.notas;
        this.hotelCanasta.tipoHotel = this.hotel.tipoHotel ;
        this.hotelCanasta.ciudad = this.destino.ciudad;
        this.hotelCanasta.idCiudad = this.destino.idCiudad;
        this.hotelCanasta.idPais = this.destino.idPais;
        this.hotelCanasta.tipoNombre = 'hotel';
        this.hotelCanasta.estrellas = this.hotel.estrellas;
        this.hotelCanasta.tipo = 4;
        this.hotelCanasta.opcional = opcional;
        this.hotelCanasta.tarifaTotal = this.hotel.tarifaTotal;
        this.hotelCanasta.comisionAgente = this.hotel.comisionAgente;
        this.hotelCanasta.comision = this.hotel.comision;
        this.hotelCanasta.cityTax = this.hotel.cityTax;
        this.hotelCanasta.desayuno = this.hotel.desayuno;
        this.hotelCanasta.daysInHotel = this.daysInHotel;
        this.hotelCanasta.holidaysInHotel = this.holidaysInHotel;
        this.hotelCanasta.desayuno = this.hotel.desayuno;
        this.hotelCanasta.otros = this.hotel.otros;
        this.productoPrecioTotal.idProducto = res.insertId;
        this.productosPreciosTotalesService.create(this.productoPrecioTotal).subscribe((resTotal: any) => {
          this.productoPrecioTotal = new ProductosPreciosTotales();
        });

        //AGREGAR HABITACIONES Y MEJORAS
        this.hotelHabitaciones.forEach((habitacion: any) => {
          let tarifaBase: number = habitacion.tarifa * this.daysInHotel;
          let tarifaAlta: number = habitacion.tarifa * this.holidaysInHotel * 1.20;
          let tarifa: number = tarifaBase + tarifaAlta;
          habitacion.tarifa = tarifa;
          habitacion.idHotelAdquirido = res.insertId;
          this._hotelesService.agreagrHabitacion(habitacion).subscribe((resHabitacion: any) => {
            habitacion.idHotelHabitacion = resHabitacion.insertId;
            switch(this.sectionActivated){
              case 1:
                let hUDB: any = this.hotelHabitacionesUDB.find(habitacionUDB => habitacionUDB.conMejoras && habitacionUDB.i == habitacion.i);
                if(!hUDB) return false;
                hUDB.idCotizacion = this.cotizacion.idCotizacion;
                hUDB.idHotelAdquirido = res.insertId;
                hUDB.fecha = this.hotel.checkIn;
                hUDB.idHabitacion = resHabitacion.insertId;
                this._hotelesService.upgradeHabitacion(hUDB).subscribe(res => {}, err => console.log(err));
                break;
              case 2:
                if(this.hotelHabitacionesUM.length === 0) return false;
                let hUM: any = this.hotelHabitacionesUM.find(habitacionUM => habitacionUM.conMejoras && habitacionUM.i == habitacion.i);
                if(!hUM) return false;
                hUM.idCotizacion = this.cotizacion.idCotizacion;
                hUM.idHotelAdquirido = res.insertId;
                hUM.fecha = this.hotel.checkIn;
                hUM.idHabitacion = resHabitacion.insertId;
                this._hotelesService.upgradeHabitacion(hUM).subscribe(res => {}, err => console.log(err));
                break;
            }
          }, err => console.log(err));
        });

        this.hotelCanasta.habitaciones = this.hotelHabitaciones;
        this._canastaService.addProduct(Object.assign({}, this.hotelCanasta));

        if(this.sectionActivated === 2 && this.hotelManualUpgrade.adding){
           this.hotelManualUpgrade.tarifa = this.hotelHabitacionesUM.reduce((acc: number, upgrade: any) => acc + upgrade.tarifa, 0);
           this.hotelManualUpgrade.fecha = this.hotel.checkIn;
           this.hotelManualUpgrade.idHotelAdquirido = res.insertId;
           this._hotelesService.upgradeHotel(this.hotelManualUpgrade).subscribe((resUH: any) => {}, err => console.log(err));
           this.guardarImagenesHotelManual(res.insertId);
        }else{
          this.guardarImagenesHotelPrecargado(res.insertId);
        }
        this.redirect.emit(1);
        this.insertCanasta(res.insertId);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Producto agregado correctamente`,
          showConfirmButton: false,
          timer: 1500
        });
      }, err => { console.log(err) });
    }
    this.validando = false;
  }

  guardarImagenesHotelPrecargado(idHotel: number){
    this.imagen1.blob && this.imagenesService.guardarImagenHotel1(idHotel, this.imagen1.blob).subscribe(imagen => {}, err => console.log(err));
    this.imagen2.blob && this.imagenesService.guardarImagenHotel2(idHotel, this.imagen2.blob).subscribe(imagen => {}, err => console.log(err));
  }

  guardarImagenesHotelManual(idHotel: number){
      this.imagen1.blob && this.imagenesService.guardarActualizacionImagenHotel1(idHotel, this.imagen1.blob).subscribe(imagen => {}, err => console.log(err));
      this.imagen2.blob && this.imagenesService.guardarActualizacionImagenHotel2(idHotel, this.imagen2.blob).subscribe(imagen => {}, err => console.log(err));
  }

  inicializarModelo(){
    this.hotel = new Hotel();
    let fecha1 = localStorage.getItem('fechaInicio');
    let date: any = new Date(fecha1);
    let addDay = date.setDate(date.getDate() + 2);
    setTimeout(() => {
      this.changeDatepicker('.datepicker-checkOut', new Date(addDay), 2);
      this.hotel.desayunoBase = 0;
      this.hotel.cantidadDesayunos = 0;
      this.hotel.cityTax = '0';
      this.hotel.opcionTarifa = null;
      this.hotel.opcionCategoria = null;
    }, 0);
    $("#hotelCategoria1").val('');
    $("#opcionHotelTarifa").val('');
    $('#checkImagenes').prop("checked", false);
    $('#collapsibleImagenes').collapsible();
    $('#collapsibleImagenes').collapsible('close');
    this.cargarImagen = false;
    this.totalStatic = 0;
    this.totalStaticByNight = 0;
    this.totalDynamic = 0;
    this.totalHabitacion = 0;
    this.totalDynamicByNight = 0;
    this.hotel.comisionAgente = this.comisionAgenteBase;
    this.hotel.idDestino = this.destino.idDestino;
    this.hotel.noPersonas = this.totalViajeros;
    this.personasRestates = 0;
    this.actualCategoria = {};
    this.actualHotel = [];
    this.hotelHabitaciones = [];
    this.personasRestates = this.totalViajeros;
    this.hotelHabitacion = new HotelHabitacion();
    this.imagenesHotel = [];
    this.validando = false;
    this.validandoUpgrade = false;
  }

  showContainer(idContainer){
    if(this.sectionActivated == 2 && idContainer == 1){
      this.initDatepicker();
      this.staticOptions();
      setTimeout(() => { $('.collapsible').collapsible() }, 0);
      this.inicializarModelo();
      this.hotelHabitacionesUDB = [];
      this.cargarImagen = false;
    }
    if(this.sectionActivated == 1 && idContainer == 2){
      this.dynamicOptions();
      this.inicializarModelo();
      setTimeout(() => { this.initDatepicker() }, 0);
      this.hotelHabitacionesUDB= [];
      this.checkHotel(0);
      this.cargarImagen = false;
    }
    this.sectionActivated = idContainer;
  }

  dynamicOptions(){
    this.title = 'Ingresar Datos';
    $("#dynamic").css('display', 'block');
    $("#static").css('display', 'none');
  }

  staticOptions(){
    this.title = 'Datos Precargados';
    $("#static").css('display', 'block');
    $("#dynamic").css('display', 'none');
  }

  insertCanasta(insertId: number) {
    this.canasta.idCotizacion = this.destino.idCotizacion;
    this.canasta.idActividad = insertId;
    this.canasta.tipo = 4;
    this._canastaService.create(this.canasta).subscribe(res => {
      this._cotizacionesService.list_one(this.destino.idCotizacion).subscribe((cotizacion: Cotizacion) => {
        let version = new Version();
        version.idActividad = insertId;
        version.tipo = 4; //Es un hotel
        version.idCotizacion = cotizacion.idCotizacion;
        version.versionCotizacion = cotizacion.version;
        version.accion = 1;
        version.idUsuario = this.usuario.idUsuario;
        this.versionesService.create(version).subscribe((resp) => { });
        this.inicializarModelo();
      });
    }, err => { console.log(err) });
  }

  reiniciarCategoria(){
    $('#hotelCategoria1').val(this.hotel.categoria ? this.hotel.categoria : 'null');
  }

  agregarCategoria(form){
    this.validandoCategoria = true;
    if(form.invalid) return false;
    this.actualCategoria.idCategoria = 1;
    this.hotel.estrellas = this.nuevaCategoria.estrellas;
    this.hotel.categoria = this.nuevaCategoria.nombre;
    this.hotelCanasta.categoria = this.nuevaCategoria.nombre;
    this.totalStaticByNight = 0;
    this.totalStaticByNight = this.nuevaCategoria.tarifa;
    this.actualCategory = this.nuevaCategoria.nombre;
    this.helperChangeCategory();
    $('#modalCategoria').modal('close');
  }

  async changeCategory(category: string){
    if(!category) return false;
    if(category !== 'Otra'){
      this.actualCategoria = this.categorias.find(c => c.categoria === category);
      this.hotel.estrellas = this.actualCategoria.estrellas;
      this.hotel.categoria = this.actualCategoria.categoria;
      this.hotelCanasta.categoria = this.actualCategoria.categoria;
      this.totalStaticByNight = 0;
      this.actualCategory = category;
      switch(category){
        case '3* - Turista':
          this.totalStaticByNight = this.actualHotel.turista;
          break;
        case '4* - Turista Superior':
          this.totalStaticByNight = this.actualHotel.turistaSup;
          break;
        case '4.5* - Turista Premium':
          this.totalStaticByNight = this.actualHotel.premium;
          break;
        case '5* - Lujo':
          this.totalStaticByNight = this.actualHotel.lujo;
          break;
        default:
          this.totalStaticByNight = 0;
          break;
      }
      this.helperChangeCategory();
    }else{
      $('#modalCategoria').modal({dismissible: false});
      $('#modalCategoria').modal('open');
    }
  }

  helperChangeCategory(){
    this.checkHotel(0);
    this.totalStatic = 0;
    this.hotel.tarifaTotal = 0;
    this.hotelHabitaciones.forEach((h: any) => {
      h.tarifa = h.tipoHabitacion === 'Triple' ? this.totalStaticByNight * 1.45 : this.totalStaticByNight;
      this.hotel.tarifaTotal += (h.tarifa * h.cantidadHabitaciones);
      let totalBase: number = this.agregarComisiones(h.tarifa * h.cantidadHabitaciones) * this.daysInHotel;
      let totalAlta: number = this.agregarComisiones(h.tarifa * h.cantidadHabitaciones) * this.holidaysInHotel * 1.20;
      h.total = totalBase + totalAlta;
      this.totalStatic += h.total;
    });
    this.asignarDiferenciaUpgradeHabitacion();
  }

  asignarDiferenciaUpgradeHabitacion(){
    this.hotelHabitacionesUDB.forEach((upgrade: any) => {
      upgrade.tarifa = this.totalStaticByNight;
      if(upgrade.tipoHabitacion === 'Triple'){
        upgrade.diferencia = this.calcularDiferenciaUpgradeHabitacion(upgrade, upgrade.tarifa, 1, 1.45);
      }else{
        upgrade.diferencia = this.calcularDiferenciaUpgradeHabitacion(upgrade, upgrade.tarifa, 1.45, 1);
      }
    });
  }

  dynamicPlan(value: number, type: string){
    value = value === null || value === 0  ? 0 : value;
    this.totalDynamic = 0;
    this.totalDynamic = this.hotelHabitaciones.reduce((acc: number, h: any) => acc + h.total, 0);
    switch(type){
      case 'cityTax':
        this.totalDynamicByNight = 0;
        this.hotel.cityTax = value;
        this.totalDynamicByNight = (
          this.hotel.cityTax +
          this.hotel.desayuno 
        );
        break;
      case 'desayuno':
        this.totalDynamicByNight = 0;
        this.hotel.desayunoBase = value;
        this.hotel.desayuno = (this.hotel.desayunoBase * this.hotel.cantidadDesayunos);
        this.totalDynamicByNight = (
          this.hotel.cityTax +
          this.hotel.desayuno 
        );
        break;
      case 'cantidadDesayunos':
        this.totalDynamicByNight = 0;
        this.hotel.desayuno = (this.hotel.desayunoBase * this.hotel.cantidadDesayunos);
        this.totalDynamicByNight = (
          this.hotel.cityTax +
          this.hotel.desayuno
        );
        break;
      case 'otros':
        this.hotel.otros = value;
        break;
      default:
        break;
    }
    let totalBase: number = this.agregarComisiones(this.totalDynamicByNight) * this.daysInHotel;
    let totalAlto: number = this.agregarComisiones(this.totalDynamicByNight) * this.holidaysInHotel * 1.20;
    let total: number = totalBase + totalAlto;
    this.totalDynamic += total;
    this.totalDynamic += this.hotel.otros;
  }

  async checkHotel(value: number){
    this.datesInHotel = '';
    switch(value){
      case 1:
        let addDay = new Date(this.hotel.checkIn + 'T00:00:00').setDate(new Date(this.hotel.checkIn + 'T00:00:00').getDate() + 1);
        this.hotel.checkOut = this.datePipe.transform(new Date(addDay), "yyyy-MM-dd");
        this.changeDatepicker('.datepicker-checkOut', new Date(addDay), 2);
        break;
      case 2:
        if(this.sectionActivated == 2) this.alterTotalDynamicByHolidays(new Date(this.hotel.checkIn), new Date(this.hotel.checkOut));
        break;
      default:
        break;
    }
    this.daysInHotel = Math.abs(Math.floor((new Date(this.hotel.checkOut + 'T00:00:00').getTime() - new Date(this.hotel.checkIn + 'T00:00:00').getTime()) / 1000 / 60 / 60 / 24));
    this.daysInHotel = this.daysInHotel === 0 ? 1 : this.daysInHotel;
    this.holidays(new Date(this.hotel.checkIn + 'T00:00:00'), new Date(this.hotel.checkOut + 'T00:00:00'));
    if(value !== 0 || this.dividirTarifa){
      this.totalDynamic = 0;
      this.totalStatic = 0;
      this.hotel.tarifaTotal = 0;
      this.hotelHabitaciones.forEach((h: any) => {
        h.idHotelAdquirido = this.hotel.idHotelAdquirido;
        if(this.sectionActivated === 1){
          h.tarifa = this.totalStaticByNight;
          switch(h.tipoHabitacion){
            case 'Doble':
              this.hotel.tarifaTotal += (h.tarifa * h.cantidadHabitaciones);
              let tarifaBase1: number = (this.agregarComisiones(h.tarifa * h.cantidadHabitaciones) * this.daysInHotel);
              let tarifaAlta1: number = (this.agregarComisiones(h.tarifa * h.cantidadHabitaciones) * this.holidaysInHotel * 1.20);
              h.total = tarifaBase1 + tarifaAlta1;
              break;
            case 'Triple':
              this.hotel.tarifaTotal += (h.tarifa * h.cantidadHabitaciones);
              let tarifaBase2: number = (this.agregarComisiones(h.tarifa * h.cantidadHabitaciones * 1.45) * this.daysInHotel);
              let tarifaAlta2: number = (this.agregarComisiones(h.tarifa * h.cantidadHabitaciones * 1.45) * this.holidaysInHotel * 1.20);
              h.tarifa = h.tarifa * 1.45;
              h.total = tarifaBase2 + tarifaAlta2;
              break
          }
          this.totalStatic += h.total;
        }else{
          if(this.holidaysInHotel > 0 && this.editing && this.dividirTarifa){
            let d = (h.tarifa / (this.daysInHotel + this.holidaysInHotel));
            h.tarifa = (d * 100) / 110;
          }
          this.hotel.tarifaTotal += h.tarifa * h.cantidadHabitaciones;
          let tarifaBase: number = this.agregarComisiones(h.tarifa * h.cantidadHabitaciones) * this.daysInHotel;
          let tarifaAlta: number = this.agregarComisiones(h.tarifa * h.cantidadHabitaciones) * this.holidaysInHotel * 1.20;
          h.total = tarifaBase + tarifaAlta;
          this.totalDynamic += h.total;
        }
      });
      switch(this.sectionActivated){
        case 1:
          this.asignarDiferenciaUpgradeHabitacion();
        break;
        case 2:
          let totalBase: number = this.agregarComisiones(this.totalDynamicByNight) * this.daysInHotel;
          let totalAlto: number = this.agregarComisiones(this.totalDynamicByNight) * this.holidaysInHotel * 1.20;
          let total: number = totalBase + totalAlto;
          this.totalDynamic += total;
          this.totalDynamic += this.hotel.otros;
          this.hotelHabitacionesUM.forEach((upgrade: any) => {
            let hh: any = this.hotelHabitaciones.find(h => h.hasOwnProperty('i') && h.i == upgrade.i || h.idHotelHabitacion == upgrade.idHabitacion);
            upgrade.diferencia = this.agregarComisiones(upgrade.tarifa * upgrade.cantidadHabitaciones, this.hotelManualUpgrade.comisionAgente) - this.agregarComisiones(hh.tarifa * hh.cantidadHabitaciones);   
            upgrade.diferencia = (upgrade.diferencia * this.daysInHotel) + (upgrade.diferencia * this.holidaysInHotel * 1.20);  
            upgrade.fecha = this.hotel.checkIn;
          });
          this.hotelManualUpgrade.tarifa = this.hotelHabitacionesUM.reduce((acc: number, upgrade: any) => acc + upgrade.tarifa, 0);
          this.hotelManualUpgrade.diferencia = this.hotelHabitacionesUM.reduce((acc: number, upgrade: any) => acc + upgrade.diferencia, 0);
        break;
      }
    }
  }

  holidays(checkIn: Date, checkOut: Date){
    if(this.actualCountry.length === 0) return false;
    if(this.actualCountry[0].diasAltos){
      let holidaysArray: string[] = this.actualCountry[0].diasAltos.split(',');
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
          this.daysInHotel--;
        }
      });
    }else{
      if(this.sectionActivated === 1){
        this.hotelHabitacion.tarifa = this.totalStaticByNight;
        this.totalHabitacion = (this.agregarComisiones(this.hotelHabitacion.tarifa) * this.daysInHotel);
      }
    }
  }

  rangeConditionals(desde: any){
    //VALIDAR QUE EL MES SEA SIEMPRE DE 2 DIGITOS
    let month: string = (desde.getMonth() + 1) < 10 ? '0' + (desde.getMonth() + 1) : desde.getMonth() + 1;

    //VALIDAR QUE EL DIA SEA SIEMPRE DE 2 DIGITOS
    let day: string = desde.getDate() < 10 ? '0' + desde.getDate() : desde.getDate();

    //AGREGAR LA FECHA A UNA CADENA
    this.datesInHotel += this.datesInHotel ? ',' + desde.getFullYear() + '-' + month + '-' + day : desde.getFullYear() + '-' + month + '-' + day;
  }

  alterTotalDynamicByHolidays(checkIn?: Date, checkOut?: Date){
    while(checkIn.getTime() < checkOut.getTime()){
      this.rangeConditionals(checkIn);
      checkIn.setDate(checkIn.getDate() + 1);
    }
  }

  alterTotal(id: string){
    switch(this.sectionActivated){
      case 1:
        switch(id){
          case 'add':
            this.totalStatic += this.hotel.otros;
            break;
          case 'less':
            if(this.totalStatic === 0){
              this.hotel.otros = 0;
            }else{
              this.totalStatic -= this.hotel.otros;
              this.hotel.otros = (this.hotel.otros * -1);
            }
            break;
        }
        break;
      case 2:
        switch(id){
          case 'add':
            this.totalDynamic += this.hotel.otros;
            break;
          case 'less':
            if(this.totalDynamic === 0){
              this.hotel.otros = 0;
            }else{
              this.totalDynamic -= this.hotel.otros;
              this.hotel.otros = (this.hotel.otros * -1);
            }
            break;
        }
        break;
    }
  }

  cambiarComisiones(comision: number = 0, tipo: string){
    tipo === '5Rives' ? this.hotel.comision = comision : this.hotel.comisionAgente = comision;
    this.totalStatic = 0;
    this.totalDynamic = 0;
    this.hotelHabitaciones.forEach((habitacion: any) => {
      switch(this.sectionActivated){
        case 1:
          switch(habitacion.tipoHabitacion){
            case 'Doble':
              let tarifaBaseD: number = this.agregarComisiones(habitacion.tarifa) * this.daysInHotel;
              let tarifaAltaD: number = this.agregarComisiones(habitacion.tarifa) * this.holidaysInHotel * 1.20;
              habitacion.total = tarifaBaseD + tarifaAltaD;
              this.totalStatic += habitacion.total;
              break;
            case 'Triple':
              let tarifaBaseT: number = this.agregarComisiones(habitacion.tarifa * 1.45) * this.daysInHotel;
              let tarifaAltaT: number = this.agregarComisiones(habitacion.tarifa * 1.45) * this.holidaysInHotel * 1.20;
              habitacion.total = tarifaBaseT + tarifaAltaT;
              this.totalStatic += habitacion.total;
              break;
          }
          break;
        case 2:
          let tarifaBase: number = this.agregarComisiones(habitacion.tarifa) * this.daysInHotel;
          let tarifaAlta: number = this.agregarComisiones(habitacion.tarifa) * this.holidaysInHotel * 1.20;
          habitacion.total = tarifaBase + tarifaAlta;
          this.totalDynamic += habitacion.total;
          break;
      }
    });
    // TODO revisar por que esta este switch
    switch(this.sectionActivated){
      case 1:
        break;
      case 2:
        let totalBase: number = this.agregarComisiones(this.totalDynamicByNight) * this.daysInHotel;
        let totalAlto: number = this.agregarComisiones(this.totalDynamicByNight) * this.holidaysInHotel * 1.20;
        let total: number = totalBase + totalAlto;
        this.totalDynamic += total;
        this.totalDynamic += this.hotel.otros;

        let tarifaBase: number = (this.hotelManualUpgrade.tarifa * this.daysInHotel);
        let tarifaAlta: number = (this.hotelManualUpgrade.tarifa * this.holidaysInHotel * 1.20);
        this.hotelManualUpgrade.diferencia = (tarifaBase + tarifaAlta);
        // this.hotelesManualUpgrade.map((mejora) => {
        //   let tarifaBase: number = (mejora.tarifa * this.daysInHotel);
        //   let tarifaAlta: number = (mejora.tarifa * this.holidaysInHotel * 1.20);
        //   mejora.diferencia = (tarifaBase + tarifaAlta);
        // });
        break;
    }
  }

  agregarMejoraManual(form){
    this.validandoUpgrade = true;
    if(form.invalid) return;
    this.hotelManualUpgrade.categoria = this.hotelManualUpgrade.categoriaM;
    this.hotelManualUpgrade.estrellas = this.hotelManualUpgrade.estrellasM;
    this.hotelCanasta.categoria = this.hotelManualUpgrade.categoria;
    delete this.hotelManualUpgrade.categoriaM;
    delete this.hotelManualUpgrade.estrellasM;
    if(!this.hotelManualUpgrade.edit){
      $('#modalMejoras').modal('close');
      this.hotelManualUpgrade.adding = true;
      this.hotelManualUpgrade.idCotizacion = this.cotizacion.idCotizacion;
      this.hotelManualUpgrade.diferencia = this.totalHotelMM;
      this.hotelManualUpgrade.habitaciones = this.hotelHabitacionesUM.slice();
      this.hotelHabitacionesUMB = JSON.parse(JSON.stringify(this.hotelHabitacionesUM));
      if(this.adding) this.hotelManualUpgrade.versionCotizacion = (this.cotizacion.version + 1)
      this.validandoUpgrade = false;
      this.totalHotelMM = 0;
      if(this.editingCarrito){
        this.hotelManualUpgrade.idHotelAdquirido = this.hotel.idHotelAdquirido;
        this.hotelManualUpgrade.fecha = this.hotel.checkIn;
        this.hotelManualUpgrade.tarifa = this.hotelHabitacionesUM.reduce((acc: number, upgrade: any) => acc + upgrade.tarifa, 0);
        this.hotelManualUpgrade.diferencia = this.hotelHabitacionesUM.reduce((acc: number, upgrade: any) => acc + upgrade.diferencia, 0);
        this._hotelesService.upgradeHotel(this.hotelManualUpgrade).subscribe((res: any) => {
          this.hotelHabitacionesUM.forEach(habitacion => {
            let h: any = this.hotelHabitaciones.find(h => h.hasOwnProperty('i') && h.i == habitacion.i || h.idHotelHabitacion == habitacion.idHabitacion);
            habitacion.idCotizacion = this.cotizacion.idCotizacion;
            habitacion.fecha = this.hotel.checkIn;
            habitacion.idHotelAdquirido = this.hotel.idHotelAdquirido;
            habitacion.idHabitacion = h.idHotelHabitacion;
            habitacion.idHotelAdquiridoUpgrade = 0;
            this._hotelesService.upgradeHabitacion(Object.assign({}, habitacion)).subscribe((res: any) => {
              this.getUpgrades();
            });
          });
        });
      }
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Mejora agregada correctamente`,
        showConfirmButton: false,
        timer: 2000
      });
    }else{
      $('#modalMejoras').modal('close');
      this.hotelManualUpgrade.diferencia = this.totalHotelMM;
      this.hotelHabitacionesUMB = JSON.parse(JSON.stringify(this.hotelHabitacionesUM));
      if(this.editingCarrito){// Actualizar mejora de hotel y habitaciones
        this.hotelManualUpgrade.tarifa = this.hotelHabitacionesUM.reduce((acc: number, upgrade: any) => acc + upgrade.tarifa, 0);
        this._hotelesService.updateHotelHabitacionesUpgrade(this.hotelManualUpgrade, this.hotelHabitacionesUM).subscribe((res: any) => {
          Swal.fire({
            position: 'center',
            icon: res.status,
            title: res.msg,
            showConfirmButton: false,
            timer: 2000
          });
        });
      }else{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Mejora actualizada correctamente`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
    setTimeout(() => {
      $('.dropdown-trigger').dropdown({alignment: 'center'});
    }, 0);
  }

  cargarMejoraManual(): void {
    this.hotelManualUpgrade.categoriaM = this.hotelManualUpgrade.categoria;
    this.hotelManualUpgrade.estrellasM = this.hotelManualUpgrade.estrellas.toString();
    this.totalHotelMM = this.hotelManualUpgrade.diferencia;
    this.hotelManualUpgrade.habitaciones = this.hotelHabitacionesUM;
    this.hotelManualUpgrade.edit = true;
    $('#modalMejoras').modal('open');
  }

  reiniciarMejoraManual(){
    $('#modalMejoras').modal('close');
  }

  comisionMejorasManual(tarifaBase: number){
    let total: number = tarifaBase;
    let comisionRives = (this.hotel.comision / 100);
    let comisionAgente = (this.hotelManualUpgrade.comisionAgente / 100);
    total = tarifaBase * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    return total;
  }

  calcularComisionMejoraManual(tarifa: number){
    this.totalHotelMM = this.comisionMejorasManual(tarifa);
  }

  eliminarMejoraManual(idHotelAdquirido: number){
    Swal.fire({
      title: `¿Esta seguro de eliminar la mejora?`,
      showCancelButton: true,
      cancelButtonText: 'No, regresar',
      confirmButtonText: `Si, continuar`,
      confirmButtonColor: '#b71c1c',
      backdrop: false
    }).then((result) => {
      if(result.isConfirmed){
        let msg: string = 'Mejora algo correctamente';
        let status: any = 'success';
        if(this.editingCarrito){
          this._hotelesService.deleteUpgradesManual(idHotelAdquirido).subscribe((res: any) => {
            msg = res.msg;
            status = res.status;
          });
        }
        this.hotelManualUpgrade = new HotelUpgrade();
        this.hotelHabitacionesUM = [];
        this.hotelHabitacionesUMB = [];
        Swal.fire({
          position: 'center',
          icon: status,
          title: msg,
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  esActualizacion(){
    this.hotel.habitaciones = this.hotelHabitaciones.slice();
    if(JSON.stringify(this.hotelBase) !== JSON.stringify(this.hotel)){
      return true;
    }else{
      return false;
    }
  }

  agregarHabitacion(form){
    this.validandoUpgrade = true;
    if(form.invalid) return;
    var msg: string = 'Habitación agregada correctamente';
    //AGREGAR HABITACIÓN Y MEJORAS
    if(this.hotelHabitacion.adding){
      switch(this.sectionActivated){
        case 1:
          this.hotelHabitacion.total = this.totalHabitacion;
          this.hotelHabitacion.i = this.countMejoras;
          this.totalStatic += this.totalHabitacion;
          this.personasRestates -= this.hotelHabitacion.noPersonas;
          var hh: any = Object.assign({}, this.hotelHabitacion);
          if(this.adding) hh.versionCotizacion = (this.cotizacion.version + 1);
          switch(this.hotelHabitacion.tipoHabitacion){
            case 'Doble':
              this.hotel.tarifaTotal += (this.hotelHabitacion.tarifa * this.hotelHabitacion.cantidadHabitaciones);
              hh.diferencia = this.calcularDiferenciaUpgradeHabitacion(hh, this.hotelHabitacion.tarifa, 1, 1.45);
              hh.tarifa = (hh.tarifa * 1.45);
              hh.tipoHabitacion = 'Triple';
              hh.i = this.countMejoras;
              this.hotelHabitacionesUDB.push(hh);
              break;
            case 'Triple':
              hh.diferencia = this.calcularDiferenciaUpgradeHabitacion(hh, this.hotelHabitacion.tarifa, 1.45, 1);
              this.hotelHabitacion.tarifa = (this.hotelHabitacion.tarifa * 1.45);
              this.hotel.tarifaTotal += (this.hotelHabitacion.tarifa * this.hotelHabitacion.cantidadHabitaciones);
              this.hotelHabitacion.tarifa = this.editing ? (this.hotelHabitacion.tarifa * 100) / 145 : this.hotelHabitacion.tarifa;
              hh.tipoHabitacion = 'Doble';
              hh.i = this.countMejoras;
              this.hotelHabitacionesUDB.push(hh);
              break;
          }
          this.hotelHabitacion.conMejoras = 0;
          this.hotelHabitaciones.push(Object.assign({}, this.hotelHabitacion));
          setTimeout(() => { $('.collapsible').collapsible() }, 0);
          break;
        case 2:
          this.hotel.tarifaTotal += (this.hotelHabitacion.tarifa * this.hotelHabitacion.cantidadHabitaciones);
          this.hotelHabitacion.i = this.countMejoras;
          this.hotelHabitacion.total = this.totalHabitacion;
          this.totalDynamic += this.totalHabitacion;
          this.personasRestates -= this.hotelHabitacion.noPersonas;
          var hh2: any = Object.assign({}, this.hotelHabitacion);
          hh2.diferencia = 0;
          hh2.i = this.countMejoras;
          if(this.adding) hh2.versionCotizacion = (this.cotizacion.version + 1);
          this.hotelHabitacionesUM.push(hh2);
          this.hotelHabitacionesUMB.push(Object.assign({}, hh2));
          this.hotelHabitaciones.push(Object.assign({}, this.hotelHabitacion));
          break;
      }
      if(this.editingCarrito){
        this.hotelHabitacion.idHotelAdquirido = this.hotel.idHotelAdquirido;
        this._hotelesService.agreagrHabitacion(this.hotelHabitacion).subscribe((resHabitacion: any) => {
          this.hotelHabitaciones[this.hotelHabitaciones.length - 1].idHotelHabitacion = resHabitacion.insertId;
          this.hotel.idDestino = this.destino.idDestino;
          switch(this.sectionActivated){
            case 1:
              hh.idHotelHabitacion = resHabitacion.insertId;
              hh.idCotizacion = this.cotizacion.idCotizacion;
              hh.idHotelAdquirido = this.hotel.idHotelAdquirido;
              hh.fecha = this.hotel.checkIn;
              hh.idHabitacion = resHabitacion.insertId;
              this.hotel.tarifaTotal = this.hotelHabitaciones.reduce((acc: number, h: any) => acc + h.tarifa, 0);
              this._hotelesService.updateHotel(this.hotel).subscribe(res => {}, err => console.log(err));
            break;
            case 2:
              hh2.idHotelHabitacion = resHabitacion.insertId;
              hh2.idCotizacion = this.cotizacion.idCotizacion;
              hh2.idHotelAdquirido = this.hotel.idHotelAdquirido;
              hh2.fecha = this.hotel.checkIn;
              hh2.idHabitacion = resHabitacion.insertId;
              this.hotel.tarifaTotal = this.hotelHabitaciones.reduce((acc: number, h: any) => acc + h.tarifa, 0);
              this._hotelesService.updateHotel(this.hotel).subscribe(res => {}, err => console.log(err));
              if(this.hotelManualUpgrade.adding){
                this._hotelesService.upgradeHabitacion(hh2).subscribe(res => {}, err => console.log(err));
                this.hotelManualUpgrade.tarifa = this.hotelHabitacionesUM.reduce((acc: number, upgrade: any) => acc + upgrade.tarifa, 0);
                this.hotelManualUpgrade.diferencia = this.hotelHabitacionesUM.reduce((acc: number, upgrade: any) => acc + upgrade.diferencia, 0);
                this._hotelesService.updateHotelUpgrade(this.hotelManualUpgrade).subscribe(res => {}, err => console.log(err));
              }
            break;
          }
        });
      }
      // INICIALIZAR INFORMACIÓN AL AGREGAR HABITACIÓN
      this.hotelHabitacion = new HotelHabitacion();
      form.reset(this.hotelHabitacion);
      this.totalHabitacion = 0;
      this.countMejoras++;
      this.validandoUpgrade = false;
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: msg,
        showConfirmButton: false,
        timer: 2000
      });
    }else{
      this.personasRestates -= this.hotelHabitacion.noPersonas;
      //ACTUALIZAR HABITACIÓN Y MEJORAS AL EDITAR DESDE EL CARRITO
      if(this.sectionActivated === 1 && this.hotelHabitacion.conMejoras && this.hotelHabitacionesUDB[0].idHabitacion || this.sectionActivated === 2 && this.hotelManualUpgrade.nombre && this.hotelManualUpgrade.nombre !== ''){
        Swal.fire({
          title: `Al editar una habitación, su mejora será inicializada con los nuevos valores, ¿Desea continuar?`,
          showCancelButton: true,
          cancelButtonText: 'No, regresar',
          confirmButtonText: `Si, continuar`,
          confirmButtonColor: '#b71c1c',
          backdrop: false
        }).then((result) => {
          if(result.isConfirmed){
            this.updateHabitacion();
          }
        });
      }else{
        this.router.url.includes('nuevaVersion') ? this.updateHabitacionEnVersiones() : this.updateHabitacion();
      }
    }
    $('#modalHabitacion').modal('close');
    setTimeout(() => { 
      $('.dropdown-trigger').dropdown({alignment: 'center'});
    }, 500);
  }

  updateHabitacion(){
    let i: number = this.hotelHabitaciones.findIndex((h: any) => h.i == this.hotelHabitacion.i);
    switch(this.sectionActivated){
      case 1:
        this.hotelHabitacion.idHotelAdquirido = this.hotel.idHotelAdquirido;
          var iUDB: any = this.hotelHabitacionesUDB.findIndex((hUDB: any) => hUDB.i == this.hotelHabitacion.i);
          this.hotelHabitacionesUDB[iUDB] = Object.assign(this.hotelHabitacionesUDB[iUDB], this.hotelHabitacion);
          switch(this.hotelHabitacion.tipoHabitacion){
             case 'Doble':
              this.hotelHabitacionesUDB[iUDB].diferencia = this.calcularDiferenciaUpgradeHabitacion(this.hotelHabitacionesUDB[iUDB], this.hotelHabitacion.tarifa, 1, 1.45);
              this.hotelHabitacionesUDB[iUDB].tipoHabitacion = 'Triple';
              this.hotelHabitacionesUDB[iUDB].tarifa = this.hotelHabitacionesUDB[iUDB].tarifa * 1.45;
              break;
            case 'Triple':
              this.hotelHabitacionesUDB[iUDB].diferencia = this.calcularDiferenciaUpgradeHabitacion(this.hotelHabitacionesUDB[iUDB], this.hotelHabitacion.tarifa, 1.45, 1);
              this.hotelHabitacionesUDB[iUDB].tipoHabitacion = 'Doble';
              break;
          }
        this.hotelHabitaciones[i] = this.hotelHabitacion;
        this.hotelHabitaciones[i].total = this.totalHabitacion;
        this.totalStatic += this.hotelHabitaciones[i].total;
        switch(this.hotelHabitacion.tipoHabitacion){
          case 'Doble':
            this.hotel.tarifaTotal += (this.hotelHabitaciones[i].tarifa * this.hotelHabitaciones[i].cantidadHabitaciones);
            break;
          case 'Triple':
            this.hotelHabitaciones[i].tarifa = this.hotelHabitaciones[i].tarifa * 1.45;
            this.hotel.tarifaTotal += (this.hotelHabitaciones[i].tarifa * this.hotelHabitaciones[i].cantidadHabitaciones);
            break;
        }
        if(!this.editingCarrito) return false;
        this._hotelesService.updateHabitacion(this.hotelHabitacion).subscribe((res: any) => {
          this.hotel.idDestino = this.destino.idDestino;
          this.hotel.tarifaTotal = this.hotelHabitaciones.reduce((acc: number, h: any) => acc + h.tarifa, 0);
          this._hotelesService.updateHotel(this.hotel).subscribe((resHotel: any) => {});
          if(this.hotelHabitacionesUDB[iUDB].conMejoras && res.status === 'success'){
            this._hotelesService.updateHabitacionUpgrade(this.hotelHabitacionesUDB[iUDB]).subscribe((resHabitacion: any) => {
              Swal.fire({
                position: 'center',
                icon: resHabitacion.status,
                title: resHabitacion.status === 'success' ? res.msg : resHabitacion.msg,
                showConfirmButton: false,
                timer: 1500
              });
            }, err => console.log(err));
          }else{
            Swal.fire({
              position: 'center',
              icon: res.status,
              title: res.msg,
              showConfirmButton: false,
              timer: 1500
            });
          }
        }, err => console.log(err));
        break;
      case 2:
        this.hotel.tarifaTotal += (this.hotelHabitacion.tarifa * this.hotelHabitacion.cantidadHabitaciones);
        if(this.hotelHabitacionesUM.length > 0){
          let iUM: any = this.hotelHabitacionesUM.findIndex((hUM: any) => hUM.hasOwnProperty('i') && hUM.i == this.hotelHabitacion.i || hUM.idHabitacion == this.hotelHabitacion.idHotelHabitacion);
          let iUMB: any = this.hotelHabitacionesUMB.findIndex((hUB: any) => hUB.hasOwnProperty('i') && hUB.i == this.hotelHabitacion.i || hUB.idHabitacion == this.hotelHabitacion.idHotelHabitacion);
          this.hotelHabitacionesUM[iUM] = Object.assign(this.hotelHabitacionesUM[iUM], this.hotelHabitacion);
          this.hotelHabitacionesUM[iUM].diferencia = 0;
          this.hotelHabitacionesUM[iUM].total = 0;
          this.hotelHabitacionesUM[iUM].tipoHabitacion = this.hotelHabitacion.tipoHabitacion === 'Triple' ? 'Doble' : 'Triple';
          this.hotelHabitacionesUM[iUM].idHotelAdquirido = this.hotel.idHotelAdquirido;
          this.hotelHabitacionesUMB[iUMB] = Object.assign({}, this.hotelHabitacionesUM[iUM]);
        }
        this.hotelHabitaciones[i] = this.hotelHabitacion;
        this.hotelHabitaciones[i].total = this.totalHabitacion;
        this.hotelHabitacion.idHotelAdquirido = this.hotel.idHotelAdquirido;
        this.totalDynamic += this.hotelHabitaciones[i].total;
        this.hotelManualUpgrade.tarifa = this.hotelHabitacionesUM.reduce((acc: number, upgrade: any) => acc + upgrade.tarifa, 0);
        this.hotelManualUpgrade.diferencia = this.hotelHabitacionesUM.reduce((acc: number, upgrade: any) => acc + upgrade.diferencia, 0); 
        if(!this.editingCarrito){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Habitación actualizada',
            showConfirmButton: false,
            timer: 1500
          });
          return false;
        }
        this._hotelesService.updateHabitacion(this.hotelHabitacion).subscribe((res: any) => {
          this.hotel.tarifaTotal = this.hotelHabitaciones.reduce((acc: number, h: any) => acc + h.tarifa, 0);
          this.hotel.idDestino = this.destino.idDestino;
          this._hotelesService.updateHotel(this.hotel).subscribe((resHotel: any) => {});
          if(this.hotelManualUpgrade.nombre && this.hotelManualUpgrade.nombre !== '' && res.status === 'success'){
            this._hotelesService.updateHotelHabitacionesUpgrade(this.hotelManualUpgrade, this.hotelHabitacionesUM).subscribe((resM: any) => {
              Swal.fire({
                position: 'center',
                icon: resM.status,
                title: resM.status === 'success' ? res.msg : resM.msg,
                showConfirmButton: false,
                timer: 1500
              });
            }, err => console.log(err));
          }else{
            Swal.fire({
              position: 'center',
              icon: res.status,
              title: res.msg,
              showConfirmButton: false,
              timer: 1500
            });
          }
        }, err => console.log(err));
        break;
    }
    setTimeout(() => { 
      $('.dropdown-trigger').dropdown({alignment: 'center'});
    }, 0);
  }

  updateHabitacionEnVersiones(){
    let i: any = this.hotelHabitaciones.findIndex((h: any) => h.i == this.hotelHabitacion.i);
    this.hotelHabitaciones[i] = this.hotelHabitacion;
      switch(this.sectionActivated){
        case 1:
          this.hotelHabitaciones[i].total = this.totalHabitacion;
          this.totalStatic += this.hotelHabitaciones[i].total;
          switch(this.hotelHabitacion.tipoHabitacion){
            case 'Doble':
              this.hotel.tarifaTotal += (this.hotelHabitaciones[i].tarifa * this.hotelHabitaciones[i].cantidadHabitaciones);
              break;
            case 'Triple':
              this.hotelHabitaciones[i].tarifa = this.hotelHabitaciones[i].tarifa * 1.45;
              this.hotel.tarifaTotal += (this.hotelHabitaciones[i].tarifa * this.hotelHabitaciones[i].cantidadHabitaciones);
              break;
          }
          break;
        case 2:
          this.hotelHabitaciones[i].total = this.totalHabitacion;
          this.hotel.tarifaTotal += (this.hotelHabitacion.tarifa * this.hotelHabitacion.cantidadHabitaciones);
          this.hotelHabitaciones[i].total = this.totalHabitacion;
          this.totalDynamic += this.hotelHabitaciones[i].total;
          break;
      }
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Habitación actualizada correctamente`,
        showConfirmButton: false,
        timer: 1500
      });
  }

  cargarHabitacion(index: number){
    this.hotelHabitacion = Object.assign({}, this.hotelHabitaciones[index]);
    delete this.hotelHabitacion.adding;
    this.hotel.tarifaTotal -= (this.hotelHabitacion.tarifa * this.hotelHabitacion.cantidadHabitaciones);
    this.personasRestates += this.hotelHabitacion.noPersonas;
    if(!this.editing){
      this.totalHabitacion = this.hotelHabitacion.totalBase;
    }else{
      this.totalHabitacion = this.hotelHabitacion.total;
      this.hotelHabitacion.totalBase = (this.hotelHabitacion.total / this.hotelHabitacion.cantidadHabitaciones);
    }
    switch(this.sectionActivated) {
      case 1:
        this.totalStatic -= this.totalHabitacion;
        if(this.hotelHabitacion.tipoHabitacion === 'Triple') this.hotelHabitacion.tarifa = (this.hotelHabitacion.tarifa * 100) / 145;
        if(this.hotelHabitacion.tipoHabitacion === 'Triple') this.hotelHabitacion.totalBase = (this.hotelHabitacion.totalBase * 100) / 145;
        break;
      case 2:
        this.totalDynamic -= this.totalHabitacion
        break;
    }
    $('#tipoHabitacionM').val(this.hotelHabitacion.tipoHabitacion);
    this.hotelHabitacion.edit = true;
    $('#modalHabitacion').modal({ dismissible: false});
    $('#modalHabitacion').modal('open');
  }

  trackByItems(index: number, item: any){
    return item.i;
  }

  calcularDiferenciaUpgradeHabitacion(hh: any, tarifa: number, tarifaHD: number, tarifaHT: number){
    let diferenciaBase: number = this.agregarComisiones(tarifa * tarifaHD * hh.cantidadHabitaciones) * this.daysInHotel;
    let diferenciaAlta: number = this.agregarComisiones(tarifa * tarifaHD * hh.cantidadHabitaciones) * this.holidaysInHotel * 1.20;
    let diferenciaTotal: number = diferenciaBase + diferenciaAlta;
    let tarifaBase: number = this.agregarComisiones(hh.tarifa * tarifaHT * hh.cantidadHabitaciones) * this.daysInHotel;
    let tarifaAlta: number = this.agregarComisiones(hh.tarifa * tarifaHT * hh.cantidadHabitaciones) * this.holidaysInHotel * 1.20;
    let tarifaTotal: number = tarifaBase + tarifaAlta;
    return (tarifaTotal - diferenciaTotal);
  }

  agregarMejoraDB(i: number, mejora: any, index: number) {
    if(mejora.conMejoras == 1){
      Swal.fire({
        title: `¿Esta seguro de eliminar la mejora?`,
        showCancelButton: true,
        cancelButtonText: 'No, regresar',
        confirmButtonText: `Si, continuar`,
        confirmButtonColor: '#b71c1c',
        backdrop: false
      }).then((result) => {
        if(result.isConfirmed){
          if(this.editingCarrito){
            this._hotelesService.deleteUpgradeHabitacion(this.hotelHabitacionesUDB[index].idHabitacion).subscribe((res: any) => {
              this.hotelHabitacionesUDB[index].conMejoras = 0;
              this.hotelHabitaciones.forEach(h => {
                if(h.hasOwnProperty('i') && h.i == this.hotelHabitacionesUDB[index] || h.idHotelHabitacion == this.hotelHabitacionesUDB[index].idHabitacion){
                  h.conMejoras = 0;
                }
              });
              Swal.fire({
                position: 'center',
                icon: res.status,
                title: res.msg,
                showConfirmButton: false,
                timer: 1500
              });
            }, err => console.log(err));
          }
        }else{
          setTimeout(() => {
            $('#checkHabitacion-' + index).prop('checked', true);
            this.hotelHabitacionesUDB[index].conMejoras = 1;
          }, 0);
        }
      });
    }else{
      this.hotelHabitaciones.forEach(h => {
        if(h.hasOwnProperty('i') && h.i == this.hotelHabitacionesUDB[index] || h.idHotelHabitacion == this.hotelHabitacionesUDB[index].idHabitacion){
          h.conMejoras = 1;
        }
      });
      this.hotelHabitacionesUDB[index].idCotizacion = this.cotizacion.idCotizacion;
      this.hotelHabitacionesUDB[index].i = i;
      this.hotelHabitacionesUDB[index].tipoHabitacion = mejora.tipoHabitacion;
      this.hotelHabitacionesUDB[index].tipoCategoria = mejora.tipoCategoria;
      this.hotelHabitacionesUDB[index].diferencia = mejora.diferencia;
      if(this.adding) this.hotelHabitacionesUDB[index].versionCotizacion = (this.cotizacion.version + 1);
      this.hotelHabitacionesUDB[index].conMejoras = 1;
      this.hotelHabitacionesUDB[index].conMejoras = 1;
      if(this.editingCarrito){
        this._hotelesService.upgradeHabitacion(this.hotelHabitacionesUDB[index]).subscribe((res: any) => {
          this.hotelHabitacionesUDB[index].idHotelAdquiridoUpgrade = res.insertId;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Mejora agregada correctamente',
            showConfirmButton: false,
            timer: 1500
          });
        }, err => console.log(err));
      }
    }
  }

  agregarComisiones(tarifaBase: number, comA?: number){
    let CA: any = comA >= 0 ? comA : this.hotel.comisionAgente;
    let comisionRives = (this.hotel.comision / 100);
    let comisionAgente = (CA / 100);
    let total: number = tarifaBase * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    return total;
  }

  calcularTarifaHabitacion(tarifa: number){
    if(this.sectionActivated === 1){
      switch(this.hotelHabitacion.tipoHabitacion){
        case 'Doble':
          let tarifaBase1: number = (this.agregarComisiones(tarifa) * this.daysInHotel);
          let tarifaAlta1: number = (this.agregarComisiones(tarifa) * this.holidaysInHotel * 1.20);
          this.totalHabitacion = tarifaBase1 + tarifaAlta1;
          this.hotelHabitacion.totalBase = tarifaBase1 + tarifaAlta1;
          break;
        case 'Triple':
          let tarifaBase2: number = (this.agregarComisiones(tarifa * 1.45) * this.daysInHotel);
          let tarifaAlta2: number = (this.agregarComisiones(tarifa * 1.45) * this.holidaysInHotel * 1.20);
          this.totalHabitacion = tarifaBase2 + tarifaAlta2;
          this.hotelHabitacion.totalBase = tarifaBase2 + tarifaAlta2;
          break;
      }
    }else{
      let tarifaBase: number = (this.agregarComisiones(tarifa) * this.daysInHotel);
      let tarifaAlta: number = (this.agregarComisiones(tarifa) * this.holidaysInHotel * 1.20);
      this.totalHabitacion = tarifaBase + tarifaAlta;
      this.hotelHabitacion.totalBase = tarifaBase + tarifaAlta;
    }
    
  }

  calcularDiferenciaManual(tarifa: number, id: number, index: number, comA: number){
    if(tarifa === null){
      this.hotelHabitacionesUM[index].diferencia = 0;
    }else{
      this.totalHotelMM = 0;
      let h: any = this.hotelHabitaciones.find((h: any) => h.hasOwnProperty('i') && h.i == id || h.idHotelHabitacion == id);
      this.hotelHabitacionesUM[index].tarifa = tarifa;
      this.hotelHabitacionesUM[index].diferencia = (this.agregarComisiones((tarifa * this.hotelHabitacionesUM[index].cantidadHabitaciones), comA) - this.agregarComisiones(h.tarifa * this.hotelHabitacionesUM[index].cantidadHabitaciones));
      this.hotelHabitacionesUM[index].diferencia = (this.hotelHabitacionesUM[index].diferencia * this.daysInHotel) + (this.hotelHabitacionesUM[index].diferencia * this.holidaysInHotel * 1.20);  
      this.hotelManualUpgrade.tarifa = this.hotelHabitacionesUM.reduce((acc: number, upgrade: any) => acc + upgrade.tarifa, 0);
      this.hotelManualUpgrade.diferencia = this.hotelHabitacionesUM.reduce((acc: number, upgrade: any) => acc + upgrade.diferencia, 0);
      this.totalHotelMM = this.hotelManualUpgrade.diferencia;
    }
  }

  cambiarComisionAgente(com: number){
    if(com === null) return;
    this.hotelHabitacionesUM.forEach((mejora: any) => {
      mejora.diferencia = this.agregarComisiones(mejora.tarifa, com) - mejora.total;
    });
  }

  validarNumeroPersonas(noPersonas: number){
    if(noPersonas === null || noPersonas < 1){
      $('#numeroPersonas').val(1);
      this.hotelHabitacion.noPersonas = 1;
    }else if(noPersonas > this.personasRestates){
      $('#numeroPersonas').val(this.personasRestates);
      this.hotelHabitacion.noPersonas = this.personasRestates;
    }
  }

  cambiarNumeroPersonas(noPersonas: number){
    let noP: number = this.hotelHabitaciones.reduce((acc: number, h: any) => acc + h.noPersonas, 0);
    this.personasRestates = this.editingCarrito ? noPersonas - noP : noPersonas;
  }

  editarHabitacion(index: number){
    this.hotelHabitacion = this.hotelHabitaciones[index];
    $('#modalHabitacion').modal('open');
  }

  eliminarHabitacion(index: number, id: number, idHabitacion: number){
    var upgradeToDelete: any = undefined;
    if(this.sectionActivated === 1){
      upgradeToDelete = this.hotelHabitacionesUDB.find(h => h.idHabitacion == this.hotelHabitaciones[index].idHotelHabitacion);
    }
    this.hotel.tarifaTotal = this.hotelHabitaciones.reduce((acc: number, h: any) => acc + h.tarifa, 0);
    if(upgradeToDelete && upgradeToDelete.conMejoras || this.hotelManualUpgrade.adding){
      Swal.fire({
        title: `Esta habitación contiene una mejora, si la elimina, la mejora también será eliminada y tendrá que agregarla nuevamente, ¿Desea continuar?`,
        showCancelButton: true,
        cancelButtonText: 'No, regresar',
        confirmButtonText: `Si, continuar`,
        confirmButtonColor: '#b71c1c',
        backdrop: false
      }).then((result) => {
        if(result.isConfirmed){
          this.hotel.tarifaTotal -= (this.hotelHabitaciones[index].tarifa * this.hotelHabitaciones[index].cantidadHabitaciones);
          this.totalHabitacion = 0;
          this.totalDynamic -= this.hotelHabitaciones[index].total;
          this.personasRestates += this.hotelHabitaciones[index].noPersonas;
          if(this.editingCarrito){
            if(this.hotelHabitaciones.length === 1){
              this._hotelesService.deleteHabitacion(idHabitacion).subscribe((resHabitacion: any) => {
                this.hotel.idDestino = this.destino.idDestino;
                this._hotelesService.updateHotel(this.hotel).subscribe((resHotel: any) => {});
                switch(this.sectionActivated){
                  case 1:
                    this.hotelHabitacionesUDB = [];
                    break;
                  case 2:
                    this._hotelesService.deleteUpgradesManual(this.hotel.idHotelAdquirido).subscribe((res: any) => {});
                    this.hotelManualUpgrade = new HotelUpgrade();
                    this.hotelHabitacionesUM = [];
                    this.hotelHabitacionesUMB = [];
                    break;
                }
                this.hotelHabitaciones.splice(index, 1);
              });
            }else{
              switch(this.sectionActivated){
                case 1:
                  let i: number = this.hotelHabitacionesUDB.findIndex(h => h.idHabitacion == this.hotelHabitaciones[index].idHotelHabitacion);
                  this.hotelHabitacionesUDB.splice(i, 1);
                  break;
                case 2:
                  let ii: number = this.hotelHabitacionesUM.findIndex(h => h.idHabitacion == this.hotelHabitaciones[index].idHotelHabitacion);
                  this.hotelHabitacionesUM.splice(ii, 1);
                  break;
              }
              this.hotelHabitaciones.splice(index, 1);
              this._hotelesService.deleteHabitacion(idHabitacion).subscribe((resHabitacion: any) => {
                this.hotel.idDestino = this.destino.idDestino;
                this._hotelesService.updateHotel(this.hotel).subscribe((resHotel: any) => {});
                if(this.sectionActivated === 2){
                  this.hotelManualUpgrade.tarifa = this.hotelHabitacionesUM.reduce((acc: number, upgrade: any) => acc + upgrade.tarifa, 0);
                  this._hotelesService.updateHotelHabitacionesUpgrade(this.hotelManualUpgrade, this.hotelHabitacionesUM).subscribe((resHotel: any) => {});
                }
                this.getUpgrades();
              });
            }
          }else{
            this.hotelManualUpgrade = new HotelUpgrade();
            this.hotelHabitacionesUM = [];
            this.hotelHabitacionesUMB = [];
            this.hotelHabitaciones.splice(index, 1);
            this.hotelHabitaciones.forEach((h: any) => {
              let hh2: any = Object.assign({}, h);
              hh2.diferencia = 0;
              hh2.i = h.i;
              if(this.adding) hh2.versionCotizacion = (this.cotizacion.version + 1);
              this.hotelHabitacionesUM.push(hh2);
              this.hotelHabitacionesUMB.push(Object.assign({}, hh2));
            });
          }
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `Habitación eliminada correctamente`,
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    }else{
      Swal.fire({
        title: `¿Esta seguro de eliminar la habitación?`,
        showCancelButton: true,
        cancelButtonText: 'No, regresar',
        confirmButtonText: `Si, continuar`,
        confirmButtonColor: '#b71c1c',
        backdrop: false
      }).then((result) => {
        if(result.isConfirmed){
          switch(this.sectionActivated){
            case 1:
              this.totalStatic -= this.hotelHabitaciones[index].total;
              this.personasRestates += this.hotelHabitaciones[index].noPersonas;
              let ii: any = this.hotelHabitacionesUDB.findIndex((mejora: any) => mejora.i === id);
              this.hotelHabitacionesUDB.splice(ii, 1);
              let iHDB: number = this.hotelHabitacionesUDB.findIndex((hDB: any) => hDB.i === id);
              if(iHDB !== -1) this.hotelHabitacionesUDB.splice(iHDB, 1);
              this.hotelHabitaciones.splice(index, 1);
              this.hotel.tarifaTotal = this.hotelHabitaciones.reduce((acc: number, h: any) => acc + h.tarifa, 0);
              if(this.editingCarrito){
                this._hotelesService.deleteHabitacion(idHabitacion).subscribe((resHabitacion: any) => {
                  this.hotel.idDestino = this.destino.idDestino;
                  this._hotelesService.updateHotel(this.hotel).subscribe((resHotel: any) => {});
                  this.getUpgrades();
                });
              }
              break;
            case 2:
              this.totalDynamic -= this.hotelHabitaciones[index].total;
              this.personasRestates += this.hotelHabitaciones[index].noPersonas;
              let iii: any = this.hotelHabitacionesUM.findIndex((mejora: any) => mejora.i === id);
              this.hotelHabitacionesUM.splice(iii, 1);
              let iM: any = this.hotelHabitacionesUMB.findIndex((mejora: any) => mejora.i === id);
              this.hotelHabitacionesUMB.splice(iM, 1);
              this.hotel.tarifaTotal -= (this.hotelHabitaciones[index].tarifa * this.hotelHabitaciones[index].cantidadHabitaciones);
              this.hotel.idDestino = this.destino.idDestino;
              this.hotelHabitaciones.splice(index, 1);
              if(this.editingCarrito){
                this._hotelesService.deleteHabitacion(idHabitacion).subscribe((resHabitacion: any) => {
                  this._hotelesService.updateHotel(this.hotel).subscribe((resHotel: any) => {});
                  this.hotelManualUpgrade.tarifa = this.hotelHabitacionesUM.reduce((acc: number, upgrade: any) => acc + upgrade.tarifa, 0);
                  this._hotelesService.updateHotelHabitacionesUpgrade(this.hotelManualUpgrade, this.hotelHabitacionesUM).subscribe((resHotel: any) => {});
                  this.getUpgrades();
                });
              }
              break;
          }
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `Habitación eliminada correctamente`,
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    }
  }

  iniciarNuevaMejora(){
    this.validandoUpgrade = false;
    this.hotelManualUpgrade = new HotelUpgrade();
    this.hotelManualUpgrade.noPersonas = (this.totalViajeros - this.personasRestates);
    this.hotelHabitacionesUM = [];
    if(this.hotelHabitacionesUMB.length === 0){
      this.hotelHabitaciones.forEach(h => {
        let hh: any = Object.assign({}, h);
        hh.diferencia = 0;
        hh.idHabitacion = h.idHotelHabitacion;
        this.hotelHabitacionesUM.push(hh);
      });
      this.hotelManualUpgrade.comisionAgente = this.hotel.comisionAgente;
    }else{
      this.hotelHabitacionesUM = JSON.parse(JSON.stringify(this.hotelHabitacionesUMB));
      this.hotelManualUpgrade.comisionAgente = this.comisionAgenteBase;
    }
    this.hotelManualUpgrade.estrellasM = 0;
    this.totalHotelMM = 0;
  }

  cambiarTipoHabitacion(tipoHabitacion: string){
    if(this.sectionActivated === 1){
      if(this.hotelHabitacion.tipoHabitacion === 'Doble' && tipoHabitacion === 'Triple'){
        let tarifaBase: number = this.agregarComisiones(this.hotelHabitacion.tarifa * this.hotelHabitacion.cantidadHabitaciones * 1.45) * this.daysInHotel;
        let tarifaAlta: number = this.agregarComisiones(this.hotelHabitacion.tarifa * this.hotelHabitacion.cantidadHabitaciones * 1.45) * this.holidaysInHotel * 1.20;
        this.totalHabitacion = tarifaBase + tarifaAlta;
      }else{
        let tarifaBase: number = this.agregarComisiones(this.hotelHabitacion.tarifa * this.hotelHabitacion.cantidadHabitaciones) * this.daysInHotel;
        let tarifaAlta: number = this.agregarComisiones(this.hotelHabitacion.tarifa * this.hotelHabitacion.cantidadHabitaciones) * this.holidaysInHotel * 1.20;
        this.totalHabitacion = tarifaBase + tarifaAlta;
      }
    }
    this.hotelHabitacion.tipoHabitacion = tipoHabitacion;
  }

  nuevaHabitacion(){
    this.hotelHabitacion = new HotelHabitacion();
    this.hotelHabitacion.adding = true;
    $('#tipoHabitacionM').val('Doble');
    if(this.sectionActivated === 1){
      this.hotelHabitacion.tarifa = this.totalStaticByNight;
      let tarifaBase: number = (this.agregarComisiones(this.hotelHabitacion.tarifa * this.hotelHabitacion.cantidadHabitaciones) * this.daysInHotel);
      let tarifaAlta: number = (this.agregarComisiones(this.hotelHabitacion.tarifa * this.hotelHabitacion.cantidadHabitaciones) * this.holidaysInHotel * 1.20);
      this.totalHabitacion = tarifaBase + tarifaAlta;
      this.hotelHabitacion.totalBase = tarifaBase + tarifaAlta;
    }
    $('#modalHabitacion').modal({ dismissible: false });
    $('#modalHabitacion').modal('open');
  }

  actualizarHabitacion(){
    this.totalStatic = 0;
    this.hotelHabitacion.total = this.totalHabitacion;
    this.hotelHabitaciones.forEach((h: any, i) => {
      this.totalStatic += h.total;
      if(this.hotelHabitacion.idHotelHabitacion === h.idHotelHabitacion){
        this.hotelHabitaciones[i] = h;
      }
    });
    $('#modalHabitacion').modal('close');
  }

  cerrarModalAH(){
    $('#modalHabitacion').modal('close');
    if(this.hotelHabitacion.edit){
      this.hotel.tarifaTotal += (this.hotelHabitacion.tarifa * this.hotelHabitacion.cantidadHabitaciones);
      this.personasRestates -= this.hotelHabitacion.noPersonas;
      this.sectionActivated === 1 ? this.totalStatic += this.totalHabitacion : this.totalDynamic += this.totalHabitacion;
    }
  }

  updateCarrito(form) {
    if(form.invalid) return false;
    this.hotel.idDestino = this.destino.idDestino;
    this.hotel.tarifaTotal = this.hotelHabitaciones.reduce((acc: number, h: any) => acc + h.tarifa, 0);
    this._hotelesService.updateHotel(this.hotel).subscribe((res: any) => {
      this.hotelHabitaciones.forEach(habitacion => {
        habitacion.idHotelAdquirido = this.hotel.idHotelAdquirido;
        this._hotelesService.updateHabitacion(habitacion).subscribe((resH: any) => {});
      });
      switch(this.sectionActivated){
        case 1:
          this.hotelHabitacionesUDB.forEach(upgrade => {
            if(upgrade.conMejoras){
              upgrade.fecha = this.hotel.checkIn;
              this._hotelesService.updateHabitacionUpgrade(upgrade).subscribe((res: any) => {});
            }
          });
          break;
        case 2:
          this.hotelManualUpgrade.fecha = this.hotel.checkIn;
            this._hotelesService.updateHotelHabitacionesUpgrade(this.hotelManualUpgrade, this.hotelHabitacionesUM).subscribe((resM: any) => {}, err => console.log(err));
          break;
      }
      this.refresh.emit(true);
      Swal.fire({
        position: 'center',
        icon: res.status,
        title: res.msg,
        showConfirmButton: false,
        timer: 1500
      });
    });
  }

  cargarCollapsibleImagenes(){
    $('#collapsibleImagenes').collapsible();
    if(this.cargarImagen){
      $('#collapsibleImagenes').collapsible('close');
    }else{
      $('#collapsibleImagenes').collapsible('open');
    }
    this.cargarImagen = this.cargarImagen ? false : true;
  }

  eliminarImagenHotel(num: number): void {
    num === 1 ? this.imagen1 = [] : this.imagen2 = [];
  }

  validarFormularios(valor: any, input: string): void {
    switch(input){
      case 'nombre':
        this.validaciones.nombre = /^[A-Za-z0-9\s]+$/i.test(valor) ? 1 : 0;
        break;
      case 'comision5':
        valor = parseInt(valor.target.value);
        this.validaciones.comision5 = /^[0-9]+$/i.test(valor) ? 1 : 0;
        break;
      case 'comisionA':
        valor = parseInt(valor.target.value);
        this.validaciones.comisionA = /^[0-9]+$/i.test(valor) ? 1 : 0;
        break;
    }
  }

  cargarDescripcion(nombreHotel: string): void {
    this.hotel.descripcion = `Hospedaje en: ${nombreHotel}`
  }

  tarifaPorCantHabitaciones(cantidad: number): void {
    if(cantidad === 0){
      cantidad = 1;
      $('#cantHabitacion').val(1);
    }
    this.hotelHabitacion.cantidadHabitaciones = cantidad;
    if(this.sectionActivated === 1 && this.hotelHabitacion.tipoHabitacion === 'Triple'){
      this.totalHabitacion = this.hotelHabitacion.totalBase * 1.45 * (cantidad === null ? 1 : cantidad);
    }else{
      this.totalHabitacion = this.hotelHabitacion.totalBase * (cantidad === null ? 1 : cantidad);
    }
  }

  async cargarImagen1(files: FileList){
    let fileToUpload = files[0];
    if(files[0]) await this.getFileBlob(fileToUpload, 1);
  }

  async cargarImagen2(files: FileList){
    let fileToUpload = files[0];
    if(files[0]) await this.getFileBlob(fileToUpload, 2);
  }

  getFileBlob(file, num: number){
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
        case 'jpg':
        case 'jpeg':
          let objIMG = {
            ext: d,
            blob: data
          }
          num === 1 ? this.imagen1 = objIMG : this.imagen2 = objIMG;
          if(this.editingCarrito){
            switch(this.sectionActivated){
              case 1:
                switch(num){
                  case 1:
                    this.imagenesService.guardarImagenHotel1(this.hotel.idHotelAdquirido, this.imagen1.blob).subscribe((imagen: any) => {
                      setTimeout(() => {
                        this.imagen1.img = `${this.filePath}/hotel1/${imagen.result}?img=${new Date().getTime()}`;
                      }, 0);
                    }, err => console.log(err));
                  break;
                  case 2:
                    this.imagenesService.guardarImagenHotel2(this.hotel.idHotelAdquirido, this.imagen2.blob).subscribe((imagen: any) => {
                      setTimeout(() => {
                        this.imagen2.img = `${this.filePath}/hotel2/${imagen.result}?img=${new Date().getTime()}`;
                      }, 0);
                    }, err => console.log(err));
                  break;
                }
              break;
              case 2:
                switch(num){
                  case 1:
                    this.imagenesService.guardarActualizacionImagenHotel1(this.hotel.idHotelAdquirido, this.imagen1.blob).subscribe((imagen: any) => {
                      setTimeout(() => {
                        this.imagen1.img = `${this.filePath}/actualizacionHotel1/${imagen.result}?img=${new Date().getTime()}`;
                      }, 0);
                    }, err => console.log(err));
                  break;
                  case 2:
                    this.imagenesService.guardarActualizacionImagenHotel2(this.hotel.idHotelAdquirido, this.imagen2.blob).subscribe((imagen: any) => {
                      setTimeout(() => {
                        this.imagen2.img = `${this.filePath}/actualizacionHotel2/${imagen.result}?img=${new Date().getTime()}`;
                      }, 0);
                    }, err => console.log(err));
                  break;
                }
              break;
            }
          }
        break;
        default:
          Swal.fire({
            icon: 'error',
            title: 'Archivo no valido',
            text: 'Extensiones permitidas: .jpg, .jpeg',
            backdrop: false
          });
        break;
      }
    }).catch(err => {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Su archivo no pudo ser procesado, por favor intentelo nuevamente.',
        backdrop: false,
      });
    });
    return a;
  }
}