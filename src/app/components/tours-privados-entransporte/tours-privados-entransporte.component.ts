import { DatePipe, LocationStrategy } from "@angular/common";
import { Component, Input, OnInit, ViewChild, DoCheck, OnDestroy, EventEmitter, Output } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
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
import { CotizacionesService } from "src/app/services/cotizaciones.service";
import { DestinosService } from "src/app/services/destinos.service";
import { DivisasService } from "src/app/services/divisas.service";
import { ProductosService } from "src/app/services/productos.service";
import { SubcategoriasService } from "src/app/services/subcategorias.service";
import { environment } from "src/environments/environment";
import { ProductosAdquiridosService } from "../../services/productos-adquiridos.service";
import Swal from "sweetalert2";
import * as M from "materialize-css/dist/js/materialize";
import { ProductosOpcionesAdquiridosService } from "../../services/productos-opciones-adquiridos.service";
import { ProductosTransporteAdquiridoService } from "../../services/productos-transporte-adquirido.service";
import { Canasta } from "src/app/models/Canasta";
import { CanastaService } from "../../services/canasta.service";
import { ComisionesAgentesService } from "src/app/services/comisiones-agentes.service";
import { VersionesService } from "src/app/services/versiones.service";
import { Version } from "src/app/models/Version";
import { UsuariosService } from "../../services/usuarios.service";
import { Usuario } from "src/app/models/Usuario";
import { SendDataToEditService } from "src/app/services/sendDataToEdit.service";
import { ProductosPreciosTotales } from 'src/app/models/ProductosPreciosTotales';
import { ProductosPreciosTotalesService } from "src/app/services/productosPreciosTotales.service";
import { ProductoOpcionAdquiridaUpgrade } from 'src/app/models/ProductoOpcionAdquiridaUpgrade';
import { ProductoTransporteUpgrade } from '../../models/ProductoTransporteUpgrade';
import { ProductoTransporteAdquirido } from '../../models/productoTransporteAdquirido';
import { Subscription } from "rxjs";
import { ProductoTransporte } from '../../models/productoTransporte';
import { ActivatedRoute, Router } from "@angular/router";

declare var $: any;

@Component({
  selector: "app-tours-privados-entransporte",
  templateUrl: "./tours-privados-entransporte.component.html",
  styleUrls: ["./tours-privados-entransporte.component.css"],
})
export class ToursPrivadosEntransporteComponent implements OnInit, DoCheck, OnDestroy {
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
  public subcategorias: Subcategoria[] = [];
  public subcategoriaActual: Subcategoria = new Subcategoria();
  public destino: any = new Destino();
  public seleccion: boolean = false;
  public dataSource;
  public totalPersonas: number = 0;
  public cotizacion: Cotizacion = new Cotizacion();
  public divisaBase: DivisaBase = new DivisaBase();
  public productos: Producto[] = [];
  public productoActual: Producto = new Producto();
  public productosRelacionados: Producto[] = [];
  public productoInfoActual: ProductoInfo = new ProductoInfo();
  public productoAdquirido: any = new ProductoAdquirido();
  public productoAdquiridoBase: any = new ProductoAdquirido();
  public divisaActual: Divisa = new Divisa();
  public displayedColumns: string[] = ["tour"];
  public API_URI: string = ``;
  public horarios: ProductoHorario[] = [];
  public usuario: any = new Usuario();
  public lujo: number = 0;
  public trasportes: any[] = [];
  public total: number = 0;
  public totalSinComision: number = 0;
  public transporteSeleccionado: any;
  public transporteSeleccionadoBase: any;
  public indexTS: number = 0; //Index de la lista de transporte
  public incrementoFechaHora: number = 0;
  public productoEntradas: ProductoEntrada[] = [];
  public opcionesSeleccionadas: ProductoOpcion[] = [];
  public opcionesSeleccionadasBase: ProductoOpcion[] = [];
  public productoOpciones: ProductoOpcion[] = [];
  public productoTarifas: ProductoTarifa[] = [];
  public productoPrecioTotal: ProductosPreciosTotales = new ProductosPreciosTotales();
  public esTransportePublico: boolean = false; //Si es elegido transporte público, sirve para las tarifas por personas
  public tourTransporteCanasta: any = {};
  public comisionAgente: number = 0;
  public comision5rivesNueva: number = 0;
  public comisionAgenteNueva: number = 0;
  public diasCerrados: string[] = [];
  public mostrarComision5rives: boolean = false;
  public mostrarComisionAgente: boolean = false;

  public mejoras: ProductoOpcionAdquiridaUpgrade[] = [];
  public mejorasTransporte: ProductoTransporteUpgrade[] = [];

  public editado: boolean = false;
  public mostrarFechas: boolean = false;
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
      $(".tabs").tabs("select", "toursPrivadosEntransporte");
      console.log(this.router.url.split("/"));
      if (this.router.url.split("/").length == 4) {
        console.log("Entra en opcion 1");
        this.seleccion = false;
      } else {
        
        this.seleccion = true;
        this.idProducto = Number.parseInt(this.router.url.split("/")[4]);

        this.router.navigate([`/home/cotizacionProductos/toursPrivadosEnTransporte/${this.router.url.split("/")[4]}`]); 

        this.productosService.listProductoByIdProducto(Number.parseInt(this.router.url.split("/")[4])).subscribe(
          (resp: Producto) => {
            let p = resp;
            this.setProducto(p);
          } 
        );

      }
    } 

    setTimeout(() => { 
      $('.datepicker').datepicker();
    }, 0);

    this.getUsuario();
    if (this.editing) {
      $('#modalDetalleTourTransporte').modal({ dismissible: false });
      this.sendDataToEditService.getProduct("tourTransporte").subscribe(
        (res: any) => {
         // this.idProductoAdquirido = res;
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

  ngDoCheck(): void {
    M.updateTextFields();
  }

  ngOnDestroy(): void{
    this.suscripciones.map(s => s.unsubscribe());
  }

  ngAfterViewChecked() {
    if (localStorage.getItem("productoTransporte") != null) {
      let idProducto = Number.parseInt(localStorage.getItem("productoTransporte"));
      localStorage.removeItem("productoTransporte");
      this.router.navigate([`/home/cotizacionProductos/toursPrivadosEnTransporte`,idProducto]); 
      this.seleccion = true;
      this.productosService.listProductoByIdProducto(idProducto).subscribe(
        (resp: Producto) => {
          let p = resp;
          this.setProducto(p);
        }
      );
    }
  }

  getDiasCerrados() {

    console.log( this.productoAdquirido.fecha );
    this.diasCerrados = [];
    this.productosService
      .listDiasCerradosByIdProducto(this.productoActual.idProducto)
      .subscribe((resp: any[]) => {
        resp.forEach((element) => {
          if (element.fecha == "7") {
            this.diasCerrados.push("0"); //el date devuelve domingo como 0 
          } else {
            this.diasCerrados.push(element.fecha);
          }
        });
        // console.log(this.diasCerrados);
        let jQueryInstance = this; // This line will assign all the angular instances to jQueryInstance variable.
      
        let fecha1 = localStorage.getItem('fechaInicio');
        let minDate: any = new Date(fecha1 += 'T00:00:00');
        let fecha2 = localStorage.getItem('fechaFinal');
        let maxDate: any = new Date(fecha2 += 'T00:00:00');
        let date;
        if (this.editing) {
          date = new Date(this.productoAdquirido.fecha + 'T00:00:00');
        } else { 
           date = minDate; 
        }
        console.log(date);
        console.log( this.productoAdquirido.fecha );
       
        $("#fechaTourPT").datepicker({
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
        console.log( this.productoAdquirido.fecha );
        this.getHorarios();
      });
  }

  getSubcategorias() {
    this.subcategoriasService
      .listByCategoriaCiudad(2, this.destino.idCiudad)
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
                this.comisionesAgentesService
                  .listByIdAgenteTipoActividad(this.cotizacion.idAgente, 4)
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
    if (!this.editing) {
      if (this.subcategorias.length > 0) {
        this.subcategoriaActual = this.subcategorias[ii];
       // this.seleccion = false;
        this.productosService.listByCiudadCategoriaSubcategoria(this.destino.idCiudad, 2, this.subcategorias[ii].idSubcategoria)
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
      }
    } else {
      this.setProducto(this.productoActual);
    }
  }

  // getNombreSubCategoria() {
  //   return this.subCategorias.find(subCategoria => subCategoria.idSubCategoria == this.subcategoriaActual).nombre;
  // }

  setProducto(producto) {
    console.log( this.productoAdquirido.fecha );

    this.productoActual = producto;
    this.seleccion = true;
    this.productosService
      .listProductosRelacionados(this.productoActual.titulo, 2)
      .subscribe((resp: Producto[]) => {
        this.productosRelacionados = resp;
        this.getProductoInfoActual();
      });
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
            this.getTransportes();
            this.divisaActual = resp;
            if (!this.editing) {
              if (this.productoInfoActual.reserva2Meses == false) {
                this.productoAdquirido.fecha = this.datePipe.transform(
                  new Date(),
                  "yyyy-MM-dd"
                );
              } else {
                this.productoAdquirido.fecha = this.datePipe.transform(
                  new Date(new Date().setMonth(new Date().getMonth() + 2)),
                  "yyyy-MM-dd"
                );
              }
            }
            console.log( this.productoAdquirido.fecha );
            this.getDiasCerrados();
          });
      });
  }

  setFecha(date) {
    if (date != undefined) {
      this.productoAdquirido.fecha = date;
    this.verificarEdicion();
    }
    
  }

  getHorarios() {
    this.productosService
      .listHorariosProducto(this.productoActual.idProducto)
      .subscribe((resp: ProductoHorario[]) => {
        this.horarios = resp;
        if(!this.editing){
          this.productoAdquirido.horario = this.horarios[0].hora;
        }
        this.getProductoEntradas();
      });
  }

  getProductoEntradas() {
    this.productosService
      .listEntradasByIdProducto(this.productoActual.idProducto)
      .subscribe((resp: ProductoEntrada[]) => {
        this.productoEntradas = resp;
        this.getOpciones();
      });
  }

  getOpciones() {
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
    this.productosService
      .listTarifasIdProducto(this.productoActual.idProducto)
      .subscribe((resp: ProductoTarifa[]) => {
        this.productoTarifas = resp;
        // this.getTarifaTotal();
        this.getIncrementoFechaHora();
      });
  }

  seleccionarTransporte() {
    this.productosService
        .listTransporteByProducto(this.productoActual.idProducto, this.lujo)
        .subscribe((res: any) => {
          this.trasportes = res;
          if (this.trasportes.length > 0) {
          
            this.indexTS = 0;
            this.getTarifaTotal();
          }
        });
  }

  getTransportes() {
    if (this.editing) {
      this.productosService
        .listTransporteByProducto(this.productoActual.idProducto, this.lujo)
        .subscribe((res: any) => {
          this.trasportes = res;
          if (this.trasportes.length > 0) {
          
            this.indexTS = this.trasportes.findIndex(
              (t) =>
                t.idProductoTransporte ==
                this.transporteSeleccionado.idProductoTransporte
            );
            this.getTarifaTotal();
          }
        });
    } else {
      this.productosService
        .listTransporteByProducto(
          this.productoActual.idProducto,
          Number(this.lujo)
        )
        .subscribe((res: any) => {
          this.trasportes = res;
          if (this.trasportes.length > 0) {
            this.getTarifaTotal();
          }
        });
    }
  }

  setOpcionSeleccionada(ii, productoOpcion) {

    let index = this.opcionesSeleccionadas.findIndex(opcion=> opcion.idProductoOpcion == productoOpcion.idProductoOpcion);
    (index == -1) ? this.opcionesSeleccionadas.push(productoOpcion) : this.opcionesSeleccionadas.splice(index, 1);
    
    if (
      this.mejoras.findIndex((p) => p.idProductoOpcion == productoOpcion.idProductoOpcion) !=-1
    ) {
      this.mejoras.splice( this.mejoras.findIndex((p) => p.idProductoOpcion == productoOpcion.idProductoOpcion),1);
    } 


    this.verificarEdicion();
    this.getTarifaTotal();
  }

  setTransportePublico() {
    if (this.esTransportePublico) {
      this.transporteSeleccionado = this.trasportes[0];
    } else {
      this.transporteSeleccionado = null;
    }
    this.verificarEdicion();
    this.getIncrementoFechaHora();
  }
 
  getTarifaTotal() {
    this.verificarEdicion();
    let tarifaTransporte = 0;
    let tarifaGuia = 0; //Puede ser cientifica o de chofer guia, la de chofer guia es más barata
    let incrementoAudifonos = 0;
    let incrementoEntrada = 0;
    let incrementoOpciones = 0;
    let incrementoHoraExtraGuia = 0;
    let incrementoGuiaAcademico = 0;
    let incrementoHorasExtras = 0;
    let incrementoHorasExtrasChofer = 0;

    if (this.productoInfoActual.tarifaCientifica == 0) {
      
      if (this.esTransportePublico) {
        tarifaTransporte =
          this.transporteSeleccionado.tarifa * this.totalPersonas;
      } else {
        if (
          this.productoTarifas.find(
            (tarifa) => tarifa.numPersonas == this.totalPersonas
          ) != undefined
        ) {
          tarifaTransporte =
            this.productoTarifas.find(
              (tarifa) => tarifa.numPersonas == this.totalPersonas
            ).tarifa * this.totalPersonas; //numero de personas * tarifa por persona según el rango
        } else {
          if (this.totalPersonas > 10) {
            tarifaTransporte =
              this.productoTarifas.find((tarifa) => tarifa.numPersonas == 11)
                .tarifa * this.totalPersonas;
          }
        }
      }
    } else {
      this.transporteSeleccionado = this.trasportes[this.indexTS];
      if (this.transporteSeleccionado.nombre == `Transporte púbico`) {
        tarifaTransporte =
          this.transporteSeleccionado.tarifa * this.totalPersonas;
      } else {
        tarifaTransporte = this.transporteSeleccionado.tarifa;
      }
    }

    if (!this.productoAdquirido.choferGuia) {
      tarifaGuia = this.productoInfoActual.tarifaCientifica;
    } else {
      tarifaGuia = this.productoInfoActual.choferGuia;
    }
    // console.log(this.productoInfoActual);
    if (this.totalPersonas >= 20) {
      incrementoAudifonos =
        this.productoInfoActual.audifonos * this.totalPersonas;
    }

    this.productoEntradas.forEach((entrada) => {
      incrementoEntrada = incrementoEntrada + this.cotizacion.numM * entrada.tarifaAdulto; // Increento por adulto
      
      if (18 >= entrada.minimoMenor && 18 <= entrada.maximoMenor) {
        incrementoEntrada =  incrementoEntrada + this.cotizacion.num18 * entrada.tarifaMenor;
      } else {
        incrementoEntrada =
          incrementoEntrada + this.cotizacion.num18 * entrada.tarifaAdulto;
      }

      if (12 >= entrada.minimoMenor && 12 <= entrada.maximoMenor) {
        incrementoEntrada =
          incrementoEntrada + this.cotizacion.num12 * entrada.tarifaMenor;
      } else {
        incrementoEntrada =
          incrementoEntrada + this.cotizacion.num12 * entrada.tarifaAdulto;
      }
    });

    this.opcionesSeleccionadas.forEach((opcion) => {
      if (this.productoInfoActual.tarifaCientifica == 0) {
        //Se cobrará la tarifa por persona
        if (this.esTransportePublico) {
          incrementoHoraExtraGuia = 0;
        } else {
          

          if (this.productoAdquirido.choferGuia) {
            let horaExtraChoferGuia =
              this.productoInfoActual.choferGuia / this.productoActual.duracion; //Prorata de el costo por hora del chofer guia
            incrementoHoraExtraGuia =
              incrementoHoraExtraGuia +
              opcion.horasExtras * horaExtraChoferGuia;
          } else {
            incrementoHoraExtraGuia =
              incrementoHoraExtraGuia +
              opcion.horasExtras * this.productoInfoActual.horaExtraGuia;
          }

          if (
            this.productoTarifas.find(
              (tarifa) => tarifa.numPersonas == this.totalPersonas
            ) != undefined
          ) {
            tarifaTransporte =
              tarifaTransporte +
              opcion.horaExtraChofer *
                (this.productoTarifas.find(
                  (tarifa) => tarifa.numPersonas == this.totalPersonas
                ).tarifa /
                  this.productoActual.duracion);
          } else {
            if (this.totalPersonas > 10) {
              tarifaTransporte =
                tarifaTransporte +
                opcion.horaExtraChofer *
                  (this.productoTarifas.find(
                    (tarifa) => tarifa.numPersonas == 11
                  ).tarifa /
                    this.productoActual.duracion);
            }
          }
        }
      } else {
        
        if (this.transporteSeleccionado.nombre == `Transporte púbico`) {
          //No se cobran las horas extras
          incrementoHoraExtraGuia = 0;
        } else {
          if (this.productoAdquirido.choferGuia) {
            let horaExtraChoferGuia =
              this.productoInfoActual.choferGuia / this.productoActual.duracion; //Prorata de el costo por hora del chofer guia
            incrementoHoraExtraGuia =
              incrementoHoraExtraGuia +
              opcion.horasExtras * horaExtraChoferGuia;
          } else {
            incrementoHoraExtraGuia =
              incrementoHoraExtraGuia +
              opcion.horasExtras * this.productoInfoActual.horaExtraGuia;
          }

          incrementoHorasExtrasChofer =
            incrementoHorasExtrasChofer +
            opcion.horaExtraChofer * this.transporteSeleccionado.horasExtras;
        }
      }

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

    if (this.productoAdquirido.guiaAcademico) {
      incrementoGuiaAcademico = this.productoInfoActual.guiaAcademico;
    }

    if (this.productoAdquirido.horasExtras > 0) {
      if (this.productoInfoActual.tarifaCientifica == 0) {
        if (this.productoAdquirido.choferGuia) {
          let horaExtraChoferGuia =
            this.productoInfoActual.choferGuia / this.productoActual.duracion; //Prorata de el costo por hora del chofer guia
          incrementoHorasExtras =
            this.productoAdquirido.horasExtras * horaExtraChoferGuia +
            this.productoAdquirido.horasExtras *
              this.transporteSeleccionado.horasExtras;
        } else {
          if (
            this.productoTarifas.find(
              (tarifa) => tarifa.numPersonas == this.totalPersonas
            ) != undefined
          ) {
            incrementoHorasExtras =
              this.productoAdquirido.horasExtras *
                this.productoInfoActual.horaExtraGuia +
              this.productoAdquirido.horasExtras *
                (this.productoTarifas.find(
                  (tarifa) => tarifa.numPersonas == this.totalPersonas
                ).tarifa /
                  this.productoActual.duracion);
          } else {
            if (this.totalPersonas > 10) {
              incrementoHorasExtras =
                this.productoAdquirido.horasExtras *
                  this.productoInfoActual.horaExtraGuia +
                this.productoAdquirido.horasExtras *
                  (this.productoTarifas.find(
                    (tarifa) => tarifa.numPersonas == 11
                  ).tarifa /
                    this.productoActual.duracion);
            }
          }
        }
      } else {

        if (this.productoAdquirido.choferGuia) {
          let horaExtraChoferGuia =
            this.productoInfoActual.choferGuia / this.productoActual.duracion; //Prorata de el costo por hora del chofer guia
          incrementoHorasExtras =
            this.productoAdquirido.horasExtras * horaExtraChoferGuia +
            this.productoAdquirido.horasExtras *
              this.transporteSeleccionado.horasExtras;
        } else {
          incrementoHorasExtras =
            this.productoAdquirido.horasExtras *
              this.productoInfoActual.horaExtraGuia +
            this.productoAdquirido.horasExtras *
              this.transporteSeleccionado.horasExtras;
        }
      }
    }

    this.total = 0;
    this.total =
      this.total +
      tarifaTransporte +
      tarifaGuia +
      incrementoAudifonos +
      incrementoEntrada +
      incrementoOpciones +
      incrementoHoraExtraGuia +
      incrementoGuiaAcademico +
      incrementoHorasExtrasChofer +
      incrementoHorasExtras;
    this.total = this.total * (1 + this.incrementoFechaHora / 100);
    this.total = this.total / this.divisaActual.valor / this.divisaBase.valor;

    let porcentajeCom = this.productoInfoActual.com / 100;
    let porcentajeAgente = this.comisionAgente / 100;
    this.totalSinComision = this.total;
    this.total =
      this.total *
      (1 + porcentajeCom) *
      (1 + porcentajeAgente / (1 - porcentajeAgente));
    
    // console.log("calculando",this.total);
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
                          console.log( this.productoAdquirido.fecha );
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

  async agregar() {
    // console.log(this.mejoras);
    // console.log(this.mejorasTransporte);
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
          'Es un tour privado en transporte opcional',
        confirmButtonText:
          'Continuar <i class="fa fa-arrow-right"></i>',
      })

      this.productoAdquirido.tarifa = this.totalSinComision;
      this.productoAdquirido.idProducto = this.productoInfoActual.idProducto;
      this.productoAdquirido.comision = this.productoInfoActual.com;
      this.productoAdquirido.comisionAgente = this.comisionAgente;
      this.productoAdquirido.opcional = opcional;
      this.productoAdquirido.productoPrecioTotal = this.productoPrecioTotal;

      this.productoAdquirido.nuevo = true;
      this.productoAdquirido.id = this.productoAdquirido.idProductoAdquirido;
      this.productoAdquirido.type = "Tour privado en transporte";
      this.productoAdquirido.precio = this.productoAdquirido.tarifa;
      this.productoAdquirido.valido = true;
      this.productoAdquirido.idToSend = 4;
      this.productoAdquirido.idCiudad = this.destino.idCiudad;
      let product: any = [];
      product.push(this.productoAdquirido);
      product.push(this.opcionesSeleccionadas);
      product.push(this.transporteSeleccionado);
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
      // console.log(this.productoAdquirido);
      const { value: opcional } = await Swal.fire({
        input: 'checkbox',
        inputValue: 0,
        backdrop: false,
        inputPlaceholder:
          'Es un tour privado en transporte opcional',
        confirmButtonText:
          'Continuar <i class="fa fa-arrow-right"></i>',
      })
      // console.log(this.productoAdquirido);
      this.productoAdquirido.tarifa = this.totalSinComision;
      this.productoAdquirido.idProducto = this.productoInfoActual.idProducto;
      this.productoAdquirido.comision = this.productoInfoActual.com;
      this.productoAdquirido.comisionAgente = this.comisionAgente;
      this.productoAdquirido.opcional = opcional;
      this.productosAdquiridosService.create(
          this.productoAdquirido,
          this.opcionesSeleccionadas,
          this.transporteSeleccionado,
          this.mejoras,
          this.mejorasTransporte
        )
        .subscribe((resp: any) => {
          this.mejoras = [];
          this.mejorasTransporte = [];

          this.productoAdquirido.idProductoAdquirido = resp.insertId;
          this.productoAdquirido.tipoNombre = "tourTransporte";
          this.productoAdquirido.tipo = 72;
          this.productoAdquirido.idCiudad = this.destino.idCiudad;
          this.productoAdquirido.ciudad = this.destino.ciudad;
          this.productoAdquirido.titulo = this.productoActual.titulo;
          this.productoAdquirido.categoria = this.productoActual.categoria;

          // this.tourTransporteCanasta.idProducto = "tourTransporte";
          // this.tourTransporteCanasta.tipo = 72;
          // this.tourTransporteCanasta.opcional = opcional;
          // this.tourTransporteCanasta.idProductoAdquirido = resp.insertId;
          // this.tourTransporteCanasta.ciudad = this.destino.ciudad;
          // this.tourTransporteCanasta.idCiudad = this.destino.idCiudad;
          // this.tourTransporteCanasta.fecha = this.productoAdquirido.fecha;
          // this.tourTransporteCanasta.horario = this.productoAdquirido.horario;
          // this.tourTransporteCanasta.comision = this.productoAdquirido.comision;
          // this.tourTransporteCanasta.comisionAgente = this.productoAdquirido.comisionAgente;
          // this.tourTransporteCanasta.tarifa = this.totalSinComision;

          this.canastaService.addProduct(this.productoAdquirido);
          delete this.productoAdquirido.tipoNombre;
          delete this.productoAdquirido.tipo;
          delete this.productoAdquirido.idCiudad;
          // console.log(resp);
          //this.productoAdquirido.idProductoAdquirido = resp.insertId;
          // console.log(this.productoAdquirido);

          let canasta = new Canasta();
          canasta.idCotizacion = this.cotizacion.idCotizacion;
          canasta.idActividad = this.productoAdquirido.idProductoAdquirido;
          canasta.tipo = 7; //Viene de la tabla productos adquridos
          this.productoPrecioTotal.idProducto = resp.insertId;
          // this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
          // this.productoPrecioTotal.tipoProducto = 7;
          // let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
          // this.productoPrecioTotal.precioPorPersona = (this.total / viajeros);
          // this.productoPrecioTotal.total = this.total;
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
          // });
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
    this.comisionAgenteNueva = this.comisionAgente ;
    this.getTarifaTotal();
    this.mostrarComisionAgente = false;
    this.productoAdquirido.comisionAgente = this.comisionAgente;
    this.verificarEdicion();
  }


  actualizacion(pa) {
        this.productoAdquiridoBase = Object.assign({}, pa);
        this.productoAdquirido = pa;
        this.productoAdquiridoBase.fecha = pa.fecha.split(`T`)[0];
        this.productoAdquirido.fecha = pa.fecha.split(`T`)[0];
    console.log( this.productoAdquirido.fecha );
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
                    this.productosTransporteAdquiridoService
                      .listByIdProductoAdquirido(
                        this.productoAdquirido.idProductoAdquirido
                      )
                      .subscribe((trasporteSeleccionado: any) => {
                        this.transporteSeleccionado = trasporteSeleccionado[0];
                        this.lujo = this.transporteSeleccionado.lujo;
                         delete this.transporteSeleccionado.lujo;
                        this.transporteSeleccionadoBase = Object.assign({}, this.transporteSeleccionado);
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
                              console.log("Editing opciones", this.opcionesSeleccionadas);

                                  this.productosAdquiridosService.getMejorasOpciones(this.productoAdquirido.idProductoAdquirido).subscribe(
                                    (resMejorasOpciones: ProductoOpcionAdquiridaUpgrade[]) => {
                                      this.mejoras = resMejorasOpciones;
                                      this.productosAdquiridosService.getMejorasTransporte(this.productoAdquirido.idProductoAdquirido).subscribe(
                                        (resMejorasTransporte: ProductoTransporteUpgrade[]) => {
                                          this.mejorasTransporte = resMejorasTransporte;
                                          this.total = this.productoAdquirido.precio;
                                          console.log( this.productoAdquirido.fecha );
                                          this.getCotizacion();
                                        }
                                      );
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
          });
   //   });
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

  abrirModalDetalle() {
    $('#modalDetalleTourTransporte').modal('open');
  }

  async actualizar() {
    this.productoAdquirido.idProductoAdquirido = 0;
    this.productoAdquirido.tarifa = this.totalSinComision;
    this.productoAdquirido.id = this.idProductoAdquirido;
    this.productoAdquirido.idProducto = this.productoInfoActual.idProducto;
    this.productoAdquirido.comision = this.productoInfoActual.com;
    this.productoAdquirido.comisionAgente = this.comisionAgente;
    this.productoAdquirido.type = 'Tour privado en transporte';
    this.productoAdquirido.notasVersion = $('#detalle').val();
    this.productoAdquirido.editado = true;
    this.productoAdquirido.valido = true;
    if(this.productoAdquirido.notasVersion.trim() === ''){
      M.toast({
        html: 'Error: El campo es obligatorio',
        classes: 'rounded red darken-3'
      });
    } else {

      this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
      this.productoPrecioTotal.tipoProducto = 7;
      let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
      this.productoPrecioTotal.precioPorPersona = (this.total / viajeros);
      this.productoPrecioTotal.total = this.total;
      this.productoAdquirido.productoPrecioTotal = this.productoPrecioTotal;

      this.sendDataToEditService.sendProductToUpdate([
        this.productoAdquirido,
        this.opcionesSeleccionadas,
        this.transporteSeleccionado,
        undefined,
        undefined
      ]);
      this.productoAdquirido = new ProductoAdquirido();
      this.getProductoInfoActual();
      this.editado = false;
      $('.modalSendProducts').modal('close');
      $('#modalDetalleTourTransporte').modal('close');
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Actualizado correctamente",
        showConfirmButton: false,
        timer: 1000,
      });
    }
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
      localStorage.setItem(
        "productoGrupo",
        JSON.stringify(producto.idProducto)
      );
      $(".tabs").tabs("select", "toursPrivadosEngrupo");
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

    let tarifaTransporte = 0;
    let tarifaGuia = 0; //Puede ser cientifica o de chofer guia, la de chofer guia es más barata
    let incrementoAudifonos = 0;
    let incrementoEntrada = 0;
    let incrementoOpciones = 0;
    let incrementoHoraExtraGuia = 0;
    let incrementoGuiaAcademico = 0;
    let incrementoHorasExtras = 0;
    let incrementoHorasExtrasChofer = 0;
    let transporteSeleccionado: any;

    if (this.productoInfoActual.tarifaCientifica == 0) {
      
      if (this.esTransportePublico) {
        tarifaTransporte =
          transporteSeleccionado.tarifa * this.totalPersonas;
      } else {
        if (
          this.productoTarifas.find(
            (tarifa) => tarifa.numPersonas == this.totalPersonas
          ) != undefined
        ) {
          tarifaTransporte =
            this.productoTarifas.find(
              (tarifa) => tarifa.numPersonas == this.totalPersonas
            ).tarifa * this.totalPersonas; //numero de personas * tarifa por persona según el rango
        } else {
          if (this.totalPersonas > 10) {
            tarifaTransporte =
              this.productoTarifas.find((tarifa) => tarifa.numPersonas == 11)
                .tarifa * this.totalPersonas;
          }
        }
      }
    } else {
      transporteSeleccionado = this.trasportes[this.indexTS];
      if (transporteSeleccionado.nombre == `Transporte púbico`) {
        tarifaTransporte =
          transporteSeleccionado.tarifa * this.totalPersonas;
      } else {
        tarifaTransporte = transporteSeleccionado.tarifa;
      }
    }

    if (!this.productoAdquirido.choferGuia) {
      tarifaGuia = this.productoInfoActual.tarifaCientifica;
    } else {
      tarifaGuia = this.productoInfoActual.choferGuia;
    }
    // console.log(this.productoInfoActual);
    if (this.totalPersonas >= 20) {
      incrementoAudifonos =
        this.productoInfoActual.audifonos * this.totalPersonas;
    }

    this.productoEntradas.forEach((entrada) => {
      incrementoEntrada =
        incrementoEntrada + this.cotizacion.numM * entrada.tarifaAdulto;
      if (18 >= entrada.minimoMenor && 18 <= entrada.maximoMenor) {
        incrementoEntrada =
          incrementoEntrada + this.cotizacion.num18 * entrada.tarifaMenor;
      } else {
        incrementoEntrada =
          incrementoEntrada + this.cotizacion.num18 * entrada.tarifaAdulto;
      }

      if (12 >= entrada.minimoMenor && 12 <= entrada.maximoMenor) {
        incrementoEntrada =
          incrementoEntrada + this.cotizacion.num12 * entrada.tarifaMenor;
      } else {
        incrementoEntrada =
          incrementoEntrada + this.cotizacion.num12 * entrada.tarifaAdulto;
      }
    });

    mejoras.forEach((opcion) => {
      if (this.productoInfoActual.tarifaCientifica == 0) {
        //Se cobrará la tarifa por persona
        if (this.esTransportePublico) {
          incrementoHoraExtraGuia = 0;
        } else {
          

          if (this.productoAdquirido.choferGuia) {
            let horaExtraChoferGuia =
              this.productoInfoActual.choferGuia / this.productoActual.duracion; //Prorata de el costo por hora del chofer guia
            incrementoHoraExtraGuia =
              incrementoHoraExtraGuia +
              opcion.horasExtras * horaExtraChoferGuia;
          } else {
            incrementoHoraExtraGuia =
              incrementoHoraExtraGuia +
              opcion.horasExtras * this.productoInfoActual.horaExtraGuia;
          }

          if (
            this.productoTarifas.find(
              (tarifa) => tarifa.numPersonas == this.totalPersonas
            ) != undefined
          ) {
            tarifaTransporte =
              tarifaTransporte +
              opcion.horaExtraChofer *
                (this.productoTarifas.find(
                  (tarifa) => tarifa.numPersonas == this.totalPersonas
                ).tarifa /
                  this.productoActual.duracion);
          } else {
            if (this.totalPersonas > 10) {
              tarifaTransporte =
                tarifaTransporte +
                opcion.horaExtraChofer *
                  (this.productoTarifas.find(
                    (tarifa) => tarifa.numPersonas == 11
                  ).tarifa /
                    this.productoActual.duracion);
            }
          }
        }
      } else {
        
        if (transporteSeleccionado.nombre == `Transporte púbico`) {
          //No se cobran las horas extras
          incrementoHoraExtraGuia = 0;
        } else {
          if (this.productoAdquirido.choferGuia) {
            let horaExtraChoferGuia =
              this.productoInfoActual.choferGuia / this.productoActual.duracion; //Prorata de el costo por hora del chofer guia
            incrementoHoraExtraGuia =
              incrementoHoraExtraGuia +
              opcion.horasExtras * horaExtraChoferGuia;
          } else {
            incrementoHoraExtraGuia =
              incrementoHoraExtraGuia +
              opcion.horasExtras * this.productoInfoActual.horaExtraGuia;
          }

          incrementoHorasExtrasChofer =
            incrementoHorasExtrasChofer +
            opcion.horaExtraChofer * transporteSeleccionado.horasExtras;
        }
      }

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

    if (this.productoAdquirido.guiaAcademico) {
      incrementoGuiaAcademico = this.productoInfoActual.guiaAcademico;
    }

    if (this.productoAdquirido.horasExtras > 0) {
      if (this.productoInfoActual.tarifaCientifica == 0) {
        if (this.productoAdquirido.choferGuia) {
          let horaExtraChoferGuia =
            this.productoInfoActual.choferGuia / this.productoActual.duracion; //Prorata de el costo por hora del chofer guia
          incrementoHorasExtras =
            this.productoAdquirido.horasExtras * horaExtraChoferGuia +
            this.productoAdquirido.horasExtras *
              transporteSeleccionado.horasExtras;
        } else {
          if (
            this.productoTarifas.find(
              (tarifa) => tarifa.numPersonas == this.totalPersonas
            ) != undefined
          ) {
            incrementoHorasExtras =
              this.productoAdquirido.horasExtras *
                this.productoInfoActual.horaExtraGuia +
              this.productoAdquirido.horasExtras *
                (this.productoTarifas.find(
                  (tarifa) => tarifa.numPersonas == this.totalPersonas
                ).tarifa /
                  this.productoActual.duracion);
          } else {
            if (this.totalPersonas > 10) {
              incrementoHorasExtras =
                this.productoAdquirido.horasExtras *
                  this.productoInfoActual.horaExtraGuia +
                this.productoAdquirido.horasExtras *
                  (this.productoTarifas.find(
                    (tarifa) => tarifa.numPersonas == 11
                  ).tarifa /
                    this.productoActual.duracion);
            }
          }
        }
      } else {

        if (this.productoAdquirido.choferGuia) {
          let horaExtraChoferGuia =
            this.productoInfoActual.choferGuia / this.productoActual.duracion; //Prorata de el costo por hora del chofer guia
          incrementoHorasExtras =
            this.productoAdquirido.horasExtras * horaExtraChoferGuia +
            this.productoAdquirido.horasExtras *
              transporteSeleccionado.horasExtras;
        } else {
          incrementoHorasExtras =
            this.productoAdquirido.horasExtras *
              this.productoInfoActual.horaExtraGuia +
            this.productoAdquirido.horasExtras *
             transporteSeleccionado.horasExtras;
        }
      }
    }

   totalMejora =
   totalMejora +
      tarifaTransporte +
      tarifaGuia +
      incrementoAudifonos +
      incrementoEntrada +
      incrementoOpciones +
      incrementoHoraExtraGuia +
      incrementoGuiaAcademico +
      incrementoHorasExtrasChofer +
      incrementoHorasExtras;
      totalMejora = totalMejora * (1 + this.incrementoFechaHora / 100);
      totalMejora = totalMejora / this.divisaActual.valor / this.divisaBase.valor;

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
        $(`#${this.productoOpciones[index].idProductoOpcion}_mtpap`).prop('checked', false);
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


  getDiferenciaTransporte(idVehiculo) {

    this.getTarifaTotal();
    let totalMejora = 0;
    let tarifaTransporte = 0;
    let tarifaGuia = 0; //Puede ser cientifica o de chofer guia, la de chofer guia es más barata
    let incrementoAudifonos = 0;
    let incrementoEntrada = 0;
    let incrementoOpciones = 0;
    let incrementoHoraExtraGuia = 0;
    let incrementoGuiaAcademico = 0;
    let incrementoHorasExtras = 0;
    let incrementoHorasExtrasChofer = 0;
    let transporteSeleccionado: any;
    if (this.productoInfoActual.tarifaCientifica == 0) {
      
      if (this.esTransportePublico) {
        tarifaTransporte =
          transporteSeleccionado.tarifa * this.totalPersonas;
      } else {
        if (
          this.productoTarifas.find(
            (tarifa) => tarifa.numPersonas == this.totalPersonas
          ) != undefined
        ) {
          tarifaTransporte =
            this.productoTarifas.find(
              (tarifa) => tarifa.numPersonas == this.totalPersonas
            ).tarifa * this.totalPersonas; //numero de personas * tarifa por persona según el rango
        } else {
          if (this.totalPersonas > 10) {
            tarifaTransporte =
              this.productoTarifas.find((tarifa) => tarifa.numPersonas == 11)
                .tarifa * this.totalPersonas;
          }
        }
      }
    } else {
      transporteSeleccionado = this.trasportes.find(t => t.idVehiculo == idVehiculo);
      if (transporteSeleccionado.nombre == `Transporte púbico`) {
        tarifaTransporte =
          transporteSeleccionado.tarifa * this.totalPersonas;
      } else {
        tarifaTransporte = transporteSeleccionado.tarifa;
      }
    }

    if (!this.productoAdquirido.choferGuia) {
      tarifaGuia = this.productoInfoActual.tarifaCientifica;
    } else {
      tarifaGuia = this.productoInfoActual.choferGuia;
    }
    // console.log(this.productoInfoActual);
    if (this.totalPersonas >= 20) {
      incrementoAudifonos =
        this.productoInfoActual.audifonos * this.totalPersonas;
    }

    this.productoEntradas.forEach((entrada) => {
      incrementoEntrada =
        incrementoEntrada + this.cotizacion.numM * entrada.tarifaAdulto;
      if (18 >= entrada.minimoMenor && 18 <= entrada.maximoMenor) {
        incrementoEntrada =
          incrementoEntrada + this.cotizacion.num18 * entrada.tarifaMenor;
      } else {
        incrementoEntrada =
          incrementoEntrada + this.cotizacion.num18 * entrada.tarifaAdulto;
      }

      if (12 >= entrada.minimoMenor && 12 <= entrada.maximoMenor) {
        incrementoEntrada =
          incrementoEntrada + this.cotizacion.num12 * entrada.tarifaMenor;
      } else {
        incrementoEntrada =
          incrementoEntrada + this.cotizacion.num12 * entrada.tarifaAdulto;
      }
    });

    this.opcionesSeleccionadas.forEach((opcion) => {
      if (this.productoInfoActual.tarifaCientifica == 0) {
        //Se cobrará la tarifa por persona
        if (this.esTransportePublico) {
          incrementoHoraExtraGuia = 0;
        } else {
          

          if (this.productoAdquirido.choferGuia) {
            let horaExtraChoferGuia =
              this.productoInfoActual.choferGuia / this.productoActual.duracion; //Prorata de el costo por hora del chofer guia
            incrementoHoraExtraGuia =
              incrementoHoraExtraGuia +
              opcion.horasExtras * horaExtraChoferGuia;
          } else {
            incrementoHoraExtraGuia =
              incrementoHoraExtraGuia +
              opcion.horasExtras * this.productoInfoActual.horaExtraGuia;
          }

          if (
            this.productoTarifas.find(
              (tarifa) => tarifa.numPersonas == this.totalPersonas
            ) != undefined
          ) {
            tarifaTransporte =
              tarifaTransporte +
              opcion.horaExtraChofer *
                (this.productoTarifas.find(
                  (tarifa) => tarifa.numPersonas == this.totalPersonas
                ).tarifa /
                  this.productoActual.duracion);
          } else {
            if (this.totalPersonas > 10) {
              tarifaTransporte =
                tarifaTransporte +
                opcion.horaExtraChofer *
                  (this.productoTarifas.find(
                    (tarifa) => tarifa.numPersonas == 11
                  ).tarifa /
                    this.productoActual.duracion);
            }
          }
        }
      } else {
        
        if (transporteSeleccionado.nombre == `Transporte púbico`) {
          //No se cobran las horas extras
          incrementoHoraExtraGuia = 0;
        } else {
          if (this.productoAdquirido.choferGuia) {
            let horaExtraChoferGuia =
              this.productoInfoActual.choferGuia / this.productoActual.duracion; //Prorata de el costo por hora del chofer guia
            incrementoHoraExtraGuia =
              incrementoHoraExtraGuia +
              opcion.horasExtras * horaExtraChoferGuia;
          } else {
            incrementoHoraExtraGuia =
              incrementoHoraExtraGuia +
              opcion.horasExtras * this.productoInfoActual.horaExtraGuia;
          }

          incrementoHorasExtrasChofer =
            incrementoHorasExtrasChofer +
            opcion.horaExtraChofer * transporteSeleccionado.horasExtras;
        }
      }

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

    if (this.productoAdquirido.guiaAcademico) {
      incrementoGuiaAcademico = this.productoInfoActual.guiaAcademico;
    }

    if (this.productoAdquirido.horasExtras > 0) {
      if (this.productoInfoActual.tarifaCientifica == 0) {
        if (this.productoAdquirido.choferGuia) {
          let horaExtraChoferGuia =
            this.productoInfoActual.choferGuia / this.productoActual.duracion; //Prorata de el costo por hora del chofer guia
          incrementoHorasExtras =
            this.productoAdquirido.horasExtras * horaExtraChoferGuia +
            this.productoAdquirido.horasExtras *
              transporteSeleccionado.horasExtras;
        } else {
          if (
            this.productoTarifas.find(
              (tarifa) => tarifa.numPersonas == this.totalPersonas
            ) != undefined
          ) {
            incrementoHorasExtras =
              this.productoAdquirido.horasExtras *
                this.productoInfoActual.horaExtraGuia +
              this.productoAdquirido.horasExtras *
                (this.productoTarifas.find(
                  (tarifa) => tarifa.numPersonas == this.totalPersonas
                ).tarifa /
                  this.productoActual.duracion);
          } else {
            if (this.totalPersonas > 10) {
              incrementoHorasExtras =
                this.productoAdquirido.horasExtras *
                  this.productoInfoActual.horaExtraGuia +
                this.productoAdquirido.horasExtras *
                  (this.productoTarifas.find(
                    (tarifa) => tarifa.numPersonas == 11
                  ).tarifa /
                    this.productoActual.duracion);
            }
          }
        }
      } else {

        if (this.productoAdquirido.choferGuia) {
          let horaExtraChoferGuia =
            this.productoInfoActual.choferGuia / this.productoActual.duracion; //Prorata de el costo por hora del chofer guia
          incrementoHorasExtras =
            this.productoAdquirido.horasExtras * horaExtraChoferGuia +
            this.productoAdquirido.horasExtras *
              transporteSeleccionado.horasExtras;
        } else {
          incrementoHorasExtras =
            this.productoAdquirido.horasExtras *
              this.productoInfoActual.horaExtraGuia +
            this.productoAdquirido.horasExtras *
              transporteSeleccionado.horasExtras;
        }
      }
    }

    
    totalMejora =
    totalMejora +
      tarifaTransporte +
      tarifaGuia +
      incrementoAudifonos +
      incrementoEntrada +
      incrementoOpciones +
      incrementoHoraExtraGuia +
      incrementoGuiaAcademico +
      incrementoHorasExtrasChofer +
      incrementoHorasExtras;
      totalMejora = totalMejora * (1 + this.incrementoFechaHora / 100);
      totalMejora = totalMejora / this.divisaActual.valor / this.divisaBase.valor;

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
        $(`#${this.trasportes[index].idVehiculo}_ttpet`).prop('checked', false);
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


  deseleccionarMejorasTransportes(){
    for (let index = 0; index < this.trasportes.length; index++) {
      
      if(this.trasportes[index].idVehiculo != this.transporteSeleccionado.idVehiculo){
        $(`#${this.trasportes[index].idVehiculo}_ttpet`).prop('checked', false);

      }
    }
  }


  setHorario(value) {
    this.productoAdquirido.horario = value;
    this.verificarEdicion();
    this.getIncrementoFechaHora();
  }

  setTransporte(value) {
    this.indexTS = value;
    this.transporteSeleccionado = this.trasportes[this.indexTS];
    this.mejorasTransporte = [];
    this.deseleccionarMejorasTransportes();
    this.getTarifaTotal();
    this.verificarEdicion();
  }


  verificarEdicion() {
    if (this.editing) {
      // console.log("opciones base", this.opcionesSeleccionadasBase);
      // console.log("opciones", this.opcionesSeleccionadas);
      
      if (JSON.stringify(this.productoAdquiridoBase) !== JSON.stringify(this.productoAdquirido) || this.transporteSeleccionadoBase.idProductoTransporte !== this.transporteSeleccionado.idProductoTransporte || JSON.stringify(this.opcionesSeleccionadas) != JSON.stringify(this.opcionesSeleccionadasBase)) {
        this.editado = true;
      } else {
        this.editado = false;
      }
    }
  }


  cerrarModalEditar() {
    $('.modalSendProducts').modal('close');
  }

  setChoferGuia(value) {
    (value) ? this.productoAdquirido.choferGuia = 1 : this.productoAdquirido.choferGuia = 0;
    this.getTarifaTotal();
  }

  setGuiaAcademico(value) {
    (value) ? this.productoAdquirido.guiaAcademico = 1 : this.productoAdquirido.guiaAcademico = 0;
    this.getTarifaTotal();
  }

  actualizarCarrito(){
    this.productoAdquirido.tarifa = this.totalSinComision;
    this.productoAdquirido.id = this.idProductoAdquirido;
    this.productoAdquirido.idProducto = this.productoInfoActual.idProducto;
    this.productoAdquirido.comision = this.productoInfoActual.com;
    this.productoAdquirido.comisionAgente = this.comisionAgente;
    this.productoAdquirido.total = this.total;
    this.productoAdquirido.idCotizacion = this.cotizacion.idCotizacion;
    let viajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
    this.productoAdquirido.precioPorPersona = (this.total / viajeros);

    console.log("producto a actualizarse", this.productoAdquirido);
    this.productosAdquiridosService.update(this.productoAdquirido, this.opcionesSeleccionadas, this.transporteSeleccionado, this.mejoras, this.mejorasTransporte).subscribe(
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

  }

  esMejoraOpcion(idProductoOpcion) {
    return (this.mejoras.find(mejora => mejora.idProductoOpcion == idProductoOpcion) != undefined) ? true: false;
  }

  esMejoraTransporte(idVehiculo) {
    return (this.mejorasTransporte.find(mejora => mejora.idVehiculo == idVehiculo) != undefined) ? true: false;
  }

}
