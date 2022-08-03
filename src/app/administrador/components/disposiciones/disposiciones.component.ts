import { Component, OnInit } from "@angular/core";
import { Ciudad } from "src/app/models/Ciudad";
import { Lugar } from "src/app/models/Lugar";
import { Pais } from "src/app/models/Pais";
import { CiudadesService } from "src/app/services/ciudades.service";
import { PaisesService } from "src/app/services/paises.service";
import { LugaresService } from "../../../services/lugares.service";
import { DivisasService } from "../../../services/divisas.service";
import { Divisa } from "../../../models/Divisa";
import { DisposicionCosto } from "../../../models/DisposicionCosto";
import { Disposicion } from "../../../models/Disposicion";
import { Vehiculo } from "../../../models/Vehiculo";
import { VehiculosService } from "../../../services/vehiculos.service";
import { Incremento } from "../../../models/incremento";
import { IncrementoFecha } from "../../../models/incrementoFecha";
import { incrementoHora } from "../../../models/IncrementoHora";
import { DisposicionesService } from "../../../services/disposiciones.service";
import { DisposicionesCostosService } from "../../../services/disposiciones-costos.service";
import { IncrementosService } from "../../../services/incrementos.service";
declare var $: any;
import Swal from "sweetalert2";
import { ContinentesService } from "../../../services/continentes.service";
import { Continente } from "src/app/models/Continente";
import { Notificacion } from 'src/app/models/Notificacion';
import { Usuario } from 'src/app/models/Usuario';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: "app-disposiciones",
  templateUrl: "./disposiciones.component.html",
  styleUrls: ["./disposiciones.component.css"],
})
export class DisposicionesComponent implements OnInit {
  usuario: Usuario = new Usuario();
  dataAutocomplete: any = [];
  paises: Pais[] = [];
  ciudades: Ciudad[] = [];
  idPais: number = 0;
  lugares: Lugar[] = [];
  divisas: Divisa[] = [];
  costos: DisposicionCosto[] = [];
  disposicion: Disposicion = new Disposicion();
  disposicionCosto: DisposicionCosto = new DisposicionCosto();
  vehiculos: Vehiculo[] = [];
  incremento: Incremento = new Incremento();
  incrementosFecha: IncrementoFecha[] = [];
  incrementosHoras: incrementoHora[] = [];
  incrementoHora: incrementoHora = new incrementoHora();
  incrementoFecha: IncrementoFecha = new IncrementoFecha();
  id: string = ``;
  im: string = ``;
  im2: string = ``;
  fd: string = ``;
  fm: string = ``;
  incrementos: any[][] = [];
  disposiciones: any[] = [];
  incrementoHoraEditar: incrementoHora = new incrementoHora();
  incrementoFechaEditar: IncrementoFecha = new IncrementoFecha();

  // variables para listado
  continenteSeleccionado: number = -1;
  paisSeleccionado: number = -1;
  ciudadSeleccionada: number = -1;
  continentes: Continente[] = [];
  paisesByContinente: Pais[] = [];
  ciudadesByPais: Ciudad[] = [];
  disposicionActual: any = {
    pais: "",
  };
  diposicionCostosList: DisposicionCosto[] = [];
  incrementosFechasList: any[][] = [];
  incrementosHorasList: any[][] = [];
  esAgente: boolean = false;
  notificacion: Notificacion = new Notificacion();
  
  constructor(
    private paisesService: PaisesService,
    private ciudadService: CiudadesService,
    private lugaresService: LugaresService,
    private divisasService: DivisasService,
    private vehiculosService: VehiculosService,
    private disposicionesService: DisposicionesService,
    private disposicionesCostoService: DisposicionesCostosService,
    private incrementosService: IncrementosService,
    private continentesService: ContinentesService,
    private notificacionesService: NotificacionesService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    $(".fixed-action-btn").floatingActionButton();
    $(".modal").modal();
    $("select").formSelect();
    $("#inicial").datepicker({ changeYear: false, dateFormat: "dd-mm" });
    (localStorage.getItem("privilegios") == "1") ? this.esAgente = true : this.esAgente = false;

    this.getPaises();
    this.getLugares();
    this.getDivisas();
    this.getVehiculos();
    this.getContinentes();
  }

  onSubmit(form) {}

  getContinentes() {
    this.continentesService.listDisposiciones().subscribe((continentes: Continente[]) => {
      this.continentes = continentes;
      this.continenteSeleccionado = this.continentes[0].idContinente;
      this.getPaisesByIdContinente();
    });
  }

  getPaisesByIdContinente() {
    this.paisesService
      .listDisposiciones(this.continenteSeleccionado)
      .subscribe((paises: Pais[]) => {
        this.paisesByContinente = paises;
        this.paisSeleccionado = this.paisesByContinente[0].id;
        this.getCiudadesByIdPais();
      });
  }

  getCiudadesByIdPais() {
    this.ciudadService
      .list_porPaisDisposiciones(this.paisSeleccionado)
      .subscribe((ciudades: Ciudad[]) => {
        this.ciudadesByPais = ciudades;
        this.ciudadSeleccionada = -1;
        // console.log(this.ciudadesByPais);
        this.getDisposiciones();
      });
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
            this.disposicion.idCiudad = idCiudad;
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
            this.disposicionActual.idCiudad = idCiudad;
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

      $("#autocomplete_lugar").autocomplete({
        data: this.dataAutocomplete,
        onAutocomplete: () => {
          let idLugar = null;
          let tmp: any = document.getElementById("autocomplete_lugar");
          tmp = tmp.value;
          for (const id of this.lugares) {
            if (id.nombre === tmp) {
              idLugar = id.idLugar;
            }
          }
          if (idLugar != null) {
            this.disposicion.idLugar = idLugar;
          }
        },
      });

      $("#autocomplete_lugarEditar").autocomplete({
        data: this.dataAutocomplete,
        onAutocomplete: () => {
          let idLugar = null;
          let tmp: any = document.getElementById("autocomplete_lugarEditar");
          tmp = tmp.value;
          for (const id of this.lugares) {
            if (id.nombre === tmp) {
              idLugar = id.idLugar;
            }
          }
          if (idLugar != null) {
            this.disposicionActual.idLugar = idLugar;
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

      $("#autocomplete_divisa").autocomplete({
        data: this.dataAutocomplete,
        onAutocomplete: () => {
          let idDivisa = null;
          let tmp: any = document.getElementById("autocomplete_divisa");
          tmp = tmp.value;
          for (const id of this.divisas) {
            if (id.divisa === tmp) {
              idDivisa = id.idDivisa;
            }
          }
          if (idDivisa != null) {
            this.disposicion.idDivisa = idDivisa;
          }
        },
      });

      $("#autocomplete_divisaEditar").autocomplete({
        data: this.dataAutocomplete,
        onAutocomplete: () => {
          let idDivisa = null;
          let tmp: any = document.getElementsByClassName(
            "autocomplete_divisaEditar"
          );
          tmp = tmp.value;
          for (const id of this.divisas) {
            if (id.divisa === tmp) {
              idDivisa = id.idDivisa;
            }
          }
          if (idDivisa != null) {
            this.disposicionActual.idDivisa = idDivisa;
          }
        },
      });
    });
  }

  getVehiculos() {
    this.vehiculosService.list().subscribe((vehiculos: Vehiculo[]) => {
      this.vehiculos = vehiculos;
      this.disposicionCosto.idVehiculo = this.vehiculos[0].idVehiculo;
    });
  }

  guardar() {

    if (this.esValido()) {
      this.disposicionesService.create(this.disposicion).subscribe((res: any) => {
        this.disposicion.idDisposicion = res.insertId;
        this.disposicionesCostoService
          .create_list(this.costos, this.disposicion.idDisposicion)
          .subscribe((res2: any) => {
            this.incrementosService
              .create_list(this.incrementos, this.disposicion.idDisposicion)
              .subscribe((res3: any) => {
                this.disposicion = new Disposicion();
                this.costos = [];
                this.incrementos = [];

                $('#autocomplete_pais').val("");
                $('#autocomplete_ciudad').val("");
                $('#autocomplete_lugar').val("");
                $('#autocomplete_divisa').val("");

                this.getDisposiciones();
                $("#agregarDisposicion").modal("close");
                
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
                    this.notificacion.asunto = "Disposicion nueva agregada por Agente de ventas";
                    this.notificacion.tipo = 1;
                    this.notificacion.prioridad = 3;
                    this.notificacion.estatus = 0;
                    this.notificacion.caducidad = "3";
                    this.notificacion.data.tarea = ` El agente ${this.usuario.nombre} ha agregado una nueva disposición en ${ciudad}-${pais} porfavor completa la información`;
                    this.notificacion.emisor = this.usuario.idUsuario;
  
  
                    this.notificacionesService.create(this.notificacion, 2).subscribe(
                      res => {
                        Swal.fire({
                          position: "center",
                          icon: "success",
                          title: "Guardado correctamente",
                          text: "Se ha notificado al área de productos que complete la información de esta disposición",
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
          });
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Faltan alguno de los campos obligatorios",
        showConfirmButton: true,
      });
    }
   
  }

  agregarCosto() {
    this.costos.push(this.disposicionCosto);
    this.disposicionCosto = new DisposicionCosto();
    this.disposicionCosto.idVehiculo = this.vehiculos[0].idVehiculo;
  }

  getNombreVehiculo(idVehiculo) {
    return this.vehiculos.find((vehiculo) => vehiculo.idVehiculo == idVehiculo)
      .nombre;
  }

  eliminarCosto(index) {
    //console.log(`eliminando...`);
    this.costos.splice(index, 1);
  }

  agregarFechaDetalle() {
    this.incrementoFecha.fechaInicial = `${this.id}-${this.im}`;
    this.incrementoFecha.fechaFinal = `${this.fd}-${this.fm}`;
    this.incrementosFecha.push(this.incrementoFecha);
    this.incrementoFecha = new IncrementoFecha();
    this.id = ``;
    this.fd = ``;
    this.im = ``;
    this.fm = ``;
  }
  agregarHoraDetalle() {
    this.incrementosHoras.push(this.incrementoHora);
    this.incrementoHora = new incrementoHora();
    //console.log(this.incrementosHoras);
  }

  eliminarIncrementoFecha(ii) {
    this.incrementosFecha.splice(ii, 1);
  }

  agregarIncremento() {
    this.incremento.tipoActividad = 3; //Indica que viene de la tabla disposiciones
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

  cancelarNuevo() {
    this.disposicion = new Disposicion();
    this.costos = [];
    this.incrementos = [];
    $("#agregarDisposicion").modal("close");
  }

  getDisposiciones() {
    this.disposicionesService
      .listByPaisCiudad_vista(this.paisSeleccionado, this.ciudadSeleccionada)
      .subscribe((disp: any[]) => {
        this.disposiciones = disp;
        //console.log(this.disposiciones);
      });
  }

  verDetalles(idDisposicion) {
    this.disposicionActual = this.disposiciones.find(
      (disposicion) => disposicion.idDisposicion == idDisposicion
    );
    this.disposicionesCostoService
      .listByIdDisposicion(idDisposicion)
      .subscribe((diposicionCosto: DisposicionCosto[]) => {
        this.diposicionCostosList = diposicionCosto;

        this.incrementosService
          .listFecha_ByIdActividadTipoActividad(idDisposicion, 3)
          .subscribe((res1: any) => {
            this.incrementosFechasList = res1;
            //console.log(this.incrementosFechasList);
            this.incrementosService
              .listHoras_ByIdActividadTipoActividad(idDisposicion, 3)
              .subscribe((res2: any) => {
                this.incrementosHorasList = res2;
                //console.log(this.incrementosHorasList);

                $("#verDetalleDisposicion").modal("open");
              });
          });
      });
  }

  editar(idDisposicion) {
    this.disposicionActual = this.disposiciones.find(
      (disposicion) => disposicion.idDisposicion == idDisposicion
    );
    //console.log(this.disposicionActual);
    this.disposicionesCostoService
      .listByIdDisposicion(idDisposicion)
      .subscribe((diposicionCosto: DisposicionCosto[]) => {
        this.diposicionCostosList = diposicionCosto;

        this.incrementosService
          .listFecha_ByIdActividadTipoActividad(idDisposicion, 3)
          .subscribe((res1: any) => {
            this.incrementosFechasList = res1;
            //console.log(this.incrementosFechasList);
            this.incrementosService
              .listHoras_ByIdActividadTipoActividad(idDisposicion, 3)
              .subscribe((res2: any) => {
                this.incrementosHorasList = res2;
                //console.log(this.incrementosHorasList);

                $("#editarDisposicion").modal("open");
              });
          });
      });
  }

  eliminar(idDisposicion: number) {
    Swal.fire({
      title: "¿Realmente quieres eliminar la disposición?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.disposicionesService.delete(idDisposicion).subscribe((resp) => {
          this.getDisposiciones();
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

  actualizar() {
    let disp = new Disposicion();
    disp.idDisposicion = this.disposicionActual.idDisposicion;
    disp.idCiudad = this.disposicionActual.idCiudad;
    disp.idLugar = this.disposicionActual.idLugar;
    disp.idDivisa = this.disposicionActual.idDivisa;
    disp.dentro = this.disposicionActual.dentro;
    disp.comision = this.disposicionActual.comision;
    disp.cancelaciones = this.disposicionActual.cancelaciones;
    disp.estatus = this.disposicionActual.estatus;
    //console.log(disp);
    this.disposicionesService.actualizar(disp).subscribe((resp1) => {
      //console.log(resp1);
      //console.log(this.diposicionCostosList);
      this.disposicionesCostoService
        .actualizar(
          this.diposicionCostosList,
          this.disposicionActual.idDisposicion
        )
        .subscribe((resp2) => {
          //console.log(resp2);
          //console.log(this.incrementosHorasList);
          //console.log(this.incrementosFechasList);
          this.incrementosService
            .actualizar_list(
              this.incrementosHorasList,
              this.disposicionActual.idDisposicion,
              3,
              1
            )
            .subscribe((resp3) => {
              this.incrementosService
                .actualizar_list(
                  this.incrementosFechasList,
                  this.disposicionActual.idDisposicion,3,
                  2
                )
                .subscribe((resp4) => {
                  this.getDisposiciones();

                  $("#editarDisposicion").modal("close");
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Actualizado correctamente",
                    showConfirmButton: false,
                    timer: 1000,
                  });
                });
            });
        });
    });
  }

  agregarCostoEditar() {
    this.disposicionCosto.idDisposicion = this.disposicionActual.idDisposicion;
    //console.log(this.disposicionCosto);
    this.diposicionCostosList.push(this.disposicionCosto);
    this.disposicionCosto = new DisposicionCosto();
  }

  eliminarCostoEditar(index) {
    this.diposicionCostosList.splice(index, 1);
  }

  eliminarDetHoraEditar(indexIncremento, indexDetalle) {
    //console.log(this.incrementosHorasList);
    //console.log(indexIncremento, indexDetalle);
    this.incrementosHorasList[indexIncremento][[1][0]].splice(indexDetalle, 1);
    //console.log(this.incrementosHorasList);
  }

  agregarDetHoraEditar(indexIncremento) {
    this.incrementoHoraEditar.idIncremento = this.incrementosHorasList[
      indexIncremento
    ][0].idIncremento;
    //console.log(this.incrementoHoraEditar);
    this.incrementosHorasList[indexIncremento][[1][0]].push(
      this.incrementoHoraEditar
    );
    this.incrementoHoraEditar = new incrementoHora();
    //console.log(this.incrementosHorasList[indexIncremento]);
    // this.incrementoHora.idIncremento= this.incrementosHorasList[ii]
  }

  eliminarIncrementoEditar(indexIncremento, tipo) {
    if (tipo == 1) {
      this.incrementosHorasList.splice(indexIncremento, 1);
    } else {
      this.incrementosFechasList.splice(indexIncremento, 1);
    }
  }

  agregarIncrementoEditar() {
    this.incremento.tipoActividad = 3; //3 Indica que viene de la tabla disposiciones
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

  agregarDetFechaEditar(indexIncremento) {
    this.incrementoFechaEditar.idIncremento = this.incrementosFechasList[
      indexIncremento
    ][0].idIncremento;
    this.incrementosFechasList[indexIncremento][[1][0]].push(
      this.incrementoFechaEditar
    );
    this.incrementoFechaEditar = new IncrementoFecha();
    //console.log(this.incrementosFechasList[indexIncremento]);
    // this.incrementoHora.idIncremento= this.incrementosHorasList[ii]
  }

  eliminarDetFechaEditar(indexIncremento, indexDetalle) {
    this.incrementosFechasList[indexIncremento][[1][0]].splice(indexDetalle, 1);
    //console.log(this.incrementosFechasList);
  }


  esValido() {
    // console.log(this.disposicion);
    if (this.disposicion.idCiudad != 0 && this.disposicion.idLugar != 0 && this.disposicion.idDivisa!=0) {
      return true;
    }
    return false;
  }
}
