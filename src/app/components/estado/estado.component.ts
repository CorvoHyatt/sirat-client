import { Component, OnInit } from '@angular/core';
import { AgentesService } from '../../services/agentes.service';
import { Notificacion } from '../../../app/models/Notificacion';
import { NotificacionesService } from '../../services/notificaciones.service';
declare var $: any;

@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.css']
})
export class EstadoComponent implements OnInit {
  lista_agentes :  any;
  lista_cotizaciones: any;  
  notificacion: Notificacion;
  timeline: any;  
  ayudaTexto: string;


  constructor(private agentesService: AgentesService,
    private notificacionesService: NotificacionesService) 
  { 

  }
  cambioAgente(opcion)
  {
    console.log("cambio",opcion);
    this.agentesService.listCotizacionesByAgente(opcion).subscribe((resCotizaciones: any) => 
    {
      this.lista_cotizaciones = resCotizaciones;
      console.log(this.lista_cotizaciones);
    },err => console.error(err));    
  }  
  cambioAgenteCotizacion(opcion)
  {
    console.log("cambio",opcion);
    this.agentesService.listTimelineByCotizacion(opcion).subscribe((resTimelineCotizacion: any) => 
    {
      this.timeline=resTimelineCotizacion;
      console.log(this.timeline);
    },err => console.error(err));
  }
  darColor(tipo)
  {
    if(tipo==2||tipo==4)
      return "orange"
    if(tipo==3||tipo==5)
      return "blue"
    return "red";

  }
  darIcono(tipo)
  {
    if(tipo==2||tipo==4)
      return "markunread"
    if(tipo==3||tipo==5)
      return "mail_outline"
    return "ac_unit";

  }
  darMes(mes)
  {
    if(mes==1)
      return "enero";
    if(mes==2)
      return "febrero";
    if(mes==3)
      return "marzo";
    if(mes==4)
      return "abril";
    if(mes==5)
      return "mayo";
    if(mes==6)
      return "junio";
    if(mes==7)
      return "julio";
    if(mes==8)
      return "agosto";
    if(mes==9)
      return "septiembre";
    if(mes==10)
      return "octubre";
      if(mes==11)
      return "noviembre";
    if(mes==12)
      return "diciembre";

  }
  darFecha(fechita)
  {
    //console.log(fechita);
    //var cadena = fechita.split("-T", 3); 
    var date = new Date(fechita);

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return day+" de "+this.darMes(monthIndex+1);
  }
  ngOnInit(): void 
  {
    this.ayudaTexto="hola crayola";

    $(document).ready(function(){
      $('select').formSelect();    
      $('.modal').modal();   
   //   $('.tooltipped').tooltip();
   $('.tooltipped').tooltip();

    });
    

    this.agentesService.listAgentes().subscribe((res: any) => 
    {
      this.lista_agentes=res;
      console.log(this.lista_agentes);
      this.agentesService.listCotizacionesByAgente(this.lista_agentes[0].idUsuario).subscribe((resCotizaciones: any) => 
      {
        this.lista_cotizaciones = resCotizaciones;
        console.log(this.lista_cotizaciones);
        this.agentesService.listTimelineByCotizacion(this.lista_cotizaciones[0].idCotizacion).subscribe((resTimelineCotizacion: any) => 
        {
          this.timeline=resTimelineCotizacion;
          console.log(this.timeline);
        },err => console.error(err));
      },err => console.error(err));
    },
    err => console.error(err));

    /*
    this.notificacion = new Notificacion();
    this.notificacion.receptor = 4; //-1 para todos los del área definida, en otro casa el idUsuario
    this.notificacion.asunto = "Probando notificaciones";
    this.notificacion.tipo = 1;// 1.- Tarea pendiente, 2.- Llamada pendiente 3.-Notas
    this.notificacion.prioridad = 3; //1.- Baja, 2.- Media 3.-Alta
    this.notificacion.estatus = 0;//0.- Pendiente, 1.-Finalizada
    this.notificacion.caducidad = "2";//los dias que tiene para hacer la tarea
    this.notificacion.data.tarea = `probando tarea`;
    this.notificacion.emisor = 5;

    this.notificacionesService.create(this.notificacion, 3).subscribe(
      resNotificacion =>  {
        console.log(resNotificacion);

      } );
*/
  }


}
