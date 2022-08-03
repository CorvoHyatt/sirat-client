import { AfterContentInit, AfterViewInit, Component, Input, OnInit, OnDestroy, ViewChild, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CanastaService } from './../../services/canasta.service';
import Swal from 'sweetalert2';
import { CotizacionProductosComponent } from 'src/app/components/cotizacion-productos/cotizacion-productos.component';
import { Router } from '@angular/router';
import { TarifasService } from 'src/app/services/tarifas.service';
import { ProductosEstaticosComponent } from '../globales/productos-estaticos/productos-estaticos.component';
import { TarifasComponent } from '../globales/tarifas/tarifas.component';
declare var $: any;

@Component({
  selector: 'app-canasta',
  templateUrl: './canasta.component.html',
  styleUrls: ['./canasta.component.css']
})
export class CanastaComponent implements OnInit, OnDestroy {

  @ViewChild(ProductosEstaticosComponent) productosEstaticosComponent: ProductosEstaticosComponent;
  @ViewChild(TarifasComponent) tarifasComponent: TarifasComponent;

  public suscripciones: Subscription[] = [];
  public total: number = 0;
  public cotizacion: any;
  public idCotizacion: any;
  public applyPanel: boolean = false;
  public idsToDeleteTP: string = '';
  public idsToDeleteTT: string = '';
  public idsToDeleteTG: string = '';
  public idsToDeleteA: string = '';
  public show: boolean = true;
  public typeToSend: number = 0;

  constructor(
    private canastaService: CanastaService,
    private cotizacionProductos: CotizacionProductosComponent,
    private router: Router,
    private tarifasService: TarifasService
  ) {}

  ngOnInit(): void{
    this.actualRoute();
    this.getCotizacion(); 
  } 

  ngOnDestroy(): void{
    this.suscripciones.forEach(s => s.unsubscribe());
  }

  getCotizacion() {
    let s: any = this.tarifasService.getTarifa('cotizacion').subscribe(cotizacion => {
      if(Object.keys(cotizacion).length === 0) return false;
      this.cotizacion = cotizacion;
      this.show = false;
    });
    this.suscripciones.push(s);
  }

  actualRoute(){
    let route = this.router.url.split('/');
    if(route && route[2] === 'canastaFinal'){
      this.applyPanel = true;
    }
  }

  cancelarCotizacion(idCotizacion: number){
    Swal.fire({
      title: 'Al cancelar una cotización, será eliminada automáticamente, ¿Desea continuar?',
      showCancelButton: true,
      cancelButtonText: 'No, cancelar',
      confirmButtonText: `Si, continuar`,
      confirmButtonColor: '#b71c1c'
    }).then((result) => {
      if(result.isConfirmed){
        this.canastaService.getIdsToDelete().subscribe((res: any) => {
          res = res.length === 0 ? 0 : res;
          this.canastaService.cancelarCotizacion(idCotizacion, res).subscribe(res => {
            this.cotizacion = false;
            localStorage.removeItem('idDestino');
            localStorage.removeItem('idCotizacion');
            this.router.navigate(["home/disenoCotizacion"]);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Cotización eliminada correctamente`,
              showConfirmButton: false,
              timer: 1500
            });
          }, err => console.log(err));
        }, err => console.log(err));
      }
    });
  }

  cotizacionPendiente(){
    Swal.fire({
      title: 'Su cotización será agregada como pendiente, ¿Desea continuar?',
      showCancelButton: true,
      cancelButtonText: 'No, cancelar',
      confirmButtonText: `Si, continuar`,
      confirmButtonColor: '#b71c1c'
    }).then((result) => {
      if(result.isConfirmed){
        this.cotizacion = false;
        localStorage.removeItem('idDestino');
        localStorage.removeItem('idCotizacion');
        localStorage.removeItem('fechaInicio');
        localStorage.removeItem('fechaFinal');
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Su cotización fue asignada como pendiente`,
          showConfirmButton: false,
          timer: 2000
        });
        this.cotizacionProductos.closeModal();
        this.cotizacionProductos.numeroTab = 0;
        this.router.navigate(["home/disenoCotizacion"]);
      }
    });
  }

  generarCotizacion(idCotizacion: number){
    this.router.navigate(["home/procesado", idCotizacion, this.cotizacion.version]);
  }

  getTypeToSend(event) {
    this.typeToSend = event;
  }

  closeModalEditCarrito() {
    $("#modalEditCarrito").modal("close");
  }

  refresh() {
    this.productosEstaticosComponent.tarifaSN = 0;
    this.productosEstaticosComponent.tarifaHN = 0;
    this.productosEstaticosComponent.tarifaSC = 0;
    this.productosEstaticosComponent.tarifaHC = 0;

    this.productosEstaticosComponent.obtenerProducto();
    this.productosEstaticosComponent.getProductsByCotizacion();
    this.productosEstaticosComponent.canDelete = true;
    this.productosEstaticosComponent.canEdit = true;
    $("#modalEditCarrito").modal("close");
  } 

  refreshProductos() {
    console.log("refresh productos...");
  }
}
