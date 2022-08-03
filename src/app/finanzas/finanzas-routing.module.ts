import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { CanActivateViaAuthFinanzasGuard } from './guard/canActivateViaAuth.guardFinanzas.guard';
import { FinanzasComponent } from './finanzas.component';
import { ListadoVentasComponent } from './components/listado-ventas/listado-ventas.component';
import { HomeComponent } from './components/home/home.component';
import { DetalleVentaComponent } from './components/detalle-venta/detalle-venta.component';
import { ProductosVentaComponent } from './components/productos-venta/productos-venta.component';

const finanzasRoutes: Routes = [
    { 
        path: "",
        redirectTo: "/login",
        pathMatch: "full" 
    },
    {
      path: 'finanzas',
      canActivate: [CanActivateViaAuthFinanzasGuard],
      component: FinanzasComponent,
      children: [
          { path: 'inicio', component: HomeComponent },
          { path: 'ventas', component: ListadoVentasComponent },
          { path: 'detalle-venta/:idCotizacion', component: DetalleVentaComponent },
          { path: 'productos-venta/:idCotizacion/:version', component: ProductosVentaComponent },
      ]
    }
];
    
@NgModule({
    imports: [RouterModule.forRoot(finanzasRoutes, { useHash: true })],
    exports: [RouterModule]
})
export class FinanzasRoutingModule { }