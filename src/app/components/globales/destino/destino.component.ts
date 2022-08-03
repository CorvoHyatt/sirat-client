import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ciudad } from 'src/app/models/Ciudad';
import { Cotizacion } from 'src/app/models/Cotizacion';
import { Cotiz_dest_version } from 'src/app/models/cotiz_dest_version';
import { Destino } from 'src/app/models/Destino';
import { Pais } from 'src/app/models/Pais';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { DestinosService } from 'src/app/services/destinos.service';
import { PaisesService } from 'src/app/services/paises.service';
import { SendDataToEditService } from 'src/app/services/sendDataToEdit.service';
declare var $: any;

@Component({
  selector: 'app-destino',
  templateUrl: './destino.component.html',
  styleUrls: ['./destino.component.css']
})
export class DestinoComponent implements OnInit {
  public idCotizacion: number = 0;
  public cotizacion: Cotizacion = new Cotizacion();
  public destinos: Destino[] = [];
  public dataAutocomplete: any = [];
  public paises: Pais[] = [];
  public ciudades: Ciudad[] = [];
  public idPais: number = 0;
  public destino: Destino = new Destino();
  public actualRoute: string = '';
  public actualPais: any = null;
  public actualCiudad: any = null;
  public paisesSA: any[] = [];
  public ciudadesSA: any[] = [];

  constructor(
    private router: Router,
    private destinosService: DestinosService,
    private paisesService: PaisesService,
    private ciudadService: CiudadesService,
    private sendDataToEdit: SendDataToEditService,
  ) { }

  ngOnInit(): void {
    let route = this.router.url.split('/');
    this.actualRoute = route[2];
    if(this.actualRoute === 'cotizacionDestinos'){
      this.cotizacion.idCotizacion = parseInt(localStorage.getItem('idCotizacion'));
      this.cotizacion.version = 1;
    }else{
      this.sendDataToEdit.getProduct('cotizacion').subscribe((cotizacion: any) => {
        if(Object.keys(cotizacion).length === 0) return false;
        this.cotizacion = cotizacion;
      });
    }
    this.getPaises();
    $(document).ready(function(){
      $('input.autocomplete-destino').autocomplete({
        data: {
          "Sin datos": null,
        },
      });
    }) ;
  }
 
  getPaises() {
    this.paisesService.list().subscribe((resp: Pais[]) => {
      this.paisesSA = resp;
      for(let i=0; i<this.paisesSA.length; i++){
        this.paisesSA[i].nombre = this.paisesSA[i].nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      }

      this.paisesService.list().subscribe((resp: Pais[]) => {
        this.paises = resp;
        this.paises = this.paises.concat(this.paisesSA);
        let datos = '{';
        for (const ll of this.paises) {
          if (datos === '{')
            datos += '"' + ll.nombre + '": ""';
          else
            datos += ',"' + ll.nombre + '": ""';
        }
        
        datos += '}';
        this.dataAutocomplete = JSON.parse(datos);
        $('input#autocomplete_pais').autocomplete({
          data: this.dataAutocomplete,
          onAutocomplete: ( paisSelected ) => {
            this.actualPais = this.paises.find((pais) => pais.nombre === paisSelected );
            if(this.actualPais){
              this.getCiudad(this.actualPais.id);
            }
          }
        });
      });
    });
  }

  getCiudad(idPais: number) {
    console.log('Entre');
    this.ciudadService.list_porPais(idPais).subscribe((resp: Ciudad[]) => {
      this.ciudadesSA = resp;
      for(let i=0; i<this.ciudadesSA.length; i++){
        this.ciudadesSA[i].nombre = this.ciudadesSA[i].nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      }
      this.ciudadService.list_porPais(idPais).subscribe((resp: Ciudad[]) => {
        this.ciudades = resp;
        this.ciudades = this.ciudades.concat(this.ciudadesSA);
        let datos = '{';
        for (const ll of this.ciudades) {
          if (datos === '{')
            datos += '"' + ll.nombre + '": ""';
          else
            datos += ',"' + ll.nombre + '": ""';
        }
        datos += '}';
        this.dataAutocomplete = JSON.parse(datos);
        $('input#completarCiudad').autocomplete({
          data: this.dataAutocomplete,
          onAutocomplete: (ciudadSelected) => {
            this.actualCiudad = this.ciudades.find((ciudad) => ciudad.nombre === ciudadSelected);
            if(this.actualCiudad){
              this.destino.idCiudad = this.actualCiudad.idCiudad;
            }
          }
        });
      });
    });
  }

  insertarDestino() {
    if (this.destino.idCiudad !== 0) {
      let dtno: any = new Destino();
      dtno.idCiudad = this.destino.idCiudad;
      dtno.idCotizacion = this.cotizacion.idCotizacion;
      dtno.versionCotizacion = this.cotizacion.version;
      switch(this.actualRoute){
        case 'nuevaVersion':
        case 'ordenCompra':
          dtno.pais = this.actualPais.nombre;
          dtno.idPais = this.actualPais.id;
          dtno.ciudad = this.actualCiudad.nombre;
          dtno.productos = [];
          this.destinosService.sendNuevoDestinoNV(dtno);
        break;
        default:
          dtno.versionCotizacion = this.cotizacion.version;
          this.destinosService.create(dtno).subscribe((resp: any) => {
            this.destino = resp;
            this.destinosService.setActualDestino(this.destino);
            this.destinosService.setNuevoDestino(this.destino);
            if(this.actualRoute && this.actualRoute === 'cotizacionDestinos'){
              this.router.navigate([`home/cotizacionProductos`]);
            }
          });
        break;
      }
      $('#modalDestino').modal('close');
      $('#modalDestinoVersiones').modal('close');
    }
    setTimeout(() => {
      $('#autocomplete_pais').val("");
      $('#completarCiudad').val("");
    }, 0);
  }
}
