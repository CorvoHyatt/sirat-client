import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaisesService } from 'src/app/services/paises.service';
import { ProductosExtrasConciergeService } from 'src/app/services/productosExtrasConcierge.service';
import { ProductosVentaService } from './productosVenta.service';
import { ReembolsosService } from './reembolsos.service';

@Injectable()
export class HelperService {

  private obtenerValores: BehaviorSubject<any> = new BehaviorSubject<any>({});

  public destinos: any[] = [];
  public productos: any[] = [];
  public productosReembolsados: any[] = [];
  public canasta: any[] = [];
  //Variables ventas
  public totalNetoCotizado: number = 0;
  public totalMontoComprado: number = 0;
  public comision5Venta: number = 0;
  public comisionAVenta: number = 0;
  public totalGanancia: number = 0;
  //Variables reembolsos
  public reembolsos: any[] = [];
  public comision5Reembolsos: number = 0;
  public comisionAReembolsos: number = 0;
  public totalReembolsos: number = 0;
  public totalAReembolsar: number = 0;
  public reembolsoFinal: number = 0;
  //Variables extras
  public totalExtrasAgencia: number = 0;
  public totalExtrasViajero: number = 0;
  public comision5Extras: number = 0;
  public comisionAExtras: number = 0;
  //Variables generales
  public pagoIncompleto: boolean = true;
  public datesInHotel: string = '';
  public holidaysInHotel: number = 0;
  public valoresExtras: any = {};
  public valoresReembolsos: any = {};
  public valoresVenta: any = {};
  public countV: number = 0;
  public countR: number = 0;
  public countE: number = 0;

  constructor(
    private productosVentaService: ProductosVentaService,
    private paisesService: PaisesService,
    private reembolsosService: ReembolsosService,
    private productosExtrasService: ProductosExtrasConciergeService
  ) {}

  async getValoresVenta(idCotizacion: number, version: number){
    this.countV = 0;
    this.totalNetoCotizado = 0;
    this.totalMontoComprado = 0;
    this.comision5Venta= 0;
    this.comisionAVenta = 1;
    await this.getProductosVenta(idCotizacion, version);
    this.valoresVenta = {
      totalNetoCotizado: this.totalNetoCotizado,
      totalMontoComprado: this.totalMontoComprado,
      comision: this.comision5Venta,
      comisionAgente: this.comisionAVenta,
      pagoIncompleto: this.pagoIncompleto
    }
    return this.valoresVenta;
  }

  async getValoresReembolsos(idCotizacion: number, version: number){
    this.countR = 0;
    this.totalAReembolsar = 0;
    this.totalReembolsos = 0;
    this.comision5Reembolsos = 0;
    this.comisionAReembolsos = 0;
    this.reembolsoFinal = 0;
    await this.getProductosReembolsados(idCotizacion, version);
    this.valoresReembolsos = {
      totalAReembolsar: this.totalAReembolsar,
      totalReembolsos: this.totalReembolsos,
      comision: this.comision5Reembolsos,
      comisionAgente: this.comisionAReembolsos,
      reembolsoFinal: this.reembolsoFinal
    }
    return this.valoresReembolsos;
  }

  async getValoresExtras(idCotizacion: number){
    this.countE = 0;
    this.totalExtrasAgencia = 0;
    this.totalExtrasViajero = 0;
    this.comision5Extras = 0;
    this.comisionAExtras = 0;
    await this.getProductosExtrasConcierge(idCotizacion);
    this.valoresExtras = {
      totalExtrasAgencia: this.totalExtrasAgencia,
      totalExtrasViajero: this.totalExtrasViajero,
      comision: this.comision5Extras,
      comisionAgente: this.comisionAExtras
    }
    return this.valoresExtras;
  }

  getProductosVenta(idCotizacion: number, version: number){
    return new Promise((resolve :any, reject : any)=> {
      this.productosVentaService.getProductosVenta(idCotizacion, version, 0).subscribe(async(res: any) => {
        this.destinos = res.destinos;
        this.canasta = res.canasta;
        for(let product of this.canasta){
          switch (product.tipo) {
            case 1:
              if(product.traslado !== undefined){
                product.traslado.id = product.traslado.idTrasladoAdquirido;
                this.productos.push(product.traslado);
                this.helperOperacionesProductosVenta(product.traslado, product.traslado.tarifa);
              }
              break;
            case 2:
              if(product.disposicion !== undefined){
                product.disposicion.id = product.disposicion.idDisposicionAdquirida;
                this.productos.push(product.disposicion);
                this.helperOperacionesProductosVenta(product.disposicion, product.disposicion.tarifa);
              }
              break;
            case 3:
              if(product.trasladoOtro !== undefined){
                product.trasladoOtro.id = product.trasladoOtro.idTrasladoAdquirido;
                this.productos.push(product.trasladoOtro);
                this.helperOperacionesProductosVenta(product.trasladoOtro, product.trasladoOtro.tarifa);
              }
              break;
            case 4:
              if(product.hotel !== undefined){
                product.hotel.id = product.hotel.idHotelAdquirido;
                this.productos.push(product.hotel);
                product.hotel.daysInHotel = Math.floor((new Date(product.hotel.checkOut).getTime() - new Date(product.hotel.checkIn).getTime()) / 1000 / 60 / 60 / 24);
                let destino = this.destinos.find(destino => destino.idDestino === product.hotel.idDestino);
                await this.getPais(new Date(product.hotel.checkIn), new Date(product.hotel.checkOut), destino.idPais);
                product.hotel.holidaysInHotel = this.holidaysInHotel;
                product.hotel.daysInHotel = (product.hotel.daysInHotel - this.holidaysInHotel);
                let tarifaBase: number = (product.hotel.cityTax + product.hotel.desayuno) * product.hotel.daysInHotel;
                let tarifaAlta: number = (product.hotel.cityTax + product.hotel.desayuno) * this.holidaysInHotel * 1.20;
                let tarifa: number = (product.hotel.tarifa + tarifaBase + tarifaAlta);
                let tarifaTotal: number  = tarifa + product.hotel.otros;
                this.helperOperacionesProductosVenta(product.hotel, tarifaTotal);
              }
              break;
            case 5:  
              if(product.vuelo !== undefined){
                product.vuelo.id = product.vuelo.idVuelo;  
                this.productos.push(product.vuelo);   
                this.helperOperacionesProductosVenta(product.vuelo, product.vuelo.tarifa); 
              }  
              break;
            case 6:
              if(product.tren !== undefined){
                product.tren.id = product.tren.idTren;
                this.productos.push(product.tren);
                this.helperOperacionesProductosVenta(product.tren, product.tren.tarifa); 
              }
              break;
            case 7:
              if(product.tourPie){
                product.tourPie.id = product.tourPie.idProductoAdquirido;
                this.productos.push(product.tourPie);
                this.helperOperacionesProductosVenta(product.tourPie, product.tourPie.tarifa); 
              }else if(product.tourTransporte){
                product.tourTransporte.id = product.tourTransporte.idProductoAdquirido;
                this.productos.push(product.tourTransporte);
                this.helperOperacionesProductosVenta(product.tourTransporte, product.tourTransporte.tarifa); 
              }else if(product.tourGrupo){
                product.tourGrupo.id = product.tourGrupo.idProductoAdquirido;
                this.productos.push(product.tourGrupo);
                this.helperOperacionesProductosVenta(product.tourGrupo, product.tourGrupo.tarifa); 
              }else if(product.actividad){
                product.actividad.id = product.actividad.idProductoAdquirido;
                this.productos.push(product.actividad);
                this.helperOperacionesProductosVenta(product.actividad, product.actividad.tarifa); 
              }
              break;
            case 8:
              if(product.extra !== undefined){
                product.extra.id = product.extra.idExtras;
                this.productos.push(product.extra);
                this.helperOperacionesProductosVenta(product.extras, product.extras.tarifa); 
              }
              break;
          }
          if(this.countV == this.canasta.length - 1) resolve();
          this.countV++;
        }
      }, err => console.log(err));
    });
  }

  helperOperacionesProductosVenta(producto: any, tarifa: number){
    if(producto.pagoCompletado) this.pagoIncompleto = false;
    this.totalNetoCotizado += tarifa;
    this.totalMontoComprado += producto.precioComprado;
    this.comision5Venta += tarifa * (producto.comision / 100);
    let montoProductoCotizado: number = this.calcularComision(tarifa, producto.comision, producto.comisionAgente);
    this.comisionAVenta += montoProductoCotizado * (producto.comisionAgente / 100);
  }

  getProductosReembolsados(idCotizacion: number, version: number){
    return new Promise<void>((resolve: any, reject: any) => {
      this.productosVentaService.getProductosVenta(idCotizacion, version, 3).subscribe(async(res: any) => {
        this.productosReembolsados = [];
        for(let product of res.canasta){
          switch (product.tipo) {
            case 1:
              if(product.traslado !== undefined) this.productosReembolsados.push(product.traslado);
              break;
            case 2:
              if(product.disposicion !== undefined) this.productosReembolsados.push(product.disposicion);
              break;
            case 3:
              if(product.trasladoOtro !== undefined) this.productosReembolsados.push(product.trasladoOtro);
              break;
            case 4:
              if(product.hotel !== undefined) this.productosReembolsados.push(product.hotel);
              break;
            case 5:  
            if(product.vuelo !== undefined) this.productosReembolsados.push(product.vuelo);
              break;
            case 6:
              if(product.tren !== undefined) this.productosReembolsados.push(product.tren);
              break;
            case 7:
              if (product.tourPie) {
                this.productosReembolsados.push(product.tourPie);
              } else if (product.tourTransporte) {
                this.productosReembolsados.push(product.tourTransporte);
              } else if (product.tourGrupo) {
                this.productosReembolsados.push(product.tourGrupo);
              } else if (product.actividad) {
                this.productosReembolsados.push(product.actividad);
              }
              break;
            case 8:
              if(product.extra !== undefined) this.productosReembolsados.push(product.extra);
              break;
          }
        }
        this.reembolsosService.getTotalReembolsoFinal(idCotizacion).subscribe((totalReembolsoFinal: any) => {
          if(this.productosReembolsados.length === 0){
            resolve();
          }
          for(let producto of this.productosReembolsados){
            let ganancia5: number = producto.tarifa * (producto.comision / 100);
            let gananciaA: number = this.calcularComision(producto.tarifa, producto.comision, producto.comisionAgente) * (producto.comisionAgente / 100);
            this.comisionAReembolsos += gananciaA;
            this.comision5Reembolsos += ganancia5;
            this.totalAReembolsar += producto.tarifa;
            this.totalReembolsos += (this.totalAReembolsar + this.comision5Reembolsos + this.comisionAReembolsos);
            this.reembolsoFinal = totalReembolsoFinal;
            if(this.countR == this.productosReembolsados.length - 1) resolve();
            this.countR++;
          }
        });
        // this.reembolsosService.listPorCotizacion(idCotizacion).subscribe((reembolsos: any) => {
        //   this.reembolsos = reembolsos;
        //   console.log('this.reembolsos', this.reembolsos);
        //   if(this.reembolsos.length > 0) {
        //     console.log('this.productosReembolsados', this.productosReembolsados);
        //     for(let reembolso of this.reembolsos){
        //       console.log('reembolso', reembolso);
        //       let producto: any = this.productosReembolsados.find(producto => producto.idActividad == reembolso.idProducto && producto.tipo == reembolso.tipo);
        //       console.log('producto', producto);
        //       let rFinal: any = this.reembolsos.find(reembolso => reembolso.reembolsoFinal == 1);
        //       if(producto){
        //         reembolso.ganancia5 = producto.cantidadNeta * (producto.comision / 100);
        //         reembolso.gananciaA = this.calcularComision(producto.tarifa, producto.comision, producto.comisionAgente) * (producto.comisionAgente / 100);
        //       }else{
        //         reembolso.ganancia5 = 0;
        //         reembolso.gananciaA = 0;
        //       }
        //       let c5R: number = 100 - reembolso.com5R;
        //       let cAR: number = 100 - reembolso.comAR;
        //       let gr5: number = reembolso.ganancia5 * (c5R / 100);
      
        //       let subT1: number = reembolso.ganancia5 * (reembolso.com5R / 100);
        //       let subT2: number = reembolso.gananciaA * (reembolso.comAR / 100);
        //       let subT3: number = reembolso.cantidadNeta * (reembolso.porcentaje / 100);
        //       this.comisionAReembolsos += reembolso.gananciaA * (cAR / 100);
        //       this.comision5Reembolsos += (gr5 + reembolso.cantidadNeta - (reembolso.cantidadNeta * (reembolso.porcentaje / 100)));
        //       this.totalAReembolsar += (subT1 + subT2 + subT3);
        //       this.totalReembolsos += (this.totalAReembolsar + this.comision5Reembolsos + this.comisionAReembolsos);
        //       this.reembolsoFinal = rFinal ? rFinal.cantidadDivisa : 0;
        //       if(this.countR == this.reembolsos.length - 1) resolve();
        //       this.countR++;
        //     }
        //   }else{
        //     resolve();
        //   }
        // });
      }, err => console.log(err));
    });
  }

  getProductosExtrasConcierge(idCotizacion: number){
    return new Promise<void>((resolve: any, reject: any)=> {
      this.productosExtrasService.getProductosExtrasConcierge(idCotizacion).subscribe((productos: any) => {
        const { productosExtras } = productos;
        if(productosExtras.length > 0) {
          for(let producto of productosExtras){
            switch(producto.tipo){
              case 1:
                this.calcularExtrasPorPolitica(producto.traslado);
                break;
              case 2:
                this.calcularExtrasPorPolitica(producto.disposicion);
                break;
              case 3:
                this.calcularExtrasPorPolitica(producto.trasladoOtro);
                break;
              case 4:
                this.calcularExtrasPorPolitica(producto.hotel);
                break;
              case 5:
                this.calcularExtrasPorPolitica(producto.vuelo);
                break;
              case 6:
                this.calcularExtrasPorPolitica(producto.tren);
                break;
              case 7:
                this.calcularExtrasPorPolitica(producto.producto);
                break;
              case 8:
                this.calcularExtrasPorPolitica(producto.extra);
                break;
            }
            if(this.countE == productosExtras.length - 1) resolve();
            this.countE++;
          }
        }else{
          resolve();
        }
      });
    });
  }

  calcularExtrasPorPolitica(producto: any){
    switch(producto.politicasExtra){
      case 'Agencia':
        this.totalExtrasAgencia += producto.tarifa;
        break;
      case 'Viajero':
        let montoProductoCotizado: number = this.calcularComision(producto.tarifa, producto.comision, producto.comisionAgente);
        this.totalExtrasViajero += montoProductoCotizado;
        this.comision5Extras += producto.tarifa * (producto.comision / 100);
        this.comisionAExtras += montoProductoCotizado * (producto.comisionAgente / 100);
        break;
    }
  }

  calcularComision(tarifa: number, comision5r: number, comisionA: number){
    let comisionRives = (comision5r / 100);
    let comisionAgente = (comisionA / 100);
    let total = tarifa * (1 + comisionRives) * (1 + (comisionAgente / (1 - comisionAgente)));
    return total;
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
    datesInHotelArray.map((date) => {
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