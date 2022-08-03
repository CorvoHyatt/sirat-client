import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

import { AdminComponent } from './admin.component';
import { DisposicionesComponent } from './components/disposiciones/disposiciones.component';
import { TrasladosComponent } from './components/traslados/traslados.component';
import { ToursPrivadosApieComponent } from './components/tours-privados-apie/tours-privados-apie.component';
import { ToursPrivadosEntransporteComponent } from './components/tours-privados-entransporte/tours-privados-entransporte.component';
import { HotelComponent } from './components/hotel/hotel.component';
import { TrenesComponent } from './components/trenes/trenes.component';
import { VuelosComponent } from './components/vuelos/vuelos.component';
import { ExtrasComponent } from './components/extras/extras.component';
import { HomeComponent } from './components/home/home.component';
import { PaisesComponent } from './components/paises/paises.component';
import { ToursPrivadosEnGrupoComponent } from './components/tours-privados-en-grupo/tours-privados-en-grupo.component';
import { ActividadesComponent } from './components/actividades/actividades.component';
import { CiudadesComponent } from './components/ciudades/ciudades.component';
import { VehiculosComponent } from './components/vehiculos/vehiculos.component';
import { AgenciasComponent } from './components/agencias/agencias.component';
import { AgentesComponent } from './components/agentes/agentes.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { JerarquiasComponent } from './components/jerarquias/jerarquias.component';
import { ProcesarTrasladosComponent } from './components/procesar-traslados/procesar-traslados.component';
import { ProcesarDisposicionesComponent } from './components/procesar-disposiciones/procesar-disposiciones.component';
import { CanActivateViaAuthAdminGuard } from './guard/canActivateViaAuth.guardAdmin.guard';
import { ProcesarExcelComponent } from './components/procesar-excel/procesar-excel.component';
import { AreasComponent } from './components/areas/areas.component';

const adminRoutes: Routes = [
    {
      path: 'administrador',
      canActivate: [CanActivateViaAuthAdminGuard],
      component: AdminComponent,
      children: [
          { path: '', component: HomeComponent },
          { path: 'disposiciones', component: DisposicionesComponent },
          { path: 'traslados', component: TrasladosComponent },
          { path: 'tours-privados-a-pie', component: ToursPrivadosApieComponent },
          { path: 'tours-privados-en-transporte', component: ToursPrivadosEntransporteComponent },
          { path: 'hotel', component: HotelComponent },
          { path: 'trenes', component: TrenesComponent },
          { path: 'vuelos', component: VuelosComponent },
          { path: 'extras', component: ExtrasComponent },
          { path: 'paises', component: PaisesComponent },
          { path: 'tours-en-grupo', component: ToursPrivadosEnGrupoComponent },
          { path: 'actividades', component: ActividadesComponent },
          { path: 'ciudades', component: CiudadesComponent },
          { path: 'vehiculos', component: VehiculosComponent },
          { path: 'areas', component: AreasComponent },
          { path: 'agencias', component: AgenciasComponent },
          { path: 'agentes', component: AgentesComponent },
          { path: 'usuarios', component: UsuariosComponent },
          { path: 'jerarquias', component: JerarquiasComponent },
          { path: 'procesarTraslados', component: ProcesarTrasladosComponent },
          { path: 'procesarDisposiciones', component: ProcesarDisposicionesComponent },
          { path: 'procesarExcel', component: ProcesarExcelComponent }
      ]
    }
];
    
@NgModule({
    imports: [RouterModule.forRoot(adminRoutes)],
exports: [RouterModule]
})
export class AdminRoutingModule { }