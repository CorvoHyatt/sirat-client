import { Component, OnInit, ViewChild } from '@angular/core';
import { Ciudad } from 'src/app/models/Ciudad';
import { Continente } from 'src/app/models/Continente';
import { Pais } from 'src/app/models/Pais';
import { ContinentesService } from '../../../services/continentes.service';
import { PaisesService } from '../../../services/paises.service';
import { CiudadesService } from '../../../services/ciudades.service';
declare var $: any;
import Swal from "sweetalert2";
import { ImageUploadComponent, UploadMetadata } from 'angular2-image-upload';
import { ImagenesService } from '../../../services/imagenes.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { CiudadesEditarComponent } from '../ciudades-editar/ciudades-editar.component';
import { Imagen } from '../../../models/Imagen';

@Component({
  selector: 'app-ciudades',
  templateUrl: './ciudades.component.html',
  styleUrls: ['./ciudades.component.css']
})
export class CiudadesComponent implements OnInit {

  @ViewChild('imagenesPortada') imagenesPortadaComponent: ImageUploadComponent;
  @ViewChild('imagenesPortadaE') imagenesPortadaComponentE: ImageUploadComponent;

  @ViewChild('imagenesG2N') imageUploadComponentG2N: ImageUploadComponent;
  @ViewChild('imagenesG3N') imageUploadComponentG3N: ImageUploadComponent;


  @ViewChild('imagenesM1N') imageUploadComponentM1N: ImageUploadComponent;
  @ViewChild('imagenesM2N') imageUploadComponentM2N: ImageUploadComponent;
  @ViewChild('imagenesM3N') imageUploadComponentM3N: ImageUploadComponent;


  @ViewChild('imagenesP1N') imageUploadComponentP1N: ImageUploadComponent;
  @ViewChild('imagenesP2N') imageUploadComponentP2N: ImageUploadComponent;
  @ViewChild('imagenesP3N') imageUploadComponentP3N: ImageUploadComponent;

  @ViewChild('imagenesO1N') imageUploadComponentO1N: ImageUploadComponent;
  @ViewChild('imagenesO2N') imageUploadComponentO2N: ImageUploadComponent;
  @ViewChild('imagenesO3N') imageUploadComponentO3N: ImageUploadComponent;

  ciudad: Ciudad = new Ciudad();
  continentes: Continente[] = [];
  continenteSelecModal: number = 0;
  continenteSelec: number = 0;
  paisesModal: Pais[] = []; //Lista de paises para nuevo y editar
  paisesVista: Pais[] = []; //Lista de paises para nuevo y editar
  paisSelec: number = 0;
  ciudadesByPais: Ciudad[] = [];
  ciudadActual: any = new Ciudad();
  imagenesG: any = [];
  imagenesM: any = [];
  imagenesP: any = [];
  imagenesO: any = [];

  ver = false;
  imagenesPortadaPre: any = [];
  imagenesMPrecargadas: any = [];
  imagenesPPrecargadas: any = [];
  imagenesOPrecargadas: any = [];

  imagenesPortada: any = [];

  // imagenesGE: any = [];
  // imagenesME: any = [];
  // imagenesPE: string[] = [];
  // imagenesOE: string[] = [];


  customStyle = {
    selectButton: {
      "background-color": "#3C9",
      "color": "#fff"
    },
  
    layout: {
      "background-color": "whitesmoke",
      "color": "#9b9b9b",
      "border": "1px dashed #d0d0d0"
    },
   
  }
  
  constructor(
    private continentesService: ContinentesService,
    private paisesService: PaisesService,
    private ciudadesService: CiudadesService,
    private imagenesService: ImagenesService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log("entrando al oninit...");
    $(".modal").modal();
    $("select").formSelect();
    this.getContinentes();
  }

  ngOnChanges() {
    ///** WILL TRIGGER WHEN PARENT COMPONENT UPDATES '**
 
  }


  getContinentes() {
    this.continentesService.list().subscribe((continentes: Continente[]) => {
      this.continentes = continentes;
      this.continenteSelecModal = this.continentes[0].idContinente;
      this.continenteSelec = this.continentes[0].idContinente;
      this.getPaisesModal();
      this.getPaisesVista();
    });
  }

  getPaisesModal() {
    this.paisesService
      .listByIdContinente(this.continenteSelecModal)
      .subscribe((paises: Pais[]) => {
        this.paisesModal = paises;
        this.ciudad.idPais = this.paisesModal[0].id;
      });
  }

  getPaisesVista() {
    this.paisesService
      .listByIdContinente(this.continenteSelec)
      .subscribe((paises: Pais[]) => {
        this.paisesVista = paises;
        this.paisSelec = this.paisesVista[0].id;
        this.getCiudadesByIdPais();
      });
  }

  getCiudadesByIdPais() {
    this.ciudadesService
      .list_porPais(this.paisSelec)
      .subscribe((ciudades: Ciudad[]) => {
        this.ciudadesByPais = ciudades;
        //console.log(this.ciudadesByPais);
      });
  }


  abrirNuevaCiudad() {
    this.ciudad = new Ciudad();
    this.imagenesG = [];
    this.imagenesM = [];
    this.imagenesP = [];

    this.imagenesPortada = [];
 

    this.ciudad.idPais = this.paisesModal[0].id;
    $("#nuevaCiudad").modal("open"); 
  }

  resetImagenes() {
    this.imagenesPortadaComponent.deleteAll();
    this.imagenesPortadaComponentE.deleteAll();

    this.imageUploadComponentM1N.deleteAll();
    this.imageUploadComponentM2N.deleteAll();
    this.imageUploadComponentM3N.deleteAll();

    this.imageUploadComponentP1N.deleteAll();
    this.imageUploadComponentP2N.deleteAll();
    this.imageUploadComponentP3N.deleteAll();

    this.imageUploadComponentO1N.deleteAll();
    this.imageUploadComponentO2N.deleteAll();
    this.imageUploadComponentO3N.deleteAll();

  }
  guardarCiudad() {
    this.ciudadesService.create(this.ciudad).subscribe(
      (resp: any) => {
        this.imagenesService.uploadCiudad([this.imagenesPortada, this.imagenesM, this.imagenesP, this.imagenesO], resp.insertId).subscribe(
          resImg => {

            this.resetImagenes();
            this.getCiudadesByIdPais();
            $("#nuevaCiudad").modal("close");
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Guardado correctamente",
              showConfirmButton: false,
              timer: 1000,
            });
          }
        );
      
      }
    );
  }

  getNombrePais(id: number) {
    return this.paisesVista.find(pais => pais.id == id).nombre;
  }


  editar(idCiudad: number) {
    

    this.ver = false;
    this.ciudadesService.listOneWithContinent(idCiudad).subscribe(
      (ciudad: any) => {
        this.paisesService
          .listByIdContinente(ciudad.idContinente)
          .subscribe((paises: Pais[]) => {
            this.paisesModal = paises;
            this.ciudadActual = ciudad;
            
            this.ciudadesService.listImagenesExistentes(idCiudad, 1).subscribe(
              (portada: any) => {
                console.log(portada);

                this.imagenesPortadaPre = [];
                this.imagenesPortada = [];
                for (let iii = 0; iii < portada.length; iii++){
                  let img = new Imagen();
                  img.nombre = `${environment.API_URI_IMAGES}/portada/${idCiudad}_${iii + 1}.jpg`;
                  this.imagenesPortada.push(img);
                  this.imagenesPortadaPre.push(`"${environment.API_URI_IMAGES}/portada/${idCiudad}_${iii+1}.jpg"`);
                }
                console.log(this.imagenesPortadaPre);
                
                this.ciudadesService.listImagenesExistentes(idCiudad, 2).subscribe(
                  (evento: any) => {
                    console.log(evento);
    
                    this.imagenesMPrecargadas = [];
                    this.imagenesM = [];
                    for (let iii = 1; iii < 4; iii++){
                     
                      if (evento.findIndex(img => Number.parseInt(img.num) == iii) != -1) {
                        this.imagenesMPrecargadas[iii - 1] = [`"${environment.API_URI_IMAGES}/evento/${idCiudad}_${iii}.jpg"`];
                        this.imagenesM[iii - 1] = -1; // la imagen existe
                      } else {
                        this.imagenesMPrecargadas[iii - 1] = [];
                        this.imagenesM[iii - 1] = null; // la imagen no existe
                      }
                    }
                    console.log(this.imagenesM);
                    
                    this.ciudadesService.listImagenesExistentes(idCiudad, 3).subscribe(
                      (daybyday: any) => {
                        console.log(daybyday);
        
                        this.imagenesPPrecargadas = [];
                        this.imagenesP = [];
                        for (let iii = 1; iii < 4; iii++){
                         
                          if (daybyday.findIndex(img => Number.parseInt(img.num) == iii) != -1) {
                            this.imagenesPPrecargadas[iii - 1] = [`"${environment.API_URI_IMAGES}/daybyday/${idCiudad}_${iii}.jpg"`];
                             this.imagenesP[iii - 1] = -1; // la imagen existe
                          } else {
                            this.imagenesPPrecargadas[iii - 1] = [];
                            this.imagenesP[iii - 1] = null; // la imagen no existe
                          }
                        }
                        console.log(this.imagenesP);
                        this.ciudadesService.listImagenesExistentes(idCiudad, 4).subscribe(
                          (opciones: any) => {
                            console.log(opciones);
            
                            this.imagenesOPrecargadas = [];
                            this.imagenesO = [];
                            for (let iii = 1; iii < 4; iii++){
                             
                              if (opciones.findIndex(img => Number.parseInt(img.num) == iii) != -1) {
                                this.imagenesOPrecargadas[iii - 1] = [`"${environment.API_URI_IMAGES}/opciones/${idCiudad}_${iii}.jpg"`];
                                this.imagenesO[iii - 1] = -1; // la imagen existe
                              } else {
                                this.imagenesOPrecargadas[iii - 1] = [];
                                this.imagenesO[iii - 1] = null; // la imagen no existe
                              }
                            }
                            console.log(this.imagenesO);
                            this.ver = true;

                            //this.resetImagenes();
                            $("#editarCiudad").modal("open");

                          }
                        );
                      }
                    );
    
                  }
                );


              }
            );


          });

        
      }
    );
  }

  actualizarCiudad() {
    delete this.ciudadActual.idContinente;

    this.ciudadesService.update(this.ciudadActual).subscribe(
      res => {
        console.log(this.imagenesM);
        this.imagenesService.refreshCiudad([this.imagenesPortada, this.imagenesM, this.imagenesP, this.imagenesO], this.ciudadActual.idCiudad).subscribe(
          resImg => {

            setTimeout(() => { this.imagenesPortadaComponentE.deleteAll();this.ver = false , 0 });
 
            this.getCiudadesByIdPais();
            $("#editarCiudad").modal("close");
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Actualizado correctamente",
              showConfirmButton: false,
              timer: 1000,
            }); 
          });
        
      }
    );
  }


  eliminar(idCiudad) {
    //console.log(idCiudad);

    Swal.fire({
      title: "¿Realmente quieres eliminar esta ciudad?",
      text: "Se eliminaran los traslados, disposiciones de chofer, tours y cualquier otra información relacionada a esta ciudad",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.ciudadesService.delete(idCiudad).subscribe(
          res => {
            this.getCiudadesByIdPais();
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Eliminado correctamente",
              showConfirmButton: false,
              timer: 1000,
            });
          }
        );
      }
    });

    
  }


  onUploadFinished(event, tipo, index) {
    console.log("event onupload", event);
    switch (tipo) {
      case 1:
        let img = new Imagen();
        img.nombre = event.file.name;
        img.src = event.src;

        this.imagenesPortada.push(img);
        console.log("imagenes portada",this.imagenesPortada);
        break;
      case 2:
        this.imagenesM[index] = event;
        console.log(this.imagenesM);
        break;
      case 3:
        this.imagenesP[index] = event;
        console.log(this.imagenesP);
        break;
      case 4:
        this.imagenesO[index] = event;
        console.log(this.imagenesO);
        break;
    }
    // switch (tipo) {
    //   case 1:
    //     this.imagenesG[index] = event;
    //     console.log(this.imagenesG);
    //     break;
    //   case 2:
    //     this.imagenesM[index] = event;
    //     console.log(this.imagenesM);
    //     break;
    //   case 3:
    //     this.imagenesP[index] = event;
    //     console.log(this.imagenesP);
    //     break;
    //   case 4:
    //     this.imagenesO[index] = event;
    //     console.log(this.imagenesO);
    //     break;
    // }
  }




  onRemoved(event, tipo, index) {
    console.log("event remove", event);
    switch (tipo) {
      case 1:
        let nombre = event.file.name.replace(/['"]+/g, '');
        let i = this.imagenesPortada.findIndex(img => img.nombre == nombre);
        console.log(i);
        this.imagenesPortada.splice(i,1);
        console.log(this.imagenesPortada);
        break;
      case 2:
        this.imagenesM[index] = undefined;
        console.log(this.imagenesM);
        break;
      case 3:
        this.imagenesP[index] = undefined;
        console.log(this.imagenesP);
        break;
    }
  }


}