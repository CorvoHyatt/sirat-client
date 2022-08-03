import { Component, Input, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { Subscription } from 'rxjs';
import * as M from 'materialize-css/dist/js/materialize';
import { Destino } from '../../models/Destino';
import { DestinosService } from '../../services/destinos.service';
import { Cotizacion } from '../../models/Cotizacion';
import { CotizacionesService } from '../../services/cotizaciones.service';
import { CanastaService } from '../../services/canasta.service';
import { UsuariosService } from '../../services/usuarios.service';
declare var $: any;

@Component({
  selector: 'app-cotizacion-productos',
  templateUrl: './cotizacion-productos.component.html',
  styleUrls: ['./cotizacion-productos.component.css']
})
export class CotizacionProductosComponent implements OnInit, OnDestroy {
  //@ViewChild(CanastaComponent) canastaComponent: CanastaComponent;
   
  private subscriptionDestinoA: Subscription;
  private subscriptionDestinoN: Subscription;
  public destinos: Destino[] = [];
  public destino: any = new Destino();
  public cotizacion: Cotizacion = new Cotizacion();
  public numeroTab: number = 1;
  public mostrarModal: boolean = false;
  public instance: any;
  public totalProductos: number = 0;

  constructor(
    private destinosService: DestinosService,
    private cotizacionesService: CotizacionesService,
    private router: Router,
    private location: LocationStrategy,
    private canastaService: CanastaService,
    private usuariosService: UsuariosService
  ) { 
    location.onPopState(() => {
      setTimeout(() => { 
        if (this.router.url.includes("disposiciones")) {
          this.numeroTab = 2;
        } else if (this.router.url.includes("toursPrivadosAPie")) {
          this.numeroTab = 3;
        } else if (this.router.url.includes("toursPrivadosEnTransporte")) { 
          this.numeroTab = 4;
        }else if (this.router.url.includes("toursEnGrupo")) { 
          this.numeroTab = 5;
        }else if (this.router.url.includes("actividades")) { 
          this.numeroTab = 6;
        }else if (this.router.url.includes("hotel")) { 
          this.numeroTab = 7;
        } else if (this.router.url.includes("vuelos")) { 
          this.numeroTab = 8;
        } else if (this.router.url.includes("trenes")) { 
          this.numeroTab = 9;
        } else if (this.router.url.includes("extras")) { 
          this.numeroTab = 10;
        }  else if (this.router.url.includes("rentaVehiculo")) { 
          this.numeroTab = 11;
        } else { 
          this.router.navigate(['/home/cotizacionProductos/traslados']); 
          this.numeroTab = 1;
        }
      }, 0);
    });
  }

  ngOnInit(): void {
    if (this.router.url.includes("disposiciones")) {
      this.numeroTab = 2;
    } else if (this.router.url.includes("toursPrivadosAPie")) {
      this.numeroTab = 3;
    } else if (this.router.url.includes("toursPrivadosEnTransporte")) { 
      this.numeroTab = 4;
    }else if (this.router.url.includes("toursEnGrupo")) { 
      this.numeroTab = 5;
    }else if (this.router.url.includes("actividades")) { 
      this.numeroTab = 6;
    }else if (this.router.url.includes("hotel")) { 
      this.numeroTab = 7;
    } else if (this.router.url.includes("vuelos")) { 
      this.numeroTab = 8;
    } else if (this.router.url.includes("trenes")) { 
      this.numeroTab = 9;
    } else if (this.router.url.includes("extras")) { 
      this.numeroTab = 10;
    } else if (this.router.url.includes("rentaVehiculo")) { 
      this.numeroTab = 11;
    } else { 
      this.router.navigate(['/home/cotizacionProductos/traslados']); 
      this.numeroTab = 1;
    }
    this.cotizacion.idCotizacion = parseInt(localStorage.getItem('idCotizacion'));
    this.getDestinosByCotizacion(this.cotizacion.idCotizacion);
    this.getCotizacion();
    $(document).ready(function(){
      $('select').formSelect();
      $('#modalCanasta').modal({ dismissible: false});
      $('#modalDestino').modal({ dismissible: false});
    });
    const options= {};
    var el = document.querySelectorAll('.tabs');   
    var instance = M.Tabs.init(el, options);
    this.subscriptionDestinoA = this.destinosService.getActualDestino().subscribe(destino => {
      if(Object.keys(destino).length === 0) return false;
      this.destino = destino;
    });
    this.subscriptionDestinoN = this.destinosService.getNuevoDestino().subscribe(destino => {
      if(Object.keys(destino).length === 0) return false;
      this.destinos.push(destino);
      setTimeout(() => { $('#destino').val(this.destinos.length - 1) }, 0);
    });

    this.obtenerTodosProductos();
    this.obtenerProductos();
  }

  ngOnDestroy(): void {
    this.subscriptionDestinoA.unsubscribe();
    this.subscriptionDestinoN.unsubscribe();
  }

  getDestinosByCotizacion(idCotizacion: number){
    this.destinosService.list_porCotizacion(idCotizacion).subscribe((destinos: Destino[]) => {
      this.destinos = destinos;
      this.destino = this.destinos[0];
      this.destinosService.setActualDestino(this.destino);
    }, err => console.log(err));
  }

  getCotizacion() {
    this.cotizacionesService.list_one(this.cotizacion.idCotizacion).subscribe((resp: Cotizacion) => {
      this.cotizacion = resp;
    });
  }

  closeModal(){
    $('#modalCanasta').modal('close');
  }

  cambiarDestino(index: number){
    this.destinosService.setActualDestino(this.destinos[index]);
  }

  cambiarTab(indexTab){
    this.numeroTab = indexTab;
  }

  abrirModalCanasta() {
    //this.canastaComponent.refresh();
    // this.mostrarModal = true;
    $("#modalCanasta").modal("open");
    this.redirectTab(1);
  }

  irURL(tipo) {
    switch (tipo) {
      case 1:
        this.router.navigate(['/home/cotizacionProductos/traslados']); 
      break;
      case 2:
        this.router.navigate(['/home/cotizacionProductos/disposiciones']); 
      break;
      case 3:
        this.router.navigate(['/home/cotizacionProductos/toursPrivadosAPie']); 
      break;
      case 4:
        this.router.navigate(['/home/cotizacionProductos/toursPrivadosEnTransporte']); 
      break;
      case 5:
        this.router.navigate(['/home/cotizacionProductos/toursEnGrupo']); 
      break;
      case 6:
        this.router.navigate(['/home/cotizacionProductos/actividades']); 
      break;
      case 7:
        this.router.navigate(['/home/cotizacionProductos/hoteles']); 
      break;
      case 8:
        this.router.navigate(['/home/cotizacionProductos/vuelos']); 
      break;
      case 9:
        this.router.navigate(['/home/cotizacionProductos/trenes']); 
      break;
      case 10:
        this.router.navigate(['/home/cotizacionProductos/extras']); 
      break;
      case 11:
        this.router.navigate(['/home/cotizacionProductos/rentaVehiculo']); 
      break;
      default:
      break;
    }
  }

  redirectTab(tabIndex: number){
    this.numeroTab = tabIndex;
    this.instance = M.Tabs.getInstance(document.querySelector('.tabs'));
    this.instance.select('traslados');
    $('.tabs').scrollLeft(0);
    window.scroll(0, 0);
  }

  obtenerProductos() {
    let s: any = this.canastaService.getProduct().subscribe(async (product: any) => { 
      this.obtenerTodosProductos();
    });
  }
  obtenerTodosProductos() {
    let s: any = this.usuariosService.getUser().subscribe(user => {
      if (Object.keys(user).length === 0) return false;
      let idCotizacion = parseInt(localStorage.getItem('idCotizacion'));

      this.canastaService.listOneCotizacionByUserByVersion(user.idUsuario, idCotizacion, 1).subscribe((res: any) => {
        console.log("productos canasta", res);
        this.totalProductos = res.canasta.length;
        console.log(this.totalProductos);
      }, err => { console.log(err) });
    });

    
  }
}
 