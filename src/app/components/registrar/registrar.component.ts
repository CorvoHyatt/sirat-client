import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AuthService} from '../../services/auth.service';
import { CotizacionesService } from './../../services/cotizaciones.service';
import { Timeline } from "../../../app/models/Timeline";

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
  estado: number;
  timeline: Timeline = new Timeline();

  constructor(private route: ActivatedRoute,
    private cotizacionesService: CotizacionesService,    
    private authService:AuthService,
    private router: Router) { }

  ngOnInit(): void 
  {    
    this.estado=0;

    this.route.paramMap.subscribe(params => 
      {
        let id=params.get('idCotizacion') ;
        console.log("cotizacion",id);

        let versionCotizacion=params.get('versionCotizacion') ;
        console.log("version",versionCotizacion);
    this.authService.decodificarMail(id).subscribe(
        res1  => 
          {
            console.log("cotizacion",res1);
            let idCotizacion= res1 as any;


            this.cotizacionesService.updateEstadoAEnviado(idCotizacion,100).subscribe((res: any) => 
            {
              this.timeline = new Timeline();
              this.timeline.idCotizacion = idCotizacion;
              this.timeline.notas = 'Acuse de recibido de la cotización V'+versionCotizacion;
              this.timeline.tipo = 3;
              this.cotizacionesService.addTimeline(this.timeline).subscribe(res => {});

              this.estado=res['affectedRows'];
              console.log(this.estado);        
              Swal.fire({
                position: "center",
                icon: "success",
                title: `Regresando a página principal`,
                showConfirmButton: false,
                timer: 3000,
              });
              this.router.navigateByUrl('/#/login');


            },err => console.error(err));
            

          },err => 
        console.error(err));

      });
  }

}
