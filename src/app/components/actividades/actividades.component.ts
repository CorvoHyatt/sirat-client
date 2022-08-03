import { DatePipe, LocationStrategy } from "@angular/common";
import { Component, Input, OnInit, ViewChild, DoCheck, OnDestroy, EventEmitter, Output } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Canasta } from "src/app/models/Canasta";
import { Cotizacion } from "src/app/models/Cotizacion";
import { Destino } from "src/app/models/Destino";
import { Divisa } from "src/app/models/Divisa";
import { DivisaBase } from "src/app/models/DivisaBase";
import { PorcentajeIncremento } from "src/app/models/PorcentajeIncremento";
import { Producto } from "src/app/models/Producto";
import { ProductoAdquirido } from "src/app/models/ProductoAdquirido";
import { ProductoHorario } from "src/app/models/productoHorarios";
import { ProductoInfo } from "src/app/models/ProductoInfo";
import { Subcategoria } from "src/app/models/Subcategoria";
import { Usuario } from "src/app/models/Usuario";
import { Version } from "src/app/models/Version";
import { CanastaService } from "src/app/services/canasta.service";
import { ComisionesAgentesService } from "src/app/services/comisiones-agentes.service";
import { CotizacionesService } from "src/app/services/cotizaciones.service";
import { DestinosService } from "src/app/services/destinos.service";
import { DivisasService } from "src/app/services/divisas.service";
import { ProductosAdquiridosService } from "src/app/services/productos-adquiridos.service";
import { ProductosOpcionesAdquiridosService } from "src/app/services/productos-opciones-adquiridos.service";
import { ProductosTransporteAdquiridoService } from "src/app/services/productos-transporte-adquirido.service";
import { ProductosService } from "src/app/services/productos.service";
import { SubcategoriasService } from "src/app/services/subcategorias.service";
import { VersionesService } from "src/app/services/versiones.service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import * as M from "materialize-css/dist/js/materialize";
import { UsuariosService } from "../../services/usuarios.service";
import { SendDataToEditService } from "src/app/services/sendDataToEdit.service";
import { ProductosPreciosTotalesService } from 'src/app/services/productosPreciosTotales.service';
import { ProductosPreciosTotales } from 'src/app/models/ProductosPreciosTotales';
import { ProductoOpcion } from 'src/app/models/ProductoOpcion';
import { ProductoOpcionAdquiridaUpgrade } from 'src/app/models/ProductoOpcionAdquiridaUpgrade';
import { ProductoTransporteUpgrade } from 'src/app/models/ProductoTransporteUpgrade';
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

declare var $: any;

@Component({
  selector: "app-actividades",
  templateUrl: "./actividades.component.html",
  styleUrls: ["./actividades.component.css"],
})
export class ActividadesComponent implements OnInit, DoCheck, OnDestroy {
  @Input() public editing: boolean = false;
  @Input() public adding: boolean = false;
  @Input() public idProductoAdquirido: number = 0;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
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
  public actividadCanasta: any = {};
  public dataSource;
  public displayedColumns: string[] = ["tour"];
  public subcategorias: Subcategoria[] = [];
  public subcategoriaActual: Subcategoria = new Subcategoria();
  public destino: any = new Destino();
  public cotizacion: Cotizacion = new Cotizacion();
  public divisaBase: DivisaBase = new DivisaBase();
  public totalPersonas: number = 0;
  public seleccion: boolean = false;
  public productos: Producto[] = [];
  public API_URI: string = ``;
  public productoActual: Producto = new Producto();
  public productoInfoActual: ProductoInfo = new ProductoInfo();
  public productoAdquirido: any = new ProductoAdquirido();
  public productoAdquiridoBase: any = new ProductoAdquirido();
  public divisaActual: Divisa = new Divisa();
  public diasCerrados: string[] = [];
  public horarios: ProductoHorario[] = [];
  public usuario: any = new Usuario();
  public productoPrecioTotal: ProductosPreciosTotales = new ProductosPreciosTotales();
  public incrementoFechaHora: number = 0;
  public total: number = 0;
  public totalSinComision: number = 0;
  public trasportes: any[] = [];
  public transporteSeleccionado: any;
  public transporteSeleccionadoBase: any;
  public indexTS: number = 0; //Index de la lista de transporte
  public t: boolean = false; //Si seleccionó elegir un transporte
  public comisionAgente: number = 0;
  public comision5rivesNueva: number = 0;
  public comisionAgenteNueva: number = 0;
  public mostrarComision5rives: boolean = false;
  public mostrarComisionAgente: boolean = false;
  public productoOpciones: ProductoOpcion[] = [];
  public opcionesSeleccionadas: ProductoOpcion[] = [];
  public opcionesSeleccionadasBase: ProductoOpcion[] = [];

  public mejoras: ProductoOpcionAdquiridaUpgrade[] = [];
  public mejorasTransporte: ProductoTransporteUpgrade[] = [];
  public editado: boolean = false;
  public idProducto = 0;


  constructor(
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
    private router: Router,
    private activatedRoute : ActivatedRoute

  ) {
    this.API_URI = environment.API_URI;
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
  }

  ngOnInit(): void {
    $('.collapsible').collapsible();
    $('.carousel').carousel({fullWidth: true,indicators: true
    });

    if (this.router.url.includes("cotizacionProductos")) {
      $(".tabs").tabs("select", "actividades");
      console.log(this.router.url.split("/"));
      if (this.router.url.split("/").length == 4) {
        console.log("Entra en opcion 1");
        this.seleccion = false;
      } else {
        
        this.seleccion = true;
        this.idProducto = Number.parseInt(this.router.url.split("/")[4]);
        this.router.navigate([`/home/cotizacionProductos/actividades/${this.router.url.split("/")[4]}`]); 

        this.productosService.listProductoByIdProducto(Number.parseInt(this.router.url.split("/")[4])).subscribe(
          (resp: Producto) => {
            let p = resp;
            this.setProducto(p);
          } 
        );

      }
    } 


    setTimeout(() => {
      this.initDatepicker();
    }, 2000);

    this.getUsuario();
    if (this.editing) {
      $('#modalDetalleActividad').modal({ dismissible: false });
      this.sendDataToEditService.getProduct("actividad").subscribe(
        (res: any) => {
          //this.idProductoAdquirido = res;
          this.seleccion = true;
          this.actualizacion(res);
        },
        (err: any) => {
          console.log(err);
        }
      );
    } else {
      this.destinosService.getActualDestino().subscribe(
        (destino: Destino) => {
          if (Object.keys(destino).length === 0) return false;
          this.destino = destino;
          this.getSubcategorias();
         // this.getCotizacion();
        }
      );
    }
  }

  getUsuario(){
    let s = this.usuariosService.getUser().subscribe(usuario => {
      if(Object.keys(usuario).length === 0) return false;
      this.usuario = usuario;
    });
    this.suscripciones.push(s);
  }

  ngOnDestroy(): void{
    this.suscripciones.map(s => s.unsubscribe());
  }

  ngDoCheck(): void {
    M.updateTextFields();
  }

  getSubcategorias() {
    this.subcategoriasService
    .listByCategoriaCiudad(4, this.destino.idCiudad)
    .subscribe((resp: Subcategoria[]) => {
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
    this.cotizacionesService
      .list_one(this.destino.idCotizacion)
      .subscribe((resp: Cotizacion) => {
        this.cotizacion = resp;
        this.divisasService
          .divisaBase_getOne(this.cotizacion.divisa)
          .subscribe((resp: DivisaBase) => {
            this.divisaBase = resp;

            if (this.cotizacion.comisionAgente == 2) {
              //Se incluye la comsión el agente
              this.comisionesAgentesService
                .listByIdAgenteTipoActividad(this.cotizacion.idAgente, 6)
                .subscribe(
                  //2 se refiere a que es la comisión sobre las disposiciones
                  (comisionAgente: number) => {
                    if (this.editing) {
                      this.getActividades(0);
                      this.comisionAgente = this.productoAdquirido.comisionAgente;
                      this.totalPersonas =
                        this.cotizacion.numM +
                        this.cotizacion.num18 +
                        this.cotizacion.num12;
                    } else {
                      this.comisionesAgentesService
                        .listByIdAgenteTipoActividad(
                          this.cotizacion.idAgente,
                          4
                        )
                        .subscribe(
                          //2 se refiere a que es la comisión sobre las disposiciones
                          (comisionAgente: number) => {
                            this.comisionAgente = comisionAgente;
                            this.getActividades(0);
                            this.totalPersonas =
                              this.cotizacion.numM +
                              this.cotizacion.num18 +
                              this.cotizacion.num12;
                          }
                        );
                    }
                  }
                );
            } else {
              this.getActividades(0);
              this.totalPersonas =
                this.cotizacion.numM +
                this.cotizacion.num18 +
                this.cotizacion.num12;
            }
          });
      });
  }

  getActividades(ii) {
    if (!this.editing) {
      this.subcategoriaActual = this.subcategorias[ii];
      //this.seleccion = false;
      this.productosService.listByCiudadCategoriaSubcategoria(this.destino.idCiudad, 4, this.subcategorias[ii].idSubcategoria)
        .subscribe((resp: Producto[]) => {
          this.productos = resp;
          this.productos.map((product: any) => {
            if(product.reserva2meses === 1){
              let fechaHabil = new Date(new Date().setMonth(new Date().getMonth() + 2));
              let fechaInicio = localStorage.getItem('fechaInicio');
              let minDate: any = new Date(fechaInicio += 'T00:00:00');
              if(minDate.getTime() >= fechaHabil.getTime()){
                product.disabled = false;
              }else{
                product.disabled = true;
              }
            }else{
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

  setProducto(producto) {
    this.productoActual = producto;
    this.seleccion = true;
    this.getProductoInfoActual();
  }

  getProductoInfoActual() {
    this.productoAdquirido.descripcion = this.productoActual.descripcion;
    this.productosService
      .listProductoInfoByIdProducto(this.productoActual.idProducto)
      .subscribe((resp: ProductoInfo) => {
        this.productoInfoActual = resp[0];
        if (this.editing)
          this.productoInfoActual.com = this.productoAdquirido.comision;

        // if (!this.editing) {
        //   this.productoAdquirido.descripcion =
        //     `Cotización para el tour privado a pie ` +
        //     this.productoActual.titulo;
        // }
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
            this.getTransportes();
            this.getOpciones();
          });
      });
  }

  getDiasCerrados() {
    this.diasCerrados = [];

    this.productosService
      .listDiasCerradosByIdProducto(this.productoActual.idProducto)
      .subscribe((resp: any[]) => {
        resp.forEach((element) => {
          this.diasCerrados.push(element.fecha);
        });
        let jQueryInstance = this; // This line will assign all the angular instances to jQueryInstance variable.
        // function getFecha() {
        //   if (jQueryInstance.productoInfoActual.reserva2Meses == false) {
        //     let fecha1 = localStorage.getItem('fechaInicio');
        //     let minDate: any = new Date(fecha1 += 'T00:00:00');
        //     return minDate;
        //   } else {
        //     return new Date(new Date().setMonth(new Date().getMonth() + 2));
        //   }
        // }
        let fecha1 = localStorage.getItem('fechaInicio');
        let minDate: any = new Date(fecha1 += 'T00:00:00');
        let fecha2 = localStorage.getItem('fechaFinal');
        let maxDate: any = new Date(fecha2 += 'T00:00:00');
        let date = minDate;
        if(this.editing){
          date = new Date(this.productoAdquirido.fecha + 'T00:00:00');
        }
        $("#fechaA").datepicker({
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
            } else if(jQueryInstance.diasCerrados.indexOf(day) > -1) {
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
    this.productosService
      .listHorariosProducto(this.productoActual.idProducto)
      .subscribe((resp: ProductoHorario[]) => {
        this.horarios = resp;
        // console.log(`Horarios de actividades`, this.horarios);
        if(!this.editing) this.productoAdquirido.horario = this.horarios[0].hora;
      });
  }

  setFecha() {
    this.productoAdquirido.fecha = $("#fechaA").val();
    this.getIncrementoFechaHora();
    this.verificarEdicion();
  }

  getIncrementoFechaHora() {
    // console.log(`Producto adqurido`, this.productoAdquirido);

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

  getTarifaTotal() {
    this.verificarEdicion();
    // console.log(`Información de la actividad actual`);
    // console.log(this.productoInfoActual);
    let tarifaBase = 0;
    let incrementoGuiaEspecializado = 0;
    let incrementoAudioguia = 0;
    let incrementoTransporte = 0;
    let incrementoOpciones = 0;
    let incrementoHoraExtraGuia = 0;

    // console.log(this.productoInfoActual.tarifaCientifica);
    tarifaBase =
      this.cotizacion.numM * this.productoInfoActual.tarifaCientifica;
    // console.log(tarifaBase);
    if (
      18 >= this.productoInfoActual.minimoMenor &&
      18 <= this.productoInfoActual.maximoMenor
    ) {
      // console.log(
      //   `aplica tarifa menor para 18`,
      //   this.productoInfoActual.tarifaMenor
      // );
      // console.log(tarifaBase);
      tarifaBase =
        tarifaBase +
        this.cotizacion.num18 * this.productoInfoActual.tarifaMenor;
    } else {
      tarifaBase =
        tarifaBase +
        this.cotizacion.num18 * this.productoInfoActual.tarifaCientifica;
    }

    if (
      12 >= this.productoInfoActual.minimoMenor &&
      12 <= this.productoInfoActual.maximoMenor
    ) {
      // console.log(
      //   `aplica tarifa menor para 12`,
      //   this.productoInfoActual.tarifaMenor
      // );
      // console.log(tarifaBase);
      tarifaBase =
        tarifaBase +
        this.cotizacion.num12 * this.productoInfoActual.tarifaMenor;
    } else {
      // console.log(`no aplica tarifa menor para 12`);
      tarifaBase =
        tarifaBase +
        this.cotizacion.num12 * this.productoInfoActual.tarifaCientifica;
    }

    if (this.productoAdquirido.guiaEspecializado) {
      incrementoGuiaEspecializado = this.productoInfoActual.guiaEspecializado;
    }

    if (this.productoAdquirido.audioguia) {
      incrementoAudioguia = this.productoInfoActual.audioguia;
    }

    if (this.t) {
      incrementoTransporte = this.trasportes[this.indexTS].tarifa;
    }

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

    // console.log(`Tarifa base`, tarifaBase);
    this.total =
      tarifaBase +
      incrementoGuiaEspecializado +
      incrementoAudioguia +
      incrementoTransporte+
      incrementoHoraExtraGuia +
      incrementoOpciones ;
    this.total = this.total / this.divisaActual.valor / this.divisaBase.valor;

    // console.log(`Tarifa antes de incrementos`);
    // console.log(this.total);

    // console.log(`Tarifa despues de incrementos fecha hora`);
    this.total = this.total * (1 + this.incrementoFechaHora / 100);
    // console.log(this.total);

    let porcentajeCom = this.productoInfoActual.com / 100;
    let porcentajeAgente = this.comisionAgente / 100;
    this.totalSinComision = this.total;
    this.total =
      this.total *
      (1 + porcentajeCom) *
      (1 + porcentajeAgente / (1 - porcentajeAgente));

    // console.log(`Tarifa total`, this.total);
  }

  getTransportes() {
    this.productosService
      .listTransporteByProducto(this.productoActual.idProducto, -1)
      .subscribe((res: any) => {
        this.trasportes = res;
        if (this.editing && this.transporteSeleccionado) {
          this.indexTS = this.trasportes.findIndex(
            (t) =>
              t.idProductoTransporte ==
              this.transporteSeleccionado.idProductoTransporte
          );
        }
        this.getDiasCerrados();
      });
  }

  async agregar() {
    if (this.adding) {
      const { value: opcional } = await Swal.fire({
        input: 'checkbox',
        inputValue: 0,
        backdrop: false,
        inputPlaceholder:
          'Es una actividad opcional',
        confirmButtonText:
          'Continuar <i class="fa fa-arrow-right"></i>',
      })

      this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
      this.productoPrecioTotal.tipoProducto = 7;
      let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
      this.productoPrecioTotal.precioPorPersona = (this.total / viajeros);
      this.productoPrecioTotal.total = this.total;

      this.productoAdquirido.tarifa = this.totalSinComision;
      this.productoAdquirido.idProducto = this.productoInfoActual.idProducto;
      this.productoAdquirido.comision = this.productoInfoActual.com;
      this.productoAdquirido.comisionAgente = this.comisionAgente;
      this.productoAdquirido.opcional = opcional;
      this.productoAdquirido.nuevo = true;
      this.productoAdquirido.id = this.productoAdquirido.idProductoAdquirido;
      this.productoAdquirido.type = "Actividad";
      this.productoAdquirido.precio = this.productoAdquirido.tarifa;
      this.productoAdquirido.valido = true;
      this.productoAdquirido.idToSend = 6;
      this.productoAdquirido.idCiudad = this.destino.idCiudad;
      this.productoAdquirido.productoPrecioTotal = this.productoPrecioTotal;
      let product: any[] = [];
      product.push(this.productoAdquirido);
      product.push(this.opcionesSeleccionadas);
      if (this.t) {
        product.push(this.trasportes[this.indexTS]);
      } else {
        product.push(undefined);
      }

      product.push(this.mejoras);
      product.push(this.mejorasTransporte);
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
          'Es una actividad opcional',
        confirmButtonText:
          'Continuar <i class="fa fa-arrow-right"></i>',
      })
      this.productoAdquirido.tarifa = this.totalSinComision;
      this.productoAdquirido.idProducto = this.productoInfoActual.idProducto;
      this.productoAdquirido.comision = this.productoInfoActual.com;
      this.productoAdquirido.comisionAgente = this.comisionAgente;
      this.productoAdquirido.opcional = opcional;

      if (this.t) {
        this.productosAdquiridosService.create(this.productoAdquirido, this.opcionesSeleccionadas, this.trasportes[this.indexTS], this.mejoras, this.mejorasTransporte).subscribe((resp: any) => {
            this.productoAdquirido.idProductoAdquirido = resp.insertId;
            this.mejoras = [];
            this.mejorasTransporte = [];
            this.asignarValores(resp, opcional);            
            let canasta = new Canasta();
            canasta.idCotizacion = this.cotizacion.idCotizacion;
            canasta.idActividad = this.productoAdquirido.idProductoAdquirido;
            canasta.tipo = 7; //Viene de la tabla productos adquridos
            this.productoPrecioTotal.idProducto = this.productoAdquirido.idProductoAdquirido;
            this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
            this.productoPrecioTotal.tipoProducto = 7;
            let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
            this.productoPrecioTotal.precioPorPersona = (this.total / viajeros);
            this.productoPrecioTotal.total = this.total;
            this.productosPreciosTotalesService.create(this.productoPrecioTotal).subscribe((resTotal: any) => {
              this.productoPrecioTotal = new ProductosPreciosTotales();
            }); 
            this.canastaService.create(canasta).subscribe((resp4) => {
              let version = new Version();
              version.idActividad = this.productoAdquirido.idProductoAdquirido;
              version.tipo = 7; //Es un producto
              // version.version = 1; //Es una insecion nueva por lo que se inicaliza en 1
              version.idCotizacion = this.cotizacion.idCotizacion;
              version.versionCotizacion = this.cotizacion.version;
              version.accion = 1;
              // this.usuariosService.list_oneByCorreo(localStorage.getItem(`correo`)).subscribe((usuario: Usuario) => {
              // console.log(usuario);
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
          });
      } else {
        this.productosAdquiridosService.create(this.productoAdquirido, this.opcionesSeleccionadas, undefined, this.mejoras, this.mejorasTransporte)
          .subscribe((resp: any) => {
            this.mejoras = [];
            this.mejorasTransporte = [];
            this.asignarValores(resp, opcional);
            this.productoAdquirido.idProductoAdquirido = resp.insertId;
            let canasta = new Canasta();
            canasta.idCotizacion = this.cotizacion.idCotizacion;
            canasta.idActividad = this.productoAdquirido.idProductoAdquirido;
            canasta.tipo = 7; //Viene de la tabla productos adquridos
            this.productoPrecioTotal.idProducto = resp.insertId;
            this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
            this.productoPrecioTotal.tipoProducto = 7;
            let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
            this.productoPrecioTotal.precioPorPersona = (this.total / viajeros);
            this.productoPrecioTotal.total = this.total;
            this.productosPreciosTotalesService.create(this.productoPrecioTotal).subscribe((resTotal: any) => {
              this.productoPrecioTotal = new ProductosPreciosTotales();
            }); 
            this.canastaService.create(canasta).subscribe((resp4) => {
              let version = new Version();
              version.idActividad = this.productoAdquirido.idProductoAdquirido;
              version.tipo = 7; //Es un producto
              // version.version = 1; //Es una insecion nueva por lo que se inicaliza en 1
              version.idCotizacion = this.cotizacion.idCotizacion;
              version.versionCotizacion = this.cotizacion.version;
              version.accion = 1;
              // this.usuariosService.list_oneByCorreo(localStorage.getItem(`correo`)).subscribe((usuario: Usuario) => {
              // console.log(usuario);
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
          });
      }
    }
  }

  asignarValores(resp: any, opcional: number) {
    
    this.productoAdquirido.idProductoAdquirido = resp.insertId;
    this.productoAdquirido.tipoNombre = "actividad";
    this.productoAdquirido.tipo = 74;
    this.productoAdquirido.idCiudad = this.destino.idCiudad;
    this.productoAdquirido.ciudad = this.destino.ciudad;
    this.productoAdquirido.titulo = this.productoActual.titulo;
    this.productoAdquirido.categoria = this.productoActual.categoria;


    // this.actividadCanasta.idProducto = "actividad";
    // this.actividadCanasta.tipo = 74;
    // this.actividadCanasta.opcional = opcional;
    // this.actividadCanasta.idProductoAdquirido = resp.insertId;
    // this.actividadCanasta.titulo = this.productoActual.titulo;
    // this.actividadCanasta.ciudad = this.destino.ciudad;
    // this.actividadCanasta.idCiudad = this.destino.idCiudad;
    // this.actividadCanasta.fecha = this.productoAdquirido.fecha;
    // this.actividadCanasta.horario = this.productoAdquirido.horario;
    // this.actividadCanasta.comision = this.productoAdquirido.comision;
    // this.actividadCanasta.comisionAgente = this.productoAdquirido.comisionAgente;
    // this.actividadCanasta.tarifa = this.totalSinComision;

    this.canastaService.addProduct(this.productoAdquirido);
    delete this.productoAdquirido.tipoNombre;
    delete this.productoAdquirido.tipo;
    delete this.productoAdquirido.idCiudad;
  }  
 

  actualizacion(pa) {
    console.log("******** actualizacion *****");
        this.productoAdquirido = pa;
        this.productoAdquirido.fecha = this.productoAdquirido.fecha.split(`T`)[0];
    this.productoAdquiridoBase = Object.assign({}, this.productoAdquirido);
    console.log("producto adquirido desde actualizacion", this.productoAdquirido);
        this.productosService
          .listProductoByIdProducto_vista(this.productoAdquirido.idProducto)
          .subscribe((p: any) => {
            this.productoActual = p;
            this.productosService
              .listProductoInfoByIdProducto(this.productoAdquirido.idProducto)
              .subscribe((pia: ProductoInfo) => {
                this.productosTransporteAdquiridoService
                  .listByIdProductoAdquirido(
                    this.productoAdquirido.idProductoAdquirido
                  )
                  .subscribe((trasporteSeleccionado: any) => {

                    this.productosOpcionesAdquiridosService
                      .listByIdProductoAdquirido(
                        this.productoAdquirido.idProductoAdquirido
                      )
                      .subscribe((opcionesSeleccionadas: ProductoOpcion[]) => {
                        this.transporteSeleccionado = trasporteSeleccionado[0];
                        this.transporteSeleccionadoBase = Object.assign({}, this.transporteSeleccionado);

                        if (this.transporteSeleccionado != null) {
                          this.t = true;
                        } else {
                          this.transporteSeleccionado = undefined;
                          this.transporteSeleccionadoBase = undefined;
                        }
                        this.opcionesSeleccionadas = opcionesSeleccionadas;
                        this.opcionesSeleccionadasBase = Object.assign([], this.opcionesSeleccionadas);
                        this.productoInfoActual.com = this.productoAdquirido.comision;
                        this.productoInfoActual = pia[0];
                        this.destino.idCiudad = this.productoActual.idCiudad;
                        this.destino.idCotizacion = Number(
                          localStorage.getItem(`idCotizacion`)
                        );
                        this.total = this.productoAdquirido.precio;
                        this.getCotizacion();
                      });
                  });
              });
          });
   //   });
  }

  abrirModalDetalle(){
      $('#modalDetalleActividad').modal('open');
  }

  async actualizar() {

    this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
    this.productoPrecioTotal.tipoProducto = 7;
    let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
    this.productoPrecioTotal.precioPorPersona = (this.total / viajeros);
    this.productoPrecioTotal.total = this.total;


    this.productoAdquirido.notasVersion = $('#detalle').val();
    this.productoAdquirido.editado = true;
    this.productoAdquirido.valido = true;
    this.productoAdquirido.productoPrecioTotal = this.productoPrecioTotal;

    
    if(this.productoAdquirido.notasVersion.trim() === ''){
      M.toast({
        html: 'Error: El campo es obligatorio',
        classes: 'rounded red darken-3'
      });
    } else {

      if (this.t) {
        this.sendDataToEditService.sendProductToUpdate([
          this.productoAdquirido,
          [],
          this.trasportes[this.indexTS],
          undefined,
          undefined
        ]);
      } else {
        this.sendDataToEditService.sendProductToUpdate([this.productoAdquirido]);
      }
      $('.modalSendProducts').modal('close');
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Actualizado correctamente",
        showConfirmButton: false,
        timer: 1000,
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
    this.comisionAgenteNueva = this.comisionAgente ;
    this.getTarifaTotal();
    this.mostrarComisionAgente = false;
    this.productoAdquirido.comisionAgente = this.comisionAgente;
    this.verificarEdicion();
  }

  esActualizacion() {
    return true;
    // this.productoAdquirido.idProductoAdquirido = 0;
    // this.productoAdquirido.tarifa = this.totalSinComision;
    // this.productoAdquirido.idProducto = this.productoInfoActual.idProducto;
    // this.productoAdquirido.comision = this.productoInfoActual.com;
    // this.productoAdquirido.comisionAgente = this.comisionAgente;

    // this.productoAdquiridoBase.idProductoAdquirido = 0;
    // this.productoAdquiridoBase.tarifa = this.totalSinComision;
    // this.productoAdquiridoBase.idProducto = this.productoInfoActual.idProducto;
    // this.productoAdquiridoBase.comision = this.productoInfoActual.com;
    // this.productoAdquiridoBase.comisionAgente = this.comisionAgente;
    // this.productoAdquiridoBase.fecha = this.datePipe.transform(
    //   this.productoAdquiridoBase.fecha,
    //   "yyyy-MM-dd"
    // );
    // if(JSON.stringify(this.productoAdquiridoBase) !== JSON.stringify(this.productoAdquirido)){
    //   return true;
    // }else{
    //   return false;
    // }
  }


  getOpciones() {
    this.productosService
      .listOpcionesByIdProducto(this.productoActual.idProducto)
      .subscribe((resp: ProductoOpcion[]) => {
        this.productoOpciones = resp;
      });
  }


  setOpcionSeleccionada(ii, productoOpcion) {
    console.log("antes de opcion selecciondada", this.opcionesSeleccionadas);
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
      this.mejoras.findIndex((p) => p.idProductoOpcion == productoOpcion.idProductoOpcion) !=-1
    ) {
      this.mejoras.splice( this.mejoras.findIndex((p) => p.idProductoOpcion == productoOpcion.idProductoOpcion),1);
    } 

    this.getTarifaTotal();
    this.verificarEdicion();
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

  hayMejoras() {
    return (this.opcionesSeleccionadas.length < this.productoOpciones.length)? true: false;
  }

  getDiferenciaOpcion(idProductoOpcion) {
    this.getTarifaTotal();
    let mejoras = this.opcionesSeleccionadas.slice();;
    let opcion = this.productoOpciones.find(po => po.idProductoOpcion == idProductoOpcion);
    mejoras.push(opcion);
    let totalMejora = 0;

 // console.log(this.productoInfoActual);
     let tarifaBase = 0;
     let incrementoGuiaEspecializado = 0;
     let incrementoAudioguia = 0;
     let incrementoTransporte = 0;
     let incrementoOpciones = 0;
     let incrementoHoraExtraGuia = 0;
    
 // console.log(this.productoInfoActual.tarifaCientifica);
   tarifaBase =
     this.cotizacion.numM * this.productoInfoActual.tarifaCientifica;
     // console.log(tarifaBase);
     if (
       18 >= this.productoInfoActual.minimoMenor &&
       18 <= this.productoInfoActual.maximoMenor
     ) {
       // console.log(
       //   `aplica tarifa menor para 18`,
       //   this.productoInfoActual.tarifaMenor
       // );
       // console.log(tarifaBase);
       tarifaBase =
         tarifaBase +
         this.cotizacion.num18 * this.productoInfoActual.tarifaMenor;
     } else {
       tarifaBase =
         tarifaBase +
         this.cotizacion.num18 * this.productoInfoActual.tarifaCientifica;
     }
    
     if (
       12 >= this.productoInfoActual.minimoMenor &&
       12 <= this.productoInfoActual.maximoMenor
     ) {
       tarifaBase =
         tarifaBase +
         this.cotizacion.num12 * this.productoInfoActual.tarifaMenor;
     } else {
       tarifaBase =
         tarifaBase +
         this.cotizacion.num12 * this.productoInfoActual.tarifaCientifica;
     }

     if (this.productoAdquirido.guiaEspecializado) {
       incrementoGuiaEspecializado = this.productoInfoActual.guiaEspecializado;
     }
    
     if (this.productoAdquirido.audioguia) {
       incrementoAudioguia = this.productoInfoActual.audioguia;
     }
    
     if (this.t) {
       incrementoTransporte = this.trasportes[this.indexTS].tarifa;
     }

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

 // console.log(`Tarifa base`, tarifaBase);
 totalMejora =
   tarifaBase +
   incrementoGuiaEspecializado +
   incrementoAudioguia +
   incrementoTransporte+
   incrementoHoraExtraGuia +
   incrementoOpciones ;
 totalMejora = totalMejora / this.divisaActual.valor / this.divisaBase.valor;

 // console.log(`Tarifa antes de incrementos`);
 // console.log(this.total);

 // console.log(`Tarifa despues de incrementos fecha hora`);
 totalMejora = totalMejora * (1 + this.incrementoFechaHora / 100);
 // console.log(this.total);

 let porcentajeCom = this.productoInfoActual.com / 100;
 let porcentajeAgente = this.comisionAgente / 100;
 totalMejora =
 totalMejora *
   (1 + porcentajeCom) *
   (1 + porcentajeAgente / (1 - porcentajeAgente));

 // console.log(`Tarifa total`, this.total);
    return totalMejora - this.total;
  }

  setMejorasOpciones(idProductoOpcion) {

    this.mejoras = [];
    for (let index = 0; index < this.productoOpciones.length; index++) {
      if(this.productoOpciones[index].idProductoOpcion != idProductoOpcion){
        $(`#${this.productoOpciones[index].idProductoOpcion}_ma`).prop('checked', false);
      }
    }
    
    let poau = new ProductoOpcionAdquiridaUpgrade();
    poau.idCotizacion = this.cotizacion.idCotizacion;
    poau.idProductoOpcion = idProductoOpcion;
    poau.diferencia = this.getDiferenciaOpcion(idProductoOpcion);
    poau.fecha = this.productoAdquirido.fecha;
    if (this.adding) {
      poau.versionCotizacion = this.cotizacion.version + 1;
    }
    let index = this.mejoras.findIndex(o => o.idProductoOpcion==poau.idProductoOpcion);
    (index == -1) ? this.mejoras.push(poau) : this.mejoras.splice(index, 1);
  }
  
  setMejorasTransporte(idVehiculo) {
    this.mejorasTransporte = [];
    for (let index = 0; index < this.trasportes.length; index++) {
      if(this.trasportes[index].idVehiculo != idVehiculo){
        $(`#${this.trasportes[index].idVehiculo}_ta`).prop('checked', false);
      }
    }

    let ptu = new ProductoTransporteUpgrade();
    ptu.idCotizacion = this.cotizacion.idCotizacion;
    ptu.idVehiculo = idVehiculo;
    ptu.diferencia= this.getDiferenciaTransporte(idVehiculo);
    ptu.fecha = this.productoAdquirido.fecha;
    if (this.adding) {
      ptu.versionCotizacion = this.cotizacion.version + 1;
    }
    let index = this.mejorasTransporte.findIndex(m=> m.idVehiculo == ptu.idVehiculo);
    (index == -1) ? this.mejorasTransporte.push(ptu): this.mejorasTransporte.splice(index,1);
  }

  getDiferenciaTransporte(idVehiculo) {

    // console.log(`Información de la actividad actual`);
    // console.log(this.productoInfoActual);
    let tarifaBase = 0;
    let incrementoGuiaEspecializado = 0;
    let incrementoAudioguia = 0;
    let incrementoTransporte = 0;
    let incrementoOpciones = 0;
    let incrementoHoraExtraGuia = 0;
    let totalMejora = 0;

    // console.log(this.productoInfoActual.tarifaCientifica);
    tarifaBase =
      this.cotizacion.numM * this.productoInfoActual.tarifaCientifica;
    // console.log(tarifaBase);
    if (
      18 >= this.productoInfoActual.minimoMenor &&
      18 <= this.productoInfoActual.maximoMenor
    ) {
      // console.log(
      //   `aplica tarifa menor para 18`,
      //   this.productoInfoActual.tarifaMenor
      // );
      // console.log(tarifaBase);
      tarifaBase =
        tarifaBase +
        this.cotizacion.num18 * this.productoInfoActual.tarifaMenor;
    } else {
      tarifaBase =
        tarifaBase +
        this.cotizacion.num18 * this.productoInfoActual.tarifaCientifica;
    }

    if (
      12 >= this.productoInfoActual.minimoMenor &&
      12 <= this.productoInfoActual.maximoMenor
    ) {
      // console.log(
      //   `aplica tarifa menor para 12`,
      //   this.productoInfoActual.tarifaMenor
      // );
      // console.log(tarifaBase);
      tarifaBase =
        tarifaBase +
        this.cotizacion.num12 * this.productoInfoActual.tarifaMenor;
    } else {
      // console.log(`no aplica tarifa menor para 12`);
      tarifaBase =
        tarifaBase +
        this.cotizacion.num12 * this.productoInfoActual.tarifaCientifica;
    }

    if (this.productoAdquirido.guiaEspecializado) {
      incrementoGuiaEspecializado = this.productoInfoActual.guiaEspecializado;
    }

    if (this.productoAdquirido.audioguia) {
      incrementoAudioguia = this.productoInfoActual.audioguia;
    }

    if (this.t) {
      incrementoTransporte = this.trasportes.find(t=> t.idVehiculo == idVehiculo).tarifa; 
    }

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

    // console.log(`Tarifa base`, tarifaBase);
    totalMejora =
      tarifaBase +
      incrementoGuiaEspecializado +
      incrementoAudioguia +
      incrementoTransporte+
      incrementoHoraExtraGuia +
      incrementoOpciones ;
      totalMejora = totalMejora / this.divisaActual.valor / this.divisaBase.valor;

    totalMejora =totalMejora * (1 + this.incrementoFechaHora / 100);

    let porcentajeCom = this.productoInfoActual.com / 100;
    let porcentajeAgente = this.comisionAgente / 100;
    this.totalSinComision = totalMejora;
    totalMejora=
    totalMejora *
      (1 + porcentajeCom) *
      (1 + porcentajeAgente / (1 - porcentajeAgente));
    return totalMejora - this.total;
  }


  deseleccionarMejorasTransportes(){
    for (let index = 0; index < this.trasportes.length; index++) {
      
      if(this.trasportes[index].idVehiculo != this.transporteSeleccionado.idVehiculo){
        $(`#${this.trasportes[index].idVehiculo}_ta`).prop('checked', false);

      }
    }
  }

  verificarEdicion() {
    if (this.editing) {
  

      if (JSON.stringify(this.productoAdquiridoBase) != JSON.stringify(this.productoAdquirido) || JSON.stringify(this.opcionesSeleccionadas) != JSON.stringify(this.opcionesSeleccionadasBase) || JSON.stringify(this.transporteSeleccionadoBase) != JSON.stringify(this.transporteSeleccionado) ) {
        this.editado = true;
      } else {
        this.editado = false;
      }
    }
  }


  setHorario(value) {
    this.productoAdquirido.horario = value;
    // console.log(this.productoAdquirido.horario);
    this.verificarEdicion();
    this.getIncrementoFechaHora();
  }


  cerrarModalDetalle() {
    $('.modalSendProducts').modal('close');
  }

  verificarTransporte() {
    (!this.t)? this.transporteSeleccionado = undefined: this.transporteSeleccionado =  this.trasportes[this.indexTS];
     this.verificarEdicion();
    this.getTarifaTotal();
  }
  
  esMejoraOpcion(idProductoOpcion) {
    return (this.mejoras.find(mejora => mejora.idProductoOpcion == idProductoOpcion) != undefined) ? true: false;
  }

  esMejoraTransporte(idVehiculo) {
    return (this.mejorasTransporte.find(mejora => mejora.idVehiculo == idVehiculo) != undefined) ? true: false;
  }


  actualizarCarrito() {
    this.productoAdquirido.idCotizacion = this.cotizacion.idCotizacion;
    let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
    this.productoAdquirido.precioPorPersona = (this.total / viajeros);
    this.productoAdquirido.total = this.total;

    this.productoAdquirido.tarifa = this.totalSinComision;
    this.productoAdquirido.idProducto = this.productoInfoActual.idProducto;
    this.productoAdquirido.comision = this.productoInfoActual.com;
    this.productoAdquirido.comisionAgente = this.comisionAgente;

    
    if (this.t) {
      this.productosAdquiridosService.update(this.productoAdquirido, this.opcionesSeleccionadas, this.trasportes[this.indexTS], this.mejoras, this.mejorasTransporte).subscribe(
        res => {
          this.editingCarrito = false;
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
    } else {
      this.productosAdquiridosService.update(this.productoAdquirido, this.opcionesSeleccionadas, undefined, this.mejoras, this.mejorasTransporte).subscribe(
        res => {
          this.editingCarrito = false;
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

  }


  initDatepicker(fecha?: any) {
    
    let fecha1 = localStorage.getItem('fechaInicio');
    let fecha2 = localStorage.getItem('fechaFinal');
    let minDate: any = new Date(fecha1 += 'T00:00:00');
    let maxDate: any = new Date(fecha2 += 'T00:00:00');
    let date = minDate;
    if(fecha){
      date = new Date(fecha + 'T00:00:00');
    }
    $('#fechaA').datepicker({
      minDate: minDate,
      maxDate: maxDate,
      setDefaultDate: date,
      defaultDate: date,
      format: "yyyy-mm-dd",
      i18n: this.i18nOptions
    });
  }

}
