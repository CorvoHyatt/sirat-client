import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { environment } from 'src/environments/environment';
import { SendDataToEditService } from 'src/app/services/sendDataToEdit.service';
import { Cotizacion } from 'src/app/models/Cotizacion';
import { CotizacionInformacionPasajerosService } from 'src/app/services/cotizacion-informacion-pasajeros.service';
import { CotizacionInformacionPasajero } from 'src/app/models/CotizacionInformacionPasajero';
import { ActivatedRoute, Router } from '@angular/router';
import { CanastaService } from 'src/app/services/canasta.service';
import { DestinosService } from 'src/app/services/destinos.service';
import { PaisesService } from 'src/app/services/paises.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/models/Usuario';
import { VueloInfoExtra } from 'src/app/models/VueloInfoExtra';
import { TrenInfoExtra } from 'src/app/models/TrenInfoExtra';
import Swal from 'sweetalert2';
import { HotelInfoExtra } from 'src/app/models/HotelInfoExtra';
import { TrasladoInfoExtra } from 'src/app/models/TrasladoInfoExtra';
import { TrasladosAdquiridosService } from 'src/app/services/traslados-adquiridos.service';
import { HotelesService } from 'src/app/services/hoteles.service';
import { VuelosService } from 'src/app/services/vuelos.service';
import { TrasladosService } from '../../services/traslados.service';
import { TrasladosCostosService } from '../../services/traslados-costos.service';
import * as M from "materialize-css/dist/js/materialize";
import { VehiculosService } from '../../services/vehiculos.service';
import { Vehiculo } from 'src/app/models/Vehiculo';
import { DisposicionInfoExtra } from '../../models/DisposicionInfoExtra';
import { DisposicionesCostosService } from '../../services/disposiciones-costos.service';
import { DisposicionesAdquiridasService } from '../../services/disposiciones-adquiridas.service';
import { Producto } from '../../models/Producto';
import { ProductoInfoExtra } from '../../models/ProductoInfoExtra';
import { ProductosAdquiridosService } from '../../services/productos-adquiridos.service';
import { RentaVehiculoInfo } from '../../models/RentaVehiculoInfo';
import { RentaVehiculosService } from '../../services/rentaVehiculos.service';
import { ExtrasInfo } from '../../models/ExtrasInfo';
import { ExtrasService } from '../../services/extras.service';
import { TrenesService } from '../../services/trenes.service';

import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { CotizacionesService } from '../../services/cotizaciones.service';
declare var $: any;

@Component({
  selector: 'app-completar-cotizacion',
  templateUrl: './completar-cotizacion.component.html',
  styleUrls: ['./completar-cotizacion.component.css']
})
export class CompletarCotizacionComponent implements OnInit {

  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  public usuario: any = new Usuario();
  public cotizacion: any = new Cotizacion(); 
  public infoPrincipal: any = new CotizacionInformacionPasajero();
  public vueloInfoExtra: VueloInfoExtra = new VueloInfoExtra();
  public trenInfoExtra: TrenInfoExtra = new TrenInfoExtra();
  public hotelInfoExtra: HotelInfoExtra = new HotelInfoExtra();
  public infoExtra: any = new TrasladoInfoExtra();
  public filePath: string = environment.API_URI_IMAGES;
  public infoPasajerosArray: any[] = [];
  public totalPasajerosArray: any[] = [];
  public totalNeto: number = 0;
  public totalComision: number = 0;
  public destinos: any[] = [];
  public holidaysInHotel: number = 0;
  public datesInHotel: string = '';
  public versionCotizacion: number = 0;
  public indexD: number = 0;
  public indexP: number = 0;
  public imagenesParaMostrar: any[] = [];
  public imagenesParaGuardar: any[] = [];
  public countImagenes: number = 1;
  public datosPasajerosCompletados: boolean = false;
  public productosCompletados: boolean = false;
  public vehiculos: Vehiculo[] = [];
  public vehiculoSeccionado: Vehiculo = new Vehiculo();
  public tipoHacia: number = 2;
  public tipoDesde: number = 2;
  public API_URI_IMAGES = environment.API_URI_IMAGES;

  cardOptions: StripeCardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        
        iconColor: "#666EE8",
        color: "#31325F",
        fontWeight: "300",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: "20px",
        "::placeholder": {
          color: "#4993e7",
        },
       
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: "es",
  };

  constructor(
    private canastaService: CanastaService,
    private imagenesService: ImagenesService,
    private sendDataToEditService: SendDataToEditService,
    private cotizacionInformacionPasajerosService: CotizacionInformacionPasajerosService,
    private destinosService: DestinosService,
    private paisesService: PaisesService,
    private usuariosService: UsuariosService,
    private trasladosAdquiridosServide: TrasladosAdquiridosService,
    private hotelesService: HotelesService,
    private trenesService: TrenesService,
    private vuelosService: VuelosService,
    private router: Router,
    private route: ActivatedRoute,
    private trasladosService: TrasladosService,
    private trasladosCostoService: TrasladosCostosService,
    private vehiculosService: VehiculosService,
    private _changeDetectorRef: ChangeDetectorRef,
    private disposicionesCostoService: DisposicionesCostosService,
    private disposicionesAdquiridasService: DisposicionesAdquiridasService,
    private productosAdquiridosService: ProductosAdquiridosService,
    private rentaVehiculosService: RentaVehiculosService,
    private extrasService: ExtrasService,
    private stripeService: StripeService,
    private cotizacionService: CotizacionesService

  ) { }

  ngOnInit(): void {



    this.infoPrincipal.principal = 1;
    $('select').formSelect();
    this.getVehiculos();
    this.getUser();
    setTimeout(() => {
      $('#modalInfoPasaportes').modal({ dismissible: false });
      $('.timepicker').timepicker();
    }, 0);

    // setTimeout(() => { 
    //   $('.datepicker').datepicker();
    // }, 0);
    
    $("body").delegate("#fechaDesdeTCI", "focusin", function () {
      $(this).datepicker({ format: "yyyy-mm-dd" });
    });


    $("body").delegate("#fechaHaciaTCI", "focusin", function () {
      $(this).datepicker({ format: "yyyy-mm-dd" });
    });
    
    $("body").delegate(".timepicker", "focusin", function () {
      $(this).timepicker({
      });
    });

    $("body").delegate("#fechaCompletar", "focusin", function () {
      $(this).datepicker({ format: "yyyy-mm-dd" });
    });

    $("body").delegate("#fechaTren", "focusin", function () {
      $(this).datepicker({ format: "yyyy-mm-dd" });
    });
    
    

    $("body").delegate("#fechaPickUpRenta", "focusin", function () {
      $(this).datepicker({ format: "yyyy-mm-dd" });
    });

    $("body").delegate("#fechaDropOffRenta", "focusin", function () {
      $(this).datepicker({ format: "yyyy-mm-dd" });
    });

    $("body").delegate("#fechaExtra", "focusin", function () {
      $(this).datepicker({ format: "yyyy-mm-dd" });
    });


  }

  getVehiculos() {
    console.log("getvehiculos");
    this.vehiculosService.list().subscribe(
      (res: Vehiculo[]) => {
        this.vehiculos = res;
        console.log(this.vehiculos);
      }
    );
  }

  getUser() {
    this.usuariosService.getUser().subscribe((user: any) => {
      if (Object.keys(user).length === 0) return false;
      this.usuario = user;
      this.listOneCotizacionByUserByVersion(user);
    }, err => { console.log(err) });
  }

  listOneCotizacionByUserByVersion(usuario: any) {
    this.route.params.subscribe((params) => {
      let idCotizacion: number = params["idCotizacion"];
      this.versionCotizacion = params["versionCotizacion"];
      this.canastaService.listOneCotizacionByUserByVersion(usuario.idUsuario, idCotizacion, this.versionCotizacion).subscribe((res: any) => {
        this.destinos = res.destinos;
        
        this.destinosService.setActualDestino(this.destinos[0]);
        this.cotizacion = res.cotizacion;
        console.log("Cotizacion", this.cotizacion);
        this.destinos.map((destino) => {
          res.canasta.map(async (product: any) => {
            switch (product.tipo) {
              case 1:
                if (product.traslado.idCiudad !== destino.idCiudad) return false;
                console.log("traslado",product.infoExtra);                
                product.traslado.infoExtra = product.infoExtra;
                destino.productos.push(product.traslado);
                product.traslado.id = product.traslado.idTrasladoAdquirido;
                product.traslado.type = 'Traslado';
                product.traslado.precio = this.calcularComision(product.traslado.comision, product.traslado.comisionAgente, product.traslado.tarifa);
                // product.traslado.opcional === 0 ? this.enviarComisionServicios(product.traslado.tarifa, product.traslado.comision, product.traslado.comisionAgente) : '';
                break;
              case 2:
                if (product.disposicion.idCiudad !== destino.idCiudad) return false;
                product.disposicion.infoExtra = product.infoExtra;
                destino.productos.push(product.disposicion);
                product.disposicion.id = product.disposicion.idDisposicionAdquirida;
                product.disposicion.type = 'Disposición';
                product.disposicion.precio = this.calcularComision(product.disposicion.comision, product.disposicion.comisionAgente, product.disposicion.tarifa);
                // product.disposicion.opcional === 0 ? this.enviarComisionServicios(product.disposicion.tarifa, product.disposicion.comision, product.disposicion.comisionAgente) : '';
                break;
              case 3:
                
                if (product.trasladoOtro.idCiudad !== destino.idCiudad) return false;
                product.trasladoOtro.infoExtra = product.infoExtra;
                destino.productos.push(product.trasladoOtro);
                product.trasladoOtro.id = product.trasladoOtro.idTrasladoOtro;
                product.trasladoOtro.type = 'Traslado Otro';
                product.trasladoOtro.precio = this.calcularComision(product.trasladoOtro.comision, product.trasladoOtro.comisionAgente, product.trasladoOtro.tarifa);
                // product.trasladoOtro.opcional === 0 ? this.enviarComisionServicios(product.trasladoOtro.tarifa, product.trasladoOtro.comision, product.trasladoOtro.comisionAgente): '';
                break;
              case 4:
                if (product.hotel.idDestino !== destino.idDestino) return false;
                product.hotel.infoExtra = product.infoExtra;
                destino.productos.push(product.hotel);
                product.hotel.id = product.hotel.idHotelAdquirido;
                product.hotel.type = 'Hotel';
                product.hotel.daysInHotel = Math.floor((new Date(product.hotel.checkOut).getTime() - new Date(product.hotel.checkIn).getTime()) / 1000 / 60 / 60 / 24);
                await this.getPais(new Date(product.hotel.checkIn), new Date(product.hotel.checkOut), destino.idPais);
                product.hotel.holidaysInHotel = this.holidaysInHotel;
                product.hotel.daysInHotel = (product.hotel.daysInHotel - this.holidaysInHotel);
                let tarifaBase: number = (product.hotel.cityTax + product.hotel.desayuno) * product.hotel.daysInHotel;
                let tarifaAlta: number = (product.hotel.cityTax + product.hotel.desayuno) * this.holidaysInHotel * 1.20;
                let tarifaTotal: number = (product.hotel.tarifaTotal + tarifaBase + tarifaAlta);
                product.hotel.precio = this.calcularComision(product.hotel.comision, product.hotel.comisionAgente, tarifaTotal);
                product.hotel.precio += product.hotel.otros;
                // product.hotel.opcional === 0 ? this.enviarComisionHoteles(tarifaTotal, product.hotel.comision, product.hotel.comisionAgente) : '';
                break;
              case 5:
                console.log(product.vuelo.idDestino);
                console.log(destino.idDestino);
 
                if (product.vuelo.idDestino !== destino.idDestino) return false;
                product.vuelo.infoExtra = product.infoExtra;
                destino.productos.push(product.vuelo);
                product.vuelo.id = product.vuelo.idVuelo;
                product.vuelo.type = 'Vuelo';
                product.vuelo.precio = this.calcularComision(product.vuelo.comision, product.vuelo.comisionAgente, product.vuelo.tarifa);
                // product.vuelo.opcional === 0 ? this.enviarComisionServicios(product.vuelo.tarifa, product.vuelo.comision, product.vuelo.comisionAgente) : '';
                break;
              case 6:
                if (product.tren.idDestino !== destino.idDestino) return false;
                product.tren.infoExtra = product.infoExtra;
                destino.productos.push(product.tren);
                product.tren.id = product.tren.idTren;
                product.tren.type = 'Tren';
                product.tren.precio = this.calcularComision(product.tren.comision, product.tren.comisionAgente, product.tren.tarifa);
                // product.tren.opcional === 0 ? this.enviarComisionServicios(product.tren.tarifa, product.tren.comision, product.tren.comisionAgente) : '';
                break;
              case 7:
                if (product.tourPie) {
                  if (product.tourPie.idCiudad !== destino.idCiudad) return false;
                  console.log("tour pie",product.infoExtra);
                  product.tourPie.infoExtra = product.infoExtra;
                  destino.productos.push(product.tourPie);
                  product.tourPie.id = product.tourPie.idProductoAdquirido;
                  product.tourPie.type = 'Tour privado a pie';
                  product.tourPie.precio = this.calcularComision(product.tourPie.comision, product.tourPie.comisionAgente, product.tourPie.tarifa);
                  // product.tourPie.opcional === 0 ? this.enviarComisionServicios(product.tourPie.tarifa, product.tourPie.comision, product.tourPie.comisionAgente) : ''
                } else if (product.tourTransporte) {
                  if (product.tourTransporte.idCiudad !== destino.idCiudad) return false;
                  product.tourTransporte.infoExtra = product.infoExtra;
                  destino.productos.push(product.tourTransporte);
                  product.tourTransporte.id = product.tourTransporte.idProductoAdquirido;
                  product.tourTransporte.type = 'Tour privado en transporte';
                  product.tourTransporte.precio = this.calcularComision(product.tourTransporte.comision, product.tourTransporte.comisionAgente, product.tourTransporte.tarifa);
                  // product.tourTransporte.opcional === 0 ? this.enviarComisionServicios(product.tourTransporte.tarifa, product.tourTransporte.comision, product.tourTransporte.comisionAgente) : '';
                } else if (product.tourGrupo) {
                  if (product.tourGrupo.idCiudad !== destino.idCiudad) return false;
                  product.tourGrupo.infoExtra = product.infoExtra;
                  destino.productos.push(product.tourGrupo);
                  product.tourGrupo.id = product.tourGrupo.idProductoAdquirido;
                  product.tourGrupo.type = 'Tour privado en grupo';
                  product.tourGrupo.precio = this.calcularComision(product.tourGrupo.comision, product.tourGrupo.comisionAgente, product.tourGrupo.tarifa);
                  // product.tourGrupo.opcional === 0 ? this.enviarComisionServicios(product.tourGrupo.tarifa, product.tourGrupo.comision, product.tourGrupo.comisionAgente) : '';
                } else if (product.actividad) {
                  if (product.actividad.idCiudad !== destino.idCiudad) return false;
                  product.actividad.infoExtra = product.infoExtra;
                  destino.productos.push(product.actividad);
                  product.actividad.id = product.actividad.idProductoAdquirido;
                  product.actividad.type = 'Actividad';
                  product.actividad.precio = this.calcularComision(product.actividad.comision, product.actividad.comisionAgente, product.actividad.tarifa);
                  // product.actividad.opcional === 0 ? this.enviarComisionServicios(product.actividad.tarifa, product.actividad.comision, product.actividad.comisionAgente) : '';
                }
                break;
              case 8:
                if (product.extra.idDestino !== destino.idDestino) return false;
                product.extra.infoExtra = product.infoExtra;
                destino.productos.push(product.extra);
                product.extra.id = product.extra.idExtras;
                product.extra.type = `${product.extra.extras} (Producto extra)`;
                product.extra.precio = this.calcularComision(product.extra.comision, product.extra.comisionAgente, product.extra.tarifa);
                // product.extra.opcional === 0 ? this.enviarComisionServicios(product.extra.tarifa, product.extra.comision, product.extra.comisionAgente) : '';
                break;
              
              case 12:
                console.log("renta de autos");
                console.log(product);
                if (product.rentaVehiculo.idDestino !== destino.idDestino) return false;
                product.rentaVehiculo.infoExtra = product.infoExtra;
                destino.productos.push(product.rentaVehiculo);
                product.rentaVehiculo.idRentaVehiculo = product.rentaVehiculo.idRentaVehiculo;
                product.rentaVehiculo.type = `Renta vehiculo`;
                product.rentaVehiculo.precio = this.calcularComision(product.rentaVehiculo.comision, product.rentaVehiculo.comisionAgente, product.rentaVehiculo.tarifa);
                //product.rentaVehiculo.opcional === 0 ? this.enviarComisionServicios(product.extra.tarifa, product.extra.comision, product.extra.comisionAgente) : '';
                break;
            } 
          });
        });
        console.log(this.destinos);
        this.infoPasaportes();
      }, err => console.log(err))
    });
  }

  infoPasaportes() {
    let arrayLength = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12) - 1;
    this.totalPasajerosArray = new Array(arrayLength);
   

      this.cotizacionInformacionPasajerosService.get(this.cotizacion.idCotizacion).subscribe(
        (resp: CotizacionInformacionPasajero[]) => {
          let pasajeroPrincipal = resp.find(pasajero => pasajero.principal == 1);
          if (pasajeroPrincipal != undefined) {
            this.infoPrincipal = pasajeroPrincipal;
           
          }  
          
          let otrosPasajeros = resp.filter(pasajeros => pasajeros.principal != 1);
          if (otrosPasajeros.length > 0) {
            this.infoPasajerosArray = otrosPasajeros;

          }
          
          if (resp.length == 0) {
            this.infoPrincipal.nombre = this.cotizacion.viajeroNombre;
            this.infoPrincipal.apellidos = this.cotizacion.viajeroApellido;
            this.infoPrincipal.idCotizacion = this.cotizacion.idCotizacion;

            for (let i = 0; i < this.totalPasajerosArray.length; i++) {
              let infoPasajero = new CotizacionInformacionPasajero();
              infoPasajero.idCotizacion = this.cotizacion.idCotizacion;
              this.infoPasajerosArray.push(infoPasajero);
            }
          }else {
            this.datosPasajerosCompletados = true;
          }

        }
      );
  
    
  }

  getFileBlob(file, index) {
    var reader = new FileReader();
    let a: any = new Promise(function (resolve, reject) {
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
      switch (d) {
        case 'jpeg':
        case 'jpg':
          let containerImage: any = `
            <img src="${data}" alt="Pasaporte" height="100" width="200">
          `;
          let objImg = {
            data: containerImage,
            ext: d,
            blob: data
          }
          if (index === -1) {
            this.infoPrincipal.img = objImg;
          } else {
            this.infoPasajerosArray[index].img = objImg;
          }
          this.countImagenes++;
          break;
        default:
          Swal.fire({
            icon: 'error',
            title: 'Archivo no valido',
            text: 'Extensiones permitidas: JPEG, JPG',
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

  async cargarPasaporte(files: FileList, index: number = -1) {
    let fileToUpload = files[0];
    await this.getFileBlob(fileToUpload, index);
  }

  onSubmit() {
    if (this.datosPasajerosCompletados) {//VALIDAR SI LOS DATOS DE LOS PASAJEROS SON CORRECTOS
      this.validarProductosCompletados();
      if (this.productosCompletados) {//VALIDAR SI TODOS LOS PRODUCTOS FUERON COMPLETADOS
        this.guardarInformacionPasajeros();
        this.guardarProductosCompletados();
        this.datosPasajerosCompletados = false;
        this.productosCompletados = false;
        //CAMBIAR EL ESTADO DE LA COTIZACIÓN PARA GENERAR EL ITINERARIO.
        let data = { estatus: 8 };
        this.canastaService.updateStatus(this.cotizacion.idCotizacion, data).subscribe((res: any) => {
          this.cotizacion.estado = 8;
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Información completada con éxito.",
            showConfirmButton: false,
            timer: 2000,
          });
          this.router.navigate(['/home/itinerario', this.cotizacion.idCotizacion, this.cotizacion.version]);
        }, err => { console.log(err) });
      } else {
        this.productosCompletados = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al validar productos',
          text: `Debe completar la información para todos los productos`,
          backdrop: false,
        });
      }
    } else {
      this.datosPasajerosCompletados = false;
      Swal.fire({
        icon: 'error',
        title: 'Error al validar información de pasajeros',
        text: `Debe completar los datos e imagenes para todos los pasajeros.`,
        backdrop: false,
      });
    }
  }

  validarInformacionPasajeros() {
    let validos: boolean[] = [];
    //VALIDAR DATOS DE PASAJERO PRINCIPAL
    if (this.infoPrincipal.nombre.trim() === '') {
      validos.push(false);
    } else if (this.infoPrincipal.edad <= 0) {
      validos.push(false);
    } else if (!this.infoPrincipal.img && this.infoPrincipal.pasaporte.length==0) {
      validos.push(false);
    } else {
      validos.push(true);
    }
    //VALIDAR DATOS DEL RESTO DE PASAJEROS
    this.infoPasajerosArray.map((infoPasajero, i) => {
      if (infoPasajero.nombre.trim() === '') {
        validos.push(false);
      } else if (infoPasajero.edad <= 0) {
        validos.push(false);
      } else if (!infoPasajero.img  && infoPasajero.pasaporte.length==0) {
        validos.push(false);
      } else {
        validos.push(true);
      }
    });
    //VALIDAR SI TODA LA INFORAMCIÓN ESTA COMPLETA
    if (validos.includes(false)) {
      this.datosPasajerosCompletados = false;
      Swal.fire({
        icon: 'error',
        title: 'Error al validar información',
        text: `Los datos e imagenes para todos los pasajeros son obligatorios.`,
        backdrop: false
      });
    } else {
      //this.guardarInformacionPasajeros();
      this.datosPasajerosCompletados = true;
      $('#modalInfoPasaportes').modal('close');
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Información de pasajeros validada con éxito.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  validarProductosCompletados() {
    let validos: boolean[] = [];
    console.log(this.destinos);
    this.destinos.forEach((destino: any) => {
      destino.productos.forEach((producto: any) => {
        console.log(producto.type);
        
          producto.infoExtra ? validos.push(true) : validos.push(false);
          console.log(producto.type, producto.infoExtra );
        
      }); 
    }); 
    console.log(validos);
    if (validos.includes(false)) {
      this.productosCompletados = false;
    } else {
      this.productosCompletados = true;
    } 
  }

  guardarInformacionPasajeros() {
    console.log("guardarInformacionPasajeros",this.cotizacion);

    this.cotizacion.divisa=this.cotizacion.idDivisaBase;
    delete this.cotizacion.idDivisaBase;
    delete this.cotizacion.idAgencia;
    delete this.cotizacion.createdAt;
    console.log("guardarInformacionPasajeros",this.cotizacion);

    this.cotizacionService.update(this.cotizacion).subscribe(
      resp => {
        console.log("guardando info pasajeros----");
    this.infoPasajerosArray.unshift(this.infoPrincipal);
    this.infoPasajerosArray.map((infoPasajero) => {
      console.log("infor pasajero", infoPasajero);

      if (infoPasajero.img) {
        console.log("entra con img");
        infoPasajero.pasaporte = `${new Date().getTime()}-${infoPasajero.idCotizacion}.${infoPasajero.img.ext}`;
        this.imagenesService.uploadPasaporte(infoPasajero.img.blob, infoPasajero.pasaporte).subscribe(res => {
          delete infoPasajero.img;
          if (infoPasajero.idCotizacionInformacionPasajero == 0) {
            this.cotizacionInformacionPasajerosService.create(infoPasajero).subscribe((res: any) => {
            }, err => console.log(err));
          } else {
            this.cotizacionInformacionPasajerosService.update(infoPasajero).subscribe((res: any) => {
            }, err => console.log(err));
          }
         
        }, err => console.log(err));
      } else {
        if (infoPasajero.idCotizacionInformacionPasajero == 0) {
          console.log("create");
          this.cotizacionInformacionPasajerosService.create(infoPasajero).subscribe((res: any) => {
          }, err => console.log(err));
        } else {
          console.log("update");
          this.cotizacionInformacionPasajerosService.update(infoPasajero).subscribe((res: any) => {
          }, err => console.log(err));
        }
       
      }
     
    });
    this.infoPasajerosArray = [];
    this.infoPrincipal = new CotizacionInformacionPasajero();
   
      }
    );
    
  }

  guardarProductosCompletados() {
    
    this.destinos.forEach((destino: any) => {
      destino.productos.forEach((producto: any) => {
        switch (producto.type) {
          case 'Traslado':
            producto.infoExtra.idTrasladoAdquirido = producto.idTrasladoAdquirido;

            if (producto.infoExtra.idTrasladoAdquiridoInfo == 0) {
              this.trasladosAdquiridosServide.completarInfo(producto.infoExtra).subscribe(res => {

              }, err => console.log(err));
            } else {
              this.trasladosAdquiridosServide.updateInfo(producto.infoExtra).subscribe(res => {
              }, err => console.log(err));
            }
           

            break;
          
            case 'Traslado Otro':
            producto.infoExtra.idTrasladoAdquirido = producto.idTrasladoOtro;
            
            if (producto.infoExtra.idTrasladoAdquiridoInfo == 0) {
              this.trasladosAdquiridosServide.completarInfo(producto.infoExtra).subscribe(res => {
              
              }, err => console.log(err));
            } else {
              this.trasladosAdquiridosServide.updateInfo(producto.infoExtra).subscribe(res => {
              }, err => console.log(err));
            }

              
            break;
          
        
          
          case 'Tour privado a pie':
            if (producto.infoExtra.idProductosAdquiridosInfo == 0) {
              this.productosAdquiridosService.completarInfo(producto.infoExtra).subscribe(res => {
              
              }, err => console.log(err));
            } else {
              this.productosAdquiridosService.updateInfo(producto.infoExtra).subscribe(res => {
              }, err => console.log(err));
            }
            break;
          
            case 'Tour privado en transporte':
              if (producto.infoExtra.idProductosAdquiridosInfo == 0) {
                this.productosAdquiridosService.completarInfo(producto.infoExtra).subscribe(res => {
                
                }, err => console.log(err));
              } else {
                this.productosAdquiridosService.updateInfo(producto.infoExtra).subscribe(res => {
                }, err => console.log(err));
              }
            break;
          
            

            case 'Tour privado en grupo':
              if (producto.infoExtra.idProductosAdquiridosInfo == 0) {
                this.productosAdquiridosService.completarInfo(producto.infoExtra).subscribe(res => {
                
                }, err => console.log(err));
              } else {
                this.productosAdquiridosService.updateInfo(producto.infoExtra).subscribe(res => {
                }, err => console.log(err));
              }
            break;
          
            

            case 'Actividad':
              if (producto.infoExtra.idProductosAdquiridosInfo == 0) {
                this.productosAdquiridosService.completarInfo(producto.infoExtra).subscribe(res => {
                
                }, err => console.log(err));
              } else {
                this.productosAdquiridosService.updateInfo(producto.infoExtra).subscribe(res => {
                }, err => console.log(err));
              }
            break;
          
            case 'Hotel':
              if (producto.infoExtra.idHotelesAdquiridosInfo == 0) {
                this.hotelesService.completarInfo(producto.infoExtra).subscribe(res => {
                
                }, err => console.log(err));
              } else {
                this.hotelesService.updateInfo(producto.infoExtra).subscribe(res => {
                }, err => console.log(err));
              }
            break;
          
          
          
            case 'Renta vehiculo':
              if (producto.infoExtra.idRentaVehiculoInfo == 0) {
                this.rentaVehiculosService.completarInfo(producto.infoExtra).subscribe(res => {
                
                }, err => console.log(err));
              } else {
                this.rentaVehiculosService.updateInfo(producto.infoExtra).subscribe(res => {
                }, err => console.log(err));
              }
            break;
            
          case 'Vuelo':

            if (producto.infoExtra.idVueloInfo == 0) {
              this.vuelosService.completarInfo(producto.infoExtra).subscribe(res => {
              }, err => console.log(err));
            } else {
              this.vuelosService.updateInfo(producto.infoExtra).subscribe(res => {
              }, err => console.log(err));
            }

            break;
          
          case 'Tren':

            if (producto.infoExtra.idTrenInfo == 0) {
              this.trenesService.completarInfo(producto.infoExtra).subscribe(res => {
              
              }, err => console.log(err));
            } else {
              this.trenesService.updateInfo(producto.infoExtra).subscribe(res => {
              }, err => console.log(err));
            }

            break;
          default:
            if (producto.infoExtra.idExtrasInfo == 0) {
              console.log("Aqui");
              this.extrasService.completarInfo(producto.infoExtra).subscribe(res => {
              
              }, err => console.log(err));
            } else {
              console.log("Allá");

              this.extrasService.updateInfo(producto.infoExtra).subscribe(res => {
              }, err => console.log(err));
            }
            break;
        }
      });
    });
    
  }

  onComplete(info: any, tipo: string) {
    switch (tipo) {
      case 'traslado':

        delete info.desde;
        delete info.hacia;
        delete info.idTraslado;
        delete info.idTrasladoCosto;
        
        this.destinos[this.indexD].productos[this.indexP].infoExtra = info;
        this.destinos[this.indexD].productos[this.indexP].infoExtra.completado = true; // se agregó de nuevo ṕo
        if (this.destinos[this.indexD].productos[this.indexP].infoExtra.idTrasladoAdquiridoInfo == 0) {
          this.destinos[this.indexD].productos[this.indexP].completado = true;
        }
        this.infoExtra = {};
        $('#modalCompletarTraslado').modal('close');
        break;
      
        case 'disposicion':
          
          this.destinos[this.indexD].productos[this.indexP].infoExtra = info;
          this.destinos[this.indexD].productos[this.indexP].infoExtra.completado = true; // se agregó de nuevo ṕo
          if (this.destinos[this.indexD].productos[this.indexP].infoExtra.idDispAdqInfo == 0) {
            this.destinos[this.indexD].productos[this.indexP].completado = true;
          }
          this.infoExtra = {};
          $('#modalCompletarDisposicion').modal('close');
        break;

        case 'producto':
          this.destinos[this.indexD].productos[this.indexP].infoExtra = info;
          this.destinos[this.indexD].productos[this.indexP].infoExtra.completado = true; // se agregó de nuevo ṕo
          if (this.destinos[this.indexD].productos[this.indexP].infoExtra.idProductosAdquiridosInfo == 0) {
            this.destinos[this.indexD].productos[this.indexP].completado = true;
          }
          this.infoExtra = {};
          $('#modalCompletarProducto').modal('close');
        break;
      
      case 'vuelo':
        this.destinos[this.indexD].productos[this.indexP].infoExtra = info;
        this.destinos[this.indexD].productos[this.indexP].infoExtra.completado = true; // se agregó de nuevo ṕo
        if (this.destinos[this.indexD].productos[this.indexP].infoExtra.idVueloInfo == 0) {
          this.destinos[this.indexD].productos[this.indexP].completado = true;
        }
        this.infoExtra = {};
        
        $('#modalCompletarVuelo').modal('close');
        break;
      case 'tren':
        this.destinos[this.indexD].productos[this.indexP].infoExtra = info;
        this.destinos[this.indexD].productos[this.indexP].infoExtra.completado = true; // se agregó de nuevo ṕo
        if (this.destinos[this.indexD].productos[this.indexP].infoExtra.idTrenInfo == 0) {
          this.destinos[this.indexD].productos[this.indexP].completado = true;
        }
        this.infoExtra = {};
        $('#modalCompletarTren').modal('close');
        break;
      
        break;
      case 'hotel':
        this.destinos[this.indexD].productos[this.indexP].infoExtra = info;
          this.destinos[this.indexD].productos[this.indexP].infoExtra.completado = true; // se agregó de nuevo ṕo
          if (this.destinos[this.indexD].productos[this.indexP].infoExtra.idHotelesAdquiridosInfo == 0) {
            this.destinos[this.indexD].productos[this.indexP].completado = true;
          }
          this.infoExtra = {};
          $('#modalCompletarHotel').modal('close');
        break;
      
        case 'rentaVehiculo':
        this.destinos[this.indexD].productos[this.indexP].infoExtra = info;
        console.log(this.destinos[this.indexD].productos[this.indexP].infoExtra);
        this.destinos[this.indexD].productos[this.indexP].infoExtra.completado = true; // se agregó de nuevo ṕo
        if (this.destinos[this.indexD].productos[this.indexP].infoExtra.idRentaVehiculoInfo == 0) {
          this.destinos[this.indexD].productos[this.indexP].completado = true;
        }
        this.infoExtra = {};
        $('#modalCompletarRentaVehiculo').modal('close');
        break;
      
        case 'extra':
          this.destinos[this.indexD].productos[this.indexP].infoExtra = info;
          this.destinos[this.indexD].productos[this.indexP].infoExtra.completado = true; // se agregó de nuevo ṕo
          if (this.destinos[this.indexD].productos[this.indexP].infoExtra.idExtrasInfo == 0) {
            this.destinos[this.indexD].productos[this.indexP].completado = true;
          }
          this.infoExtra = {};
          $('#modalCompletarExtra').modal('close');
            break;
    }
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Producto completado",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  completarProducto(tipo: string, indexD: number, indexP: number, tipoTraslado?: number, categoria?: number) {
    this.tipoDesde = 2;
    this.tipoHacia = 2;
    
    switch (tipo) {
      case 'trasladoOtro':
        if (this.destinos[indexD].productos[indexP].infoExtra) {
          this.infoExtra = this.destinos[indexD].productos[indexP].infoExtra;
          this.tipoDesde = this.infoExtra.tipoDesde;
          this.tipoHacia = this.infoExtra.tipoHacia;
        } else {
          this.infoExtra = new TrasladoInfoExtra();;

        }
        this.infoExtra.tipo = tipoTraslado;
        this.infoExtra.idTrasladoAdquirido = this.destinos[indexD].productos[indexP].idTrasladoOtro;
        this.infoExtra.idTraslado = this.destinos[indexD].productos[indexP].idTraslado;
        this.infoExtra.vehiculoDesde = this.destinos[indexD].productos[indexP].idVehiculo;
        this.infoExtra.vehiculoHacia = this.destinos[indexD].productos[indexP].idVehiculo;
        this.infoExtra.idCotizacion = this.cotizacion.idCotizacion;
        this.infoExtra.idCiudad = this.destinos[indexD].productos[indexP].idCiudad;
        this.infoExtra.fechaDesde = this.destinos[indexD].productos[indexP].fecha.split("T")[0];
        this.infoExtra.fechaHacia = this.destinos[indexD].productos[indexP].fecha.split("T")[0];
        this.infoExtra.notas = this.destinos[indexD].productos[indexP].notas;
        this.infoExtra.precioComprado = this.destinos[indexD].productos[indexP].precio;       
        this.infoExtra.costoNeto = this.destinos[indexD].productos[indexP].tarifa;


        this.openTrasladosOtrosModal();
        break;
      
      
      case 'traslado':

        if (this.destinos[indexD].productos[indexP].infoExtra) {
          this.infoExtra = this.destinos[indexD].productos[indexP].infoExtra;
          this.tipoDesde = this.infoExtra.tipoDesde;
          this.tipoHacia = this.infoExtra.tipoHacia;
        } else {
          this.infoExtra = new TrasladoInfoExtra();
        }
          
        this.infoExtra.tipo = tipoTraslado;
        this.infoExtra.idTrasladoAdquirido = this.destinos[indexD].productos[indexP].idTrasladoAdquirido;
        this.infoExtra.idTraslado = this.destinos[indexD].productos[indexP].idTraslado;
        this.infoExtra.idTrasladoCosto = this.destinos[indexD].productos[indexP].idTrasladoCosto;
        this.infoExtra.idTrasladoAdquirido = this.destinos[indexD].productos[indexP].idTrasladoAdquirido;
        this.infoExtra.idCotizacion = this.cotizacion.idCotizacion;
        this.infoExtra.idCiudad = this.destinos[indexD].productos[indexP].idCiudad;
        this.infoExtra.fechaDesde = this.destinos[indexD].productos[indexP].fecha.split("T")[0];
        this.infoExtra.fechaHacia = this.destinos[indexD].productos[indexP].fecha.split("T")[0];
        this.infoExtra.notas = this.destinos[indexD].productos[indexP].notas;
        this.infoExtra.precioComprado = this.destinos[indexD].productos[indexP].precio;
        this.infoExtra.costoNeto = this.destinos[indexD].productos[indexP].tarifa;

        console.log(this.infoExtra);
        this.openTrasladosModal();
       
        break;

      case 'disposicion':
        console.log(this.destinos[indexD].productos[indexP]);
        this.destinos[indexD].productos[indexP].infoExtra ? this.infoExtra = this.destinos[indexD].productos[indexP].infoExtra : this.infoExtra = new DisposicionInfoExtra();;
        this.infoExtra.idDisposicionAdquirida = this.destinos[indexD].productos[indexP].idDisposicionAdquirida;
        this.infoExtra.idCotizacion = this.cotizacion.idCotizacion;
        this.infoExtra.idCiudad = this.destinos[indexD].productos[indexP].idCiudad;
        this.infoExtra.fecha = this.destinos[indexD].productos[indexP].fecha.split("T")[0];
        this.infoExtra.hora = this.destinos[indexD].productos[indexP].horario;
        this.infoExtra.pickUp = this.destinos[indexD].productos[indexP].lugar;
        this.infoExtra.precioComprado = this.destinos[indexD].productos[indexP].precio;
        this.infoExtra.costoNeto = this.destinos[indexD].productos[indexP].tarifa;

        console.log(this.infoExtra);
        this.openDisposicionModal(this.destinos[indexD].productos[indexP].idDisposicionCosto);

        break;
      
      case 'producto':
        console.log(this.destinos[indexD].productos[indexP]);

        this.destinos[indexD].productos[indexP].infoExtra ? this.infoExtra = this.destinos[indexD].productos[indexP].infoExtra : this.infoExtra = new ProductoInfoExtra();;
        this.infoExtra.idProductoAdquirido = this.destinos[indexD].productos[indexP].idProductoAdquirido;
        this.infoExtra.idCotizacion = this.cotizacion.idCotizacion;
        this.infoExtra.idCiudad = this.destinos[indexD].productos[indexP].idCiudad;
        this.infoExtra.fecha = this.destinos[indexD].productos[indexP].fecha.split("T")[0];
        this.infoExtra.hora = this.destinos[indexD].productos[indexP].horario;
        this.infoExtra.categoria = categoria;
        this.infoExtra.titulo = this.destinos[indexD].productos[indexP].titulo;
        this.infoExtra.precioComprado = this.destinos[indexD].productos[indexP].precio;
        this.infoExtra.costoNeto = this.destinos[indexD].productos[indexP].tarifa;


        console.log(this.infoExtra);
        $('#modalCompletarProducto').modal({ dismissible: false });
        $('#modalCompletarProducto').modal('open');
        // this.openDisposicionModal(this.destinos[indexD].productos[indexP].idDisposicionCosto);
  
        break;
      
      case 'hotel':
        console.log(this.destinos[indexD].productos[indexP]);
        console.log(this.infoExtra);
        this.destinos[indexD].productos[indexP].infoExtra ? this.infoExtra = this.destinos[indexD].productos[indexP].infoExtra : this.infoExtra = new HotelInfoExtra();
        this.infoExtra.idHotelAdquirido = this.destinos[indexD].productos[indexP].idHotelAdquirido;
        this.infoExtra.idCotizacion = this.cotizacion.idCotizacion;
        this.infoExtra.idCiudad = this.destinos[indexD].productos[indexP].idCiudad;
        this.infoExtra.checkIn = this.destinos[indexD].productos[indexP].checkIn.split("T")[0];
        this.infoExtra.checkOut = this.destinos[indexD].productos[indexP].checkOut.split("T")[0];
        this.infoExtra.nombre = this.destinos[indexD].productos[indexP].nombre;
        this.infoExtra.precioComprado = this.destinos[indexD].productos[indexP].precio;
        this.infoExtra.costoNeto = this.destinos[indexD].productos[indexP].tarifaTotal;

        console.log(this.infoExtra);
        $('#modalCompletarHotel').modal({ dismissible: false });
        $('#modalCompletarHotel').modal('open');
        // this.openDisposicionModal(this.destinos[indexD].productos[indexP].idDisposicionCosto);

        break;
      
      case 'vuelo':
        this.destinos[indexD].productos[indexP].infoExtra ? this.infoExtra = this.destinos[indexD].productos[indexP].infoExtra : this.infoExtra = new VueloInfoExtra();;
       
        console.log(this.destinos[indexD].productos[indexP]);
        this.infoExtra.idVuelo = this.destinos[indexD].productos[indexP].idVuelo;
        this.infoExtra.idCotizacion = this.cotizacion.idCotizacion;
        this.infoExtra.precioComprado = this.destinos[indexD].productos[indexP].precio;
        this.infoExtra.fecha = this.destinos[indexD].productos[indexP].fecha.split("T")[0];
        this.infoExtra.origen = this.destinos[indexD].productos[indexP].origenN;
        this.infoExtra.destino = this.destinos[indexD].productos[indexP].destinoN;
        this.infoExtra.idOrigen = this.destinos[indexD].productos[indexP].origen;
        this.infoExtra.idDestino = this.destinos[indexD].productos[indexP].destino;
        this.infoExtra.horaLlegada = this.destinos[indexD].productos[indexP].horaLlegada;
        this.infoExtra.horaSalida = this.destinos[indexD].productos[indexP].horaSalida;
        this.infoExtra.costoNeto = this.destinos[indexD].productos[indexP].tarifa;

        console.log(this.infoExtra); 

        $('#modalCompletarVuelo').modal({ dismissible: false });
        $('#modalCompletarVuelo').modal('open');
        break;
      case 'tren':
        this.destinos[indexD].productos[indexP].infoExtra ? this.infoExtra = this.destinos[indexD].productos[indexP].infoExtra : this.infoExtra = new TrenInfoExtra();;
        
        this.infoExtra.idTren = this.destinos[indexD].productos[indexP].idTren;
        this.infoExtra.idCotizacion = this.cotizacion.idCotizacion;
        this.infoExtra.precioComprado = this.destinos[indexD].productos[indexP].precio;
        this.infoExtra.fecha = this.destinos[indexD].productos[indexP].fecha.split("T")[0];
        this.infoExtra.origen = this.destinos[indexD].productos[indexP].origenN;
        this.infoExtra.destino = this.destinos[indexD].productos[indexP].destinoN;
        this.infoExtra.idOrigen = this.destinos[indexD].productos[indexP].origen;
        this.infoExtra.idDestino = this.destinos[indexD].productos[indexP].destino;
        this.infoExtra.costoNeto = this.destinos[indexD].productos[indexP].tarifa;

        console.log(this.infoExtra);
       
        $('#modalCompletarTren').modal({ dismissible: false });
        $('#modalCompletarTren').modal('open');
        break;

      case 'rentaVehiculo':
        console.log(this.destinos[indexD].productos[indexP]);
        this.destinos[indexD].productos[indexP].infoExtra ? this.infoExtra = this.destinos[indexD].productos[indexP].infoExtra : this.infoExtra = new RentaVehiculoInfo();;
      
        this.infoExtra.idCiudad = this.destinos[indexD].productos[indexP].idCiudad;
        this.infoExtra.idCotizacion =  this.cotizacion.idCotizacion;
        this.infoExtra.idRentaVehiculo = this.destinos[indexD].productos[indexP].idRentaVehiculo;
        this.infoExtra.fechaPickUp = this.destinos[indexD].productos[indexP].fechaPickUp;
        this.infoExtra.fechaDropOff = this.destinos[indexD].productos[indexP].fechaDropOff;
        this.infoExtra.horaPickUp = this.destinos[indexD].productos[indexP].horaPickUp;
        this.infoExtra.horaDropOff = this.destinos[indexD].productos[indexP].horaDropOff;
        this.infoExtra.nombre = this.destinos[indexD].productos[indexP].nombre;
        this.infoExtra.tipoTransmision = this.destinos[indexD].productos[indexP].tipoTransmision;
        this.infoExtra.precioComprado = this.destinos[indexD].productos[indexP].precio;
        this.infoExtra.costoNeto = this.destinos[indexD].productos[indexP].tarifa;

        console.log(this.infoExtra);
        $('#modalCompletarRentaVehiculo').modal({ dismissible: false });
        $('#modalCompletarRentaVehiculo').modal('open');
        break;

      
      case 'extra':
        console.log("Entrando en extra", this.destinos[indexD].productos[indexP]);
        this.destinos[indexD].productos[indexP].infoExtra ? this.infoExtra = this.destinos[indexD].productos[indexP].infoExtra : this.infoExtra = new ExtrasInfo();;
        this.infoExtra.idCiudad = this.destinos[indexD].productos[indexP].idCiudad;
        this.infoExtra.idCotizacion = this.cotizacion.idCotizacion;
        this.infoExtra.idExtra = this.destinos[indexD].productos[indexP].idExtras;
        this.infoExtra.extras = this.destinos[indexD].productos[indexP].extras;
        this.infoExtra.notas = this.destinos[indexD].productos[indexP].notas;
        this.infoExtra.fecha = this.destinos[indexD].productos[indexP].fecha.split("T")[0];
        this.infoExtra.precioComprado = this.destinos[indexD].productos[indexP].precio;
        this.infoExtra.costoNeto = this.destinos[indexD].productos[indexP].tarifa;

        console.log(this.infoExtra);
          $('#modalCompletarExtra').modal({ dismissible: false });
          $('#modalCompletarExtra').modal('open');
          break;
     
    }
    this.indexD = indexD;
    this.indexP = indexP;
  }

  cambiarHora(hora: string) {
    this.trenInfoExtra.hora = hora;
  }

  calcularComision(com: number, comAgente: number, tarifa: number) {
    let comisionRives = (com / 100);
    let comisionAgente = comAgente / 100;
    let resMath = tarifa * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    let res = (resMath - tarifa);
    let total = (res + tarifa);
    return total;
  }

  getPais(checkIn: Date, checkOut: Date, idPais: number) {
    return new Promise<void>((resolve, reject) => {
      this.paisesService.listOne(idPais).subscribe((pais: any) => {
        if (pais[0] && pais[0].diasAltos !== '') {
          this.calcularTarifaDiasAltos(checkIn, checkOut, pais[0]);
          resolve();
        } else {
          resolve();
        }
      });
    });
  }

  calcularTarifaDiasAltos(checkIn: Date, checkOut: Date, pais: any) {
    let holidaysArray: string[] = pais.diasAltos.split(',');
    let datesInHotelArray: string[] = [];
    this.datesInHotel = '';
    while (checkIn.getTime() < checkOut.getTime()) {
      this.rangeConditionals(checkIn);
      checkIn.setDate(checkIn.getDate() + 1);
    }
    datesInHotelArray = this.datesInHotel.split(',');
    this.holidaysInHotel = 0;
    datesInHotelArray.map((date) => {
      if (holidaysArray.includes(date)) {
        this.holidaysInHotel++;
      }
    });
  }

  rangeConditionals(desde: any) {
    if ((desde.getMonth() + 1) < 10) {
      var month = '0' + (desde.getMonth() + 1);
    } else {
      month = (desde.getMonth() + 1);
    }
    if (this.datesInHotel) {
      this.datesInHotel += ',' + desde.getFullYear() + '-' + month + '-' + desde.getDate();
    } else {
      this.datesInHotel += desde.getFullYear() + '-' + month + '-' + desde.getDate();
    }
  }


  openTrasladosModal() {
    this.trasladosService.getOne(this.infoExtra.idTraslado).subscribe(
      (res: any) => {
        this.trasladosCostoService.listOne(this.infoExtra.idTrasladoCosto).subscribe(
          (resTrasladoCosto: any) => {
            this.infoExtra.vehiculoDesde = resTrasladoCosto.idVehiculo;
            this.infoExtra.vehiculoHacia = resTrasladoCosto.idVehiculo;
            this.infoExtra.desde = res.desdeOriginal.toLowerCase();
            this.infoExtra.hacia = res.haciaOriginal.toLowerCase();

            if(this.infoExtra.tipoDesde ==0)
              this.setTipoInicial(this.infoExtra.desde, 1);
              if(this.infoExtra.tipoHacia ==0)
            this.setTipoInicial(this.infoExtra.hacia, 2);
            
            this.vehiculoSeccionado = this.vehiculos.find(v => v.idVehiculo == this.infoExtra.vehiculoDesde);
            $('#modalCompletarTraslado').modal({ dismissible: false });
            $('#modalCompletarTraslado').modal('open');
          } 
        );
      }
    );
  }


  openDisposicionModal(idDisposicionCosto: number) {
    
    this.disposicionesCostoService.listOne(idDisposicionCosto).subscribe(
      (resp: any) => {
        console.log(resp);
        this.vehiculoSeccionado = this.vehiculos.find(v => v.idVehiculo == resp.idVehiculo);
        console.log(this.vehiculoSeccionado);
        $('#modalCompletarDisposicion').modal({ dismissible: false });
        $('#modalCompletarDisposicion').modal('open');
      }
    );
  }

  openTrasladosOtrosModal() {
    this.trasladosService.getOne(this.infoExtra.idTraslado).subscribe(
      (res: any) => {
        this.infoExtra.desde = res.desdeOriginal.toLowerCase();
        this.infoExtra.hacia = res.haciaOriginal.toLowerCase();

        if(this.infoExtra.tipoDesde ==0)
          this.setTipoInicial(this.infoExtra.desde, 1);
        if(this.infoExtra.tipoHacia ==0)
          this.setTipoInicial(this.infoExtra.hacia, 2);

        console.log(this.infoExtra);
        
        console.log(this.infoExtra);
        this.vehiculoSeccionado = this.vehiculos.find(v => v.idVehiculo == this.infoExtra.vehiculoDesde);
        $("#modalCompletarTraslado").modal("open");
          
      }
    );
  }


  setTipoInicial(lugar, tipo) {
    if (lugar.includes("centro")) {
        if (tipo == 1) {
          this.infoExtra.tipoDesde = 2;
        } else {
          this.infoExtra.tipoHacia = 2;
       } 
        return true;
      } else {
        if (lugar.includes("aeropuerto")) {
          if (tipo == 1) {
            this.infoExtra.tipoDesde = 1;
            this.tipoDesde = 1;
          } else {
            this.infoExtra.tipoHacia = 1;
            this.tipoHacia = 1;
         } 
        } else if (lugar.includes("hotel")) {
  
          if (tipo == 1) {
            this.infoExtra.tipoDesde = 2 
             this.tipoDesde = 2;
          } else {
            this.infoExtra.tipoHacia = 2;
            this.tipoHacia = 2;
         } 
        } else if (lugar.includes("tren")) {
  
          if (tipo == 1) {
            this.infoExtra.tipoDesde = 4;
            this.tipoDesde = 4;
          } else {
            this.infoExtra.tipoHacia = 4;
            this.tipoHacia = 4;
          } 
        } else if (lugar.includes("específica")) {
  
          if (tipo == 1) {
            this.infoExtra.tipoDesde = 3;
            this.tipoDesde = 3;
          } else {
            this.infoExtra.tipoHacia = 3;
            this.tipoHacia = 3;
          }
        } else if (lugar.includes("muelle")) {
          if (tipo == 1){
            this.infoExtra.tipoDesde = 5;
            this.tipoDesde = 5;
          } else {
            this.infoExtra.tipoHacia = 5;
            this.tipoHacia =5;
         }
           
        }
        return false;
      }
  }

  contein(lugar, tipo) {
    if (lugar != undefined) {
      if (lugar.includes("centro")) {
      //   if (tipo == 1) {
      //     this.infoExtra.tipoDesde = 2;
      //   } else {
      //     this.infoExtra.tipoHacia = 2;
      //  } 
        return true;
      } else {
        // if (lugar.includes("aeropuerto")) {
        //   if (tipo == 1) {
        //     this.infoExtra.tipoDesde = 1;
        //     this.tipoDesde = 1;
        //   } else {
        //     this.infoExtra.tipoHacia = 1;
        //     this.tipoHacia = 1;
        //  } 
        // } else if (lugar.includes("hotel")) {
  
        //   if (tipo == 1) {
        //     this.infoExtra.tipoDesde = 2 
        //      this.tipoDesde = 2;
        //   } else {
        //     this.infoExtra.tipoHacia = 2;
        //     this.tipoHacia = 2;
        //  } 
        // } else if (lugar.includes("tren")) {
  
        //   if (tipo == 1) {
        //     this.infoExtra.tipoDesde = 4;
        //     this.tipoDesde = 4;
        //   } else {
        //     this.infoExtra.tipoHacia = 4;
        //     this.tipoHacia = 4;
        //   } 
        // } else if (lugar.includes("específica")) {
  
        //   if (tipo == 1) {
        //     this.infoExtra.tipoDesde = 3;
        //     this.tipoDesde = 3;
        //   } else {
        //     this.infoExtra.tipoHacia = 3;
        //     this.tipoHacia = 3;
        //   }
        // } else if (lugar.includes("muelle")) {
        //   if (tipo == 1){
        //     this.infoExtra.tipoDesde = 5;
        //     this.tipoDesde = 5;
        //   } else {
        //     this.infoExtra.tipoHacia = 5;
        //     this.tipoHacia =5;
        //  }
           
        // }
        return false;
      }
    }
  }
    
  ngDoCheck(): void {
    M.updateTextFields();
  }
  

  setFechaDesde(date) {
    if (date != undefined) {
      this.infoExtra.fechaDesde = date;
      
    }
  }
 

  setFechaHacia(date) {
    if (date != undefined) {
      this.infoExtra.fechaHacia = date;
    }
  }

  setHorarioDesde(hora) {

    if (hora != undefined) {

      this.infoExtra.horarioDesde = hora;
    }
  }

  setHorarioHacia(hora) {

    if (hora != undefined) {
      this.infoExtra.horarioHacia = hora;
    }
  }

  setHora(hora) {
    if (hora != undefined) {
      this.infoExtra.hora = hora;
    }
  }

  setHoraLlegada(hora) {
    if (hora != undefined) {
      this.infoExtra.horaLlegada = hora;
    }
  }

  setHoraSalida(hora) {
    if (hora != undefined) {
      this.infoExtra.horaSalida = hora;
    }
  }

  setFecha(date) {
    if (date != undefined) {
      this.infoExtra.fecha = date;
    }
  }




  setFechaPickUp(date) {
    console.log("date pick up", date);
    if (date != undefined) {
      this.infoExtra.fechaPickUp = date;
    }
  } 

  saveInfoExtraTraslados(indexD: number, indexP: number, tipo: number) 
  {
    console.log(this.destinos[indexD].productos[indexP].infoExtra);
    
      this.trasladosAdquiridosServide.completarInfo(this.destinos[indexD].productos[indexP].infoExtra).subscribe(
        (res: any) => {
          this.destinos[indexD].productos[indexP].completado = false;
          this.destinos[indexD].productos[indexP].infoExtra.idTrasladoAdquiridoInfo = res.insertId;
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Información enviada con éxito.",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      );
  }


  saveInfoExtraDisposicion(indexD: number, indexP: number, tipo: number) {
    console.log(this.destinos[indexD].productos[indexP].infoExtra);
      this.disposicionesAdquiridasService.completarInfo(this.destinos[indexD].productos[indexP].infoExtra).subscribe(
        (res: any) => {
          this.destinos[indexD].productos[indexP].completado = false;
          this.destinos[indexD].productos[indexP].infoExtra.idDispAdqInfo = res.insertId;
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Información enviada con éxito.",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      );
  }

  saveInfoProducto(indexD: number, indexP: number) {
    delete this.destinos[indexD].productos[indexP].infoExtra.titulo;
    console.log(this.destinos[indexD].productos[indexP].infoExtra);
      this.productosAdquiridosService.completarInfo(this.destinos[indexD].productos[indexP].infoExtra).subscribe(
        (res: any) => {
          this.destinos[indexD].productos[indexP].completado = false;
          this.destinos[indexD].productos[indexP].infoExtra.idProductosAdquiridosInfo = res.insertId;
          console.log(this.destinos[indexD].productos[indexP].infoExtra.idProductosAdquiridosInfo );

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Información enviada con éxito.",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      ); 
  }


  saveInfoRenta(indexD: number, indexP: number) {
      this.rentaVehiculosService.completarInfo(this.destinos[indexD].productos[indexP].infoExtra).subscribe(
        (res: any) => {
          this.destinos[indexD].productos[indexP].completado = false;
          this.destinos[indexD].productos[indexP].infoExtra.idProductosAdquiridosInfo = res.insertId;
          console.log(this.destinos[indexD].productos[indexP].infoExtra.idProductosAdquiridosInfo );

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Información enviada con éxito.",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      ); 
  }


  saveInfoHotel(indexD: number, indexP: number) {
    delete this.destinos[indexD].productos[indexP].infoExtra.nombre;
    console.log(this.destinos[indexD].productos[indexP].infoExtra);
      this.hotelesService.completarInfo(this.destinos[indexD].productos[indexP].infoExtra).subscribe(
        (res: any) => {
          this.destinos[indexD].productos[indexP].completado = false;
          this.destinos[indexD].productos[indexP].infoExtra.idHotelesAdquiridosInfo = res.insertId;
          console.log(this.destinos[indexD].productos[indexP].infoExtra.idHotelesAdquiridosInfo );

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Información enviada con éxito.",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      ); 
  }

  saveInfoExtra(indexD: number, indexP: number) {
    
    console.log(this.destinos[indexD].productos[indexP].infoExtra);
      this.extrasService.completarInfo(this.destinos[indexD].productos[indexP].infoExtra).subscribe(
        (res: any) => {
          this.destinos[indexD].productos[indexP].completado = false;
          this.destinos[indexD].productos[indexP].infoExtra.idHotelesAdquiridosInfo = res.insertId;
          console.log(this.destinos[indexD].productos[indexP].infoExtra.idHotelesAdquiridosInfo );

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Información enviada con éxito.",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      ); 
  }

  saveInfoTrenes(indexD: number, indexP: number) {

    delete this.destinos[indexD].productos[indexP].infoExtra.origen;
    delete this.destinos[indexD].productos[indexP].infoExtra.destino;

    console.log(this.destinos[indexD].productos[indexP].infoExtra);
      this.trenesService.completarInfo(this.destinos[indexD].productos[indexP].infoExtra).subscribe(
        (res: any) => {
          this.destinos[indexD].productos[indexP].completado = false;
          this.destinos[indexD].productos[indexP].infoExtra.idTrenInfo = res.insertId;
          console.log(this.destinos[indexD].productos[indexP].infoExtra.idTrenInfo );
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Información enviada con éxito.",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      ); 
  }


  saveInfoVuelos(indexD: number, indexP: number) {

    delete this.destinos[indexD].productos[indexP].infoExtra.origen;
    delete this.destinos[indexD].productos[indexP].infoExtra.destino;

    console.log(this.destinos[indexD].productos[indexP].infoExtra);
      this.vuelosService.completarInfo(this.destinos[indexD].productos[indexP].infoExtra).subscribe(
        (res: any) => {
          this.destinos[indexD].productos[indexP].completado = false;
          this.destinos[indexD].productos[indexP].infoExtra.idVueloInfo = res.insertId;
          console.log(this.destinos[indexD].productos[indexP].infoExtra.idVueloInfo );
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Información enviada con éxito.",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      ); 
  }

  updateInfoExtraHotel(indexD: number, indexP: number) {
    delete this.destinos[indexD].productos[indexP].infoExtra.nombre;
    this.hotelesService.updateInfo(this.destinos[indexD].productos[indexP].infoExtra).subscribe(
      (res: any) => {
        this.destinos[indexD].productos[indexP].completado = false;
             Swal.fire({
          position: "center",
          icon: "success",
          title: "Información enviada con éxito.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    );
  }

  updateInfoTrenes(indexD: number, indexP: number) {
    delete this.destinos[indexD].productos[indexP].infoExtra.origen;
    delete this.destinos[indexD].productos[indexP].infoExtra.destino;

    this.trenesService.updateInfo(this.destinos[indexD].productos[indexP].infoExtra).subscribe(
      (res: any) => {
        this.destinos[indexD].productos[indexP].completado = false;
             Swal.fire({
          position: "center",
          icon: "success",
          title: "Información enviada con éxito.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    );
  }


  updateInfoVuelos(indexD: number, indexP: number) {
    delete this.destinos[indexD].productos[indexP].infoExtra.origen;
    delete this.destinos[indexD].productos[indexP].infoExtra.destino;

    this.vuelosService.updateInfo(this.destinos[indexD].productos[indexP].infoExtra).subscribe(
      (res: any) => {
        this.destinos[indexD].productos[indexP].completado = false;
             Swal.fire({
          position: "center",
          icon: "success",
          title: "Información enviada con éxito.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    );
  }



  updateInfoExtra(indexD: number, indexP: number) {
    delete this.destinos[indexD].productos[indexP].infoExtra.nombre;
    this.extrasService.updateInfo(this.destinos[indexD].productos[indexP].infoExtra).subscribe(
      (res: any) => {
        this.destinos[indexD].productos[indexP].completado = false;
             Swal.fire({
          position: "center",
          icon: "success",
          title: "Información enviada con éxito.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    );
  }
  
  updateInfoExtraTraslados(indexD: number, indexP: number, tipo: number) {

      this.trasladosAdquiridosServide.updateInfo(this.destinos[indexD].productos[indexP].infoExtra).subscribe(
        (res: any) => {
          this.destinos[indexD].productos[indexP].completado = false;
               Swal.fire({
            position: "center",
            icon: "success",
            title: "Información enviada con éxito.",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      );
  }


  updateInfoExtraDisposiciones(indexD: number, indexP: number, tipo: number) {
    this.disposicionesAdquiridasService.updateInfo(this.destinos[indexD].productos[indexP].infoExtra).subscribe(
      (res: any) => {
        this.destinos[indexD].productos[indexP].completado = false;
             Swal.fire({
          position: "center",
          icon: "success",
          title: "Información enviada con éxito.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    );
  }


  updateInfoExtraProducto(indexD: number, indexP: number) {
    delete this.destinos[indexD].productos[indexP].infoExtra.titulo;
    this.productosAdquiridosService.updateInfo(this.destinos[indexD].productos[indexP].infoExtra).subscribe(
      (res: any) => {
        this.destinos[indexD].productos[indexP].completado = false;
             Swal.fire({
          position: "center",
          icon: "success",
          title: "Información enviada con éxito.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    );
  }
  

  updateInfoExtraRenta(indexD: number, indexP: number) {
    this.rentaVehiculosService.updateInfo(this.destinos[indexD].productos[indexP].infoExtra).subscribe(
      (res: any) => {
        this.destinos[indexD].productos[indexP].completado = false;
             Swal.fire({
          position: "center",
          icon: "success",
          title: "Información enviada con éxito.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    );
  }
  

  setTipo(desde, tipo) {
    
    console.log("entra a setTipo");
    if (desde) {
      console.log("entra desde");
      this.infoExtra.tipoDesde = tipo;
      this.tipoDesde = tipo;
      this._changeDetectorRef.detectChanges()   

    } else {
      console.log("entra hacia");
      this.infoExtra.tipoHacia = tipo;
      this.tipoHacia = tipo;
      this._changeDetectorRef.detectChanges()   

    }
    console.log(tipo, this.infoExtra, this.tipoHacia);

  

  }

}
