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
import { ProductoEntrada } from "src/app/models/ProductoEntrada";
import { ProductoHorario } from "src/app/models/productoHorarios";
import { ProductoInfo } from "src/app/models/ProductoInfo";
import { ProductoOpcion } from "src/app/models/ProductoOpcion";
import { ProductoTarifa } from "src/app/models/ProductoTarifa";
import { Subcategoria } from "src/app/models/Subcategoria";
import { Usuario } from 'src/app/models/Usuario';
import { Version } from 'src/app/models/Version';
import { CanastaService } from 'src/app/services/canasta.service';
import { ComisionesAgentesService } from 'src/app/services/comisiones-agentes.service';
import { CotizacionesService } from "src/app/services/cotizaciones.service";
import { DestinosService } from "src/app/services/destinos.service";
import { DivisasService } from "src/app/services/divisas.service";
import { ProductosAdquiridosService } from 'src/app/services/productos-adquiridos.service';
import { ProductosOpcionesAdquiridosService } from 'src/app/services/productos-opciones-adquiridos.service';
import { ProductosTransporteAdquiridoService } from 'src/app/services/productos-transporte-adquirido.service';
import { ProductosService } from "src/app/services/productos.service";
import { SubcategoriasService } from "src/app/services/subcategorias.service";
import { VersionesService } from 'src/app/services/versiones.service';
import { environment } from "src/environments/environment";
import Swal from 'sweetalert2';
import * as M from 'materialize-css/dist/js/materialize';
import { UsuariosService } from '../../services/usuarios.service';
import { SendDataToEditService } from 'src/app/services/sendDataToEdit.service';
import { AnyCnameRecord } from 'dns';
import { ProductosPreciosTotalesService } from 'src/app/services/productosPreciosTotales.service';
import { ProductosPreciosTotales } from './../../models/ProductosPreciosTotales';
import { totalmem } from 'os';
import { ProductoOpcionAdquiridaUpgrade } from 'src/app/models/ProductoOpcionAdquiridaUpgrade';
import { ProductoTransporteUpgrade } from 'src/app/models/ProductoTransporteUpgrade';
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

declare var $: any;

@Component({
  selector: "app-tours-privados-en-grupo",
  templateUrl: "./tours-privados-en-grupo.component.html",
  styleUrls: ["./tours-privados-en-grupo.component.css"],
})
export class ToursPrivadosEnGrupoComponent implements OnInit, DoCheck, OnDestroy {
  @Input() public editing: boolean = false;
  @Input() public adding: boolean = false;
  @Input() public idProductoAdquirido: number = 0;
  @Input() public totalPasajeros: number = null;
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
  public dataSource;
  public displayedColumns: string[] = ["tour"];
  public productos: Producto[] = [];
  public destino: any = new Destino();
  public subcategoriaActual: Subcategoria = new Subcategoria();
  public categoriaActual: number = 0;
  public seleccion: boolean = false;
  public productoActual: Producto = new Producto();
  public productoInfoActual: ProductoInfo = new ProductoInfo();
  public cotizacion: Cotizacion = new Cotizacion();
  public divisaBase: DivisaBase = new DivisaBase();
  public productoAdquirido: any = new ProductoAdquirido();
  public productoAdquiridoBase: any = new ProductoAdquirido();
  public productoPrecioTotal: ProductosPreciosTotales = new ProductosPreciosTotales();
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
  public dolar: Divisa = new Divisa();
  public usuario: any = new Usuario();
  public trasportes: any[] = [];
  public transporteSeleccionado: any;
  public transporteSeleccionadoBase: any;
  public indexTS: number = 0; //Index de la lista de transporte
  public productosRelacionados: Producto[] = [];
  public API_URI: string = ``;
  public t: boolean = false; //Si seleccionó elegir un transporte
  public tBase: boolean = false; // Si viene ya con un transporte seleccionado
  public tourGrupoCanasta: any = {};
  public comisionAgente: number = 0;
  public comision5rivesNueva: number = 0;
  public comisionAgenteNueva: number = 0;
  public mostrarComision5rives: boolean = false;
  public mostrarComisionAgente: boolean = false;
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
      $(".tabs").tabs("select", "toursPrivadosEngrupo");
      console.log(this.router.url.split("/"));
      if (this.router.url.split("/").length == 4) {
        console.log("Entra en opcion 1");
        this.seleccion = false;
      } else {
        
        this.seleccion = true;
        this.router.navigate([`/home/cotizacionProductos/toursEnGrupo/${this.router.url.split("/")[4]}`]); 
        this.idProducto = Number.parseInt(this.router.url.split("/")[4]);
        this.productosService.listProductoByIdProducto(Number.parseInt(this.router.url.split("/")[4])).subscribe(
          (resp: Producto) => {
            let p = resp;
            this.setProducto(p);
          } 
        );

      }
    } 

    setTimeout(() => { 
      $('.datepicker').datepicker(
        {
          format: "yyyy-mm-dd",
        }
      );
    }, 0);

    this.getUsuario();
    if (this.editing) {
      $('#modalDetalleTourGrupo').modal({ dismissible: false });
      this.sendDataToEditService.getProduct('tourGrupo').subscribe(
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
          //this.getCotizacion();
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

  ngAfterViewChecked() {
    if (localStorage.getItem("productoGrupo") != null) {

      let idProducto = Number.parseInt(localStorage.getItem("productoGrupo"));
      localStorage.removeItem("productoGrupo");
      this.router.navigate([`/home/cotizacionProductos/toursEnGrupo`,idProducto]); 
      this.seleccion = true;

      this.productosService.listProductoByIdProducto(idProducto).subscribe(
        (resp: Producto) => {
          let p = resp;
          localStorage.removeItem("productoGrupo");
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
    .listByCategoriaCiudad(3, this.destino.idCiudad)
    .subscribe((resp: Subcategoria[]) => {
      // console.log("******* Subcategorias *******");
      // console.log(resp);
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
            this.divisasService.getOne(142).subscribe((dolar: Divisa) => {
              this.dolar = dolar;
              this.divisaBase = resp;
              if (this.cotizacion.comisionAgente == 2) { //Se incluye la comsión el agente
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
  
                  this.comisionesAgentesService.listByIdAgenteTipoActividad(this.cotizacion.idAgente, 4).subscribe( //2 se refiere a que es la comisión sobre las disposiciones
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
      });
  }

  getTours(ii) {
    if (!this.editing) {
    this.subcategoriaActual = this.subcategorias[ii];
  //  this.seleccion = false;
      this.productosService.listByCiudadCategoriaSubcategoria(this.destino.idCiudad, 3, this.subcategorias[ii].idSubcategoria)
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

  // getNombreSubCategoria() {
  //   return this.subCategorias.find(subCategoria => subCategoria.idSubCategoria == this.subcategoriaActual).nombre;
  // }

  setProducto(producto) {
    this.productoActual = producto;
    this.seleccion = true;
    this.productosService
      .listProductosRelacionados(this.productoActual.titulo, 3)
      .subscribe((resp: Producto[]) => {
        this.productosRelacionados = resp;
        //console.log(`Productos relacionados`, this.productosRelacionados);
        this.getProductoInfoActual();
      });
  }

  getProductoInfoActual() {
    this.productoAdquirido.descripcion = this.productoActual.descripcion;
    //console.log(`Obteniendo información del prodducto actual`);
    this.productosService
      .listProductoInfoByIdProducto(this.productoActual.idProducto)
      .subscribe((resp: ProductoInfo) => {
        //console.log(this.productoActual);
        //console.log(resp);
        this.productoInfoActual = resp[0];
        if(this.editing)
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
                //console.log(`Fecha 1`, this.productoAdquirido.fecha);
              } else {
                this.productoAdquirido.fecha = this.datePipe.transform(
                  new Date(new Date().setMonth(new Date().getMonth() + 2)),
                  "yyyy-mm-dd"
                );
                //console.log(`Fecha 2`, this.productoAdquirido.fecha);

              }
            }
            this.getTransportes();
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
        $("#fechaTourPG").datepicker({
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
        this.productoAdquirido.horario = this.horarios[0].hora;
        //console.log(this.horarios[0].hora);
        //console.log(this.productoAdquirido);
        //console.log(this.productoAdquirido.horario);
        this.getOpciones();
      });
  }

  getOpciones() {
    this.productosService
      .listOpcionesByIdProducto(this.productoActual.idProducto)
      .subscribe((resp: ProductoOpcion[]) => {
        this.productoOpciones = resp;
        //console.log(`Opciones de tours de grupo`, this.productoOpciones);
        this.getTarifas();
      });
  }

  getTarifas() {
    this.productosService
      .listTarifasIdProducto(this.productoActual.idProducto)
      .subscribe((resp: ProductoTarifa[]) => {
        this.productoTarifas = resp;
        //console.log(`***Tarifas***`);
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
      this.mejoras.findIndex((p) => p.idProductoOpcion == productoOpcion.idProductoOpcion) !=-1
    ) {
      this.mejoras.splice( this.mejoras.findIndex((p) => p.idProductoOpcion == productoOpcion.idProductoOpcion),1);
    } 
    console.log(this.opcionesSeleccionadas);
    this.verificarEdicion();
    this.getTarifaTotal();
  }

  getIncrementoFechaHora() {
   
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
                    //console.log(`HHHHHHHH::::`, this.productoAdquirido.horario);
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

  setFecha(date: any) {
    this.productoAdquirido.fecha = date;
    this.verificarEdicion();
    this.getIncrementoFechaHora();
  }

  getTarifaTotal() {

    //console.log(this.productoInfoActual);
    let tarifaBase = 0;
    let incrementoOpciones = 0;
    let incrementoTransporte = 0;

    if (this.productoAdquirido.freeTour) {
      //console.log(`Calculando la tarifa free tour...`);

      tarifaBase = 5 / this.dolar.valor / this.divisaBase.valor; //No se cobra tarifa por persona, solo 5  dolares
    } else {
      //console.log(`Se calculará la tarifa por persona`);
      tarifaBase =
        this.cotizacion.numM * this.productoInfoActual.tarifaCientifica;

      if (
        18 >= this.productoInfoActual.minimoMenor &&
        18 <= this.productoInfoActual.maximoMenor
      ) {
        //console.log(`aplica tarifa menor para 18`);
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
        //console.log(`aplica tarifa menor para 12`);
        tarifaBase =
          tarifaBase +
          this.cotizacion.num12 * this.productoInfoActual.tarifaMenor;
      } else {
        //console.log(`no aplica tarifa menor para 12`);
        tarifaBase =
          tarifaBase +
          this.cotizacion.num12 * this.productoInfoActual.tarifaCientifica;
      }
    }

    this.opcionesSeleccionadas.forEach((opcion) => {
      incrementoOpciones =
        incrementoOpciones + this.cotizacion.numM * opcion.tarifaAdulto;

      if (18 >= opcion.minimoMenor && 18 <= opcion.maximoMenor) {
        //console.log(`aplica tarifa menor para 18`);
        incrementoOpciones =
          incrementoOpciones + this.cotizacion.num18 * opcion.tarifaMenor;
      } else {
        incrementoOpciones =
          incrementoOpciones + this.cotizacion.num18 * opcion.tarifaAdulto;
      }

      if (12 >= opcion.minimoMenor && 12 <= opcion.maximoMenor) {
        //console.log(`aplica tarifa menor para 12`);
        incrementoOpciones =
          incrementoOpciones + this.cotizacion.num12 * opcion.tarifaMenor;
      } else {
        //console.log(`no aplica tarifa menor para 12`);
        incrementoOpciones =
          incrementoOpciones + this.cotizacion.num12 * opcion.tarifaAdulto;
      }
    });

    if (this.t) {
      incrementoTransporte = this.trasportes[this.indexTS].tarifa;
    } else {
      this.mejorasTransporte = [];
    }

    //console.log(`Incremento opciones`, incrementoOpciones);
    this.total = 0;
    if (this.productoAdquirido.freeTour) {
      this.total = tarifaBase / this.divisaBase.valor; //Se convierte directamente a la tarifa base, ya estan los 5 dolares del free tour convertidos a pesos
      this.total =
        (this.total +
          incrementoOpciones / this.divisaActual.valor +
          incrementoTransporte / this.divisaActual.valor) /
        this.divisaBase.valor;
    } else {
      this.total = tarifaBase + incrementoOpciones + incrementoTransporte;
      this.total = this.total / this.divisaActual.valor / this.divisaBase.valor;
    }
   
    this.total = this.total * (1 + this.incrementoFechaHora / 100);

    let porcentajeCom = this.productoInfoActual.com / 100;
    let porcentajeAgente = this.comisionAgente / 100;
    this.totalSinComision = this.total;
    this.total =
      this.total *
      (1 + porcentajeCom) *
      (1 + porcentajeAgente / (1 - porcentajeAgente));

    //console.log(`Tarifa total`, this.total);
  }

  irAProducto(producto) {
    if (producto.categoria == 1) {
      localStorage.setItem("productoAPie", JSON.stringify(producto.idProducto));
      $(".tabs").tabs("select", "toursPrivadosAPie");
    }
    if (producto.categoria == 2) {
      localStorage.setItem(
        "productoTransporte",
        JSON.stringify(producto.idProducto)
      );
      $(".tabs").tabs("select", "toursPrivadosEntransporte");
    }
    if (producto.categoria == 3) {
     // console.log(producto);
      localStorage.setItem(
        "productoGrupo",
        JSON.stringify(producto.idProducto)
      );
      $(".tabs").tabs("select", "toursPrivadosEngrupo");
    }
  }

  getTransportes() {
    this.productosService
      .listTransporteByProducto(this.productoActual.idProducto, -1)
      .subscribe((res: any) => {
        this.trasportes = res;
       // console.log("transportes de grupo", this.trasportes);
        if (this.editing && this.transporteSeleccionado) {
          this.indexTS = this.trasportes.findIndex(t=>t.idProductoTransporte==this.transporteSeleccionado.idProductoTransporte);
        }

        //console.log(`$$$$$$$$$$Transportes`, this.trasportes);
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
          'Es un tour en grupo opcional',
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
      this.productoAdquirido.productoPrecioTotal = this.productoPrecioTotal;
      
      this.productoAdquirido.nuevo = true;
      this.productoAdquirido.id = this.productoAdquirido.idProductoAdquirido;
      this.productoAdquirido.type = 'Tour privado en grupo';
      this.productoAdquirido.precio = this.productoAdquirido.tarifa;
      this.productoAdquirido.valido = true;
      this.productoAdquirido.idToSend = 5;
      this.productoAdquirido.idCiudad = this.destino.idCiudad;
      let product: any = [];
      product.push(this.productoAdquirido);
      product.push(this.opcionesSeleccionadas);
      this.t ? product.push(this.trasportes[this.indexTS]) : product.push(undefined);
      product.push(this.mejoras);
      product.push(this.mejorasTransporte);
      
      this.sendDataToEditService.sendProductToUpdate(product);
      $('.modalAddProducts').modal('close');
      this.productoPrecioTotal = new ProductosPreciosTotales();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Producto agregado correctamente`,
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      const { value: opcional } = await Swal.fire({
        input: 'checkbox',
        inputValue: 0,
        backdrop: false,
        inputPlaceholder:
          'Es un tour en grupo opcional',
        confirmButtonText:
          'Continuar <i class="fa fa-arrow-right"></i>',
      })
      // console.log(this.productoAdquirido);
      this.productoAdquirido.tarifa = this.totalSinComision;
      this.productoAdquirido.idProducto = this.productoInfoActual.idProducto;
      this.productoAdquirido.comision = this.productoInfoActual.com;
      this.productoAdquirido.comisionAgente = this.comisionAgente;
      this.productoAdquirido.opcional = opcional;
      //console.log(this.productoAdquirido);
      if (this.t) {
        this.productosAdquiridosService.create(this.productoAdquirido, this.opcionesSeleccionadas, this.trasportes[this.indexTS], this.mejoras, this.mejorasTransporte)
          .subscribe((resp: any) => {
            this.mejoras = [];
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
            //console.log(usuario);
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
        this.productosAdquiridosService.create(this.productoAdquirido, this.opcionesSeleccionadas,undefined, this.mejoras, this.mejorasTransporte)
          .subscribe((resp: any) => {
            this.mejoras = [];
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
              //console.log(usuario);
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
    this.productoAdquirido.tipoNombre = "tourGrupo";
    this.productoAdquirido.tipo = 73;
    this.productoAdquirido.idCiudad = this.destino.idCiudad;
    this.productoAdquirido.ciudad = this.destino.ciudad;
    this.productoAdquirido.titulo = this.productoActual.titulo;
    this.productoAdquirido.categoria = this.productoActual.categoria;

    // this.tourGrupoCanasta.idProducto = 'tourGrupo';
    // this.tourGrupoCanasta.tipo = 73;
    // this.tourGrupoCanasta.opcional = opcional;
    // this.tourGrupoCanasta.idProductoAdquirido = resp.insertId;
    // this.tourGrupoCanasta.fecha = this.productoAdquirido.fecha;
    // this.tourGrupoCanasta.titulo = this.productoActual.titulo;
    // this.tourGrupoCanasta.ciudad = this.destino.ciudad;
    // this.tourGrupoCanasta.idCiudad = this.destino.idCiudad;
    // this.tourGrupoCanasta.horario = this.productoAdquirido.horario;
    // this.tourGrupoCanasta.comision = this.productoAdquirido.comision;
    // this.tourGrupoCanasta.comisionAgente = this.productoAdquirido.comisionAgente;
    // this.tourGrupoCanasta.tarifa = this.totalSinComision;
    
    console.log("addProduct",this.productoAdquirido);
    this.canastaService.addProduct(this.productoAdquirido);
  
    delete this.productoAdquirido.tipoNombre;
    delete this.productoAdquirido.tipo;
    delete this.productoAdquirido.idCiudad;
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
  
  actualizacion(pa) {
        this.productoAdquirido = pa;
        this.productoAdquiridoBase = Object.assign({}, pa);
        this.productoAdquirido.fecha = this.productoAdquirido.fecha.split(`T`)[0];
        this.productoAdquiridoBase.fecha = this.productoAdquiridoBase.fecha.split(`T`)[0];
        this.productosService
          .listProductoByIdProducto_vista(this.productoAdquirido.idProducto)
          .subscribe((p: any) => {
            this.productoActual = p;
            this.productosService
              .listProductoInfoByIdProducto(this.productoAdquirido.idProducto)
              .subscribe((pia: ProductoInfo) => {
                this.productosOpcionesAdquiridosService
                  .listByIdProductoAdquirido(
                    this.productoAdquirido.idProductoAdquirido
                  )
                  .subscribe((opcionesSeleccionadas: ProductoOpcion[]) => {
                    this.productosTransporteAdquiridoService.listByIdProductoAdquirido(this.productoAdquirido.idProductoAdquirido).subscribe(
                      (trasporteSeleccionado: any) => {
                        this.transporteSeleccionado = trasporteSeleccionado[0];
                        this.transporteSeleccionadoBase = Object.assign({}, trasporteSeleccionado[0]);
                        if (this.transporteSeleccionado != null) {
                          this.t = true;
                          this.tBase = true;
                        } else {
                          this.t = false;
                          this.tBase = false;
                        }

                        this.opcionesSeleccionadas = opcionesSeleccionadas;
                        this.opcionesSeleccionadasBase = Object.assign([], opcionesSeleccionadas);
                        this.productoInfoActual.com = this.productoAdquirido.comision;
                        this.productoInfoActual = pia[0];
                        this.destino.idCiudad = this.productoActual.idCiudad;
                        this.destino.idCotizacion = Number(
                        localStorage.getItem(`idCotizacion`)
                      );

                        if (this.editingCarrito) {
                          
                          this.productosAdquiridosService.getOpcionesAdquiridas(this.productoAdquirido.idProductoAdquirido).subscribe(
                            (resOpciones: ProductoOpcion[]) => {
                              this.opcionesSeleccionadas = resOpciones;
                              //console.log("Editing opciones", this.opcionesSeleccionadas);

                              this.productosAdquiridosService.getMejorasOpciones(this.productoAdquirido.idProductoAdquirido).subscribe(
                                (resMejorasOpciones: ProductoOpcionAdquiridaUpgrade[]) => {
                                  this.mejoras = resMejorasOpciones;
                                  this.productosAdquiridosService.getMejorasTransporte(this.productoAdquirido.idProductoAdquirido).subscribe(
                                    (resMejorasTransporte: ProductoTransporteUpgrade[]) => {
                                      this.mejorasTransporte = resMejorasTransporte;
                                      this.total = this.productoAdquirido.precio;
                                      this.getCotizacion();
                                    }
                                  );
                                }
                              );
                            });
                        } else {
                          this.getCotizacion();
                        }
                       
                      }
                    );
                    
                  });
              });
          });
    //  });
  }


  esOpcionSeleccionada(productoOpcion) {

    if ( 
      this.opcionesSeleccionadas.find((p) => p.idProductoOpcion == productoOpcion.idProductoOpcion) == undefined
    ) {
      return false;
    } else {
      return true;
    }
  }

  abrirModalDetalle(){
    if(this.esActualizacion()){
      $('#modalDetalleTourGrupo').modal('open');
    }else{
      $('.modalSendProducts').modal('close');
      $('#modalDetalleTourGrupo').modal('close');
    }
  }

  async actualizar() {

    this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
    this.productoPrecioTotal.tipoProducto = 7;
    let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
    this.productoPrecioTotal.precioPorPersona = (this.total / viajeros);
    this.productoPrecioTotal.total = this.total;


    this.productoAdquirido.idProductoAdquirido = 0;
    this.productoAdquirido.id = this.idProductoAdquirido;
    this.productoAdquirido.type = 'Tour privado en grupo';
    this.productoAdquirido.tarifa = this.totalSinComision;
    this.productoAdquirido.idProducto = this.productoInfoActual.idProducto;
    this.productoAdquirido.comision = this.productoInfoActual.com;
    this.productoAdquirido.comisionAgente = this.comisionAgente;
    this.productoAdquirido.notasVersion = $('#detalle').val();
    this.productoAdquirido.editado = true;
    this.productoAdquirido.valido = true;
    this.productoAdquirido.notasVersion = $('#detalle').val();
    this.productoAdquirido.editado = true;
    this.productoAdquirido.productoPrecioTotal = this.productoPrecioTotal;

    
    if(this.productoAdquirido.notasVersion.trim() === ''){
      M.toast({
        html: 'Error: El campo es obligatorio',
        classes: 'rounded red darken-3'
      });
    } else {
      if (this.t) { 
        this.sendDataToEditService.sendProductToUpdate([this.productoAdquirido, this.opcionesSeleccionadas, this.trasportes[this.indexTS], undefined, undefined]);
      } else {
        this.sendDataToEditService.sendProductToUpdate([this.productoAdquirido, this.opcionesSeleccionadas, undefined, undefined, undefined]);
      }
      $('#modalSendProducts').modal('close');
      $('#modalDetalleTourGrupo').modal('close');

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Actualizado correctamente",
        showConfirmButton: false,
        timer: 1000,
      });
    }
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

  hayMejoras() {
    return (this.opcionesSeleccionadas.length < this.productoOpciones.length)? true: false;
  }

  getDiferenciaOpcion(idProductoOpcion) {
    this.getTarifaTotal();
    let mejoras = this.opcionesSeleccionadas.slice();;
    let opcion = this.productoOpciones.find(po => po.idProductoOpcion == idProductoOpcion);
    mejoras.push(opcion);
    let totalMejora = 0;

    let tarifaBase = 0;
    let incrementoOpciones = 0;
    let incrementoTransporte = 0;

    if (this.productoAdquirido.freeTour) {
      //console.log(`Calculando la tarifa free tour...`);

      tarifaBase = 5 / this.dolar.valor / this.divisaBase.valor; //No se cobra tarifa por persona, solo 5  dolares
    } else {
      //console.log(`Se calculará la tarifa por persona`);
      tarifaBase =
        this.cotizacion.numM * this.productoInfoActual.tarifaCientifica;

      if (
        18 >= this.productoInfoActual.minimoMenor &&
        18 <= this.productoInfoActual.maximoMenor
      ) {
        //console.log(`aplica tarifa menor para 18`);
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
        //console.log(`aplica tarifa menor para 12`);
        tarifaBase =
          tarifaBase +
          this.cotizacion.num12 * this.productoInfoActual.tarifaMenor;
      } else {
        //console.log(`no aplica tarifa menor para 12`);
        tarifaBase =
          tarifaBase +
          this.cotizacion.num12 * this.productoInfoActual.tarifaCientifica;
      }
    }

    mejoras.forEach((opcion) => {
      incrementoOpciones =
        incrementoOpciones + this.cotizacion.numM * opcion.tarifaAdulto;

      if (18 >= opcion.minimoMenor && 18 <= opcion.maximoMenor) {
        //console.log(`aplica tarifa menor para 18`);
        incrementoOpciones =
          incrementoOpciones + this.cotizacion.num18 * opcion.tarifaMenor;
      } else {
        incrementoOpciones =
          incrementoOpciones + this.cotizacion.num18 * opcion.tarifaAdulto;
      }

      if (12 >= opcion.minimoMenor && 12 <= opcion.maximoMenor) {
        //console.log(`aplica tarifa menor para 12`);
        incrementoOpciones =
          incrementoOpciones + this.cotizacion.num12 * opcion.tarifaMenor;
      } else {
        //console.log(`no aplica tarifa menor para 12`);
        incrementoOpciones =
          incrementoOpciones + this.cotizacion.num12 * opcion.tarifaAdulto;
      }
    });

    if (this.t) {
      incrementoTransporte = this.trasportes[this.indexTS].tarifa;
    }

    //console.log(`Incremento opciones`, incrementoOpciones);
    if (this.productoAdquirido.freeTour) {
      totalMejora = tarifaBase / this.divisaBase.valor; //Se convierte directamente a la tarifa base, ya estan los 5 dolares del free tour convertidos a pesos
      totalMejora =
        (totalMejora +
          incrementoOpciones / this.divisaActual.valor +
          incrementoTransporte / this.divisaActual.valor) /
        this.divisaBase.valor;
    } else {
      totalMejora = tarifaBase + incrementoOpciones + incrementoTransporte;
      totalMejora = totalMejora / this.divisaActual.valor / this.divisaBase.valor;
    }
   
    totalMejora = totalMejora * (1 + this.incrementoFechaHora / 100);

    let porcentajeCom = this.productoInfoActual.com / 100;
    let porcentajeAgente = this.comisionAgente / 100;
    totalMejora =
    totalMejora *
      (1 + porcentajeCom) *
      (1 + porcentajeAgente / (1 - porcentajeAgente));
    return totalMejora - this.total;
  }


  setMejorasOpciones(idProductoOpcion) {

    this.mejoras = [];
    for (let index = 0; index < this.productoOpciones.length; index++) {
      if(this.productoOpciones[index].idProductoOpcion != idProductoOpcion){
        $(`#${this.productoOpciones[index].idProductoOpcion}_mtg`).prop('checked', false);
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
    // console.log(this.mejoras);
  }

  getDiferenciaTransporte(idVehiculo) { 

     //console.log(this.productoInfoActual);
     let tarifaBase = 0;
     let incrementoOpciones = 0;
    let incrementoTransporte = 0;
    let transporteSeleccionado: any;
    let totalMejora = 0;
 
     if (this.productoAdquirido.freeTour) {
       //console.log(`Calculando la tarifa free tour...`);
 
       tarifaBase = 5 / this.dolar.valor / this.divisaBase.valor; //No se cobra tarifa por persona, solo 5  dolares
     } else {
       //console.log(`Se calculará la tarifa por persona`);
       tarifaBase =
         this.cotizacion.numM * this.productoInfoActual.tarifaCientifica;
 
       if (
         18 >= this.productoInfoActual.minimoMenor &&
         18 <= this.productoInfoActual.maximoMenor
       ) {
         //console.log(`aplica tarifa menor para 18`);
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
         //console.log(`aplica tarifa menor para 12`);
         tarifaBase =
           tarifaBase +
           this.cotizacion.num12 * this.productoInfoActual.tarifaMenor;
       } else {
         //console.log(`no aplica tarifa menor para 12`);
         tarifaBase =
           tarifaBase +
           this.cotizacion.num12 * this.productoInfoActual.tarifaCientifica;
       }
     }
 
     this.opcionesSeleccionadas.forEach((opcion) => {
       incrementoOpciones =
         incrementoOpciones + this.cotizacion.numM * opcion.tarifaAdulto;
 
       if (18 >= opcion.minimoMenor && 18 <= opcion.maximoMenor) {
         //console.log(`aplica tarifa menor para 18`);
         incrementoOpciones =
           incrementoOpciones + this.cotizacion.num18 * opcion.tarifaMenor;
       } else {
         incrementoOpciones =
           incrementoOpciones + this.cotizacion.num18 * opcion.tarifaAdulto;
       }
 
       if (12 >= opcion.minimoMenor && 12 <= opcion.maximoMenor) {
         //console.log(`aplica tarifa menor para 12`);
         incrementoOpciones =
           incrementoOpciones + this.cotizacion.num12 * opcion.tarifaMenor;
       } else {
         //console.log(`no aplica tarifa menor para 12`);
         incrementoOpciones =
           incrementoOpciones + this.cotizacion.num12 * opcion.tarifaAdulto;
       }
     });
 
     if (this.t) {
       incrementoTransporte = this.trasportes.find(t=> t.idVehiculo == idVehiculo).tarifa; 
     }
 
     //console.log(`Incremento opciones`, incrementoOpciones);
     if (this.productoAdquirido.freeTour) {
       totalMejora = tarifaBase / this.divisaBase.valor; //Se convierte directamente a la tarifa base, ya estan los 5 dolares del free tour convertidos a pesos
       totalMejora =
         (totalMejora +
           incrementoOpciones / this.divisaActual.valor +
           incrementoTransporte / this.divisaActual.valor) /
         this.divisaBase.valor;
     } else {
      totalMejora = tarifaBase + incrementoOpciones + incrementoTransporte;
      totalMejora = totalMejora / this.divisaActual.valor / this.divisaBase.valor;
     }
    
     totalMejora= totalMejora * (1 + this.incrementoFechaHora / 100);
 
     let porcentajeCom = this.productoInfoActual.com / 100;
     let porcentajeAgente = this.comisionAgente / 100;
     totalMejora =
     totalMejora *
       (1 + porcentajeCom) *
       (1 + porcentajeAgente / (1 - porcentajeAgente));
 
    return totalMejora - this.total;
  }


  setMejorasTransporte(idVehiculo) {
    
    this.mejorasTransporte = [];
    for (let index = 0; index < this.trasportes.length; index++) {
      if(this.trasportes[index].idVehiculo != idVehiculo){
        $(`#${this.trasportes[index].idVehiculo}_ttpeg`).prop('checked', false);
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
    // console.log(this.mejorasTransporte);
  }


  deseleccionarMejorasTransportes(){
    for (let index = 0; index < this.trasportes.length; index++) {
      
      if(this.trasportes[index].idVehiculo != this.transporteSeleccionado.idVehiculo){
        $(`#${this.trasportes[index].idVehiculo}_ttpeg`).prop('checked', false);

      }
    }

   
  }
  
  setHorario(value) {
    this.productoAdquirido.horario = value;
    this.verificarEdicion();
    this.getIncrementoFechaHora();
  } 

  verificarEdicion() {
    if (this.editing) {
      // console.log("producto adquirido", this.productoAdquirido);
      // console.log("producto adquirido base", this.productoAdquiridoBase);
      // console.log("opciones", this.opcionesSeleccionadas);
      // console.log("opciones base", this.opcionesSeleccionadasBase);

      // console.log("t", this.t);
      // console.log("tBase", this.tBase);
      // console.log("transporte seleccionado", this.transporteSeleccionado);
      // console.log("trasporte seleccionado base", this.transporteSeleccionadoBase);

     
      if (JSON.stringify(this.productoAdquiridoBase) != JSON.stringify(this.productoAdquirido)   || JSON.stringify(this.opcionesSeleccionadasBase) != JSON.stringify(this.opcionesSeleccionadas) || JSON.stringify(this.transporteSeleccionadoBase) != JSON.stringify(this.transporteSeleccionado)) {
        this.editado = true;
      } else {
        this.editado = false;
      }
  
    }
  }

  cerrarModalEditar() {
    $('.modalSendProducts').modal('close');
  }


  setFreeTour(value) {
    (value) ? this.productoAdquirido.freeTour = 1 : this.productoAdquirido.freeTour = 0; 
    this.getTarifaTotal();
    this.verificarEdicion();
  }

  verificarTransporte() {
    if (!this.t) {
      this.mejorasTransporte = [];
   }
   (!this.t)? this.transporteSeleccionado = undefined: this.transporteSeleccionado =  this.trasportes[this.indexTS];
    this.verificarEdicion();
    this.getTarifaTotal();

  }

  actualizarCarrito() {
   
    this.productoAdquirido.tarifa = this.totalSinComision;
    this.productoAdquirido.idProducto = this.productoInfoActual.idProducto;
    this.productoAdquirido.comision = this.productoInfoActual.com;
    this.productoAdquirido.comisionAgente = this.comisionAgente;
    this.productoAdquirido.idCotizacion = this.cotizacion.idCotizacion;
    let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
    this.productoAdquirido.precioPorPersona = (this.total / viajeros);
    this.productoAdquirido.total = this.total;


    if (this.t) {
      this.productosAdquiridosService.update(this.productoAdquirido, this.opcionesSeleccionadas, this.trasportes[this.indexTS], this.mejoras, this.mejorasTransporte).subscribe(
        res => {
          //this.editingCarrito = false;
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
 

  esMejoraOpcion(idProductoOpcion) {
    return (this.mejoras.find(mejora => mejora.idProductoOpcion == idProductoOpcion) != undefined) ? true: false;
  }

  esMejoraTransporte(idVehiculo) {
    return (this.mejorasTransporte.find(mejora => mejora.idVehiculo == idVehiculo) != undefined) ? true: false;
  }

}
