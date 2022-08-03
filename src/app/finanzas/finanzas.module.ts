//MÓDULOS
import { LOCALE_ID, NgModule } from "@angular/core";
import { CommonModule, registerLocaleData, DatePipe, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { MomentModule } from 'angular2-moment';
import  localeEs from '@angular/common/locales/es-MX'
import { FinanzasRoutingModule } from "./finanzas-routing.module";
import { CanActivateViaAuthFinanzasGuard } from "./guard/canActivateViaAuth.guardFinanzas.guard";
import { ListadoVentasComponent } from './components/listado-ventas/listado-ventas.component';
import { HomeComponent } from './components/home/home.component';
import { FinanzasComponent } from "./finanzas.component";
import { DetalleVentaComponent } from './components/detalle-venta/detalle-venta.component';
import { ProductosVentaComponent } from './components/productos-venta/productos-venta.component';
  
registerLocaleData(localeEs, 'es-MX');

@NgModule({
    declarations: [
        FinanzasComponent,
        ListadoVentasComponent,
        HomeComponent,
        DetalleVentaComponent,
        ProductosVentaComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        HttpClientModule,
        FinanzasRoutingModule,
        MomentModule
    ],
    providers: [
        // HelperAuthService,
        {
            provide: LOCALE_ID, useValue: 'es-MX'
        },
        DatePipe,
        CurrencyPipe,
        CanActivateViaAuthFinanzasGuard
    ]
})

export class FinanzasModule {}