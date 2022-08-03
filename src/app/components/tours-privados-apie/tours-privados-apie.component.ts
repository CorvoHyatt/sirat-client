import { Component, Input, OnInit, ViewChild, DoCheck, OnDestroy, Output, EventEmitter } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ProductosService } from "../../services/productos.service";
import { Producto } from "../../models/Producto";
import { DestinosService } from "../../services/destinos.service";
import { Destino } from "../../models/Destino";
import { ProductoInfo } from "../../models/ProductoInfo";
import { Cotizacion } from "../../models/Cotizacion";
import { CotizacionesService } from "../../services/cotizaciones.service";
import { DivisaBase } from "../../models/DivisaBase";
import { DivisasService } from "../../services/divisas.service";
import { ProductoAdquirido } from "../../models/ProductoAdquirido";
import { DatePipe, LocationStrategy, NgIf } from "@angular/common";
import { ProductoHorario } from "../../models/productoHorarios";
import { ProductoEntrada } from "../../models/ProductoEntrada";
import { ProductoOpcion } from "../../models/ProductoOpcion";
import { ProductoTarifa } from "../../models/ProductoTarifa";
import { Subcategoria } from "../../models/Subcategoria";
import { SubcategoriasService } from "../../services/subcategorias.service";
import { PorcentajeIncremento } from "../../models/PorcentajeIncremento";
import { Divisa } from "../../models/Divisa";
import { environment } from "src/environments/environment";
import { ProductosAdquiridosService } from "../../services/productos-adquiridos.service";
import { ProductosOpcionesAdquiridosService } from "../../services/productos-opciones-adquiridos.service";
import { ProductosTransporteAdquiridoService } from "../../services/productos-transporte-adquirido.service";
import Swal from "sweetalert2";
import { Canasta } from "src/app/models/Canasta";
import { CanastaService } from "../../services/canasta.service";
import { ComisionesAgentesService } from "src/app/services/comisiones-agentes.service";
import { VersionesService } from "src/app/services/versiones.service";
import { Version } from "src/app/models/Version";
import { UsuariosService } from "../../services/usuarios.service";
import { Usuario } from "src/app/models/Usuario";
import * as M from "materialize-css/dist/js/materialize";
import { SendDataToEditService } from "src/app/services/sendDataToEdit.service";
import { ProductosPreciosTotalesService } from 'src/app/services/productosPreciosTotales.service';
import { ProductosPreciosTotales } from "src/app/models/ProductosPreciosTotales";
import { ProductoOpcionAdquiridaUpgrade } from '../../models/ProductoOpcionAdquiridaUpgrade';
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
declare var $: any;

@Component({
  selector: "app-tours-privados-apie",
  templateUrl: "./tours-privados-apie.component.html",
  styleUrls: ["./tours-privados-apie.component.css"],
})
export class ToursPrivadosAPieComponent implements OnInit, DoCheck, OnDestroy {
  @Input() public editing: boolean = false;
  @Input() public adding: boolean = false;
  @Input() public idProductoAdquirido: number = 0;
  @Input() public totalPasajeros: number = null;
  @Input() public editingCarrito: boolean = false;
  @Output() public refresh = new EventEmitter<boolean>();
  @Output() public redirect = new EventEmitter<number>();

  private suscripciones: Subscription[] = [];
  public i18nOptions: Object = {
    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
    weekdays: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    weekdaysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
    weekdaysAbbrev: ["D", "L", "M", "M", "J", "V", "S"],
  };
  public dataSource;
  public displayedColumns: string[] = ["tour"];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  public productos: Producto[] = [];
  public destino: any = new Destino();
  public subcategoriaActual: Subcategoria = new Subcategoria();
  public categoriaActual: number = 0;
  public seleccion: boolean = false;
  public productoActual: any = new Producto();
  public productoInfoActual: ProductoInfo = new ProductoInfo();
  public cotizacion: Cotizacion = new Cotizacion();
  public divisaBase: DivisaBase = new DivisaBase();
  public productoAdquirido: any = new ProductoAdquirido();
  public productoAdquiridoBase: any = new ProductoAdquirido();
  public diasCerrados: string[] = [];
  public horarios: ProductoHorario[] = [];
  public totalPersonas: number = 0;
  public incrementoEntradas: number = 0;
  public productoEntradas: ProductoEntrada[] = [];
  public productoOpciones: ProductoOpcion[] = [];
  public productoTarifas: ProductoTarifa[] = [];
  public opcionesSeleccionadas: ProductoOpcion[] = [];
  public opcionesSeleccionadasBase: ProductoOpcion[] = [];
  public total: number = 0;
  public totalSinComision: number = 0;
  public subcategorias: Subcategoria[] = [];
  public holidayList = [`16-04`];
  public incrementoFechaHora: number = 0;
  public divisaActual: Divisa = new Divisa();
  public productosRelacionados: Producto[] = [];
  public usuario: any = new Usuario();
  public productoPrecioTotal: ProductosPreciosTotales = new ProductosPreciosTotales();
  public API_URI: string = ``;
  public tourPieCanasta: any = {};
  public comisionAgente: number = 0;
  public comision5rivesNueva: number = 0;
  public comisionAgenteNueva: number = 0;
  public mostrarComision5rives: boolean = false;
  public mostrarComisionAgente: boolean = false;
  public mejoras: ProductoOpcionAdquiridaUpgrade[] = [];
  public editado: boolean = false;
  public imagenesExistentes: any = [];
  public idProducto: number = 0;
  public images = [true, true, true];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productosService: ProductosService,
    private destinosService: DestinosService,
    private cotizacionesService: CotizacionesService,
    private divisasService: DivisasService,
    private subcategoriasService: SubcategoriasService,
    private datePipe: DatePipe,
    private productosAdquiridosService: ProductosAdquiridosService,
    private productosOpcionesAdquiridosService: ProductosOpcionesAdquiridosService,
    private productosTransporteAdquiridoService: ProductosTransporteAdquiridoService,
    private canastaService: CanastaService,
    private comisionesAgentesService: ComisionesAgentesService,
    private versionesService: VersionesService,
    private usuariosService: UsuariosService,
    private sendDataToEditService: SendDataToEditService,
    private productosPreciosTotalesService: ProductosPreciosTotalesService,
    private location: LocationStrategy,
    private activatedRoute: ActivatedRoute
  ) {

    this.activatedRoute.url.subscribe(url => {
      if (this.router.url.split("/").length != 4) { //Producto en especifico
        this.seleccion = true;
        setTimeout(() => {
          this.productosService.listProductoByIdProducto(Number.parseInt(this.router.url.split("/")[4])).subscribe(
            (resp: Producto) => {
              let p = resp;
              this.setProducto(p);
            }
          );
        }, 0);
      } else {
        this.seleccion = false;
      }
    });

    this.API_URI = environment.API_URI;

  }

  ngOnInit(): void {

    $('.collapsible').collapsible();


    $('.carousel').carousel({
      fullWidth: true, indicators: true
    });

    $('i#prev').click(function () {
      $('.carousel').carousel('prev');
    });

    $('i#next').click(function () {
      $('.carousel').carousel('next');
    });


    if (this.router.url.includes("cotizacionProductos")) {
      $(".tabs").tabs("select", "toursPrivadosAPie");
      console.log(this.router.url.split("/"));
      if (this.router.url.split("/").length == 4) {
        console.log("Entra en opcion 1");
        this.seleccion = false;
      } else {

        this.seleccion = true;
        this.idProducto = Number.parseInt(this.router.url.split("/")[4]);
        this.router.navigate([`/home/cotizacionProductos/toursPrivadosAPie/${this.router.url.split("/")[4]}`]);

        this.productosService.listImagenesExistentes(this.idProducto).subscribe(
          (imagenesExistentes: any) => {
            this.imagenesExistentes = imagenesExistentes;
            console.log("Imagenes existentes", this.imagenesExistentes);
            this.productosService.listProductoByIdProducto(this.idProducto).subscribe(
              (resp: Producto) => {
                let p = resp;
                this.setProducto(p);
              }
            );
          });
      }
    }

    setTimeout(() => {
      $('.datepicker').datepicker();
    }, 0);
    this.getUsuario();
    if (this.totalPasajeros != null) { }
    if (this.editing) {
      //console.log("editing carrtio", this.editingCarrito);
      $('#modalDetalleTourPie').modal({ dismissible: false });
      this.sendDataToEditService.getProduct("tourPie").subscribe(
        (res: any) => {
          console.log("res tour a pie", res);
          // this.idProductoAdquirido = res;
          this.seleccion = true;
          this.actualizacion(res);
        }
      );
    } else {
      this.destinosService.getActualDestino().subscribe(
        (destino: Destino) => {
          // //console.log("Estoy cambiando de destino...");
          if (Object.keys(destino).length === 0) return false;
          this.destino = destino;
          this.getSubcategorias();

        }
      );
    }
  }

  getUsuario() {
    let s = this.usuariosService.getUser().subscribe(usuario => {
      if (Object.keys(usuario).length === 0) return false;
      this.usuario = usuario;
    });
    this.suscripciones.push(s);
  }

  ngOnDestroy(): void {
    this.suscripciones.map(s => s.unsubscribe());
  }

  ngAfterViewChecked() {
    if (localStorage.getItem("productoAPie") != null) {

      let idProducto = Number.parseInt(localStorage.getItem("productoAPie"));
      localStorage.removeItem("productoAPie");
      this.router.navigate([`/home/cotizacionProductos/toursPrivadosAPie`, idProducto]);
      this.seleccion = true;


      this.productosService.listProductoByIdProducto(idProducto).subscribe(
        (resp: Producto) => {

          let p = resp;
          localStorage.removeItem("productoAPie");
          this.setProducto(p);
        }
      );
    }
  }


  ngDoCheck(): void {
    M.updateTextFields();
  }

  getSubcategorias() {
    this.subcategoriasService
      .listByCategoriaCiudad(1, this.destino.idCiudad)
      .subscribe((resp: Subcategoria[]) => {
        // //console.log("******* Subcategorias *******");
        // //console.log(resp);
        this.subcategorias = resp;
        if (this.subcategorias.length > 0) {
          this.subcategoriaActual = this.subcategorias[0];
          this.getCotizacion();
        } else {
          this.productos = [];
          this.dataSource = new MatTableDataSource(this.productos);
          this.dataSource.paginator = this.paginator;
        }
      });
  }





  getCotizacion() {
    ////console.log(`Viene de la nueva version`,localStorage.getItem(`idCotizacion`));
    //console.log("getCotizacion");
    this.cotizacionesService
      .list_one(this.destino.idCotizacion)
      .subscribe((resp: Cotizacion) => {
        this.cotizacion = resp;
        this.divisasService
          .divisaBase_getOne(this.cotizacion.divisa)
          .subscribe((resp: DivisaBase) => {
            this.divisaBase = resp;

            if (this.cotizacion.comisionAgente == 2) {
              if (this.editing) {
                this.getTours(0);
                this.comisionAgente = this.productoAdquirido.comisionAgente;
                if (this.totalPasajeros != null) {
                  this.totalPersonas = this.totalPasajeros;
                } else {
                  this.totalPersonas =
                    this.cotizacion.numM +
                    this.cotizacion.num18 +
                    this.cotizacion.num12;
                }
              } else {
                //Se incluye la comsión el agente
                this.comisionesAgentesService
                  .listByIdAgenteTipoActividad(this.cotizacion.idAgente, 3)
                  .subscribe(
                    //2 se refiere a que es la comisión sobre las disposiciones
                    (comisionAgente: number) => {
                      this.comisionAgente = comisionAgente;
                      this.getTours(0);
                      if (this.totalPasajeros != null) {
                        this.totalPersonas = this.totalPasajeros;
                      } else {
                        this.totalPersonas =
                          this.cotizacion.numM +
                          this.cotizacion.num18 +
                          this.cotizacion.num12;
                      }
                    }
                  );
              }
            } else {
              this.getTours(0);
              if (this.totalPasajeros != null) {
                this.totalPersonas = this.totalPasajeros;
              } else {
                this.totalPersonas =
                  this.cotizacion.numM +
                  this.cotizacion.num18 +
                  this.cotizacion.num12;
              }
            }
          });
      });
  }

  getTours(ii) {
    //console.log("getTours");

    if (!this.editing) {
      this.subcategoriaActual = this.subcategorias[ii];
      // this.seleccion = false;
      this.productosService.listByCiudadCategoriaSubcategoria(this.destino.idCiudad, 1, this.subcategorias[ii].idSubcategoria)
        .subscribe((resp: Producto[]) => {
          this.productos = resp;
          this.productos.map((product: any) => {
            if (product.reserva2meses === 1) {
              let fechaHabil = new Date(new Date().setMonth(new Date().getMonth() + 2));
              let fechaInicio = localStorage.getItem('fechaInicio');
              let minDate: any = new Date(fechaInicio += 'T00:00:00');
              if (minDate.getTime() >= fechaHabil.getTime()) {
                product.disabled = false;
              } else {
                product.disabled = true;
              }
            } else {
              product.disabled = false;
            }
          });
          this.dataSource = new MatTableDataSource(this.productos);
          this.dataSource.paginator = this.paginator;
        });
    } else {
      this.setProducto(this.productoActual);
    }
  }

  // getNombreSubCategoria() {
  //   return this.subCategorias.find(subCategoria => subCategoria.idSubCategoria == this.subcategoriaActual).nombre;
  // }

  setProducto(producto) {
    //console.log("setProducto");



    this.productoActual = producto;
    this.seleccion = true;
    console.log(this.productoActual.idProducto);
    setTimeout(() => {
      this.productosService
        .listProductosRelacionados(this.productoActual.titulo, 1)
        .subscribe((resp: Producto[]) => {
          // //console.log(resp);
          this.productosRelacionados = resp;
          ////console.log(`Productos relacionados`, this.productosRelacionados);
          this.getProductoInfoActual();
        });
    }, 0);
  }

  getProductoInfoActual() {
    this.productoAdquirido.descripcion = this.productoActual.descripcion;
    //console.log("getProductoInfoActual");
    ////console.log(`Obteniendo información del prodducto actual`);
    this.productosService
      .listProductoInfoByIdProducto(this.productoActual.idProducto)
      .subscribe((resp: ProductoInfo) => {
        ////console.log(this.productoActual);
        ////console.log(resp);
        this.productoInfoActual = resp[0];
        if (this.editing)
          this.productoInfoActual.com = this.productoAdquirido.comision;

        // if (!this.editing) {
        //   this.productoAdquirido.descripcion =
        //     `Cotización para el tour privado a pie ` +
        //     this.productoActual.titulo;
        // }
        // //console.log(this.productoInfoActual);

        this.divisasService
          .getOne(this.productoInfoActual.idDivisa)
          .subscribe((resp: Divisa) => {
            this.divisaActual = resp;

            if (!this.editing) {
              if (this.productoInfoActual.reserva2Meses == false) {
                this.productoAdquirido.fecha = this.datePipe.transform(
                  new Date(),
                  "yyyy-mm-dd"
                );
              } else {
                this.productoAdquirido.fecha = this.datePipe.transform(
                  new Date(new Date().setMonth(new Date().getMonth() + 2)),
                  "yyyy-mm-dd"
                );
              }
            }

            this.getDiasCerrados();
          });
      });
  }

  getDiasCerrados() {
    //console.log("getDiasCerrados");

    this.diasCerrados = [];

    this.productosService
      .listDiasCerradosByIdProducto(this.productoActual.idProducto)
      .subscribe((resp: any[]) => {
        resp.forEach((element) => {
          this.diasCerrados.push(element.fecha);
        });
        let jQueryInstance = this; // This line will assign all the angular instances to jQueryInstance variable.
        // //console.log("dias cerrados", this.diasCerrados);
        // function getFecha() {
        //   let fecha1 = localStorage.getItem('fechaInicio');
        //   let minDate: any = new Date(fecha1 += 'T00:00:00');
        //   if (jQueryInstance.productoInfoActual.reserva2Meses == false) {
        //     return minDate;
        //   } 
        //   else {
        //     return new Date(new Date().setMonth(new Date().getMonth() + 2));
        //   }
        // }
        let fecha1 = localStorage.getItem('fechaInicio');
        let minDate: any = new Date(fecha1 += 'T00:00:00');
        let fecha2 = localStorage.getItem('fechaFinal');
        let maxDate: any = new Date(fecha2 += 'T00:00:00');
        let date = minDate;
        if (this.editing) {
          date = new Date(this.productoAdquirido.fecha + 'T00:00:00');
        }
        $("#fechaTourPAP").datepicker({
          disableDayFn: function (date) {
            const dateAux = new Date(date.toISOString());
            let day = date.getDay();
            day = day.toString();
            var dateParsed =
              date.toISOString().split("T")[0].split("-")[2] +
              `-` +
              date.toISOString().split("T")[0].split("-")[1];
            if (jQueryInstance.diasCerrados.indexOf(dateParsed) > -1) {
              return true;
            } else if (jQueryInstance.diasCerrados.indexOf(day) > -1) {
              return true;
            } else {
              return false;
            }
            // return (
            //   jQueryInstance.diasCerrados.indexOf(dateParsed) > -1 //This checks if the date is in disabledDays
            // );
          },
          minDate: minDate, // set minimum date to "self explanatory"
          maxDate: maxDate,
          setDefaultDate: date,
          defaultDate: date,
          format: "yyyy-mm-dd",
          i18n: this.i18nOptions
        });
        this.getHorarios();
      });
  }

  getHorarios() {
    //console.log("getHorarios");

    this.productosService
      .listHorariosProducto(this.productoActual.idProducto)
      .subscribe((resp: ProductoHorario[]) => {
        this.horarios = resp;
        if (!this.editing) {
          this.productoAdquirido.horario = this.horarios[0].hora;
        }
        this.getProductoEntradas();
      });
  }

  getProductoEntradas() {
    //console.log("getProductoEntradas");

    this.productosService
      .listEntradasByIdProducto(this.productoActual.idProducto)
      .subscribe((resp: ProductoEntrada[]) => {
        this.productoEntradas = resp;
        this.getOpciones();
      });
  }

  getOpciones() {
    //console.log("getOpciones");
    this.productosService
      .listOpcionesByIdProducto(this.productoActual.idProducto)
      .subscribe((resp: ProductoOpcion[]) => {
        this.productoOpciones = resp;
        if (this.productoInfoActual.tarifaCientifica == 0) {
          this.getTarifas();
        }
      });
  }

  getTarifas() {
    //console.log("getTarifas");
    this.productosService
      .listTarifasIdProducto(this.productoActual.idProducto)
      .subscribe((resp: ProductoTarifa[]) => {
        this.productoTarifas = resp;
        // this.getTarifaTotal();
        this.getIncrementoFechaHora();
      });
  }

  setOpcionSeleccionada(ii, productoOpcion) {
    if (
      this.opcionesSeleccionadas.find((p) => p.idProductoOpcion == productoOpcion.idProductoOpcion) == undefined
    ) {
      this.opcionesSeleccionadas.push(productoOpcion);
    } else {
      this.opcionesSeleccionadas.splice(
        this.opcionesSeleccionadas.findIndex((p) => p.idProductoOpcion == productoOpcion.idProductoOpcion),
        1
      );

    }

    if (
      this.mejoras.findIndex((p) => p.idProductoOpcion == productoOpcion.idProductoOpcion) != -1
    ) {
      this.mejoras.splice(this.mejoras.findIndex((p) => p.idProductoOpcion == productoOpcion.idProductoOpcion), 1);
    }

    //console.log("opciones seleccionadas", this.opcionesSeleccionadas);
    this.getTarifaTotal();
  }

  esOpcionSeleccionada(productoOpcion) {
    if (
      this.opcionesSeleccionadas.find(
        (p) => p.idProductoOpcion == productoOpcion.idProductoOpcion
      ) == undefined
    ) {
      return false;
    } else {
      return true;
    }
  }

  getIncrementoFechaHora() {
    ////console.log("getIncrementoFechaHora");
    this.incrementoFechaHora = 0;
    this.productosService
      .incrementoByFecha(
        this.productoActual.idProducto,
        this.datePipe.transform(this.productoAdquirido.fecha, "dd-MM")
      )
      .subscribe(
        (res3) => {
          let porcentajes = res3 as PorcentajeIncremento[];
          if (porcentajes.length == 0) {
            this.productosService
              .incrementoByFechaVariable(
                this.productoActual.idProducto,
                this.datePipe.transform(this.productoAdquirido.fecha, "dd-MM")
              )
              .subscribe(
                (res4) => {
                  let porcentajes = res4 as PorcentajeIncremento[];
                  if (porcentajes.length == 0) {
                    this.productosService
                      .incrementoByHora(
                        this.productoActual.idProducto,
                        this.productoAdquirido.horario
                      )
                      .subscribe(
                        (res5) => {
                          let porcentajes = res5 as PorcentajeIncremento[];
                          if (porcentajes.length != 0) {
                            this.incrementoFechaHora =
                              porcentajes[0].porcentaje;
                          }

                          this.getTarifaTotal();
                        },
                        (err) => console.error(err)
                      );
                  } else {
                    this.incrementoFechaHora = porcentajes[0].porcentaje;
                    this.getTarifaTotal();
                  }
                },
                (err) => console.error(err)
              );
          } else {
            this.incrementoFechaHora = porcentajes[0].porcentaje;
            this.getTarifaTotal();
          }
        },
        (err) => console.error(err)
      );
  }

  setFecha(date) {
    if (date != undefined) {
      this.productoAdquirido.fecha = date;
    }
    this.verificarEdicion();
    this.getIncrementoFechaHora();
  }


  getTarifaTotal() {
    //    console.log("----getTarifaTotal-----");
    this.verificarEdicion();
    let tarifaTotal = 0;
    let incrementoAudifonos = 0;
    let incrementoEntrada = 0;
    let incrementoOpciones = 0;
    let incrementoHoraExtraGuia = 0;
    let incrementoGuiaAcademico = 0;
    let incrementoHorasExtras = 0;

    if (this.productoInfoActual.tarifaCientifica == 0) {
      //Tarifa por persona
      if (
        this.productoTarifas.find((tarifa) => tarifa.numPersonas === this.totalPersonas) !== undefined
      ) {
        //numero de personas * tarifa por persona según el rango
        tarifaTotal = this.productoTarifas.find((tarifa) => tarifa.numPersonas === this.totalPersonas).tarifa * this.totalPersonas;
      } else {
        if (this.totalPersonas > 10) {
          let producto = this.productoTarifas.find((product) => product.numPersonas === 11);
          if (producto) {
            tarifaTotal = (producto.tarifa * this.totalPersonas)
          }
          // tarifaTotal = this.productoTarifas.find((tarifa) => tarifa.numPersonas === 11).tarifa * this.totalPersonas;
        }
      }
    } else {
      tarifaTotal = this.productoInfoActual.tarifaCientifica;
    }
    if (this.totalPersonas >= 20) {
      incrementoAudifonos = this.productoInfoActual.audifonos * this.totalPersonas;
    }
    this.productoEntradas.forEach((entrada) => {
      incrementoEntrada =
        incrementoEntrada + this.cotizacion.numM * entrada.tarifaAdulto;
      if (18 >= entrada.minimoMenor && 18 <= entrada.maximoMenor) {
        incrementoEntrada = incrementoEntrada + this.cotizacion.num18 * entrada.tarifaMenor;
      } else {
        incrementoEntrada = incrementoEntrada + this.cotizacion.num18 * entrada.tarifaAdulto;
      }
      if (12 >= entrada.minimoMenor && 12 <= entrada.maximoMenor) {
        incrementoEntrada = incrementoEntrada + this.cotizacion.num12 * entrada.tarifaMenor;
      } else {
        incrementoEntrada = incrementoEntrada + this.cotizacion.num12 * entrada.tarifaAdulto;
      }
    });
    this.opcionesSeleccionadas.forEach((opcion) => {
      incrementoHoraExtraGuia = incrementoHoraExtraGuia + opcion.horasExtras * this.productoInfoActual.horaExtraGuia;
      incrementoOpciones = incrementoOpciones + this.cotizacion.numM * opcion.tarifaAdulto;
      if (18 >= opcion.minimoMenor && 18 <= opcion.maximoMenor) {
        incrementoOpciones = incrementoOpciones + this.cotizacion.num18 * opcion.tarifaMenor;
      } else {
        incrementoOpciones = incrementoOpciones + this.cotizacion.num18 * opcion.tarifaAdulto;
      }
      if (12 >= opcion.minimoMenor && 12 <= opcion.maximoMenor) {
        incrementoOpciones = incrementoOpciones + this.cotizacion.num12 * opcion.tarifaMenor;
      } else {
        incrementoOpciones = incrementoOpciones + this.cotizacion.num12 * opcion.tarifaAdulto;
      }
    });
    if (this.productoAdquirido.guiaAcademico) {
      incrementoGuiaAcademico = this.productoInfoActual.guiaAcademico;
    }
    incrementoHorasExtras = (this.productoAdquirido.horasExtras * this.productoInfoActual.horaExtraGuia);
    this.total =
      (tarifaTotal +
        incrementoAudifonos +
        incrementoEntrada +
        incrementoHoraExtraGuia +
        incrementoOpciones +
        incrementoGuiaAcademico +
        incrementoHorasExtras);
    this.total = this.total * (1 + this.incrementoFechaHora / 100);
    this.total = this.total / this.divisaActual.valor / this.divisaBase.valor;
    let porcentajeCom = this.productoInfoActual.com / 100;
    let porcentajegente = this.comisionAgente / 100;
    this.totalSinComision = this.total;
    this.total =
      this.total *
      (1 + porcentajeCom) *
      (1 + porcentajegente / (1 - porcentajegente));
    // console.log(this.total);
    // console.log(tarifaTotal);
    // console.log(incrementoAudifonos);
    // console.log(incrementoEntrada);
    // console.log(incrementoHoraExtraGuia);
    // console.log(incrementoOpciones);
    // console.log(incrementoGuiaAcademico);
    // console.log(incrementoHorasExtras);
  }

  irAProducto(producto) {
    if (producto.categoria == 1) {
      localStorage.setItem("productoAPie", JSON.stringify(producto.idProducto));
      // this.router.navigate([`/home/cotizacionProductos/toursPrivadosAPie/${producto.idProducto}`]); 
      $(".tabs").tabs("select", "toursPrivadosAPie");
    }
    if (producto.categoria == 2) {
      localStorage.setItem(
        "productoTransporte",
        JSON.stringify(producto.idProducto)
      );
      console.log(producto.idProducto);
      // this.router.navigate([`/home/cotizacionProductos/toursPrivadosEnTransporte/${producto.idProducto}` ]); 
      $(".tabs").tabs("select", "toursPrivadosEntransporte");
    }
    if (producto.categoria == 3) {
      // //console.log(producto);
      localStorage.setItem(
        "productoGrupo",
        JSON.stringify(producto.idProducto)
      );
      //this.router.navigate([`/home/cotizacionProductos/toursPrivadosEngrupo/${producto.idProducto}`]); 
      $(".tabs").tabs("select", "toursPrivadosEngrupo");
    }
  }

  async agregar() {
    // console.log(this.mejoras);
    this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
    this.productoPrecioTotal.tipoProducto = 7;
    let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
    this.productoPrecioTotal.precioPorPersona = (this.total / viajeros);
    this.productoPrecioTotal.total = this.total;
    if (this.adding) {
      const { value: opcional } = await Swal.fire({
        input: 'checkbox',
        inputValue: 0,
        backdrop: false,
        inputPlaceholder:
          'Es un tour privado a pie opcional',
        confirmButtonText:
          'Continuar <i class="fa fa-arrow-right"></i>',
      })

      this.productoAdquirido.tarifa = this.totalSinComision;
      this.productoAdquirido.idProducto = this.productoInfoActual.idProducto;
      this.productoAdquirido.comision = this.productoInfoActual.com;
      this.productoAdquirido.comisionAgente = this.comisionAgente;
      this.productoAdquirido.opcional = opcional;

      this.productoAdquirido.nuevo = true;
      this.productoAdquirido.id = this.productoAdquirido.idProductoAdquirido;
      this.productoAdquirido.type = "Tour privado a pie";
      this.productoAdquirido.precio = this.productoAdquirido.tarifa;
      this.productoAdquirido.valido = true;
      this.productoAdquirido.idToSend = 3;
      this.productoAdquirido.idCiudad = this.destino.idCiudad;
      this.productoAdquirido.productoPrecioTotal = this.productoPrecioTotal;
      let product: any[] = [];
      product.push(this.productoAdquirido);
      product.push(this.opcionesSeleccionadas);
      product.push(undefined); //no tiene transporte
      product.push(this.mejoras);
      this.sendDataToEditService.sendProductToUpdate(product);
      $(".modalAddProducts").modal("close");
      this.productoPrecioTotal = new ProductosPreciosTotales();
      Swal.fire({
        position: "center",
        icon: "success",
        title: `Producto agregado correctamente`,
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      const { value: opcional } = await Swal.fire({
        input: 'checkbox',
        inputValue: 0,
        backdrop: false,
        inputPlaceholder:
          'Es un tour privado a pie opcional',
        confirmButtonText:
          'Continuar <i class="fa fa-arrow-right"></i>',
      })
      this.productoAdquirido.tarifa = this.totalSinComision;
      this.productoAdquirido.idProducto = this.productoInfoActual.idProducto;
      this.productoAdquirido.comision = this.productoInfoActual.com;
      this.productoAdquirido.comisionAgente = this.comisionAgente;
      this.productoAdquirido.opcional = opcional;
      this.productosAdquiridosService.create(this.productoAdquirido, this.opcionesSeleccionadas, undefined, this.mejoras).subscribe((resp: any) => {
          this.mejoras = [];
          this.productoAdquirido.idProductoAdquirido = resp.insertId;
          this.productoAdquirido.tipoNombre = "tourPie";
          this.productoAdquirido.tipo = 71;
          this.productoAdquirido.idCiudad = this.destino.idCiudad;
          this.productoAdquirido.ciudad = this.destino.ciudad;
          this.productoAdquirido.titulo = this.productoActual.titulo;
          this.productoAdquirido.categoria = this.productoActual.categoria;

          // this.tourPieCanasta.idProducto = "tourPie";
          // this.tourPieCanasta.tipo = 71;
          // this.tourPieCanasta.opcional = opcional;
          // this.tourPieCanasta.idProductoAdquirido = resp.insertId;
          // this.tourPieCanasta.fecha = this.productoAdquirido.fecha;
          // this.tourPieCanasta.idCiudad = this.destino.idCiudad;
          // this.tourPieCanasta.ciudad = this.destino.ciudad;
          // this.tourPieCanasta.titulo = this.productoActual.titulo;
          // this.tourPieCanasta.horario = this.productoAdquirido.horario;
          // this.tourPieCanasta.comision = this.productoAdquirido.comision;
          // this.tourPieCanasta.comisionAgente = this.productoAdquirido.comisionAgente;
          // this.tourPieCanasta.tarifa = this.totalSinComision;
          this.canastaService.addProduct(this.productoAdquirido);
          delete this.productoAdquirido.tipoNombre;
          delete this.productoAdquirido.tipo;
          delete this.productoAdquirido.idCiudad;

          let canasta = new Canasta();
          canasta.idCotizacion = this.cotizacion.idCotizacion;
          canasta.idActividad = this.productoAdquirido.idProductoAdquirido;
          canasta.tipo = 7; //Viene de la tabla productos adquridos
          this.productoPrecioTotal.idProducto = resp.insertId;
          this.productosPreciosTotalesService.create(this.productoPrecioTotal).subscribe((resTotal: any) => {
            this.productoPrecioTotal = new ProductosPreciosTotales();
          });
          this.canastaService.create(canasta).subscribe((resp3) => {
            let version = new Version();
            version.idActividad = this.productoAdquirido.idProductoAdquirido;
            version.tipo = 7; //Es un producto
            // version.version = 1; //Es una insecion nueva por lo que se inicaliza en 1
            version.idCotizacion = this.cotizacion.idCotizacion;
            version.versionCotizacion = this.cotizacion.version;
            version.accion = 1;
            // this.usuariosService.list_oneByCorreo(localStorage.getItem(`correo`)).subscribe((usuario: Usuario) => {
            version.idUsuario = this.usuario.idUsuario;
            this.versionesService.create(version).subscribe((resp) => {
              this.productoAdquirido = new ProductoAdquirido();
              this.getProductoInfoActual();
              this.redirect.emit(1);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Agregado correctamente",
                showConfirmButton: false,
                timer: 1500,
              });
            });
          });
          // });
        });
    }
  }

  cambiarComision5rives() {
    this.productoInfoActual.com = this.comision5rivesNueva;
    this.comision5rivesNueva = this.productoInfoActual.com;
    this.getTarifaTotal();
    this.mostrarComision5rives = false;
    this.productoAdquirido.comision = this.productoInfoActual.com;
    this.verificarEdicion();
  }


  cambiarComisionAgente() {
    this.comisionAgente = this.comisionAgenteNueva;
    this.comisionAgenteNueva = this.comisionAgente;
    this.getTarifaTotal();
    this.mostrarComisionAgente = false;
  }



  actualizacion(pa) {
    this.productoAdquirido = pa;
    this.productoAdquiridoBase = Object.assign({}, pa);
    this.productoAdquirido.fecha = this.productoAdquirido.fecha.split(`T`)[0];
    this.productoAdquiridoBase.fecha = this.productoAdquirido.fecha;
    this.productosService
      .listProductoByIdProducto_vista(this.productoAdquirido.idProducto)
      .subscribe((p: any) => {
        this.productoActual = p;
        ////console.log(this.productoActual);
        this.productosService
          .listProductoInfoByIdProducto(this.productoAdquirido.idProducto)
          .subscribe((pia: ProductoInfo) => {
            this.productosOpcionesAdquiridosService
              .listByIdProductoAdquirido(
                this.productoAdquirido.idProductoAdquirido
              )
              .subscribe((opcionesSeleccionadas: ProductoOpcion[]) => {
                this.opcionesSeleccionadas = opcionesSeleccionadas;
                this.opcionesSeleccionadasBase = Object.assign([], opcionesSeleccionadas);
                this.productoInfoActual.com = this.productoAdquirido.comision;
                this.productoInfoActual = pia[0];
                this.destino.idCiudad = this.productoActual.idCiudad;
                this.destino.idCotizacion = Number(
                  localStorage.getItem(`idCotizacion`)
                );
                ////console.log(this.opcionesSeleccionadas);


                //console.log("editibg antesssss ", this.editingCarrito);
                if (this.editingCarrito) {
                  this.productosAdquiridosService.getOpcionesAdquiridas(this.productoAdquirido.idProductoAdquirido).subscribe(
                    (resOpciones: ProductoOpcion[]) => {
                      this.opcionesSeleccionadas = resOpciones;
                      //console.log("opciones seleccionadas editar carrito",  this.opcionesSeleccionadas);
                      this.productosAdquiridosService.getMejorasOpciones(this.productoAdquirido.idProductoAdquirido).subscribe(
                        (resMejorasOpciones: ProductoOpcionAdquiridaUpgrade[]) => {
                          this.mejoras = resMejorasOpciones;
                          //console.log("mejoras opciones seleccionadas editar carrito",  this.mejoras);

                          this.total = this.productoAdquirido.precio;
                          this.getCotizacion();
                        }
                      );
                    }
                  );
                } else {
                  this.getCotizacion();
                }
              });
          });
      });
    //});
  }

  abrirModalDetalle() {
    $('#modalDetalleTourPie').modal('open');
  }

  async actualizar() {
    this.productoAdquirido.idProductoAdquirido = 0;
    this.productoAdquirido.id = this.idProductoAdquirido;
    this.productoAdquirido.type = 'Tour privado a pie';
    this.productoAdquirido.tarifa = this.totalSinComision;
    this.productoAdquirido.idProducto = this.productoInfoActual.idProducto;
    this.productoAdquirido.comision = this.productoInfoActual.com;
    this.productoAdquirido.comisionAgente = this.comisionAgente;
    this.productoAdquirido.notasVersion = $('#detalle').val();
    this.productoAdquirido.editado = true;
    this.productoAdquirido.valido = true;
    if (this.productoAdquirido.notasVersion.trim() === '') {
      M.toast({
        html: 'Error: El campo es obligatorio',
        classes: 'rounded red darken-3'
      });
    } else {

      // let product: any[] = [];
      // product.push(this.productoAdquirido);
      // product.push(this.opcionesSeleccionadas);
      // product.push(undefined); //no tiene transporte
      // product.push(this.mejoras);

      this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
      this.productoPrecioTotal.tipoProducto = 7;
      let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
      this.productoPrecioTotal.precioPorPersona = (this.total / viajeros);
      this.productoPrecioTotal.total = this.total;
      this.productoAdquirido.productoPrecioTotal = this.productoPrecioTotal;

      this.sendDataToEditService.sendProductToUpdate([
        this.productoAdquirido,
        this.opcionesSeleccionadas,
        undefined,
        undefined
      ]);
      this.editado = false;

      $('.modalSendProducts').modal('close');
      $('#modalDetalleTourPie').modal('close');

      this.productoAdquirido = new ProductoAdquirido();
      this.getProductoInfoActual();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Actualizado correctamente",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }



  hayMejoras() {
    return (this.opcionesSeleccionadas.length < this.productoOpciones.length) ? true : false;
  }


  getDiferencia(idProductoOpcion) {

    this.getTarifaTotal();
    let mejoras = this.opcionesSeleccionadas.slice();;
    let opcion = this.productoOpciones.find(po => po.idProductoOpcion == idProductoOpcion);
    mejoras.push(opcion);
    let tarifaTotal = 0;
    let incrementoAudifonos = 0;
    let incrementoEntrada = 0;
    let incrementoOpciones = 0;
    let incrementoHoraExtraGuia = 0;
    let incrementoGuiaAcademico = 0;
    let incrementoHorasExtras = 0;
    let totalMejora = 0;
    if (this.productoInfoActual.tarifaCientifica == 0) {
      //Tarifa por persona
      if (
        this.productoTarifas.find((tarifa) => tarifa.numPersonas === this.totalPersonas) !== undefined
      ) {
        //numero de personas * tarifa por persona según el rango
        tarifaTotal = this.productoTarifas.find((tarifa) => tarifa.numPersonas === this.totalPersonas).tarifa * this.totalPersonas;
      } else {
        if (this.totalPersonas > 10) {
          let producto = this.productoTarifas.find((product) => product.numPersonas === 11);
          if (producto) {
            tarifaTotal = (producto.tarifa * this.totalPersonas)
          }
          // tarifaTotal = this.productoTarifas.find((tarifa) => tarifa.numPersonas === 11).tarifa * this.totalPersonas;
        }
      }
    } else {
      tarifaTotal = this.productoInfoActual.tarifaCientifica;
    }
    if (this.totalPersonas >= 20) {
      incrementoAudifonos = this.productoInfoActual.audifonos * this.totalPersonas;
    }
    this.productoEntradas.forEach((entrada) => {
      incrementoEntrada =
        incrementoEntrada + this.cotizacion.numM * entrada.tarifaAdulto;
      if (18 >= entrada.minimoMenor && 18 <= entrada.maximoMenor) {
        incrementoEntrada = incrementoEntrada + this.cotizacion.num18 * entrada.tarifaMenor;
      } else {
        incrementoEntrada = incrementoEntrada + this.cotizacion.num18 * entrada.tarifaAdulto;
      }
      if (12 >= entrada.minimoMenor && 12 <= entrada.maximoMenor) {
        incrementoEntrada = incrementoEntrada + this.cotizacion.num12 * entrada.tarifaMenor;
      } else {
        incrementoEntrada = incrementoEntrada + this.cotizacion.num12 * entrada.tarifaAdulto;
      }
    });
    mejoras.forEach((opcion) => {
      incrementoHoraExtraGuia = incrementoHoraExtraGuia + opcion.horasExtras * this.productoInfoActual.horaExtraGuia;
      incrementoOpciones = incrementoOpciones + this.cotizacion.numM * opcion.tarifaAdulto;
      if (18 >= opcion.minimoMenor && 18 <= opcion.maximoMenor) {
        incrementoOpciones = incrementoOpciones + this.cotizacion.num18 * opcion.tarifaMenor;
      } else {
        incrementoOpciones = incrementoOpciones + this.cotizacion.num18 * opcion.tarifaAdulto;
      }
      if (12 >= opcion.minimoMenor && 12 <= opcion.maximoMenor) {
        incrementoOpciones = incrementoOpciones + this.cotizacion.num12 * opcion.tarifaMenor;
      } else {
        incrementoOpciones = incrementoOpciones + this.cotizacion.num12 * opcion.tarifaAdulto;
      }
    });

    if (this.productoAdquirido.guiaAcademico) {
      incrementoGuiaAcademico = this.productoInfoActual.guiaAcademico;
    }
    incrementoHorasExtras = (this.productoAdquirido.horasExtras * this.productoInfoActual.horaExtraGuia);
    totalMejora =
      (tarifaTotal +
        incrementoAudifonos +
        incrementoEntrada +
        incrementoHoraExtraGuia +
        incrementoOpciones +
        incrementoGuiaAcademico +
        incrementoHorasExtras);
    totalMejora = totalMejora * (1 + this.incrementoFechaHora / 100);
    totalMejora = totalMejora / this.divisaActual.valor / this.divisaBase.valor;
    let porcentajeCom = this.productoInfoActual.com / 100;
    let porcentajegente = this.comisionAgente / 100;

    totalMejora =
      totalMejora *
      (1 + porcentajeCom) *
      (1 + porcentajegente / (1 - porcentajegente));

    return totalMejora - this.total;

  }


  setMejoras(idProductoOpcion) {
    this.mejoras = [];

    for (let index = 0; index < this.productoOpciones.length; index++) {

      if (this.productoOpciones[index].idProductoOpcion != idProductoOpcion) {
        $(`#${this.productoOpciones[index].idProductoOpcion}_mtpap`).prop('checked', false);

      }
    }

    let poau = new ProductoOpcionAdquiridaUpgrade();
    poau.idCotizacion = this.cotizacion.idCotizacion;
    poau.idProductoOpcion = idProductoOpcion;
    poau.diferencia = this.getDiferencia(idProductoOpcion);
    poau.fecha = this.productoAdquirido.fecha;
    if (this.adding) {
      poau.versionCotizacion = this.cotizacion.version + 1;
    }
    let index = this.mejoras.findIndex(o => o.idProductoOpcion == poau.idProductoOpcion);
    (index == -1) ? this.mejoras.push(poau) : this.mejoras.splice(index, 1);
  }

  setHorario(value) {
    this.productoAdquirido.horario = value;
    this.verificarEdicion();
    this.getIncrementoFechaHora();
  }

  verificarEdicion() {
    if (this.editing) {
      if (JSON.stringify(this.productoAdquiridoBase) != JSON.stringify(this.productoAdquirido) || JSON.stringify(this.opcionesSeleccionadas) != JSON.stringify(this.opcionesSeleccionadasBase)) {
        this.editado = true;
      } else {
        this.editado = false;
      }
    }
  }

  cerrarModalEditar() {
    $('.modalSendProducts').modal('close');
  }

  actualizarCarrito() {

    this.productoAdquirido.tarifa = this.totalSinComision;
    this.productoAdquirido.idProducto = this.productoInfoActual.idProducto;
    this.productoAdquirido.comision = this.productoInfoActual.com;
    this.productoAdquirido.comisionAgente = this.comisionAgente;
    this.productoAdquirido.total = this.total;
    this.productoAdquirido.idCotizacion = this.cotizacion.idCotizacion;
    let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
    this.productoAdquirido.precioPorPersona = (this.total / viajeros);

    //console.log(this.productoAdquirido);
    this.productosAdquiridosService.update(this.productoAdquirido, this.opcionesSeleccionadas, undefined, this.mejoras).subscribe(
      res => {
        // this.editingCarrito = false;
        this.refresh.emit(true);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Actualizado correctamente`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }

  esOpcion(idProductoOpcion) {
    return (this.opcionesSeleccionadas.find(opcion => opcion.idProductoOpcion == idProductoOpcion) != undefined) ? true : false;
  }

  esMejoraOpcion(idProductoOpcion) {
    return (this.mejoras.find(mejora => mejora.idProductoOpcion == idProductoOpcion) != undefined) ? true : false;
  }
}
