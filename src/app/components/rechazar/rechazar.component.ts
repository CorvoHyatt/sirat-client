import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AuthService} from '../../services/auth.service';

import { CotizacionesService } from './../../services/cotizaciones.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-rechazar',
  templateUrl: './rechazar.component.html',
  styleUrls: ['./rechazar.component.css']
})
export class RechazarComponent implements OnInit {

  estado: number;
  constructor(private route: ActivatedRoute,
    private cotizacionesService: CotizacionesService,    
    private authService:AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.estado=0;
    this.route.paramMap.subscribe(params => 
      {
        let id=params.get('idCotizacion') ;
        console.log("id");
        console.log(id); 
        this.authService.decodificarMail(id).subscribe(
        res1  => 
          {
            let idCotizacion= res1['idCotizacion'];
            this.cotizacionesService.updateEstadoAEnviado(idCotizacion,2).subscribe((res: any) => 
            {
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

            },
              err => console.error(err)
            );

          },err => 
        console.error(err));

      });
  }

}
