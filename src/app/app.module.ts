import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { DatePipe, CurrencyPipe } from "@angular/common";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DisenoCotizacionesComponent } from "./components/diseno-cotizaciones/diseno-cotizaciones.component";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MomentModule } from 'angular2-moment';
import { AdministradorComponent } from "./components/administrador/administrador.component";
import {
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { CotizacionDestinosComponent } from "./components/cotizacion-destinos/cotizacion-destinos.component";
import { CotizacionProductosComponent } from "./components/cotizacion-productos/cotizacion-productos.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { TrasladosComponent } from "./components/traslados/traslados.component";
import { DisposicionesComponent } from "./components/disposiciones/disposiciones.component";
import { ToursPrivadosAPieComponent } from "./components/tours-privados-apie/tours-privados-apie.component";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { HotelComponent } from "./components/hotel/hotel.component";
import { VuelosComponent } from "./components/vuelos/vuelos.component";
import { TrenesComponent } from "./components/trenes/trenes.component";
import { ToursPrivadosEntransporteComponent } from './components/tours-privados-entransporte/tours-privados-entransporte.component';
import { ExtrasComponent } from './components/extras/extras.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { ProductosEstaticosComponent } from './components/globales/productos-estaticos/productos-estaticos.component';
import { ProductosDinamicosComponent } from './components/globales/productos-dinamicos/productos-dinamicos.component';
import { VersionesComponent } from './components/versiones/versiones.component';
import { NuevaVersionComponent } from './components/nueva-version/nueva-version.component';
import { OrdenCompraComponent } from './components/orden-compra/orden-compra.component';
import { CompletarCotizacionComponent } from './components/completar-cotizacion/completar-cotizacion.component';
import { TarifasComponent } from './components/globales/tarifas/tarifas.component';
import { MonitorizacionTareasComponent } from './components/monitorizacion-tareas/monitorizacion-tareas.component';
import { ImageUploadModule } from "angular2-image-upload";


//MÓDULO DE ADMINISTRACIÓN
import { AdminModule } from './administrador/admin.module';
import { FinanzasModule } from "./finanzas/finanzas.module";
import { CanastaComponent } from './components/canasta/canasta.component'
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ToursPrivadosEnGrupoComponent } from './components/tours-privados-en-grupo/tours-privados-en-grupo.component';
import { ActividadesComponent } from './components/actividades/actividades.component';
import { DestinoComponent } from './components/globales/destino/destino.component';
import { ProcesadoComponent } from './components/procesado/procesado.component';
import { CanActivateViaAuthGuard } from "./guard/canActivateViaAuth.guard";
import { ResizableModule } from 'angular-resizable-element';
import { ConfirmarComponent } from './components/confirmar/confirmar.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { RechazarComponent } from './components/rechazar/rechazar.component';
import { EstadoComponent } from './components/estado/estado.component';
import { ItinerarioComponent } from './components/itinerario/itinerario.component';
import { GerenteVentasComponent } from './components/gerente-ventas/gerente-ventas.component';
import { RegistrarOrdenComponent } from './components/registrar-orden/registrar-orden.component';
import { RechazarOrdenComponent } from './components/rechazar-orden/rechazar-orden.component';
import { GerenteComprasComponent } from './components/gerente-compras/gerente-compras.component';
import { ChoferValidarComponent } from './components/chofer-validar/chofer-validar.component';
import { RentaVehiculosComponent } from './components/renta-vehiculos/renta-vehiculos.component';
import { NgxStripeModule } from 'ngx-stripe';


@NgModule({
  declarations: [
    AppComponent,
    DisenoCotizacionesComponent,
    AdministradorComponent,
    CotizacionDestinosComponent,
    CotizacionProductosComponent,
    TrasladosComponent,
    DisposicionesComponent,
    ToursPrivadosAPieComponent,
    NavigationComponent,
    HotelComponent,
    VuelosComponent,
    TrenesComponent,
    ToursPrivadosEntransporteComponent,
    ExtrasComponent,
    CanastaComponent,
    LoginComponent,
    HomeComponent,
    ToursPrivadosEnGrupoComponent,
    ActividadesComponent,
    NotificacionesComponent,
    ProductosEstaticosComponent,
    ProductosDinamicosComponent,
    VersionesComponent,
    NuevaVersionComponent,
    OrdenCompraComponent,
    CompletarCotizacionComponent,
    TarifasComponent,
    MonitorizacionTareasComponent,
    DestinoComponent,
    ProcesadoComponent,
    ConfirmarComponent,
    RegistrarComponent,
    RechazarComponent,
    EstadoComponent,
    ItinerarioComponent,
    GerenteVentasComponent,
    RegistrarOrdenComponent,
    RechazarOrdenComponent,
    GerenteComprasComponent,
    ChoferValidarComponent,
    RentaVehiculosComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatListModule,
    MatIconModule,
    MatSidenavModule,
    ResizableModule,
    MatDialogModule,
    MatSelectModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    AdminModule,
    FinanzasModule,
    MomentModule,
    AppRoutingModule,
    ImageUploadModule.forRoot(),
    NgxStripeModule.forRoot(
      "pk_live_6SxhFUCp9skdpAKWLFaI9I3e002KwNtnoT"
      ),

  ],
  providers: [
    CotizacionProductosComponent,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: false },
    },
    DatePipe,
    CurrencyPipe,
    CanActivateViaAuthGuard
  ],
  bootstrap: [AppComponent],
  entryComponents: [],
})
export class AppModule {}
