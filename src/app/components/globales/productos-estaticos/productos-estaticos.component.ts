import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario';
import { CanastaService } from 'src/app/services/canasta.service';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CotizacionProductosComponent } from '../../cotizacion-productos/cotizacion-productos.component';
import Sweet from 'sweetalert2';
import { TarifasService } from 'src/app/services/tarifas.service';
import { DestinosService } from 'src/app/services/destinos.service';
import { Subscription } from 'rxjs';
import { SendDataToEditService } from 'src/app/services/sendDataToEdit.service';
import { PaisesService } from 'src/app/services/paises.service';
declare var $: any;

@Component({
  selector: 'app-productos-estaticos',
  templateUrl: './productos-estaticos.component.html',
  styleUrls: ['./productos-estaticos.component.css']
})
export class ProductosEstaticosComponent implements OnInit, OnDestroy {
  @Output() typeToSend = new EventEmitter<number>();

  private suscripciones: Subscription[] = [];
  public usuario: Usuario = new Usuario();
  public extras: any[] = [];
  public hoteles: any[] = [];
  public vuelos: any[] = [];
  public trenes: any[] = [];
  public traslados: any[] = [];
  public disposiciones: any[] = [];
  public toursPie: any[] = [];
  public toursTransporte: any[] = [];
  public toursGrupo: any[] = [];
  public actividades: any[] = [];
  public total: number = 0;
  public cotizacion: any = {};
  public idCotizacion: any;
  public idsToDelete7: any = [];
  public canDelete: boolean = true;
  public canEdit: boolean = true;
  public versionCotizacion: number = 0;
  public tarifaSN: number = 0;
  public tarifaHN: number = 0;
  public tarifaSC: number = 0;
  public tarifaHC: number = 0;
  public destino: any = {};
  public destinos: any = [];
  public datesInHotel: string = '';
  public holidaysInHotel: number = 0;

  constructor(
    private canastaService: CanastaService,
    private cotizacionProductos: CotizacionProductosComponent,
    private ciudadesService: CiudadesService,
    private router: Router,
    private route: ActivatedRoute,
    private usuariosService: UsuariosService,
    private tarifasService: TarifasService,
    public destinosService: DestinosService,
    private sendDataToEdit: SendDataToEditService,
    private paisesService: PaisesService
  ) { }

  ngOnInit(): void {
    this.getUsuario();
    this.getActualDestino();
    this.getNuevoDestino();
  }

  ngOnDestroy(): void {
    this.suscripciones.forEach(s => s.unsubscribe());
    this.tarifasService.setTarifa({}, 'cotizacion');
    this.tarifasService.setTarifa(0, 'tarifaSNeta');
    this.tarifasService.setTarifa(0, 'tarifaHNeta');
    this.tarifasService.setTarifa(0, 'tarifaSComision');
    this.tarifasService.setTarifa(0, 'tarifaHComision');
  }

  getUsuario() {
    let s: any = this.usuariosService.getUser().subscribe(user => {
      if(Object.keys(user).length === 0) return false;
      this.usuario = user
      this.actualRoute();
    });
    this.suscripciones.push(s);
  }

  getActualDestino() {
    let sAD: any = this.destinosService.getActualDestino().subscribe(destino => {
      if(Object.keys(destino).length === 0) return false;
      this.destino = destino;
    });
    this.suscripciones.push(sAD);
  }

  getNuevoDestino() {
    let sND: any = this.destinosService.getNuevoDestino().subscribe(destino => {
      if(Object.keys(destino).length === 0) return false;
      destino.productos = [];
      this.destinos.push(destino);
    });
    this.suscripciones.push(sND);
  }

  actualRoute() {
    let route = this.router.url.split('/');
    if(!route) return false;
    switch(route[2]){
      case 'versionado':
        this.canDelete = false;
        this.canEdit = false;
        this.listOneCotizacionByUserByVersion();
      break;
      case 'cotizacionProductos':
        this.obtenerProducto();
        this.getProductsByCotizacion();
        this.canDelete = true;
        this.canEdit = true;
      break;
    }
  }

  obtenerProducto() {
    let s: any = this.canastaService.getProduct().subscribe(async (product: any) => {
      if(Object.keys(product).length === 0) return false;
      let newProduct: any = Object.assign({}, product);
      this.destinos.forEach(async (destino) => {
        if(destino.idCiudad !== newProduct.idCiudad) return false;
        destino.productos.push(newProduct);
        switch(newProduct.tipoNombre){
          case 'traslado':
          case 'trasladoOtro':
          case 'disposicion':
          case 'vuelo':
          case 'tren':
          case 'extra':
            newProduct.precio = this.calcularComision(newProduct.comision, newProduct.comisionAgente, newProduct.tarifa);
            if(newProduct.opcional === 0){
              this.enviarComisionServicios(newProduct.tarifa, newProduct.comisionAgente, newProduct.comision);
            }
          break;
          case 'tourPie':
          case 'tourTransporte':
          case 'tourGrupo':
          case 'actividad':
            this.idsToDelete7.push(newProduct.idProductoAdquirido);
            newProduct.precio = this.calcularComision(newProduct.comision, newProduct.comisionAgente, newProduct.tarifa);
            if(newProduct.opcional === 0){
              this.enviarComisionServicios(newProduct.tarifa, newProduct.comisionAgente, newProduct.comision);
            }
          break;
          case 'hotel':
            let tarifaBase: number = +newProduct.cityTax + +newProduct.desayuno * newProduct.daysInHotel;
            let tarifaAlta: number = +newProduct.cityTax + +newProduct.desayuno * newProduct.holidaysInHotel * 1.20;
            let tarifaTotal: number = +newProduct.tarifaTotal + tarifaBase + tarifaAlta;
            newProduct.precio = this.calcularComision(newProduct.comision, newProduct.comisionAgente, tarifaTotal);
            newProduct.precio += newProduct.otros;
            if(newProduct.opcional === 0){
              this.enviarComisionHoteles(tarifaTotal, newProduct.comisionAgente, newProduct.comision, newProduct.otros);
            }
            this.holidaysInHotel = 0;
          break;
          case 'rentaVehiculo':
            newProduct.precio = this.calcularComision(newProduct.comision, newProduct.comisionAgente, newProduct.tarifa * newProduct.diasRentado);
            if(newProduct.opcional === 0){
              this.enviarComisionServicios(newProduct.tarifa * newProduct.diasRentado, newProduct.comisionAgente, newProduct.comision);
            }
          break;
        }
        this.canastaService.addIdsToDelete(this.idsToDelete7);
        await destino.productos.sort(function(a: any, b: any) {
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        });
      });

    });
    this.suscripciones.push(s);
  }

  listOneCotizacionByUserByVersion(){
    this.route.params.subscribe((params) => {
      this.idCotizacion = params["idCotizacion"];
      this.versionCotizacion = params["versionCotizacion"];
      this.canastaService.listOneCotizacionByUserByVersion(this.usuario.idUsuario, this.idCotizacion, this.versionCotizacion).subscribe((res: any) => {
        this.productCases(res);
      }, err => { console.log(err) });
    });
  }

  getProductsByCotizacion() {
    this.idCotizacion = parseInt(localStorage.getItem('idCotizacion'));
    if(this.idCotizacion !== undefined && !isNaN(this.idCotizacion)){
      this.canastaService.listOneCotizacionByUser(this.usuario.idUsuario, this.idCotizacion).subscribe((res: any) => {
        this.productCases(res);
      }, err => { console.log(err) });
    }
  }

  productCases(res: any){
    this.destinos = res.destinos;
    this.cotizacion = res.cotizacion;
    this.sendData(res.cotizacion, 'cotizacion');
    this.sendDataToEdit.sendProductToEdit(res.cotizacion, 'cotizacion');
    this.destinos.forEach(async(destino: any) => {
      await res.canasta.forEach(async(product: any) => {
        switch(product.tipo){
          case 1:
            if(product.traslado.idCiudad !== destino.idCiudad) return false;
            product.traslado.precio = this.calcularComision(product.traslado.comision, product.traslado.comisionAgente, product.traslado.tarifa);
            destino.productos.push(product.traslado);
            if(product.traslado.opcional === 0){
              this.enviarComisionServicios(product.traslado.tarifa, product.traslado.comisionAgente, product.traslado.comision);
            }
            break;
          case 2:
            if(product.disposicion.idCiudad !== destino.idCiudad) return false;
            product.disposicion.precio = this.calcularComision(product.disposicion.comision, product.disposicion.comisionAgente, product.disposicion.tarifa);
            destino.productos.push(product.disposicion);
            if(product.disposicion.opcional === 0){
              this.enviarComisionServicios(product.disposicion.tarifa, product.disposicion.comisionAgente, product.disposicion.comision);
            }
            break;
          case 3:
            console.log("Entra en 3 en globales");
            if(product.trasladoOtro.idCiudad !== destino.idCiudad) return false;
            product.trasladoOtro.precio = this.calcularComision(product.trasladoOtro.comision, product.trasladoOtro.comisionAgente, product.trasladoOtro.tarifa);
            destino.productos.push(product.trasladoOtro);
            if(product.trasladoOtro.opcional === 0){
              this.enviarComisionServicios(product.trasladoOtro.tarifa, product.trasladoOtro.comisionAgente, product.trasladoOtro.comision);
            }
            break;
          case 4:
            if(product.hotel.idDestino !== destino.idDestino) return false;
            product.hotel.daysInHotel = Math.floor((new Date(product.hotel.checkOut).getTime() - new Date(product.hotel.checkIn).getTime()) / 1000 / 60 / 60 / 24);
            await this.getPais(new Date(product.hotel.checkIn), new Date(product.hotel.checkOut), destino.idPais);
            product.hotel.holidaysInHotel = this.holidaysInHotel;
            product.hotel.daysInHotel = (product.hotel.daysInHotel - this.holidaysInHotel);
            let tarifaBase: number = (+product.hotel.cityTax + +product.hotel.desayuno + +product.hotel.tarifaTotal) * product.hotel.daysInHotel;
            let tarifaAlta: number = (+product.hotel.cityTax + +product.hotel.desayuno + +product.hotel.tarifaTotal) * this.holidaysInHotel * 1.20;
            let tarifaTotal: number = (tarifaBase + tarifaAlta);
            product.hotel.precio = this.calcularComision(product.hotel.comision, product.hotel.comisionAgente, tarifaTotal);
            product.hotel.precio += product.hotel.otros;
            destino.productos.push(product.hotel);
            if(product.hotel.opcional === 0){
              this.enviarComisionHoteles(tarifaTotal, product.hotel.comisionAgente, product.hotel.comision, product.hotel.otros);
            }
            this.holidaysInHotel = 0;
            break;
          case 5:
            if(product.vuelo.idDestino !== destino.idDestino) return false;
            product.vuelo.precio = this.calcularComision(product.vuelo.comision, product.vuelo.comisionAgente, product.vuelo.tarifa);
            destino.productos.push(product.vuelo);
            if(product.vuelo.opcional === 0){
              this.enviarComisionServicios(product.vuelo.tarifa, product.vuelo.comisionAgente, product.vuelo.comision);
            }
            break;
          case 6:
            if(product.tren.idDestino !== destino.idDestino) return false;
            product.tren.precio = this.calcularComision(product.tren.comision, product.tren.comisionAgente, product.tren.tarifa);
            destino.productos.push(product.tren);
            if(product.tren.opcional === 0){
              this.enviarComisionServicios(product.tren.tarifa, product.tren.comisionAgente, product.tren.comision);
            }
            break;
          case 7:
            if(product.tourPie){
              if(product.tourPie.idCiudad !== destino.idCiudad) return false;
              product.tourPie.precio = this.calcularComision(product.tourPie.comision, product.tourPie.comisionAgente, product.tourPie.tarifa);
              destino.productos.push(product.tourPie);
              this.idsToDelete7.push(product.tourPie.idProductoAdquirido);
              if(product.tourPie.opcional === 0){
                this.enviarComisionServicios(product.tourPie.tarifa, product.tourPie.comisionAgente, product.tourPie.comision);
              }
            }else if(product.tourTransporte){
              if(product.tourTransporte.idCiudad !== destino.idCiudad) return false;
              product.tourTransporte.precio = this.calcularComision(product.tourTransporte.comision, product.tourTransporte.comisionAgente, product.tourTransporte.tarifa);
              destino.productos.push(product.tourTransporte);
              this.idsToDelete7.push(product.tourTransporte.idProductoAdquirido);
              if(product.tourTransporte.opcional === 0){
                this.enviarComisionServicios(product.tourTransporte.tarifa, product.tourTransporte.comisionAgente, product.tourTransporte.comision);
              }
            }else if(product.tourGrupo){
              if(product.tourGrupo.idCiudad !== destino.idCiudad) return false;
              product.tourGrupo.precio = this.calcularComision(product.tourGrupo.comision, product.tourGrupo.comisionAgente, product.tourGrupo.tarifa);
              destino.productos.push(product.tourGrupo);
              this.idsToDelete7.push(product.tourGrupo.idProductoAdquirido);
              if(product.tourGrupo.opcional === 0){
                this.enviarComisionServicios(product.tourGrupo.tarifa, product.tourGrupo.comisionAgente, product.tourGrupo.comision);
              }
            }else if(product.actividad){
              if(product.actividad.idCiudad !== destino.idCiudad) return false;
              product.actividad.precio = this.calcularComision(product.actividad.comision, product.actividad.comisionAgente, product.actividad.tarifa);
              destino.productos.push(product.actividad);
              this.idsToDelete7.push(product.actividad.idProductoAdquirido);
              if(product.actividad.opcional === 0){
                this.enviarComisionServicios(product.actividad.tarifa, product.actividad.comisionAgente, product.actividad.comision);
              }
            }
            break;
          case 8:
            if(product.extra.idDestino !== destino.idDestino) return false;
            product.extra.precio = this.calcularComision(product.extra.comision, product.extra.comisionAgente, product.extra.tarifa);
            destino.productos.push(product.extra);
            if(product.extra.opcional === 0){
              this.enviarComisionServicios(product.extra.tarifa, product.extra.comisionAgente, product.extra.comision);
            }
            break;
          case 12:
            if(product.rentaVehiculo.idDestino !== destino.idDestino) return false;
            product.rentaVehiculo.precio = this.calcularComision(product.rentaVehiculo.comision, product.rentaVehiculo.comisionAgente, product.rentaVehiculo.tarifa * product.rentaVehiculo.diasRentado);
            destino.productos.push(product.rentaVehiculo);
            if(product.rentaVehiculo.opcional === 0){
              this.enviarComisionServicios(product.rentaVehiculo.tarifa * product.rentaVehiculo.diasRentado, product.rentaVehiculo.comisionAgente, product.rentaVehiculo.comision);
            }
            break;
        }
        this.canastaService.addIdsToDelete(this.idsToDelete7);
      });
      await destino.productos.sort(function(a: any, b: any) {
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      });
    });
  }

  calcularComision(com: number, comAgente: number, tarifa: number){
    let comisionRives = (com / 100);
    let comisionAgente = comAgente / 100;
    const total = tarifa * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    return total;
  }

  enviarComisionHoteles(tarifa: number, comisionAgente: number, comision5Rives: number, otros: number = 0){
    this.tarifaHN += tarifa;
    this.sendData(this.tarifaHN, 'tarifaHNeta');
    this.calcularComisionHoteles(comision5Rives, comisionAgente, tarifa, otros);
  }

  calcularComisionHoteles(com: number, comAgente: number, tarifa: number, otros: number){
    let comisionRives = (com / 100);
    let comisionAgente = (comAgente / 100);
    let resMath = tarifa * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    let res = (resMath - tarifa);
    this.tarifaHC += (res + tarifa);
    this.tarifaHC += otros;
    this.sendData(this.tarifaHC, 'tarifaHComision');
  }

  enviarComisionServicios(tarifa: number, comisionAgente: number, comision5Rives: number){
    this.tarifaSN += tarifa;
    this.sendData(this.tarifaSN, 'tarifaSNeta');
    this.calcularComisionServicios(comision5Rives, comisionAgente, tarifa);
  }

  calcularComisionServicios(com: number, comAgente: number, tarifa: number){
    let comisionRives = (com / 100);
    let comisionAgente = (comAgente / 100);
    let resMath = tarifa * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    let res = (resMath - tarifa);
    this.tarifaSC += (res + tarifa);
    this.sendData(this.tarifaSC, 'tarifaSComision');
  }

  sendData(data: any, type: string){
    switch(type){
      case 'cotizacion':
        this.tarifasService.setTarifa(data, 'cotizacion');
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

  deleteProduct(product: any, idCotizacion: number, type: string, indexD: number, indexP: number){
    switch(type){
      case 'tourPie':
      case 'tourTransporte':
      case 'tourGrupo':
      case 'actividad':
        this.remove(product, product.idProductoAdquirido, idCotizacion, type, indexD, indexP);
        break;
      case 'traslado':
        this.remove(product, product.idTrasladoAdquirido, idCotizacion, type, indexD, indexP);
        break;
      case 'trasladoOtro':
        this.remove(product, product.idTrasladoOtro, idCotizacion, type, indexD, indexP);
        break;
      case 'disposicion':
        this.remove(product, product.idDisposicionAdquirida, idCotizacion, type, indexD, indexP);
        break;
      case 'hotel':
        this.remove(product, product.idHotelAdquirido, idCotizacion, type, indexD, indexP);
        break;
      case 'vuelo':
        this.remove(product, product.idVuelo, idCotizacion, type, indexD, indexP);
        break;
      case 'tren':
        this.remove(product, product.idTren, idCotizacion, type, indexD, indexP);
        break;
      case 'extra':
        this.remove(product, product.idExtras, idCotizacion, type, indexD, indexP);
        break;
      case 'rentaVehiculo':
        this.remove(product, product.idRentaVehiculo, idCotizacion, type, indexD, indexP);
        break;
    }
  }

  remove(product, idProduct: number, idCotizacion: number, type: string, indexD: number, indexP: number){
    Sweet.fire({
      title: '¿Está seguro de eliminar el producto?',
      showCancelButton: true,
      confirmButtonText: `Eliminar`,
      confirmButtonColor: '#b71c1c'
    }).then((result) => {
      if (result.isConfirmed) {
        this.canastaService.deleteProduct(idProduct, idCotizacion, type).subscribe(res => {
          switch(type){
            case 'hotel':
              if(product.opcional === 0){
                let tarifaBase: number = (product.cityTax + product.desayuno) * product.daysInHotel;
                let tarifaAlta: number = (product.cityTax + product.desayuno) * product.holidaysInHotel * 1.20;
                let tarifaTotal: number = (product.tarifaTotal + tarifaBase + tarifaAlta);
                this.restarCantidadHoteles(product.comision, product.comisionAgente, tarifaTotal, product.otros);
              }
            break;
            case 'rentaVehiculo':
              if(product.opcional === 0){
                this.restarCantidadServicios(product.comision, product.comisionAgente, (product.tarifa * product.diasRentado));
              }
            break;
            default:
              if(product.opcional === 0){
                this.restarCantidadServicios(product.comision, product.comisionAgente, product.tarifa);
              }
            break;
          }
          this.destinos[indexD].productos.splice(indexP, 1);
          Sweet.fire({
            position: 'center',
            icon: 'success',
            title: `¡Producto eliminado correctamente!`,
            showConfirmButton: false,
            timer: 2000
          });
        }, err => { console.log(err) });
      }
    });
  }

  addProducts(){
    this.cotizacionProductos.closeModal();
  }

  getCiudad(id: number, type: string, i: number){
    this.ciudadesService.list_one(id).subscribe((res: any) => {
      let index = (i - 1);
      switch(type){
        case 'traslado':
          this.traslados[index].ciudad = res.nombre;
          break;
        case 'disposicion':
          this.disposiciones[index].ciudad = res.nombre;
          break;
      }
    }, err => { console.log(err) });
  }

  //TODO Manejar la lógica para días altos en un helper y solo llamarlo en el lugar que se necesite.
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
    //VALIDAR QUE EL MES SEA SIEMPRE DE 2 DÍGITOS
    let month: string = (desde.getMonth() + 1) < 10 ? '0' + (desde.getMonth() + 1) : desde.getMonth() + 1;

    //VALIDAR QUE EL DIA SEA SIEMPRE DE 2 DÍGITOS
    let day: string = desde.getDate() < 10 ? '0' + desde.getDate() : desde.getDate();

    //AGREGAR LA FECHA A UNA CADENA
    this.datesInHotel += this.datesInHotel ? ',' + desde.getFullYear() + '-' + month + '-' + day : desde.getFullYear() + '-' + month + '-' + day;
  }

  editProduct(typeToSend, product) {
    this.typeToSend.emit(typeToSend);
    switch(typeToSend){
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
    $('#modalEditCarrito').modal({ dismissible: false });
    $("#modalEditCarrito").modal("open");
  }
}
