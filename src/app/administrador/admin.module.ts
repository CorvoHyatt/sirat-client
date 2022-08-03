//MÓDULOS
import { LOCALE_ID, NgModule } from "@angular/core";
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AdminRoutingModule } from './admin-routing.module';
import  localeEs from '@angular/common/locales/es-MX'
import { ImageUploadModule } from "angular2-image-upload";
import {
    MatDialogModule,
    MAT_DIALOG_DEFAULT_OPTIONS,
} from "@angular/material/dialog";
  
registerLocaleData(localeEs, 'es-MX');


//COMPONENTES
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
import { CiudadesComponent } from './components/ciudades/ciudades.component';


//PROVIDERS
import { HelperAuthService } from './services/helperAuth.service';
import { PaisesComponent } from './components/paises/paises.component';
import { ToursPrivadosEnGrupoComponent } from './components/tours-privados-en-grupo/tours-privados-en-grupo.component';
import { ActividadesComponent } from './components/actividades/actividades.component';
import { VehiculosComponent } from './components/vehiculos/vehiculos.component';
import { AgenciasComponent } from './components/agencias/agencias.component';
import { AgentesComponent } from './components/agentes/agentes.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { JerarquiasComponent } from './components/jerarquias/jerarquias.component';
import { ProcesarTrasladosComponent } from './components/procesar-traslados/procesar-traslados.component';
import { ProcesarDisposicionesComponent } from './components/procesar-disposiciones/procesar-disposiciones.component';
import { CanActivateViaAuthAdminGuard } from "./guard/canActivateViaAuth.guardAdmin.guard";
import { ProcesarExcelComponent } from './components/procesar-excel/procesar-excel.component';
import { CiudadesEditarComponent } from './components/ciudades-editar/ciudades-editar.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AreasComponent } from './components/areas/areas.component';

@NgModule({
    declarations: [
        AdminComponent,
        DisposicionesComponent,
        TrasladosComponent,
        ToursPrivadosApieComponent,
        ToursPrivadosEntransporteComponent,
        HotelComponent,
        TrenesComponent,
        VuelosComponent,
        ExtrasComponent,
        HomeComponent,
        PaisesComponent,
        ToursPrivadosEnGrupoComponent,
        ActividadesComponent,
        CiudadesComponent,
        VehiculosComponent,
        AgenciasComponent,
        AgentesComponent,
        NavigationComponent,
        UsuariosComponent,
        JerarquiasComponent,
        ProcesarTrasladosComponent,
        ProcesarDisposicionesComponent,
        ProcesarExcelComponent,
        CiudadesEditarComponent,
        AreasComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        HttpClientModule,
        AdminRoutingModule,
        ImageUploadModule.forRoot(),
        MatDialogModule,
        MatTableModule,
        MatPaginatorModule

    ],
    providers: [
        HelperAuthService,
        {
            provide: LOCALE_ID, useValue: 'es-MX'
        },
        CiudadesComponent,
        {
          provide: MAT_DIALOG_DEFAULT_OPTIONS,
          useValue: { hasBackdrop: false },
        },
    
        CanActivateViaAuthAdminGuard
    ],
    entryComponents: [
        CiudadesEditarComponent
    ]
})

export class AdminModule {}