import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisenoCotizacionesComponent } from './components/diseno-cotizaciones/diseno-cotizaciones.component';
import { CotizacionDestinosComponent } from './components/cotizacion-destinos/cotizacion-destinos.component';
import { CotizacionProductosComponent } from './components/cotizacion-productos/cotizacion-productos.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CanastaComponent } from './components/canasta/canasta.component';
import { VersionesComponent } from './components/versiones/versiones.component';
import { NuevaVersionComponent } from './components/nueva-version/nueva-version.component';
import { OrdenCompraComponent } from './components/orden-compra/orden-compra.component';
import { CompletarCotizacionComponent } from './components/completar-cotizacion/completar-cotizacion.component';
import { MonitorizacionTareasComponent } from './components/monitorizacion-tareas/monitorizacion-tareas.component';
import { ProcesadoComponent } from './components/procesado/procesado.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { RegistrarOrdenComponent } from './components/registrar-orden/registrar-orden.component';
import { RechazarOrdenComponent } from './components/rechazar-orden/rechazar-orden.component';
import { RechazarComponent } from './components/rechazar/rechazar.component';
import { CanActivateViaAuthGuard } from './guard/canActivateViaAuth.guard';
import { ConfirmarComponent } from './components/confirmar/confirmar.component';
import { TrasladosComponent } from './administrador/components/traslados/traslados.component';
import { DisposicionesComponent } from './administrador/components/disposiciones/disposiciones.component';
import { ToursPrivadosApieComponent } from './administrador/components/tours-privados-apie/tours-privados-apie.component';
import { ToursPrivadosEntransporteComponent } from './administrador/components/tours-privados-entransporte/tours-privados-entransporte.component';
import { ToursPrivadosEnGrupoComponent } from './administrador/components/tours-privados-en-grupo/tours-privados-en-grupo.component';
import { ActividadesComponent } from './administrador/components/actividades/actividades.component';
import { EstadoComponent } from './components/estado/estado.component';
import { ItinerarioComponent } from './components/itinerario/itinerario.component';
import { GerenteVentasComponent } from './components/gerente-ventas/gerente-ventas.component';
import { GerenteComprasComponent } from './components/gerente-compras/gerente-compras.component';
import { ChoferValidarComponent} from './components/chofer-validar/chofer-validar.component'
import { DisposicionesComponent as DisposicionesComponentCotizacion } from './components/disposiciones/disposiciones.component';
import { TrasladosComponent as TrasladosComponentCotizacion } from './components/traslados/traslados.component';
import { ToursPrivadosAPieComponent as  ToursPrivadosAPieComponentCotizacion} from './components/tours-privados-apie/tours-privados-apie.component';
import { ToursPrivadosEntransporteComponent as ToursPrivadosEntransporteComponentCotizacion} from './components/tours-privados-entransporte/tours-privados-entransporte.component';
import { ToursPrivadosEnGrupoComponent as ToursPrivadosEnGrupoComponentCotizacion} from './components/tours-privados-en-grupo/tours-privados-en-grupo.component';
import { ActividadesComponent as ActividadesComponentCotizacion } from './components/actividades/actividades.component';
import { HotelComponent } from './components/hotel/hotel.component';
import { VuelosComponent } from './components/vuelos/vuelos.component';
import { TrenesComponent } from './components/trenes/trenes.component';
import { ExtrasComponent } from './components/extras/extras.component';
import { RentaVehiculosComponent } from './components/renta-vehiculos/renta-vehiculos.component';


const routes: Routes = [
  { 
    path: "",
    redirectTo: "/login",
    pathMatch: "full" 
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'confirmar/:id',
    component: ConfirmarComponent
  }
  ,
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [CanActivateViaAuthGuard],
    children: [
      {
        path: 'disenoCotizacion',
        component: DisenoCotizacionesComponent,
      },
      {
        path: 'cotizacionDestinos',
        component: CotizacionDestinosComponent,
      },
      {
        path: 'cotizacionProductos',
        component: CotizacionProductosComponent,
        children: [
          {
            path: 'traslados',
            component: TrasladosComponentCotizacion
          },
         { path: 'disposiciones',
            component: DisposicionesComponentCotizacion
         }
         ,
         { path: 'toursPrivadosAPie',
            component: ToursPrivadosAPieComponentCotizacion
         },
         { path: 'toursPrivadosAPie/:idTour',
            component: ToursPrivadosAPieComponentCotizacion
         }
         ,
         { path: 'toursPrivadosEnTransporte',
            component: ToursPrivadosEntransporteComponentCotizacion
         },
         { path: 'toursPrivadosEnTransporte/:idTour',
            component: ToursPrivadosEntransporteComponentCotizacion
         }
         ,
         { path: 'toursEnGrupo',
            component: ToursPrivadosEnGrupoComponentCotizacion
         },
         { path: 'toursEnGrupo/:idTour',
            component: ToursPrivadosEnGrupoComponentCotizacion
         }
         ,
         { path: 'actividades',
            component: ActividadesComponentCotizacion
         },
         { path: 'actividades/:idTour',
            component: ActividadesComponentCotizacion
         }
         ,
         { path: 'hoteles',
            component: HotelComponent
         }
         ,
         { path: 'vuelos',
            component: VuelosComponent
         }
         ,
         { path: 'trenes',
            component: TrenesComponent
         }
         ,
         { path: 'extras',
            component: ExtrasComponent
         }
         ,
         { path: 'rentaVehiculo',
            component: RentaVehiculosComponent
          }
       ]
      },
      {
        path: 'ordenCompra/:idCotizacion/:versionCotizacion',
        component: OrdenCompraComponent,
      },
      {
        path: 'completarCotizacion/:idCotizacion/:versionCotizacion',
        component: CompletarCotizacionComponent,
      },
      {
        path: 'versionado/:idCotizacion/:versionCotizacion',
        component: VersionesComponent,
      },
      {
        path: 'nuevaVersion/:idCotizacion/:versionCotizacion',
        component: NuevaVersionComponent,
      },
      {
        path: 'procesado/:idCotizacion/:versionCotizacion',
        component: ProcesadoComponent,
      },
      {
        path: 'gerenteVentas',
        component: GerenteVentasComponent,
      },
      {
        path: 'gerenteCompras',
        component: GerenteComprasComponent,
      },
      {
        path: 'gerenteCompras/:ini/:fin',
        component: GerenteComprasComponent,
      },
      {
        path: 'registrar/:idCotizacion/:versionCotizacion',
        component: RegistrarComponent,
      },
      {
        path: 'registrarOrden/:idCotizacion',
        component: RegistrarOrdenComponent,
      },
      {
        path: 'rechazar/:idCotizacion/:versionCotizacion',
        component: RechazarComponent,
      },
      {
        path: 'rechazarOrden/:idCotizacion/:versionCotizacion',
        component: RechazarOrdenComponent,
      },
      {
        path: 'monitorizacionTareas',
        component: MonitorizacionTareasComponent,
      }
      ,
      {
        path: 'traslados',
        component: TrasladosComponent,
      }
      ,
      {
        path: 'disposiciones',
        component: DisposicionesComponent,
      }
      ,
      {
        path: 'toursapie',
        component: ToursPrivadosApieComponent,
      }
      ,
      {
        path: 'toursentransporte',
        component: ToursPrivadosEntransporteComponent,
      }
      ,
      {
        path: 'toursengrupo',
        component: ToursPrivadosEnGrupoComponent,
      }
      ,
      {
        path: 'actividades',
        component: ActividadesComponent,
      },
      {
        path: 'estado/:idCotizacion',
        component: EstadoComponent,
      },
      {
        path: 'choferValidar/:correoChofer',
        component: ChoferValidarComponent,
      },
      {
        path: 'itinerario/:idCotizacion/:versionCotizacion',
        component: ItinerarioComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
