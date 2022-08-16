import { Component, OnInit, ViewChild } from "@angular/core";
import { Ciudad } from "src/app/models/Ciudad";
import { Continente } from "src/app/models/Continente";
import { Pais } from "src/app/models/Pais";
import { CiudadesService } from "src/app/services/ciudades.service";
import { ContinentesService } from "src/app/services/continentes.service";
import { DivisasService } from "src/app/services/divisas.service";
import { IncrementosService } from "src/app/services/incrementos.service";
import { PaisesService } from "src/app/services/paises.service";
import { ProductosService } from "src/app/services/productos.service";
import { Divisa } from "src/app/models/Divisa";
import { Producto } from "src/app/models/Producto";
import { ProductoDiaCerrado } from "src/app/models/ProductoDiaCerrado";
import { ProductoHorario } from "src/app/models/productoHorarios";
import { ProductoInfo } from "src/app/models/ProductoInfo";
import { ProductoOpcion } from "src/app/models/ProductoOpcion";
import Swal from "sweetalert2";
import { VehiculosService } from "src/app/services/vehiculos.service";
import { Vehiculo } from "src/app/models/Vehiculo";
import { ProductoTransporte } from "src/app/models/productoTransporte";
import { SubcategoriasService } from 'src/app/services/subcategorias.service';
import { Subcategoria } from 'src/app/models/Subcategoria';
import { ImagenesService } from '../../../services/imagenes.service';
import { ImageUploadComponent } from 'angular2-image-upload';
import { Usuario } from 'src/app/models/Usuario';
import { Notificacion } from 'src/app/models/Notificacion';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: "app-actividades",
  templateUrl: "./actividades.component.html",
  styleUrls: ["./actividades.component.css"],
})
export class ActividadesComponent implements OnInit {


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
  opciones: ProductoOpcion[] = [];
  opcionNueva: ProductoOpcion = new ProductoOpcion();
  horarios: ProductoHorario[] = [];
  horarioNuevo: ProductoHorario = new ProductoHorario();
  diasCerrados: ProductoDiaCerrado[] = [];
  diaCerradoNuevo: ProductoDiaCerrado = new ProductoDiaCerrado();
  continenteSeleccionado: number = -1;
  paisSeleccionado: number = -1;
  ciudadSeleccionada: number = -1;
  continentes: Continente[] = [];
  paisesByContinente: Pais[] = [];
  ciudadesByPais: Ciudad[] = [];
  actividades: any[] = [];
  productoInfoActual: any = {};
  nombreDivisaActual = ``;
  actvidades: Producto[] = [];
  vehiculos: Vehiculo[] = [];
  transporteNuevo: ProductoTransporte = new ProductoTransporte();
  transportes: ProductoTransporte[] = [];
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

  ) {
    this.getPaises();
    this.getDivisas();
    this.getContinentes();
    this.getVehiculos();
    this.getSubcategorias();
  }

  ngOnInit(): void {
    $(".modal").modal();
    $("select").formSelect();
    (localStorage.getItem("privilegios") == "1") ? this.esAgente = true : this.esAgente = false;

  }

  getSubcategorias() {
    this.subcategoriasService.list().subscribe(
      (resp: Subcategoria[]) => {
        this.subcategorias = resp;
      }
    );
  }

  getVehiculos() {
    this.vehiculosService.list().subscribe((vehiculos: Vehiculo[]) => {
      this.vehiculos = vehiculos;
      this.transporteNuevo.idVehiculo = this.vehiculos[0].idVehiculo;
    });
  }

  getContinentes() {
    this.continentesService.listProductos(4).subscribe((continentes: Continente[]) => {
      this.continentes = continentes;
      this.continenteSeleccionado = this.continentes[0].idContinente;
      this.getPaisesByIdContinente();
    });
  }

  getPaisesByIdContinente() {
    this.paisesService
      .listProductos(this.continenteSeleccionado,4)
      .subscribe((paises: Pais[]) => {
        this.paisesByContinente = paises;
        this.paisSeleccionado = this.paisesByContinente[0].id;
        this.getCiudadesByIdPais();
      });
  }

  getCiudadesByIdPais() {
    this.ciudadService
      .list_porPaisProductos(this.paisSeleccionado, 4)
      .subscribe((ciudades: Ciudad[]) => {
        this.ciudadesByPais = ciudades;
        this.ciudadSeleccionada = -1;
        this.getActividades();
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
          let nombreDivisa = null;
          let tmp: any = document.getElementById("autocomplete_divisa");
          tmp = tmp.value;
          for (const id of this.divisas) {
            if (id.divisa === tmp) {
              idDivisa = id.idDivisa;
              nombreDivisa = id.divisa;
            }
          }
          if (idDivisa != null) {
            this.productoInfo.idDivisa = idDivisa;
            this.nombreDivisaActual = nombreDivisa;
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

  getActividades() {
    this.productosService
      .listByPaisCiudad_vista(this.paisSeleccionado, this.ciudadSeleccionada, 4)
      .subscribe((actividades: any[]) => {
        this.actividades = actividades;
        //console.log(this.actividades);
      });
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

  abrirAgregarActividad() {
    this.opciones = [];
    this.opcionNueva = new ProductoOpcion();
    this.horarios = [];
    this.horarioNuevo = new ProductoHorario();
    this.diasCerrados = [];
    this.diaCerradoNuevo = new ProductoDiaCerrado();
    this.transportes = [];


    this.imageUploadComponent1N.deleteAll();
    this.imageUploadComponent2N.deleteAll();
    this.imageUploadComponent3N.deleteAll();

    $("#agregarActividad").modal("open");
  }

  getNombreVehiculo(idVehiculo) {
    return this.vehiculos.find((vehiculo) => vehiculo.idVehiculo == idVehiculo)
      .nombre;
  }

  agregarTransporte() {
    this.transportes.push(this.transporteNuevo);
    this.transporteNuevo = new ProductoTransporte();
    this.transporteNuevo.idVehiculo = this.vehiculos[0].idVehiculo;
  }

  eliminarTransporte(index) {
    this.transportes.splice(index, 1);
  }

  agregarNuevaActividad() {


    if (this.esValido()) {
      this.producto.categoria = 4; //4 es tour en grupo

      this.productosService
        .createActividad(
          this.producto,
          this.productoInfo,
          this.opciones,
          this.horarios,
          this.diasCerrados,
          this.transportes,
          this.subcategoriasSeleccionadas
        )
        .subscribe((idProducto:number) => {
          this.producto = new Producto();
          this.productoInfo = new ProductoInfo();
          this.opciones = [];
          this.horarios = [];
          this.diasCerrados = [];
          this.transportes = [];
          this.subcategoriasSeleccionadas = [];

          $('#autocomplete_pais').val("");
          $('#autocomplete_ciudad').val("");
          $('#autocomplete_divisa').val("");

          //console.log(idProducto);

          this.imagenesService.uploadProducto(this.imagenes, idProducto).subscribe(
            res => {
              this.getActividades();
              $("#agregarActividad").modal("close");
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
                  this.notificacion.asunto = "Actividad por Agente de ventas";
                  this.notificacion.tipo = 1;
                  this.notificacion.prioridad = 3;
                  this.notificacion.estatus = 0;
                  this.notificacion.caducidad = "3";
                  this.notificacion.data.tarea = ` El agente ${this.usuario.nombre} ha agregado una actividad en ${ciudad}-${pais} porfavor completa la información`;
                  this.notificacion.emisor = this.usuario.idUsuario;
    
                  this.notificacionesService.create(this.notificacion, 2).subscribe( //2 es el id del area de productos
                    res => {
                      Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Guardado correctamente",
                        text: "Se ha notificado al área de productos que complete la información de esta actividad",
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
    //console.log(`entra a ver`);
    this.productosService
      .listProductoByIdProducto_vista(idProducto)
      .subscribe((producto: Producto) => {
        this.productoActual = producto;
        //console.log(this.productoActual);
        this.productosService
          .listProductoInfoByIdProducto_vista(idProducto)
          .subscribe((productoInfo: ProductoInfo) => {
            this.productoInfoActual = productoInfo;
            //console.log(this.productoInfoActual);
            this.productosService
              .listOpcionesByIdProducto(idProducto)
              .subscribe((opciones: ProductoOpcion[]) => {
                this.opciones = opciones;
                //console.log(this.opciones);
                this.productosService
                  .listHorariosProducto(idProducto)
                  .subscribe((horarios: ProductoHorario[]) => {
                    this.horarios = horarios;
                    //console.log(this.horarios);
                    this.productosService
                      .listDiasCerradosByIdProducto(idProducto)
                      .subscribe((diasCerrados: ProductoDiaCerrado[]) => {
                        this.diasCerrados = diasCerrados;
                       // console.log(this.diasCerrados);
                        this.productosService
                          .listTransportesIdProducto_vista(idProducto)
                          .subscribe((transportes: any[]) => {
                            this.transportes = transportes;
                            this.productosService.list_subcategoriasByIdProducto(idProducto).subscribe(
                              (subcategoriasSeleccionadas: Subcategoria[]) => {
                                this.subcategoriasSeleccionadas = subcategoriasSeleccionadas
                                
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
                                    console.log(this.imagenes);
                                    this.ver = true;
                                    $("#verActividad").modal("open");

                                  }
                                );
                              }
                            );
                            
                          });
                      });
                  });
              });
          });
      });
  }

  editarActividad(idProducto) {
    this.ver = false;
    //console.log(`entra a ver`);
    this.productosService
      .listProductoByIdProducto_vista(idProducto)
      .subscribe((producto: Producto) => {
        this.productoActual = producto;
        //console.log(this.productoActual);
        this.productosService
          .listProductoInfoByIdProducto_vista(idProducto)
          .subscribe((productoInfo: ProductoInfo) => {
            this.productoInfoActual = productoInfo;
            //console.log(this.productoInfoActual);
            this.productosService
              .listOpcionesByIdProducto(idProducto)
              .subscribe((opciones: ProductoOpcion[]) => {
                this.opciones = opciones;
                //console.log(this.opciones);
                this.productosService
                  .listHorariosProducto(idProducto)
                  .subscribe((horarios: ProductoHorario[]) => {
                    this.horarios = horarios;
                    //console.log(this.horarios);
                    this.productosService
                      .listDiasCerradosByIdProducto(idProducto)
                      .subscribe((diasCerrados: ProductoDiaCerrado[]) => {
                        this.diasCerrados = diasCerrados;
                        //console.log(this.diasCerrados);

                        this.productosService
                          .listTransportesIdProducto_vista(idProducto)
                          .subscribe((transportes: any[]) => {
                            this.transportes = transportes;
                            this.productosService.list_subcategoriasByIdProducto(idProducto).subscribe(
                              (subcategoriasSeleccionadas: Subcategoria[]) => {
                                this.subcategoriasSeleccionadas = subcategoriasSeleccionadas
                                console.log(this.subcategoriasSeleccionadas);
                                this.imagenes = [];

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
                                    $("#editarActividad").modal("open");
                                  }
                                );
                              }
                            );
                            
                          });
                      });
                  });
              });
          });
      });
  }

  actualizar() {
    this.productosService
      .actualizarActividad(
        this.productoActual,
        this.productoInfoActual,
        this.opciones,
        this.horarios,
        this.diasCerrados,
        this.transportes,
        this.subcategoriasSeleccionadas
      )
      .subscribe((resp) => {

        this.imagenesService.uploadProducto(this.imagenes, this.productoActual.idProducto).subscribe(
          res => {
            this.getActividades();
  
            $("#editarActividad").modal("close");
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


  eliminar(idProducto: number) {
    Swal.fire({
      title: "¿Realmente quieres eliminar esta actividad?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.productosService.delete(idProducto).subscribe((resp) => {
          this.getActividades();
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


  setSubcategoriaNuevo(subcategoria) {
    let index = this.subcategoriasSeleccionadas.findIndex(s => s.idSubcategoria == subcategoria.idSubcategoria);
    //console.log(index);
    (index == -1) ? (this.subcategoriasSeleccionadas.push(subcategoria)) : (this.subcategoriasSeleccionadas.splice(index, 1));
    //console.log(this.subcategoriasSeleccionadas);
  }

  esSeleccionada(idSubcategoria) {
    let index = this.subcategoriasSeleccionadas.findIndex(s => s.idSubcategoria == idSubcategoria);
    return (index == -1) ?  false : true;
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
