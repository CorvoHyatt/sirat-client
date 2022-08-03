import { Component, OnInit, DoCheck } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CiudadesService } from './../../../services/ciudades.service';
import { Ciudad } from './../../../models/Ciudad';
import { Pais } from './../../../models/Pais';
import { Divisa } from './../../../models/Divisa';
import { Traslado } from './../../../models/Traslado';
import { Traslado_costo } from './../../../models/Traslado_costo';
import { PaisesService } from './../../../services/paises.service';
import * as M from 'materialize-css/dist/js/materialize';
import { DivisasService } from './../../../services/divisas.service';
import { LugaresService } from './../../../services/lugares.service';
import { Vehiculo } from './../../../models/Vehiculo';
import { VehiculosService } from './../../../services/vehiculos.service';
import { Incremento } from './../../../models/incremento';
import { TrasladosService } from './../../../services/traslados.service';
import { TrasladosCostosService } from 'src/app/services/traslados-costos.service';
import { IncrementosService } from './../../../services/incrementos.service';
import { Continente } from 'src/app/models/Continente';
import { ContinentesService } from 'src/app/services/continentes.service';
import { Lugar } from 'src/app/models/Lugar';
import { IncrementoFecha } from 'src/app/models/incrementoFecha';
import { incrementoHora } from 'src/app/models/IncrementoHora';
import Swal from "sweetalert2";
import { threadId } from 'worker_threads';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { Notificacion } from '../../../models/Notificacion';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from 'src/app/models/Usuario';
import { NotificacionesService } from '../../../services/notificaciones.service';

declare var $: any;

@Component({
  selector: 'app-traslados',
  templateUrl: './traslados.component.html',
  styleUrls: ['./traslados.component.css']
})
export class TrasladosComponent implements OnInit {
 
  dataAutocomplete: any = [];
  paises: Pais[] = [];
  ciudades: Ciudad[] = [];
  idPais: number = 0;
  usuario: Usuario = new Usuario();

  continenteSeleccionado: number = -1;
  paisSeleccionado: number = -1;
  ciudadSeleccionada: number = -1;
  continentes: Continente[] = [];
  paisesByContinente: Pais[] = [];
  ciudadesByPais: Ciudad[] = [];
  divisa: number = 0;
  traslado: Traslado = new Traslado();
  lugares: Lugar[] = [];
  divisas: Divisa[] = [];
  costoNuevo: Traslado_costo = new Traslado_costo();
  vehiculos: Vehiculo[] = [];
  costos: Traslado_costo[] = [];
  incremento: Incremento = new Incremento();
  incrementosFecha: IncrementoFecha[] = [];
  incrementosHoras: incrementoHora[] = [];
  incrementoHora: incrementoHora = new incrementoHora();
  incrementoFecha: IncrementoFecha = new IncrementoFecha();
  incrementos: any[][] = [];
  incrementoHoraEditar: incrementoHora = new incrementoHora();
  incrementoFechaEditar: IncrementoFecha = new IncrementoFecha();
  traslados: any[] = [];
  trasladoActual: any = {};
  incrementosFechasList: any[][] = [];
  incrementosHorasList: any[][] = [];
  dataDivisa: any = [];
  esAgente: boolean = false;
  notificacion: Notificacion = new Notificacion();


  constructor(
    private paisesService: PaisesService,
    private ciudadService: CiudadesService,
    private lugaresService: LugaresService,
    private divisasService: DivisasService,
    private vehiculosService: VehiculosService,
    private continentesService: ContinentesService,
    private trasladosService: TrasladosService,
    private incrementosService: IncrementosService,
    private trasladosCostosService: TrasladosCostosService,
    private usuariosService: UsuariosService,
    private notificacionesService: NotificacionesService
  ) {}

  ngOnInit(): void {
    $(".modal").modal();
    $("select").formSelect();
    // console.log(localStorage.getItem("privilegios"));

    (localStorage.getItem("privilegios") == "1") ? this.esAgente = true : this.esAgente = false;

    this.getContinentes();
    this.getPaises();
    this.getLugares();
    this.getDivisas();
    this.getVehiculos();

  }

  getContinentes() {
    // console.log("***getContinentes***");
    this.continentesService.listTraslados().subscribe((continentes: Continente[]) => {
      this.continentes = continentes;
      this.continenteSeleccionado = this.continentes[0].idContinente;
      this.getPaisesByIdContinente();
    });
  }

  getPaisesByIdContinente() {
    // console.log("***getPaisesByIdContinente***");
    // console.log(this.continenteSeleccionado);
    this.paisesService
      .listTraslados(this.continenteSeleccionado)
      .subscribe((paises: Pais[]) => {
        this.paisesByContinente = paises;
        // console.log(this.paisesByContinente);
        this.paisSeleccionado = this.paisesByContinente[0].id;
        this.getCiudadesByIdPais();
      }); 
  }

  getCiudadesByIdPais() {
    this.ciudadService
      .list_porPaisTraslados(this.paisSeleccionado)
      .subscribe((ciudades: Ciudad[]) => {
        this.ciudadesByPais = ciudades;
        this.ciudadSeleccionada = -1;
        // console.log(this.ciudadesByPais);
         this.getTraslados();
      });
  }


  abrirAgregarTraslado() {
    this.costos = [];
    this.incrementos = [];
    $("#modalAgregarTraslado").modal("open");
  }

  getPaises() {
    this.paisesService.list().subscribe((resp: Pais[]) => {
      this.paises = resp;

      let datos = "{";
      for (const ll of this.paises) {
        if (datos === "{") datos += '"' + ll.nombre + '": ""';
        else datos += ',"' + ll.nombre + '": ""';
      }
      datos += "}";
      this.dataAutocomplete = JSON.parse(datos);

      $("#autocomplete_pais").autocomplete({
        data: this.dataAutocomplete,
        onAutocomplete: () => {
          let destino = null;
          let tmp: any = document.getElementById("autocomplete_pais");
          tmp = tmp.value;

          //   console.log(tmp.value);
          for (const id of this.paises) {
            if (id.nombre === tmp) {
              destino = id.id;
            }
          }
          if (destino != null) {
            this.idPais = destino;

            this.getCiudad();
          }
        },
      });

      $("#autocomplete_paisEditar").autocomplete({
        data: this.dataAutocomplete,
        onAutocomplete: () => {
          let destino = null;
          let tmp: any = document.getElementById("autocomplete_paisEditar");
          tmp = tmp.value;

          //   console.log(tmp.value);
          for (const id of this.paises) {
            if (id.nombre === tmp) {
              destino = id.id;
            }
          }
          if (destino != null) {
            this.idPais = destino;

            this.getCiudad();
          }
        },
      });
    });
  }


  getCiudad() {
    this.ciudadService.list_porPais(this.idPais).subscribe((resp: Ciudad[]) => {
      this.ciudades = resp;
      let datos = "{";
      for (const ll of this.ciudades) {
        if (datos === "{") datos += '"' + ll.nombre + '": ""';
        else datos += ',"' + ll.nombre + '": ""';
      }
      datos += "}";
      this.dataAutocomplete = JSON.parse(datos);

      $("#autocomplete_ciudad").autocomplete({
        data: this.dataAutocomplete,
        onAutocomplete: () => {
          let idCiudad = null;
          let tmp: any = document.getElementById("autocomplete_ciudad");
          tmp = tmp.value;
          for (const id of this.ciudades) {
            if (id.nombre === tmp) {
              idCiudad = id.idCiudad;
            }
          }
          if (idCiudad != null) {
            this.traslado.idCiudad = idCiudad;
          }
        },
      });

      $("#autocomplete_ciudadEditar").autocomplete({
        data: this.dataAutocomplete,
        onAutocomplete: () => {
          let idCiudad = null;
          let tmp: any = document.getElementById("autocomplete_ciudadEditar");
          tmp = tmp.value;
          for (const id of this.ciudades) {
            if (id.nombre === tmp) {
              idCiudad = id.idCiudad;
            }
          }
          if (idCiudad != null) {
            this.traslado.idCiudad = idCiudad;
          }
        },
      });
    });
  }

  getLugares() {
    this.lugaresService.list().subscribe((lugares: Lugar[]) => {
      this.lugares = lugares;
      let datos = "{";
      for (const ll of this.lugares) {
        if (datos === "{") datos += '"' + ll.nombre + '": ""';
        else datos += ',"' + ll.nombre + '": ""';
      }
      datos += "}";

      this.dataAutocomplete = JSON.parse(datos);

      $("#autocomplete_desdeNuevo").autocomplete({
        data: this.dataAutocomplete,
        onAutocomplete: () => {
          let idLugar = null;
          let tmp: any = document.getElementById("autocomplete_desdeNuevo");
          tmp = tmp.value;
          for (const id of this.lugares) {
            if (id.nombre === tmp) {
              idLugar = id.idLugar;
            }
          }
          if (idLugar != null) {
            this.traslado.idDesde = idLugar;
          }
        },
      });

      $("#autocomplete_haciaNuevo").autocomplete({
        data: this.dataAutocomplete,
        onAutocomplete: () => {
          let idLugar = null;
          let tmp: any = document.getElementById("autocomplete_haciaNuevo");
          tmp = tmp.value;
          for (const id of this.lugares) {
            if (id.nombre === tmp) {
              idLugar = id.idLugar;
            }
          }
          if (idLugar != null) {
            this.traslado.idHacia = idLugar;
          }
        },
      });

      $("#autocomplete_desdeEditar").autocomplete({
        data: this.dataAutocomplete,
        onAutocomplete: () => {
          let idLugar = null;
          let tmp: any = document.getElementById("autocomplete_desdeEditar");
          tmp = tmp.value;
          for (const id of this.lugares) {
            if (id.nombre === tmp) {
              idLugar = id.idLugar;
            }
          }
          if (idLugar != null) {
            this.traslado.idDesde = idLugar;
          }
        },
      });

      $("#autocomplete_haciaEditar").autocomplete({
        data: this.dataAutocomplete,
        onAutocomplete: () => {
          let idLugar = null;
          let tmp: any = document.getElementById("autocomplete_haciaEditar");
          tmp = tmp.value;
          for (const id of this.lugares) {
            if (id.nombre === tmp) {
              idLugar = id.idLugar;
            }
          }
          if (idLugar != null) {
            this.traslado.idDesde = idLugar;
          }
        },
      });
    });
  }


  getDivisas() {
    this.divisasService.getAll().subscribe((divisas: Divisa[]) => {
      this.divisas = divisas;
      let datos = "{";
      for (const ll of this.divisas) {
        if (datos === "{") datos += '"' + ll.divisa + '": ""';
        else datos += ',"' + ll.divisa + '": ""';
      }
      datos += "}";
      this.dataAutocomplete = JSON.parse(datos);
      this.dataDivisa = this.dataAutocomplete;
      $("#autocomplete_divisa").autocomplete({
        data: this.dataAutocomplete,
        onAutocomplete: () => {
          let idDivisa = null;
          let divisa = null;
          let tmp: any = document.getElementById("autocomplete_divisa");
          tmp = tmp.value;
          for (const id of this.divisas) {
            if (id.divisa === tmp) {
              idDivisa = id.idDivisa;
              divisa = id.divisa;
            }
          }
          if (idDivisa != null) {
            this.divisa = idDivisa;
          }
        },
      });

      $("#autocomplete_divisaEditar").autocomplete({
        data: this.dataAutocomplete,
        onAutocomplete: () => {
          let idDivisa = null;
          let tmp: any = document.getElementById(
            "autocomplete_divisaEditar"
          );
          tmp = tmp.value;
          for (const id of this.divisas) {
            if (id.divisa === tmp) {
              idDivisa = id.idDivisa;
            }
          }
          if (idDivisa != null) {
            this.divisa = idDivisa;          }
        },
      });
    });
  }

  getVehiculos() {
    this.vehiculosService.list().subscribe((vehiculos: Vehiculo[]) => {
      this.vehiculos = vehiculos;
      this.costoNuevo.idVehiculo = this.vehiculos[0].idVehiculo;
    });
  }

  agregarCostoNuevo() {
  
      this.costos.push(this.costoNuevo);
      this.costoNuevo = new Traslado_costo();
      this.costoNuevo.idVehiculo = this.vehiculos[0].idVehiculo;
    
  }

  getNombreVehiculo(idVehiculo) {
    return this.vehiculos.find((vehiculo) => vehiculo.idVehiculo == idVehiculo)
      .nombre;
  }

  eliminarCosto(index) {
    this.costos.splice(index, 1);
  }


  eliminarIncrementoFecha(ii) {
    this.incrementosFecha.splice(ii, 1);
  }

  agregarIncremento() {
    this.incremento.tipoActividad = 2; //Indica que viene de la tabla disposiciones
    if (this.incremento.tipo == 1) {
      this.incrementos.push([this.incremento, this.incrementosHoras]);
    } else {
      this.incrementos.push([this.incremento, this.incrementosFecha]);
    }
    this.incremento = new Incremento();
    this.incrementosHoras = [];
    this.incrementosFecha = [];
    //console.log(this.incrementos);
  }
  resetIncrementos() {
    this.incrementosFecha = [];
    this.incrementosHoras = [];
  }

  eliminarIncremento(ii) {
    this.incrementos.splice(ii, 1);
  }

  agregarFechaDetalle() {
    let regexp = /^(\d{1,2})-(\d{1,2})$/;
    if (regexp.test(this.incrementoFecha.fechaInicial)) {
      if (regexp.test(this.incrementoFecha.fechaFinal)) {
        this.incrementosFecha.push(this.incrementoFecha);
        this.incrementoFecha = new IncrementoFecha();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            "El formato de fecha final introducido no coincide con el indicado (dd-mm)",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "El formato de fecha inicial introducido no coincide con el indicado (dd-mm)",
      });
    }
  }

  agregarHoraDetalle() {
    this.incrementosHoras.push(this.incrementoHora);
    this.incrementoHora = new incrementoHora();
    //console.log(this.incrementosHoras);
  }


  agregarTraslado() {

    if (this.esValido()) {
      this.trasladosService.create(this.traslado, this.costos, this.divisa).subscribe(
        (idTraslado: number) => {
          this.incrementosService
            .create_list(this.incrementos, idTraslado)
            .subscribe((res3: any) => {
              this.getTraslados();
              this.traslado = new Traslado();
              this.costos = [];
              this.divisa = 0;

              $("#modalAgregarTraslado").modal("close");
              $('#autocomplete_pais').val("");
              $('#autocomplete_ciudad').val("");
              $('#autocomplete_desdeNuevo').val("");
              $('#autocomplete_haciaNuevo').val("");
              $('#autocomplete_divisa').val("");


              if (this.esAgente) {
  
                // this.usuariosService.list_oneByCorreo(localStorage.getItem("correo")).subscribe((usuario: Usuario)=>{
                this.usuariosService.getUser().subscribe(usuario => {
                  if(Object.keys(usuario).length === 0) return false;
                  this.usuario = usuario;
                  let pais: any = document.getElementById("autocomplete_pais");
                  pais = pais.value;
    
                  let ciudad: any = document.getElementById("autocomplete_ciudad");
                  ciudad = ciudad.value;

                  this.notificacion = new Notificacion();
                  this.notificacion.receptor = -1; //Todos los del area
                  this.notificacion.asunto = "Traslado nuevo agregado por Agente de ventas";
                  this.notificacion.tipo = 1;
                  this.notificacion.prioridad = 3;
                  this.notificacion.estatus = 0;
                  this.notificacion.caducidad = "3";
                  this.notificacion.data.tarea = ` El agente ${this.usuario.nombre} ha agregado un nuevo traslado en ${ciudad}-${pais} porfavor completa la información`;
                  this.notificacion.emisor = this.usuario.idUsuario;


                  this.notificacionesService.create(this.notificacion, 2).subscribe(
                    res => {
                      Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Guardado correctamente",
                        text: "Se ha notificado al área de productos que complete la información de este traslado",
                        showConfirmButton: false,
                        timer: 5000,
                      });
                    }
                  );
                });
              } else {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Guardado correctamente",
                  showConfirmButton: false,
                  timer: 1000,
                });
              }
              
  
             });
        }
      );
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Faltan alguno de los campos obligatorios",
        showConfirmButton: true,
      });
    }
    
    
  }

  getTraslados() {
    // console.log("***getTraslados()***");
    // console.log(this.paisSeleccionado);
    // console.log(this.ciudadSeleccionada);
    this.trasladosService
      .listByPaisCiudad_vista(this.paisSeleccionado, this.ciudadSeleccionada)
      .subscribe((traslados: any[]) => {
        this.traslados = traslados;
        // console.log(this.traslados);
      });
  }


  verDetalles(traslado) {
    this.costos = [];
    this.trasladoActual = traslado;
    this.trasladosCostosService.listByIdTraslado(traslado.idTraslado).subscribe(
      (resp: any) => {
        this.costos = resp;
        console.log(this.costos);
        this.incrementosService
        .listFecha_ByIdActividadTipoActividad(traslado.idTraslado, 2)
        .subscribe((res1: any) => {
          this.incrementosFechasList = res1;
          console.log("Incrementos por fecha",this.incrementosFechasList);
          this.incrementosService
            .listHoras_ByIdActividadTipoActividad(traslado.idTraslado, 2)
            .subscribe((res2: any) => {
              this.incrementosHorasList = res2;
              console.log("Incrementos por hora",this.incrementosHorasList);
              $("#verDetalleTraslado").modal("open");
            });
        });

      }
    );
  }

  editar(traslado) {
    this.trasladoActual = traslado;
    this.trasladosCostosService.listByIdTraslado(traslado.idTraslado).subscribe(
      (resp: any) => {
        this.costos = resp;
        // console.log(this.costos);
        this.divisa = this.costos[0].idDivisa;
        
        document.getElementById("autocomplete_divisaEditar").setAttribute('value',this.divisas.find(divisa => divisa.idDivisa == this.divisa).divisa);
        // console.log(this.costos);
        this.incrementosService
        .listFecha_ByIdActividadTipoActividad(traslado.idTraslado, 2)
        .subscribe((res1: any) => {
          this.incrementosFechasList = res1;
          //console.log(this.incrementosFechasList);
          this.incrementosService
            .listHoras_ByIdActividadTipoActividad(traslado.idTraslado, 2)
            .subscribe((res2: any) => {
              this.incrementosHorasList = res2;
              //console.log(this.incrementosHorasList);
              $("#modalEditarTraslado").modal("open");
            });
        });

      }
    );
  }


  agregarIncrementoEditar() {
    this.incremento.tipoActividad = 2; //2 Indica que viene de la tabla productos
    if (this.incremento.tipo == 1) {
      this.incrementosHorasList.push([this.incremento, this.incrementosHoras]);
    } else {
      this.incrementosFechasList.push([this.incremento, this.incrementosFecha]);
    }
    this.incremento = new Incremento();
    this.incrementosHoras = [];
    this.incrementosFecha = [];
    // console.log(this.incrementos);
  }

  eliminarIncrementoEditar(indexIncremento, tipo) {
    if (tipo == 1) {
      this.incrementosHorasList.splice(indexIncremento, 1);
    } else {
      this.incrementosFechasList.splice(indexIncremento, 1);
    }
  }

  eliminarDetHoraEditar(indexIncremento, indexDetalle) {
    // console.log(this.incrementosHorasList);
    // console.log(indexIncremento, indexDetalle);
    this.incrementosHorasList[indexIncremento][[1][0]].splice(indexDetalle, 1);
    // console.log(this.incrementosHorasList);
  }

  agregarDetFechaEditar(indexIncremento) {
    let regexp = /^(\d{1,2})-(\d{1,2})$/;

    if (regexp.test(this.incrementoFechaEditar.fechaInicial)) {
      if (regexp.test(this.incrementoFechaEditar.fechaFinal)) {
        this.incrementoFechaEditar.idIncremento = this.incrementosFechasList[
          indexIncremento
        ][0].idIncremento;
        this.incrementosFechasList[indexIncremento][[1][0]].push(
          this.incrementoFechaEditar
        );
        this.incrementoFechaEditar = new IncrementoFecha();
        // console.log(this.incrementosFechasList[indexIncremento]);
        // this.incrementoHora.idIncremento= this.incrementosHorasList[ii]
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            "El formato de fecha final introducido no coincide con el indicado (dd-mm)",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "El formato de fecha inicial introducido no coincide con el indicado (dd-mm)",
      });
    }
  }

  eliminarDetFechaEditar(indexIncremento, indexDetalle) {
    this.incrementosFechasList[indexIncremento][[1][0]].splice(indexDetalle, 1);
    // console.log(this.incrementosFechasList);
  }

  agregarDetHoraEditar(indexIncremento) {
    this.incrementoHoraEditar.idIncremento = this.incrementosHorasList[
      indexIncremento
    ][0].idIncremento;
    // console.log(this.incrementoHoraEditar);
    this.incrementosHorasList[indexIncremento][[1][0]].push(
      this.incrementoHoraEditar
    );
    this.incrementoHoraEditar = new incrementoHora();
    // console.log(this.incrementosHorasList[indexIncremento]);
    // this.incrementoHora.idIncremento= this.incrementosHorasList[ii]
  }


  actualizarTraslado() {
    // console.log(this.trasladoActual);
    // console.log(this.divisa);
    // console.log(this.costos);
    // console.log(this.incrementosHorasList);
    // console.log(this.incrementosFechasList);
    this.trasladosService.update(this.trasladoActual, this.costos, this.divisa).subscribe(
      resp => {
        this.incrementosService
          .actualizar_list(
            this.incrementosHorasList,
            this.trasladoActual.idTraslado,
            2,
            1
          )
          .subscribe((resp3) => {
            this.incrementosService
              .actualizar_list(
                this.incrementosFechasList,
                this.trasladoActual.idTraslado, 2,
                2
              )
              .subscribe((resp4) => {
                this.getTraslados();

                $("#modalEditarTraslado").modal("close");
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Actualizado correctamente",
                  showConfirmButton: false,
                  timer: 1000,
                });
              }); 
          });
     }
    );
    // this.trasladosService.create(this.traslado, this.costos, this.divisa).subscribe(
    //   (idTraslado: number) => {
    //     this.incrementosService
    //       .create_list(this.incrementos, idTraslado)
    //       .subscribe((res3: any) => {
    //         this.getTraslados();
    //         $("#modalAgregarTraslado").modal("close");
    //         Swal.fire({
    //           position: "center",
    //           icon: "success",
    //           title: "Guardado correctamente",
    //           showConfirmButton: false,
    //           timer: 1000,
    //         });
    //        });
    //   }
    // );
  }

  eliminar(idTraslado: number) {
    Swal.fire({
      title: "¿Realmente quieres eliminar el traslado?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.trasladosService.delete(idTraslado).subscribe((resp) => {
          this.getTraslados();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Eliminado correctamente",
            showConfirmButton: false,
            timer: 1000,
          });
        });
      }
    });
  }

  esValido() {
    return (this.divisa != 0 && this.traslado.idDesde != 0 && this.traslado.idHacia != 0 && this.traslado.idCiudad != 0 ) ? true : false;
  }

}
