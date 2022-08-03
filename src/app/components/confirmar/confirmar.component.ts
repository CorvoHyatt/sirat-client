import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Notificacion } from 'src/app/models/Notificacion';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-confirmar',
  templateUrl: './confirmar.component.html',
  styleUrls: ['./confirmar.component.css']
})
export class ConfirmarComponent implements OnInit {


  token: string = "";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private usuariosService: UsuariosService,
    private notificacionesService: NotificacionesService
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => 
      {
 
     
       let id=params.get('id') ;
       console.log("id");
       console.log(id);
       this.token=id;
       
       this.authService.decodificarMail(id).subscribe(
         (res1: any)  => 
         {
           console.log(res1);

           this.usuariosService.update_estatusPorRegistrar(res1, 1).subscribe(
             res2 => {
               let notificacion = new Notificacion();
               notificacion.receptor = -1; //Todos los del area
                    notificacion.asunto = "Usuario nuevo se ha registrado, apruebalo";
                    notificacion.tipo = 1;
                    notificacion.prioridad = 3;
                    notificacion.estatus = 0;
                    notificacion.caducidad = "3";
                    notificacion.data.tarea = ` El usuario ${res1} se ha registrado y espera por confirmación`;
                    notificacion.emisor = 2;
      
      
                    this.notificacionesService.create(notificacion, 2).subscribe( //2 es el id del area de admin
                      res => {
                        Swal.fire({
                          position: "center",
                          icon: "success",
                          title: "Verificado correctamente",
                          text: "Se ha verificado su correo correctamente ahora solo espera al que el administrador del sistema confirme su ingreso",
                          showConfirmButton: true,
                        }).then((result) => {
                          if(result.isConfirmed){
                            this.router.navigate(['/login']);
                          }
                        });
                      }
                    );
             }
           );


        //  console.log(res1);
        //  this.registroChofer.correo=res1.correo;
        //  console.log("this.registroChofer");        
        //  console.log(this.registroChofer);
        //  this.authService.mailPorProbar(this.registroChofer).subscribe(
        //    res2  => 
        //    {
             
      //            console.log("viene de mail por probar");
      //            if(res2.res==0)
      //            {
      //              this.choferService.listOne(this.registroChofer.correo).subscribe(
      //                (choferRes: Chofer) => {
      //                  console.log(choferRes);
      //                  if (choferRes[0].idioma == 1) {
      //                    this.translate.use("en");
      //                    this.confirmarTexto="This account was already active, to access it, you must log in!!!";
      //                  } else {
      //                    this.translate.use("es");
      //                    this.confirmarTexto="Esta cuenta ya estaba activa, para accesar a ella, deberás loguearte!!!";
      //                  }
      //                });
   
                  
      //            }
      //            else if(res2.res==1)
      //            {
      //              this.choferService.listOne(this.registroChofer.correo).subscribe(
      //                (choferRes: Chofer) => {
      //                  console.log(choferRes);
      //                  if (choferRes[0].idioma == 1) {
      //                    this.translate.use("en");
      //                    this.confirmarTexto = "Congratulations! Your account has been successfully created";
      //                  } else {
      //                    this.translate.use("es");
      //                    this.confirmarTexto = "¡Felicidades! Su cuenta de thelocalchauffeur ha sido creada correctamente";
      //                  }
      //                  console.log("res2.res==1");
      //                  localStorage.setItem('token',this.token);
      //                  localStorage.setItem('correo',this.registroChofer.correo);
           
                                 
      //                });
                   
 
                   
              
      //            }
      //            console.log(res2);
             
             
          
      //    },err => 
      //    console.error(err)
      //  );
       },err => 
         console.error(err)
       );
 
     });

    
  }

}
