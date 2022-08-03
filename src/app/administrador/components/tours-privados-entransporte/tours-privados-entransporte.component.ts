import { Component, OnInit, ViewChild } from "@angular/core";
import { AnyTxtRecord } from "dns";
import { Ciudad } from "src/app/models/Ciudad";
import { Continente } from "src/app/models/Continente";
import { Divisa } from "src/app/models/Divisa";
import { Incremento } from "src/app/models/incremento";
import { IncrementoFecha } from "src/app/models/incrementoFecha";
import { incrementoHora } from "src/app/models/IncrementoHora";
import { Pais } from "src/app/models/Pais";
import { Producto } from "src/app/models/Producto";
import { ProductoDiaCerrado } from "src/app/models/ProductoDiaCerrado";
import { ProductoEntrada } from "src/app/models/ProductoEntrada";
import { ProductoHorario } from "src/app/models/productoHorarios";
import { ProductoInfo } from "src/app/models/ProductoInfo";
import { ProductoOpcion } from "src/app/models/ProductoOpcion";
import { ProductoTarifa } from "src/app/models/ProductoTarifa";
import { Subcategoria } from "src/app/models/Subcategoria";
import { Vehiculo } from "src/app/models/Vehiculo";
import { CiudadesService } from "src/app/services/ciudades.service";
import { ContinentesService } from "src/app/services/continentes.service";
import { DivisasService } from "src/app/services/divisas.service";
import { IncrementosService } from "src/app/services/incrementos.service";
import { PaisesService } from "src/app/services/paises.service";
import { ProductosService } from "src/app/services/productos.service";
import { VehiculosService } from "src/app/services/vehiculos.service";
declare var $: any;
import Swal from "sweetalert2";
import { ProductoTransporte } from "../../../models/productoTransporte";
import { SubcategoriasService } from "../../../services/subcategorias.service";
import { ImagenesService } from '../../../services/imagenes.service';
import { ImageUploadComponent } from 'angular2-image-upload';
import { Usuario } from 'src/app/models/Usuario';
import { Notificacion } from 'src/app/models/Notificacion';
import { UsuariosService } from '../../../services/usuarios.service';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-tours-privados-entransporte",
  templateUrl: "./tours-privados-entransporte.component.html",
  styleUrls: ["./tours-privados-entransporte.component.css"],
})
export class ToursPrivadosEntransporteComponent implements OnInit {
  @ViewChild('imagenes1NTPAP') imageUploadComponent1N: ImageUploadComponent;
  @ViewChild('imagenes2NTPAP') imageUploadComponent2N: ImageUploadComponent;
  @ViewChild('imagenes3NTPAP') imageUploadComponent3N: ImageUploadComponent;

  usuario: Usuario = new Usuario();
  notificacion: Notificacion = new Notificacion();
  esAgente: boolean = false;
  
  dataAutocomplete: any = [];
  paises: Pais[] = [];
  ciudades: Ciudad[] = [];
  divisas: Divisa[] = [];
  idPais: number = 0;
  producto: Producto = new Producto();
  productoActual: any = {};
  productoInfo: ProductoInfo = new ProductoInfo();
  tipoTarifa: number = 1; //1.- Cientifica 2.-Por persona
  tarifasPersonas: ProductoTarifa[] = [];
  tarifaNueva: ProductoTarifa = new ProductoTarifa();
  entradas: ProductoEntrada[] = [];
  entradaNueva: ProductoEntrada = new ProductoEntrada();
  opciones: ProductoOpcion[] = [];
  opcionNueva: ProductoOpcion = new ProductoOpcion();
  horarios: ProductoHorario[] = [];
  horarioNuevo: ProductoHorario = new ProductoHorario();
  diasCerrados: ProductoDiaCerrado[] = [];
  diaCerradoNuevo: ProductoDiaCerrado = new ProductoDiaCerrado();
  incrementosFecha: IncrementoFecha[] = [];
  incrementosHoras: incrementoHora[] = [];
  incrementoHora: incrementoHora = new incrementoHora();
  incrementoFecha: IncrementoFecha = new IncrementoFecha();
  incrementos: any[][] = [];
  incremento: Incremento = new Incremento();
  continenteSeleccionado: number = -1;
  paisSeleccionado: number = -1;
  ciudadSeleccionada: number = -1;
  continentes: Continente[] = [];
  paisesByContinente: Pais[] = [];
  ciudadesByPais: Ciudad[] = [];
  tours: any[] = [];
  productoInfoActual: any = {};
  incrementosFechasList: any[][] = [];
  incrementosHorasList: any[][] = [];
  incrementoHoraEditar: incrementoHora = new incrementoHora();
  incrementoFechaEditar: IncrementoFecha = new IncrementoFecha();
  tarifasCientificas: ProductoTransporte[] = [];
  vehiculos: Vehiculo[] = [];
  tarifaCientificaNueva: ProductoTransporte = new ProductoTransporte();
  nombreDivisaActual = ``;
  subcategorias: Subcategoria[] = [];
  subcategoriasSeleccionadas: Subcategoria[] = [];
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

  ver = false;
  imagenes: any[] = [];
  imagenesPrecargadas: any = [];
  

  
  constructor(
    private paisesService: PaisesService,
    private ciudadService: CiudadesService,
    private divisasService: DivisasService,
    private productosService: ProductosService,
    private incrementosService: IncrementosService,
    private continentesService: ContinentesService,
    private vehiculosService: VehiculosService,
    private subcategoriasService: SubcategoriasService,
    private imagenesService: ImagenesService,
    private usuariosService: UsuariosService,
    private notificacionesService: NotificacionesService
  ) {}

  ngOnInit(): void {
    $(".modal").modal();
    $("select").formSelect();
    (localStorage.getItem("privilegios") == "1") ? this.esAgente = true : this.esAgente = false;

    this.getPaises();
    this.getDivisas();
    this.getContinentes();
    this.getVehiculos();
    this.getSubcategorias();
  }

  getSubcategorias() {
    this.subcategoriasService.list().subscribe((resp: Subcategoria[]) => {
      this.subcategorias = resp;
      // console.log(this.subcategorias);
    });
  }

  getVehiculos() {
    this.vehiculosService.list().subscribe((vehiculos: Vehiculo[]) => {
      this.vehiculos = vehiculos;
      this.tarifaCientificaNueva.idVehiculo = this.vehiculos[0].idVehiculo;
    });
  }

  getContinentes() {
    this.continentesService.listProductos(2).subscribe((continentes: Continente[]) => {
      this.continentes = continentes;
      this.continenteSeleccionado = this.continentes[0].idContinente;
      this.getPaisesByIdContinente();
    });
  }

  getPaisesByIdContinente() {
    this.paisesService
      .listProductos(this.continenteSeleccionado,2)
      .subscribe((paises: Pais[]) => {
        this.paisesByContinente = paises;
        this.paisSeleccionado = this.paisesByContinente[0].id;
        this.getCiudadesByIdPais();
      });
  }

  getCiudadesByIdPais() {
    this.ciudadService
      .list_porPaisProductos(this.paisSeleccionado,2)
      .subscribe((ciudades: Ciudad[]) => {
        this.ciudadesByPais = ciudades;
        this.ciudadSeleccionada = -1;
        this.getTours();
      });
  }

  getTours() {
    this.productosService
      .listByPaisCiudad_vista(this.paisSeleccionado, this.ciudadSeleccionada, 2)
      .subscribe((tours: any[]) => {
        this.tours = tours;
        // console.log(this.tours);
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
            this.producto.idCiudad = idCiudad;
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
            this.productoActual.idCiudad = idCiudad;
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
            this.productoInfo.idDivisa = idDivisa;
            this.nombreDivisaActual = divisa;
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
            this.productoInfoActual.idDivisa = idDivisa;
          }
        },
      });
    });
  }

  resetTarifaCientifica() {
    this.tarifasPersonas = [];
    this.tarifasCientificas = [];
    this.productoInfo.tarifaCientifica = 0;
  }

  resetTarifaCientificaEditar() {
    this.productoInfoActual.tarifaCientifica = 0;
  }

  agregarTarifaPersona() {
    this.tarifasPersonas.push(this.tarifaNueva);
    this.tarifaNueva = new ProductoTarifa();
  }

  eliminarTarifaPersona(index) {
    this.tarifasPersonas.splice(index, 1);
  }

  agregarEntrada() {
    this.entradas.push(this.entradaNueva);
    this.entradaNueva = new ProductoEntrada();
  }

  eliminarEntrada(index) {
    this.entradas.splice(index, 1);
  }

  agregarOpcion() {
    this.opciones.push(this.opcionNueva);
    this.opcionNueva = new ProductoOpcion();
  }

  eliminarOpcion(index) {
    this.opciones.splice(index, 1);
  }

  agregarHorario() {
    this.horarios.push(this.horarioNuevo);
    this.horarioNuevo = new ProductoHorario();
  }

  eliminarHorario(index) {
    this.horarios.splice(index, 1);
  }

  agregarDiaCerrado() {
    let regexp = /^(\d{1,2})-(\d{1,2})$/;

    if (regexp.test(this.diaCerradoNuevo.fecha)) {
      this.diasCerrados.push(this.diaCerradoNuevo);
      this.diaCerradoNuevo = new ProductoDiaCerrado();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "El formato de fecha introducido no coincide con el indicado (dd-mm)",
      });
    }
  }

  eliminarDiaCerrado(index) {
    this.diasCerrados.splice(index, 1);
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
    // console.log(this.incrementosHoras);
  }

  eliminarIncrementoFecha(ii) {
    this.incrementosFecha.splice(ii, 1);
  }

  agregarIncremento() {
    this.incremento.tipoActividad = 1; //Indica que viene de la tabla productos
    if (this.incremento.tipo == 1) {
      this.incrementos.push([this.incremento, this.incrementosHoras]);
    } else {
      this.incrementos.push([this.incremento, this.incrementosFecha]);
    }
    this.incremento = new Incremento();
    this.incrementosHoras = [];
    this.incrementosFecha = [];
    // console.log(this.incrementos);
  }
  resetIncrementos() {
    this.incrementosFecha = [];
    this.incrementosHoras = [];
  }

  eliminarIncremento(ii) {
    this.incrementos.splice(ii, 1);
  }

  agregarNuevoTPET() {

    if (this.esValido()) {
      this.producto.categoria = 2; //1 es tour privado en transporte

      this.productosService
        .createTPET(
          this.producto,
          this.productoInfo,
          this.tarifasPersonas,
          this.entradas,
          this.opciones,
          this.horarios,
          this.diasCerrados,
          this.tarifasCientificas,
          this.subcategoriasSeleccionadas
        )
        .subscribe((idProducto: number) => {
          // console.log(idProducto);
          this.incrementosService
            .create_list(this.incrementos, idProducto)
            .subscribe((res3: any) => {
  
              this.imagenesService.uploadProducto(this.imagenes, idProducto).subscribe(
                res => {
                  this.getTours();
                  $("#agregarTPET").modal("close");

                  this.producto = new Producto();
                  this.productoInfo = new ProductoInfo();
                  this.tarifasPersonas = [];
                  this.entradas = [];
                  this.opciones = [];
                  this.horarios = [];
                  this.diasCerrados = [];
                  this.incrementos = [];
                  this.incrementosHoras = [];
                  this.incrementosFecha = [];
                  this.tarifasCientificas = [];
                  this.subcategoriasSeleccionadas = [];

                  $('#autocomplete_pais').val("");
                  $('#autocomplete_ciudad').val("");
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
                      this.notificacion.asunto = "Tour privado en transporte agregado por Agente de ventas";
                      this.notificacion.tipo = 1;
                      this.notificacion.prioridad = 3;
                      this.notificacion.estatus = 0;
                      this.notificacion.caducidad = "3";
                      this.notificacion.data.tarea = ` El agente ${this.usuario.nombre} ha agregado un nuevo tour privado en transporte en ${ciudad}-${pais} porfavor completa la información`;
                      this.notificacion.emisor = this.usuario.idUsuario;
    
    
                      this.notificacionesService.create(this.notificacion, 2).subscribe( //2 es el id del area de productos
                        res => {
                          Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Guardado correctamente",
                            text: "Se ha notificado al área de productos que complete la información de este tour privado en transporte",
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
  
                }
              );
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

  verDetalles(idProducto) {
    this.ver = false;
    this.productosService
      .listProductoByIdProducto_vista(idProducto)
      .subscribe((producto: Producto) => {
        this.productoActual = producto;
        this.productosService
          .listProductoInfoByIdProducto_vista(idProducto)
          .subscribe((productoInfo: ProductoInfo) => {
            this.productoInfoActual = productoInfo;
            this.productosService
              .listTarifasIdProducto(idProducto)
              .subscribe((tarifas: ProductoTarifa[]) => {
                this.tarifasPersonas = tarifas;
                this.productosService
                  .listEntradasByIdProducto(idProducto)
                  .subscribe((entradas: ProductoEntrada[]) => {
                    this.entradas = entradas;
                    this.productosService
                      .listOpcionesByIdProducto(idProducto)
                      .subscribe((opciones: ProductoOpcion[]) => {
                        this.opciones = opciones;
                        this.productosService
                          .listHorariosProducto(idProducto)
                          .subscribe((horarios: ProductoHorario[]) => {
                            this.horarios = horarios;
                            this.productosService
                              .listDiasCerradosByIdProducto(idProducto)
                              .subscribe(
                                (diasCerrados: ProductoDiaCerrado[]) => {
                                  this.diasCerrados = diasCerrados;
                                  this.incrementosService
                                    .listFecha_ByIdActividadTipoActividad(
                                      idProducto,
                                      1
                                    )
                                    .subscribe((res1: any) => {
                                      this.incrementosFechasList = res1;
                                      // console.log(this.incrementosFechasList);
                                      this.incrementosService
                                        .listHoras_ByIdActividadTipoActividad(
                                          idProducto,
                                          1
                                        )
                                        .subscribe((res2: any) => {
                                          this.incrementosHorasList = res2;
                                          // console.log(
                                          //   this.incrementosHorasList
                                          // );

                                          this.productosService
                                            .listTransportesIdProducto_vista(
                                              idProducto
                                            )
                                            .subscribe((transportes: any[]) => {
                                              this.tarifasCientificas = transportes;

                                              this.productosService
                                                .list_subcategoriasByIdProducto(
                                                  idProducto
                                                )
                                                .subscribe(
                                                  (
                                                    subcategoriasSeleccionadas: Subcategoria[]
                                                  ) => {
                                                    this.subcategoriasSeleccionadas = subcategoriasSeleccionadas;
                                                   
                                                    this.productosService.listImagenesExistentes(this.productoActual.idProducto).subscribe(
                                                      (imagenesExistentes: any) => {
                                                        this.imagenesPrecargadas = [];
                                                        this.imagenes = [];
                                                        // this.imageUploadComponent1V.deleteAll();
                                                        // this.imageUploadComponent2V.deleteAll();
                                                        // this.imageUploadComponent3V.deleteAll();
                                                        
                                                        for (let iii = 1; iii < 4; iii++) {
                                                          if (imagenesExistentes.findIndex(img => Number.parseInt(img.num) == iii) != -1) {
                                                            this.imagenesPrecargadas[iii - 1] = [`"${environment.API_URI_IMAGES}/productos/${this.productoActual.idProducto}_${iii}.jpg"`];
                                                          } else {
                                                            this.imagenesPrecargadas[iii - 1] = [`"${environment.API_URI_IMAGES}/productos/-1.jpg"`];
                                                          }
                                                        }
                                                        // console.log(this.imagenes);
                                                        this.ver = true;
                                                        $("#verDetalleTPET").modal(
                                                          "open"
                                                        );
                                                      }
                                                    );



                                                    
                                                  }
                                                );
                                            });
                                        });
                                    });
                                }
                              );
                          });
                      });
                  });
              });
          });
      });
  }

  editarTPET(idProducto) {
    this.ver = false;
    this.productosService
      .listProductoByIdProducto_vista(idProducto)
      .subscribe((producto: Producto) => {
        this.productoActual = producto;
        this.productosService
          .listProductoInfoByIdProducto_vista(idProducto)
          .subscribe((productoInfo: ProductoInfo) => {
            this.productoInfoActual = productoInfo;

            this.productosService
              .listTarifasIdProducto(idProducto)
              .subscribe((tarifas: ProductoTarifa[]) => {
                this.tarifasPersonas = tarifas;
                this.productosService
                  .listEntradasByIdProducto(idProducto)
                  .subscribe((entradas: ProductoEntrada[]) => {
                    this.entradas = entradas;
                    this.productosService
                      .listOpcionesByIdProducto(idProducto)
                      .subscribe((opciones: ProductoOpcion[]) => {
                        this.opciones = opciones;
                        this.productosService
                          .listHorariosProducto(idProducto)
                          .subscribe((horarios: ProductoHorario[]) => {
                            this.horarios = horarios;
                            this.productosService
                              .listDiasCerradosByIdProducto(idProducto)
                              .subscribe(
                                (diasCerrados: ProductoDiaCerrado[]) => {
                                  this.diasCerrados = diasCerrados;
                                  this.incrementosService
                                    .listFecha_ByIdActividadTipoActividad(
                                      idProducto,
                                      1
                                    )
                                    .subscribe((res1: any) => {
                                      this.incrementosFechasList = res1;
                                      // console.log(this.incrementosFechasList);
                                      this.incrementosService
                                        .listHoras_ByIdActividadTipoActividad(
                                          idProducto,
                                          1
                                        )
                                        .subscribe((res2: any) => {
                                          this.incrementosHorasList = res2;
                                          // console.log(
                                          //   this.incrementosHorasList
                                          // );

                                          this.productosService
                                            .listTransportesIdProducto_vista(
                                              idProducto
                                            )
                                            .subscribe((transportes: any[]) => {
                                              if (transportes.length > 0) {
                                                this.tipoTarifa = 1;
                                              } else {
                                                this.tipoTarifa = 2;
                                              }
                                              this.tarifasCientificas = transportes;
                                              this.productosService
                                                .list_subcategoriasByIdProducto(
                                                  idProducto
                                                )
                                                .subscribe(
                                                  (
                                                    subcategoriasSeleccionadas: Subcategoria[]
                                                  ) => {
                                                    this.imagenes = [];
                                                    this.subcategoriasSeleccionadas = subcategoriasSeleccionadas;
                                                    this.productosService.listImagenesExistentes(this.productoActual.idProducto).subscribe(
                                                      (imagenesExistentes: any) => {
                                                        // this.imageUploadComponent1E.deleteAll();
                                                        // this.imageUploadComponent2E.deleteAll();
                                                        // this.imageUploadComponent3E.deleteAll();
                                                        
                                                        this.imagenesPrecargadas = [];
                                                        this.imagenes = [];
                                                        for (let iii = 1; iii < 4; iii++){
                                                         
                                                          if (imagenesExistentes.findIndex(img => Number.parseInt(img.num) == iii) != -1) {
                                                            this.imagenesPrecargadas[iii - 1] = [`"${environment.API_URI_IMAGES}/productos/${this.productoActual.idProducto}_${iii}.jpg"`];
                                                            this.imagenes[iii - 1] = -1; // la imagen existe
                                                          } else {
                                                            this.imagenesPrecargadas[iii - 1] = [];
                                                            this.imagenes[iii - 1] = null; // la imagen no existe
                                                          }
                                                        }
                                                        // console.log(this.imagenes);
                                                        this.ver = true;
                                                        $("#editarTPET").modal(
                                                          "open"
                                                        );
                                                      }
                                                    );
                                                   
                                                    
                                                  }
                                                );
                                            });
                                        });
                                    });
                                }
                              );
                          });
                      });
                  });
              });
          });
      });
  }

  agregarIncrementoEditar() {
    this.incremento.tipoActividad = 1; //1 Indica que viene de la tabla productos
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

  actualizar() {
    if (this.tipoTarifa == 1) {
      //Es cientifica por lo que la tarifa por persona se deja vacia par que no se inserte tambien
      this.tarifasPersonas = [];
    } else {
      this.tarifasCientificas = [];
    }

    // console.log("producto info actual",this.productoInfoActual);
    this.productosService
      .actualizarTPET(
        this.productoActual,
        this.productoInfoActual,
        this.tarifasPersonas,
        this.entradas,
        this.opciones,
        this.horarios,
        this.diasCerrados,
        this.tarifasCientificas,
        this.subcategoriasSeleccionadas
      )
      .subscribe((resp) => {
        // console.log(this.incrementosHorasList);
        // console.log(this.incrementosFechasList);
        // this.incrementosService
        //   .actualizar_list(
        //     this.incrementosHorasList,
        //     this.productoActual.idProducto,
        //     1)
        //   .subscribe((resp3) => {
            this.imagenesService.uploadProducto(this.imagenes, this.productoActual.idProducto).subscribe(
              res => {
                this.getTours();
                // this.imageUploadComponent1.deleteAll();
                //     this.imageUploadComponent2.deleteAll();
                //     this.imageUploadComponent3.deleteAll();
                $("#editarTPET").modal("close");
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Actualizado correctamente",
                  showConfirmButton: false,
                  timer: 1000,
                });
              });
             
          // });
      });
  }

  eliminar(idProducto: number) {
    Swal.fire({
      title: "¿Realmente quieres eliminar este tour?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.productosService.delete(idProducto).subscribe((resp) => {
          this.getTours();
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

  getNombreVehiculo(idVehiculo) {
    return this.vehiculos.find((vehiculo) => vehiculo.idVehiculo == idVehiculo)
      .nombre;
  }

  agregarTarifaCientifica() {
    this.tarifasCientificas.push(this.tarifaCientificaNueva);
    this.tarifaCientificaNueva = new ProductoTransporte();
    this.tarifaCientificaNueva.idVehiculo = this.vehiculos[0].idVehiculo;
  }

  eliminarTarifaCientifica(index) {
    this.tarifasCientificas.splice(index, 1);
  }

  abrirAgregarTPET() {
    this.producto = new Producto();
    this.productoInfo = new ProductoInfo();
    this.tarifasCientificas = [];
    this.entradas = [];
    this.tarifasPersonas = [];
    this.opciones = [];
    this.diasCerrados = [];
    this.horarios = [];
    this.incrementos = [];
    this.tipoTarifa = 1;
    this.subcategoriasSeleccionadas = [];

    this.imageUploadComponent1N.deleteAll();
    this.imageUploadComponent2N.deleteAll();
    this.imageUploadComponent3N.deleteAll();


    $("#agregarTPET").modal("open");
  }

  setSubcategoriaNuevo(subcategoria) {
    let index = this.subcategoriasSeleccionadas.findIndex(
      (s) => s.idSubcategoria == subcategoria.idSubcategoria
    );
    // console.log(index);
    index == -1
      ? this.subcategoriasSeleccionadas.push(subcategoria)
      : this.subcategoriasSeleccionadas.splice(index, 1);
    console.log(this.subcategoriasSeleccionadas);
  }

  esSeleccionada(idSubcategoria) {
    let index = this.subcategoriasSeleccionadas.findIndex(s => s.idSubcategoria == idSubcategoria);
    return (index == -1) ?  false : true;
  }


  onUploadFinishedNuevo(event) {
    // console.log(event.src);
    let img = new Image();
    img.src = event.src;
    // console.log(img.naturalHeight);
  }

  onUploadFinished(event, index) {
    this.imagenes[index] = event;
    // console.log(this.imagenes);
    
  }

  onRemoved(event, index) {
    this.imagenes[index] = null;
    // console.log(this.imagenes);
  }


  onUploadFinishedEditar(event, index) {
    this.imagenes[index] = event;
    // console.log(this.imagenes);
    
  }

  onRemovedEditar(event, index) {
    this.imagenes[index] = null;
    // console.log(this.imagenes);
  }


  esValido() {
    return (this.producto.idCiudad != 0 && this.producto.titulo.length > 0 && this.productoInfo.idDivisa && this.subcategoriasSeleccionadas.length>0) ? true : false;
  }

}
