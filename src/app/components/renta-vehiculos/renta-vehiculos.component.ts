import { DatePipe } from '@angular/common';
import { Component, OnInit, DoCheck, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as M from 'materialize-css/dist/js/materialize';
import Swal from 'sweetalert2';
import { Cotizacion } from 'src/app/models/Cotizacion';
import { RentaVehiculo } from 'src/app/models/RentaVehiculo';
import { RentaVehiculosService } from 'src/app/services/rentaVehiculos.service';
import { SendDataToEditService } from 'src/app/services/sendDataToEdit.service';
import { CanastaService } from 'src/app/services/canasta.service';
import { DestinosService } from 'src/app/services/destinos.service';
import { Destino } from 'src/app/models/Destino';
import { Subscription } from 'rxjs';
import { Canasta } from 'src/app/models/Canasta';
import { Version } from 'src/app/models/Version';
import { VersionesService } from 'src/app/services/versiones.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/models/Usuario';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { environment } from 'src/environments/environment';
import { RentaVehiculoUpgrade } from 'src/app/models/RentaVehiculoUpgrade';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-renta-vehiculos',
  templateUrl: './renta-vehiculos.component.html',
  styleUrls: ['./renta-vehiculos.component.css']
})
export class RentaVehiculosComponent implements OnInit, DoCheck, OnDestroy {
  @Input() public adding: boolean = false;
  @Input() public editing: boolean = false;
  @Input() public editingCarrito: boolean = false;
  @Input() public mostrarMejora: boolean = true;
  @Output() public refresh = new EventEmitter<boolean>();
  @Output() public redirect = new EventEmitter<number>();

  public i18nOptions: Object = {
    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
    weekdays: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    weekdaysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
    weekdaysAbbrev: ["D", "L", "M", "M", "J", "V", "S"],
  };
  public filePath: string = environment.API_URI_IMAGES;
  public suscripciones: Subscription[] = [];
  public rentaVehiculo: any = new RentaVehiculo();
  public rentaVehiculoMejora: any = new RentaVehiculoUpgrade();
  public rentaVehiculoBase: any = new RentaVehiculo();
  public rentaVehiculoCanasta: any = new RentaVehiculo();
  public total: number = 0;
  public diferencia: number = 0;
  public cotizacion: any = new Cotizacion();
  public destino: any = new Destino();
  public canasta: Canasta = new Canasta();
  public usuario: any = new Usuario();
  public validando: boolean = false;
  public validandoMejora: boolean = false;
  public imagenVehiculo: any = {};
  public imagenVehiculoMejora: any = {};
  public agregarImagen: boolean = true;
  public agregarImagenMejora: boolean = true;
  public agregandoMejora: boolean = false;
  public actualizarImagenMejora: boolean = true;

  constructor(
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private sendDataToEditService: SendDataToEditService,
    private rentaVehiculosService: RentaVehiculosService,
    private canastaService: CanastaService,
    private destinosService: DestinosService,
    private versionesService: VersionesService,
    private usuariosService: UsuariosService,
    public imagenesService: ImagenesService,
    private router: Router

  ) { }

  ngOnInit(): void {
    if (this.router.url.includes("rentaVehiculo")) {
      $(".tabs").tabs("select", "rentaVehiculos");
    }
    // console.log('Carga de componente', this.editing, this.editingCarrito);
    $('#modalMejoraRV').modal({ dismissible: false});
    this.getCotizacion();
    this.getDestino();
    this.getUsuario();
    this.cargarFechas('.datepicker-pickUp', 0);
    this.cargarFechas('.datepicker-dropOff', 0);
    this.cargarHoras('.timepicker-pickUp', 0);
    this.cargarHoras('.timepicker-dropOff', 1);
    this.cargarFechas('.datepicker-pickUpMejora', 0);
    this.cargarFechas('.datepicker-dropOffMejora', 0);
    this.cargarHoras('.timepicker-pickUpMEjora', 0);
    this.cargarHoras('.timepicker-dropOffMejora', 1);
    if(this.editing || this.editingCarrito){
      this.getProducToEdit();
    }
  }

  ngDoCheck(): void {
    M.updateTextFields();
  }

  ngOnDestroy(): void {
    this.suscripciones.forEach(s => s.unsubscribe());
  }

  getCotizacion(){
    let s: any = this.sendDataToEditService.getProduct('cotizacion').subscribe((cotizacion: any) => {
      if(Object.keys(cotizacion).length === 0) return false;
      this.cotizacion = cotizacion;
    });
    this.suscripciones.push(s);
  }

  getDestino(){
    let s: any = this.destinosService.getActualDestino().subscribe((destino: Destino) => {
      if(Object.keys(destino).length === 0) return false;
      this.destino = destino;
      this.rentaVehiculo.idDestino = this.destino.idDestino;
    });
    this.suscripciones.push(s);
  }

  getUsuario(){
    let s: any = this.usuariosService.getUser().subscribe(usuario => {
      if(Object.keys(usuario).length === 0) return false;
      this.usuario = usuario;
    });
    this.suscripciones.push(s);
  }

  getProducToEdit() {
    this.sendDataToEditService.getProduct('rentaVehiculo').subscribe((rentaVehiculo: any) => {
      this.rentaVehiculo = Object.assign({}, rentaVehiculo);
      this.rentaVehiculoBase = Object.assign({}, rentaVehiculo);
      this.total = this.rentaVehiculo.precio;
      this.imagenVehiculo = {};
      this.agregarImagen = false;
      $('#image').val(this.rentaVehiculo.imagen);
      this.cargarFechas('.datepicker-pickUp', 0, this.rentaVehiculo.fechaPickUp);
      this.cargarFechas('.datepicker-dropOff', 1, this.rentaVehiculo.fechaDropOff);
      $('#modalDetalleRV').modal({ dismissible: false });
      this.getUpgrade(this.rentaVehiculo.idRentaVehiculo); 
    });
  }

  getUpgrade(idRentaVehiculo: number){
    // console.log('Consulta de mejoras');
    this.rentaVehiculosService.getUpgrade(idRentaVehiculo).subscribe((mejora: any) => {
      if(!mejora) return false;
      this.rentaVehiculoMejora = Object.assign({}, mejora);
      this.rentaVehiculoMejora.precio = this.calcularTarifa(this.rentaVehiculoMejora.comision, this.rentaVehiculoMejora.comisionAgente, this.rentaVehiculoMejora.tarifa, this.rentaVehiculoMejora.diasRentado);
      setTimeout(() => {
        this.rentaVehiculoMejora.cargada = true;
        $('#imageMejora').val(this.rentaVehiculoMejora.imagen);
        this.cargarFechas('.datepicker-pickUpMejora', 0, this.rentaVehiculoMejora.fechaPickUp);
        this.cargarFechas('.datepicker-dropOffMejora', 1, this.rentaVehiculoMejora.fechaDropOff);
      }, 0);
      this.imagenVehiculoMejora = {};
      this.agregarImagenMejora = false;
      this.agregandoMejora = true;
    }, err => console.error(err));
  }

  cargarFechas(classDatePicker: string, tipo: number, date?: string){
    let fecha1 = localStorage.getItem('fechaInicio');
    let fecha2 = localStorage.getItem('fechaFinal');
    let minDate: any = new Date(fecha1 + 'T00:00:00');
    let maxDate: any = new Date(fecha2 + 'T00:00:00');
    let defaultDate: any = new Date(fecha1 + 'T00:00:00');
    switch(tipo){
      case 0:
        minDate = date !== undefined ? new Date(date + 'T00:00:00') : minDate;
      break;
      case 1:
        !this.agregandoMejora ? 
        minDate = new Date(new Date(this.rentaVehiculo.fechaPickUp).setDate(new Date(this.rentaVehiculo.fechaPickUp).getDate() + 1)) :
        minDate = new Date(new Date(this.rentaVehiculoMejora.fechaPickUp).setDate(new Date(this.rentaVehiculoMejora.fechaPickUp).getDate() + 1));
        defaultDate = date !== undefined ? new Date(date + 'T00:00:00') : defaultDate;
      break;
      default:
      break;
    }
    $(classDatePicker).datepicker({
      minDate: minDate,
      maxDate: maxDate,
      setDefaultDate: defaultDate,
      defaultDate: defaultDate,
      format: "yyyy-mm-dd",
      i18n: this.i18nOptions
    });
  }

  cargarHoras(classTimePicker: string, tipo: number) {
    $(classTimePicker).timepicker();
  }

  cambiarHoras(hora: any, tipo: string) {
    hora = hora.target.value;
    switch(tipo){
      case 'horaPickUp':
        this.rentaVehiculo.horaPickUp = hora;
      break;
      case 'horaDropOff':
        this.rentaVehiculo.horaDropOff = hora;
      break;
      case 'horaPickUpMejora':
        this.rentaVehiculoMejora.horaPickUp = hora;
      break;
      case 'horaDropOffMejora':
        this.rentaVehiculoMejora.horaDropOff = hora;
      break;
    }
  }

  cambiarFechas(data: any, tipo: string){
    data = this.datePipe.transform(new Date(data.target.value + 'T00:00:00'), "yyyy-MM-dd");
    switch(tipo){
      case 'fechaPickUp':
        this.rentaVehiculo.fechaPickUp = data;
        if(this.rentaVehiculo.fechaDropOff === '')return false;
        if(new Date(this.rentaVehiculo.fechaPickUp).getTime() > new Date(this.rentaVehiculo.fechaDropOff).getTime()){
          this.rentaVehiculo.fechaDropOff = data;
          this.cargarFechas('.datepicker-dropOff', 0, data);
        }else{
          this.cargarFechas('.datepicker-dropOff', 1, this.rentaVehiculo.fechaDropOff);
        }
      break;
      case 'fechaPickUpMejora':
        this.rentaVehiculoMejora.fechaPickUp = data;
        if(this.rentaVehiculoMejora.fechaDropOff === '')return false;
        if(new Date(this.rentaVehiculoMejora.fechaPickUp).getTime() > new Date(this.rentaVehiculoMejora.fechaDropOff).getTime()){
          this.rentaVehiculoMejora.fechaDropOff = data;
          this.cargarFechas('.datepicker-dropOffMejora', 0, data);
        }else{
          this.cargarFechas('.datepicker-dropOffMejora', 1, this.rentaVehiculoMejora.fechaDropOff);
        }
      break;
      case 'fechaDropOff':
        this.rentaVehiculo.fechaDropOff = data;
      break;
      case 'fechaDropOffMejora':
        this.rentaVehiculoMejora.fechaDropOff = data;
      break;
    }
    if(!this.agregandoMejora){
      this.rentaVehiculo.diasRentado = this.calcularDias(this.rentaVehiculo.fechaDropOff, this.rentaVehiculo.fechaPickUp);
      this.calcularTotal();
    }else{
      this.rentaVehiculoMejora.diasRentado = this.calcularDias(this.rentaVehiculoMejora.fechaDropOff, this.rentaVehiculoMejora.fechaPickUp);
      this.calcularDiferenciaMejora();
    }
  }

  calcularDias(fechaDropOff: any, fechaPickUp: any) {
    let dias = Math.abs(Math.floor((new Date(fechaDropOff).getTime() - new Date(fechaPickUp).getTime()) / 1000 / 60 / 60 / 24));
    dias = dias === 0 ? 1 : dias;
    return dias;
  }

  calcularTarifa(com5r: number, comA: number, tarifa: number, dias: number) {
    com5r = !com5r ? 0 : com5r;
    comA = !comA ? 0 : comA;
    let comision5R = (com5r / 100);
    let comisionA = (comA / 100);
    let total = (tarifa * (1 + comision5R) * (1 + (comisionA / (1 - comisionA))) * dias);
    return total
  }

  calcularTotal() {
    this.rentaVehiculo.comision = !this.rentaVehiculo.comision ? 0 : this.rentaVehiculo.comision;
    this.rentaVehiculo.comisionAgente = !this.rentaVehiculo.comisionAgente ? 0 : this.rentaVehiculo.comisionAgente;
    let comision5R = (this.rentaVehiculo.comision / 100);
    let comisionA = (this.rentaVehiculo.comisionAgente / 100);
    this.total = (this.rentaVehiculo.tarifa * (1 + comision5R) * (1 + (comisionA / (1 - comisionA))) * this.rentaVehiculo.diasRentado);
  }

  calcularDiferenciaMejora() {
    this.rentaVehiculoMejora.comision = !this.rentaVehiculoMejora.comision ? 0 : this.rentaVehiculoMejora.comision;
    this.rentaVehiculoMejora.comisionAgente = !this.rentaVehiculoMejora.comisionAgente ? 0 : this.rentaVehiculoMejora.comisionAgente;
    let comision5R = (this.rentaVehiculoMejora.comision / 100);
    let comisionA = (this.rentaVehiculoMejora.comisionAgente / 100);
    let total = (this.rentaVehiculoMejora.tarifa * (1 + comision5R) * (1 + (comisionA / (1 - comisionA))) * this.rentaVehiculoMejora.diasRentado);
    this.diferencia = total - this.total;
    this.rentaVehiculoMejora.diferencia = this.diferencia;
    this.rentaVehiculoMejora.precio = this.calcularTarifa(this.rentaVehiculoMejora.comision, this.rentaVehiculoMejora.comisionAgente, this.rentaVehiculoMejora.tarifa, this.rentaVehiculoMejora.diasRentado);
  }

  async onSubmit(form: any){
    this.validando = true;
    if(form.invalid || !this.imagenVehiculo.blob) return false;
    const { value: opcional } = await Swal.fire({
      input: 'checkbox',
      inputValue: 0,
      backdrop: false,
      inputPlaceholder: '¿Es una renta de vehículo opcional?',
      confirmButtonText: 'Continuar <i class="fa fa-arrow-right"></i>',
    });
    this.rentaVehiculo.opcional = opcional;
    if(this.adding){
      this.rentaVehiculo.nuevo = true;
      this.rentaVehiculo.id = this.rentaVehiculo.idRentaVehiculo;
      this.rentaVehiculo.type = 'Vehículo en renta';
      this.rentaVehiculo.valido = true;
      this.rentaVehiculo.idToSend = 12;
      this.rentaVehiculo.idCiudad = this.destino.idCiudad;
      this.rentaVehiculo.imagenVehiculo = this.imagenVehiculo;
      if(this.imagenVehiculoMejora.blob){
        this.rentaVehiculo.upgrade = this.rentaVehiculoMejora;
        this.rentaVehiculo.imagenVehiculoMejora = this.imagenVehiculoMejora;
      }
      this.sendDataToEditService.sendProductToUpdate(this.rentaVehiculo);
      $('.modalAddProducts').modal('close');
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Producto agregado correctamente`,
        showConfirmButton: false,
        timer: 1500
      });
    }else{
      this.rentaVehiculoCanasta = Object.assign({}, this.rentaVehiculo);
      this.rentaVehiculosService.create(this.rentaVehiculo).subscribe((res: any) => {
        let nombre: string = `${res.insertId}-${new Date().getTime()}.${this.imagenVehiculo.ext}`;
        this.imagenesService.uploadImagenesRentaVehiculos(res.insertId, this.imagenVehiculo.blob, nombre).subscribe((resRV: any) => {
          this.imagenVehiculoMejora.blob ? this.insertMejora(res.insertId) : false;
          this.insertCanasta(res.insertId);
          this.rentaVehiculoCanasta.idRentaVehiculo = res.insertId;
          this.rentaVehiculoCanasta.tipoNombre = 'rentaVehiculo';
          this.rentaVehiculoCanasta.tipo = 12;
          this.rentaVehiculoCanasta.precio = this.total;
          this.rentaVehiculoCanasta.idCiudad = this.destino.idCiudad;
          this.rentaVehiculoCanasta.imagen = resRV.fileName;
          this.canastaService.addProduct(this.rentaVehiculoCanasta);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `Producto agregado correctamente`,
            showConfirmButton: false,
            timer: 2000
          });
          this.redirect.emit(1);
          setTimeout(() => {
            this.validando = false;
            this.imagenVehiculo = {};
            $('#image').val('');
            this.rentaVehiculo = new RentaVehiculo();
            this.rentaVehiculo.idDestino = this.destino.idDestino;
            form.reset(this.rentaVehiculo);
            this.total = 0;
            this.cargarFechas('.datepicker-pickUp', 0);
            this.cargarFechas('.datepicker-dropOff', 0);
            this.cargarHoras('.timepicker-pickUp', 0);
            this.cargarHoras('.timepicker-dropOff', 1);
          }, 0);
        });
      });
    }
  }

  insertCanasta(insertId: number) {
    this.canasta.idCotizacion = this.destino.idCotizacion;
    this.canasta.idActividad = insertId;
    this.canasta.tipo = 12;
    this.canastaService.create(this.canasta).subscribe(res => {
      let version = new Version();
      version.idActividad = insertId;
      version.tipo = 12; //Es renta de vehiculo
      version.idCotizacion = this.cotizacion.idCotizacion;
      version.versionCotizacion = this.cotizacion.version;
      version.accion = 1;
      version.idUsuario = this.usuario.idUsuario;
      this.versionesService.create(version).subscribe((resp) => {});
    }, err => { console.log(err) });
  }

  insertMejora(insertId: number) {
    this.rentaVehiculoMejora.idRentaVehiculo = insertId;
    this.rentaVehiculosService.createUpgrade(this.rentaVehiculoMejora).subscribe((res: any) => {
      let nombre: string = `${res.insertId}M-${new Date().getTime()}.${this.imagenVehiculoMejora.ext}`;
      this.imagenesService.uploadImagenesRentaVehiculosUpgrade(res.insertId, this.imagenVehiculoMejora.blob, nombre).subscribe((resRV: any) => {
        if(!this.editingCarrito){
          this.rentaVehiculoMejora = new RentaVehiculoUpgrade();
          this.imagenVehiculo = {};
        }else{
          this.rentaVehiculoMejora.idRentaVehiculoUpgrade = res.insertId;
          this.rentaVehiculoMejora.imagen = nombre;
          delete this.rentaVehiculoMejora.add;
        }
      });
    });
  }

  abrirModalDetalle(form: any){
    if(form.invalid) return false;
    if(this.esActualizacion()){
      $('#modalDetalleRV').modal('open');
    }else{
      $('.modalSendProducts').modal('close');
      $('#modalDetalleRV').modal('close');
    }
  }

  updateCarrito(form: any) {
    if(form.invalid) return false;
    this.rentaVehiculosService.update(this.rentaVehiculo, this.rentaVehiculo.idRentaVehiculo).subscribe((res: any) => {
      if(Object.keys(this.imagenVehiculo).length === 0){
        this.helperUdpateCarrito();
      }else{
        this.imagenesService.updateImagenRentaVehiculos(this.imagenVehiculo.blob, this.rentaVehiculo.imagen).subscribe((resRV: any) => {
          this.helperUdpateCarrito();
        });
      }
    }, err => console.log(err));
  }
  
  helperUdpateCarrito() {
    this.imagenVehiculo = {};
    $('#image').val('');
    this.refresh.emit(true);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: `Producto actualizado correctamente`,
      showConfirmButton: false,
      timer: 2000
    });
  }

  updateCarritoMejora(form: any) {
    // console.log('this.rentaVehiculoMejora', this.rentaVehiculoMejora);
    if(form.invalid) return false;
    this.rentaVehiculosService.updateUpgrade(this.rentaVehiculoMejora, this.rentaVehiculoMejora.idRentaVehiculoUpgrade).subscribe((res: any) => {
      if(Object.keys(this.imagenVehiculoMejora).length === 0){
        this.helperUdpateCarritoMejora();
      }else{
        this.imagenesService.updateImagenRentaVehiculos(this.imagenVehiculoMejora.blob, this.rentaVehiculoMejora.imagen).subscribe((resRV: any) => {
          this.helperUdpateCarritoMejora();
        });
      }
    }, err => console.log(err));
  }

  helperUdpateCarritoMejora() {
    this.imagenVehiculoMejora = {};
    this.agregarImagenMejora = false;
    this.validandoMejora = false;
    $('#imageMejora').val('');
    $('#modalMejoraRV').modal('close');
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: `Mejora actualizado correctamente`,
      showConfirmButton: false,
      backdrop: false,
      timer: 1500
    });
  }

  updateVersion() {
    this.rentaVehiculo.imagenVehiculo = this.imagenVehiculo;
    this.sendDataToEditService.sendProductToUpdate(this.rentaVehiculo);
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

  esActualizacion(){
    if(JSON.stringify(this.rentaVehiculoBase) !== JSON.stringify(this.rentaVehiculo) || this.imagenVehiculo.blob){
      return true;
    }else{
      return false;
    }
  }

  async cargarImagen(files: FileList, tipo: string){
    let fileToUpload = files[0];
    files[0] ? await this.getFileBlob(fileToUpload, tipo) : false;
  }

  getFileBlob(file, tipo: string){
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
      let d = file.type.split('/')[1];
      switch(d){
        case 'png':
        case 'jpg':
        case 'jpeg':
          switch(tipo){
            case 'rentaVehiculo':
              this.imagenVehiculo.ext = d;
              this.imagenVehiculo.blob = data;
              this.agregarImagen = true;
            break;
            case 'rentaVehiculoMejora':
              this.imagenVehiculoMejora.ext = d;
              this.imagenVehiculoMejora.blob = data;
              this.agregarImagenMejora = true;
            break;
          }
        break;
        default:
          Swal.fire({
            icon: 'error',
            title: 'Archivo no valido',
            text: 'Extensiones permitidas: .jpg, .jpeg, .png',
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

  cargarMejora(accion: string) {
    if(accion == 'abrir'){
      this.inicializarMejora();
    }else{
      if(this.editingCarrito){
        delete this.rentaVehiculoMejora.add;
      }else{
        this.agregandoMejora = false;
      }
      $('#modalMejoraRV').modal('close');
    }
  }

  inicializarMejora() {
    this.agregandoMejora = true;
    setTimeout(() => {
      this.agregandoMejora = true;
      this.rentaVehiculoMejora = new RentaVehiculoUpgrade();
      this.validandoMejora = false;
      this.imagenVehiculoMejora = {};
      this.cargarFechas('.datepicker-pickUpMejora', 0);
      this.cargarFechas('.datepicker-dropOffMejora', 0);
      this.cargarHoras('.timepicker-pickUpMejora', 0);
      this.cargarHoras('.timepicker-dropOffMejora', 1);
      this.rentaVehiculoMejora.add = true;
    }, 0);
  }

  agregarMejora(form: any) {
    this.validandoMejora = true;
    if(form.invalid) return false;
    this.rentaVehiculoMejora.cargada = true;
    this.rentaVehiculoMejora.precio = this.calcularTarifa(this.rentaVehiculoMejora.comision, this.rentaVehiculoMejora.comisionAgente, this.rentaVehiculoMejora.tarifa, this.rentaVehiculoMejora.diasRentado);
    if(this.editingCarrito){
      this.insertMejora(this.rentaVehiculo.idRentaVehiculo);
    }
    $('#modalMejoraRV').modal('close');
    Swal.fire({
      position: "center",
      icon: "success",
      title: !this.rentaVehiculoMejora.edit ? "Mejora agregada correctamente" : "Mejora actualizada correctamente",
      showConfirmButton: false,
      timer: 2000,
    });
  }

  eliminarMejora(){
    Swal.fire({
      title: '¿Está seguro de eliminar la mejora?',
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      confirmButtonColor: '#b71c1c'
    }).then((result) => {
      if (result.isConfirmed) {
        if(this.editingCarrito){
          this.rentaVehiculosService.deleteUpgrade(this.rentaVehiculoMejora.idRentaVehiculoUpgrade, this.rentaVehiculoMejora.imagen).subscribe(res => {
            this.helperEliminarMejora();
          });
        }else{
          this.helperEliminarMejora();
        }
      }
    });
  }

  helperEliminarMejora(){
    this.inicializarMejora();
    this.agregandoMejora = false;
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Mejora eliminada correctamente",
      showConfirmButton: false,
      timer: 2000,
    });
  }

  editarMejora(rentaVehiculoMejora: any){
    $('#modalMejoraRV').modal({ dismissible: false});
    $('#modalMejoraRV').modal('open');
    this.rentaVehiculoMejora.edit = true;
    this.rentaVehiculoMejora = rentaVehiculoMejora;
    this.diferencia = this.rentaVehiculoMejora.diferencia;
    this.agregandoMejora = true;
    if(this.editingCarrito){
      this.rentaVehiculoMejora = rentaVehiculoMejora;
      $('#nombreMejora').val(this.rentaVehiculoMejora.nombre);
      // this.cdr.reattach();
      // this.cdr.detectChanges();
      // this.cdr.detach();
    }
  }
}
