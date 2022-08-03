import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cotizacion } from 'src/app/models/Cotizacion';
import { TarifasService } from 'src/app/services/tarifas.service';

@Component({
  selector: 'app-versiones',
  templateUrl: './versiones.component.html',
  styleUrls: ['./versiones.component.css']
})
export class VersionesComponent implements OnInit {
  public versionCotizacion: number = 0;
  public cotizacion: Cotizacion = new Cotizacion();

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private tarifasService: TarifasService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.versionCotizacion = params["versionCotizacion"];
    });
    this.getCotizacion();
  }

  getCotizacion(){
    this.tarifasService.getTarifa('cotizacion').subscribe(cotizacion => this.cotizacion = cotizacion);
  }
}
