import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AuthService} from '../../services/auth.service';
import { CotizacionesService } from './../../services/cotizaciones.service';
import { OrdenCompraService } from './../../services/orden-compra.services';
import { NotificacionesService } from '../../services/notificaciones.service';
import { Notificacion } from '../../../app/models/Notificacion';

import { Timeline } from "../../../app/models/Timeline";

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ReadStream } from 'fs';

@Component({
  selector: 'app-registrar-orden',
  templateUrl: './registrar-orden.component.html',
  styleUrls: ['./registrar-orden.component.css']
})
export class RegistrarOrdenComponent implements OnInit {

  estado: number;
  timeline: Timeline = new Timeline();
  notificacion: Notificacion;

  constructor(private route: ActivatedRoute,
    private cotizacionesService: CotizacionesService,   
    private ordenCompraService: OrdenCompraService,    
    private authService:AuthService,
    private notificacionesService:NotificacionesService,
    private router: Router) { }

  ngOnInit(): void 
  {    
    this.estado=0;

    this.route.paramMap.subscribe(params => 
      {
        let id=params.get('idCotizacion') ;
        this.authService.decodificarMail(id).subscribe(
          res1  => 
          {
            let idCotizacion= res1 as any;
            console.log(idCotizacion);  
            this.cotizacionesService.updateEstadoAEnviado(idCotizacion,4).subscribe((res: any) => 
            {
                this.timeline = new Timeline();
                this.timeline.idCotizacion = idCotizacion;
                this.timeline.notas = 'Acuse de recibido de la orden de pago de la cotización ';
                this.timeline.tipo = 5;
                this.cotizacionesService.addTimeline(this.timeline).subscribe(res => {});
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: `Regresando a página principal`,
                  showConfirmButton: false,
                  timer: 3000,
                });

                let datos = {
                  'idCotizacion': idCotizacion,
                  'estado': 1
                };
                this.ordenCompraService.update(datos,1).subscribe((resActual: any) => 
                {
                  console.log(resActual);
                  this.cotizacionesService.list_oneResumen(idCotizacion).subscribe((resResumen: any) => 
                  {
                    console.log(resResumen.idUsuario);

                    this.notificacion = new Notificacion();
                    this.notificacion.receptor = 19; //-1 para todos los del área definida, en otro casa el idUsuario
                    this.notificacion.asunto = "Orden de pago aceptada por el cliente";
                    this.notificacion.tipo = 1;// 1.- Tarea pendiente, 2.- Llamada pendiente 3.-Notas
                    this.notificacion.prioridad = 3; //1.- Baja, 2.- Media 3.-Alta
                    this.notificacion.estatus = 0;//0.- Pendiente, 1.-Finalizada
                    this.notificacion.caducidad = "3";//los dias que tiene para hacer la tarea
                    this.notificacion.data.tarea = "Cobrar orden de compra";
                    this.notificacion.data.idCotizacion = idCotizacion;
                    this.notificacion.emisor = resResumen.idUsuario;
                    console.log(this.notificacion);
                
                    this.notificacionesService.create(this.notificacion, 1).subscribe(
                      resNotificacion =>  {
                        console.log(resNotificacion);
                
                      } );
                

                  },err => console.error(err));



                },err => console.error(err));
    



                this.router.navigateByUrl('/#/login');
            },err => console.error(err));
            
          },err => 
          console.error(err));
        });
      }
    }