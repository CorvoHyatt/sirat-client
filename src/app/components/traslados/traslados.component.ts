import { Component, OnInit, DoCheck, Input, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { TrasladosDesde } from "src/app/models/trasladosDesde.model";
import { TrasladosHacia } from "src/app/models/trasladosHacia.model";
import { TrasladosService } from "../../services/traslados.service";
import { Destino } from "../../models/Destino";
import { Vehiculo } from '../../models/Vehiculo';
import { TrasladosCostosService } from "../../services/traslados-costos.service";
import { Traslado_costo } from "src/app/models/Traslado_costo";
import { TrasladoAdquirido } from "../../models/TrasladoAdquirido";
import { Traslado } from "src/app/models/Traslado";
import { PorcentajeChofer } from "src/app/models/porcentajeChofer.model";
import { Divisa } from "src/app/models/Divisa";
import { TrasladosAdquiridosService } from "../../services/traslados-adquiridos.service";
import { CanastaService } from "../../services/canasta.service";
import { Canasta } from "src/app/models/Canasta";
import { DestinosService } from "../../services/destinos.service";
import Swal from "sweetalert2";
import { TrasladoOtro } from "../../models/TrasladoOtro";
import { DivisasService } from "../../services/divisas.service";
import { TrasladosOtrosService } from "../../services/traslados-otros.service";
import { CotizacionesService } from "../../services/cotizaciones.service";
import { Cotizacion } from "../../models/Cotizacion";
import { DivisaBase } from "../../models/DivisaBase";
import { DatePipe } from "@angular/common";
import { ComisionesAgentesService } from "../../services/comisiones-agentes.service";
import { Version } from "../../models/Version";
import { VersionesService } from "../../services/versiones.service";
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/Usuario';
import * as M from 'materialize-css/dist/js/materialize';
import { SendDataToEditService } from 'src/app/services/sendDataToEdit.service';
import { ProductosPreciosTotales } from './../../models/ProductosPreciosTotales';
import { ProductosPreciosTotalesService } from "src/app/services/productosPreciosTotales.service";
import { TrasladoAdquiridoUpgrade } from '../../models/TrasladoAdquiridoUpgrade';
import { TrasladoOtroUpgrade } from '../../models/TrasladoOtroUpgrade';
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { copyFileSync } from "fs";


declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "app-traslados",
  templateUrl: "./traslados.component.html",
  styleUrls: ["./traslados.component.css"],
})
export class TrasladosComponent implements OnInit, DoCheck, OnDestroy {
  @Input() public editing: boolean = false;
  @Input() public completing: boolean = false;
  @Input() public adding: boolean = false;
  @Input() public idTrasladoAdquirido: number=0;
  @Input() public tipoTraslado: number = 0;
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
  public desde: TrasladosDesde[] = [];
  public hacia: TrasladosHacia[] = [];
  public desdeActual: TrasladosDesde = new TrasladosDesde();
  public haciaActual: TrasladosHacia = new TrasladosHacia();
  public idTrasladoActual: number;
  public destino: any = new Destino();
  public trasladoActual: Traslado = new Traslado();
  public vehiculos: Vehiculo[] = [];
  public vehiculoActual: Vehiculo = new Vehiculo();
  public ii: number = 0;
  public trasladoCostoActual: Traslado_costo = new Traslado_costo();
  public trasladoAdquirido: any = new TrasladoAdquirido();
  public comisionChofer: number = 0;
  public esDireccionEspecifica: boolean = false;
  public trasladoOtro: any = new TrasladoOtro();
  public trasladoOtroBase: any = new TrasladoOtro();
  public divisas: Divisa[] = [];
  public descripcionParte1: string = `Su chófer lo verá a su llegada en `;
  public descripcionParte2: string = ` para trasladarlo al `;
  public cotizacion: Cotizacion = new Cotizacion();
  public divisaActual: Divisa = new Divisa();
  public divisaBase: DivisaBase = new DivisaBase();
  public usuario: any = new Usuario();
  public total: number = 0; 
  public totalSinComision: number = 0;
  public trasladoCanasta: any = {};
  public trasladoOtroCanasta: any = {};
  public comisionAgente: number = 0;
  public comision5rivesNueva: number = 0;
  public comisionAgenteNueva: number = 0;
  public trasladoAdquiridoActual: TrasladoAdquirido = new TrasladoAdquirido();
  public infoExtra: any = {};
  public trasladoAdquiridoBase: any = {};
  public productoPrecioTotal: ProductosPreciosTotales = new ProductosPreciosTotales();
 
  public mostrarComision5rives: boolean = false;
  public mostrarComisionAgente: boolean = false;

  public costos: any =[];
  public mejoras: TrasladoAdquiridoUpgrade[] = [];
  public mejorasBase: TrasladoAdquiridoUpgrade[] = [];

  public mejorasOtros: TrasladoOtroUpgrade[] = [];
  public mejoraOtro: TrasladoOtroUpgrade = new TrasladoOtroUpgrade();
  public editado: boolean = false;

  public validando: boolean = false;
  public trasladoForm: FormGroup;
  public trasladoOtroForm: FormGroup;
  public tipo = 1;
  
  constructor(
    private router: Router,
    private trasladosService: TrasladosService,
    private trasladosCostosService: TrasladosCostosService,
    private trasladosAdquiridosService: TrasladosAdquiridosService,
    private canastaService: CanastaService,
    private destinosService: DestinosService,
    private divisasService: DivisasService,
    private trasladosOtrosService: TrasladosOtrosService,
    private cotizacionesService: CotizacionesService,
    private datePipe: DatePipe,
    private comisionesAgentesService: ComisionesAgentesService,
    private versionesService: VersionesService,
    private usuariosService: UsuariosService,
    private sendDataToEditService: SendDataToEditService,
    private productosPreciosTotalesService: ProductosPreciosTotalesService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    console.log(this.trasladoOtro);
  }

  ngOnInit(): void {
    if (this.router.url.includes("traslados")) {
      $(".tabs").tabs("select", "traslados");
    } 
    this.validarFormulario();
    setTimeout(() => { 
      $('.datepicker').datepicker();
    }, 0);
    this.getUsuario();
    this.getDivisas();
    this.initDatepicker();
    $('#fechaTraslado').datepicker();
   
    // $(document).ready(function () {
    //   $(".modal").modal({ dismissible: false});
    // });
    
    if (this.editing) {
      this.cdr.detectChanges();
     // console.log("editing carrtio", this.editingCarrito);

      $('.modalSendProducts').modal('open');
      $('#modalDetalleTraslado').modal({ dismissible: false });

      this.sendDataToEditService.getProduct('traslado').subscribe((resTraslado: any) => {
        this.tipoTraslado = 1;
        if (Object.keys(resTraslado).length === 0) {
          this.sendDataToEditService.getProduct('trasladoOtro').subscribe((resTrasladoOtro: any) => {
            this.tipoTraslado = 2;
            this.actualizacion(resTrasladoOtro);
          });
        } else {
          this.actualizacion(resTraslado);
        }
      });
 
    }  else {
      this.destinosService.getActualDestino().subscribe((destino: Destino) => {
        if(Object.keys(destino).length === 0) return false;
        this.destino = destino;
        this.getCotizacion();
      });
      $('.modalAddProducts').modal('open');
     
    }
  }

  validarFormulario(){
    this.trasladoForm = this.fb.group({
      numeroPersonas: [0, [Validators.required, Validators.min(1)]],
    });

    this.trasladoOtroForm  = this.fb.group({
      desde: ["", [Validators.required]],
      hacia: ["", [Validators.required]],
      tarifa: [0, [Validators.required, Validators.min(1)]],
      divisa: [1, [Validators.required]],
    });
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


  getCostos(){
    this.trasladosCostosService.listByIdTraslado(this.trasladoActual.idTraslado).subscribe(
      (res: any)=>{
        this.costos = res;
        this.getTotal();
      }
    );
    
  }

  initDatepicker(fecha?: any){
    let fecha1 = localStorage.getItem('fechaInicio');
    let fecha2 = localStorage.getItem('fechaFinal');
    let minDate: any = new Date(fecha1 += 'T00:00:00');
    let maxDate: any = new Date(fecha2 += 'T00:00:00');
    let date = minDate;
    if(fecha){
      date = new Date(fecha += 'T00:00:00');
    }
    $('#fechaTraslado').datepicker({
      minDate: minDate,
      maxDate: maxDate,
      setDefaultDate: date,
      defaultDate: date,
      format: "yyyy-mm-dd",
      i18n: this.i18nOptions
    });
  }

  getDivisas() {
    this.divisasService.getAll().subscribe((resp: Divisa[]) => {
      this.divisas = resp;
      if (!this.editing) {
        this.trasladoOtro.idDivisa = resp[0].idDivisa;

      }
    });
  }

  getDivisaActual(idDivisa: number) {
    this.divisasService.getOne(idDivisa).subscribe((resp: Divisa) => {
      this.divisaActual = resp;
    });
  }

  getCotizacion() {
    this.cotizacionesService
      .list_one(this.destino.idCotizacion)
      .subscribe((resp: Cotizacion) => {
        this.cotizacion = resp;
        if(!this.editing){
          this.trasladoAdquirido.pasajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
        }
        this.divisasService
          .divisaBase_getOne(this.cotizacion.divisa)
          .subscribe((resp: DivisaBase) => {
            this.divisaBase = resp;
            if (this.cotizacion.comisionAgente == 2) {
              //Se incluye la comsión el agente
              this.comisionesAgentesService
                .listByIdAgenteTipoActividad(this.cotizacion.idAgente, 1)
                .subscribe((comisionAgente: number) => {
                  if (!this.editing) {
                    this.comisionAgente = comisionAgente;
                  } else {
                    this.comisionAgente = this.trasladoAdquirido.comisionAgente;
                  }
                  this.getTraslados();
                });
            } else {
              this.getTraslados();
            }

          });
      });
  }

  getTraslados() {
    this.desde = [];
    this.hacia = [];
    this.trasladosService
      .listTrasladoByCiudadidDesde(this.destino.idCiudad)
      .subscribe(
        (res1) => {
          console.log("Desdes", res1);
          this.desde = res1 as TrasladosDesde[];
          if (this.desde.length > 0) {
            if (this.editing) {
              if (this.tipoTraslado == 1) {
                this.desdeActual = this.desde.find(d => d.idDesde === this.trasladoActual.idDesde);
                this.desdeActual = this.desdeActual === undefined ? new TrasladosDesde() : this.desdeActual;
                this.trasladosService
                  .listTrasladoByCiudadidHacia(
                    this.destino.idCiudad,
                    this.desdeActual.idDesde
                  )
                  .subscribe(
                    (res2) => {
                     // console.log("hacias", res2);
                      this.hacia = res2 as TrasladosHacia[];
                      this.haciaActual = this.hacia.find(h => h.idHacia === this.trasladoActual.idHacia);
                      this.haciaActual = this.haciaActual === undefined ? new TrasladosHacia() : this.haciaActual;
                      
                      if (this.haciaActual.idHacia == -1) {
                        this.esDireccionEspecifica = true;
                       // this.esDirEspecifica();
                      } else {
                        this.esDireccionEspecifica = false;
                      }
                      this.getTraslado();
                    },
                    (err) => console.error(err)
                  );
              } else {
                this.esDireccionEspecifica = true;
                if (this.trasladoOtro.desde.toString().match(/^[0-9]$/)) {
                  this.desdeActual = this.desde.find(d => d.idDesde === Number.parseInt(this.trasladoOtro.desde));
                } else {
                  let to = new TrasladosDesde();
                  to.idDesde = -1;
                  this.desdeActual = to;
                }
              
               
                this.trasladosService
                .listTrasladoByCiudadidHacia(
                  this.destino.idCiudad,
                  this.desdeActual.idDesde
                )
                .subscribe(
                  (res2) => {
                    this.hacia = res2 as TrasladosHacia[];
                    if (this.trasladoOtro.hacia.toString().match(/^[0-9]$/)) {
                      this.haciaActual = this.hacia.find(h => h.idHacia === Number.parseInt(this.trasladoOtro.hacia));
                    } else {
                      let ho = new TrasladosHacia();
                      ho.idHacia = -1;
                      this.haciaActual = ho;
                    }
                    this.getTraslado();
                  },
                  (err) => console.error(err)
                );
              }
           
            } else {
              this.desdeActual = this.desde[0];
              this.trasladoAdquirido.descripcion =
              this.descripcionParte1 + this.desde[0].nombre;
              this.trasladosService
                .listTrasladoByCiudadidHacia(
                  this.destino.idCiudad,
                  this.desde[0].idDesde
                )
                .subscribe(
                  (res2) => {
                    this.hacia = res2 as TrasladosHacia[];
                    //console.log("Hacias", this.hacia);
                    this.haciaActual = this.hacia[0];
                    console.log("hacia actual desc vacio", this.haciaActual);
                    this.getDescripcion();
                    if (this.haciaActual.idHacia == -1) {
                      this.esDireccionEspecifica = true;
                      this.esDirEspecifica();
                    } else {
                      this.esDireccionEspecifica = false;
                    }
                    this.getTraslado();
                    if(!this.editing){
                      this.initDatepicker();
                    }
                  },
                  (err) => console.error(err)
                );
            }
          }
        },
        (err) => console.error(err)
      );
  }
  setDesde(index) {
    $('#desde').val("");
    $('#hacia').val("");
    this.mejoras = [];
    this.mejorasOtros = [];
    this.validando = false;
    this.deseleccionarMejoras();
    this.desdeActual = this.desde[index];
    console.log("desde actual", this.desdeActual);
    this.trasladoAdquirido.descripcion =
      this.descripcionParte1 + this.desde[index].nombre;
   

    this.trasladosService
      .listTrasladoByCiudadidHacia(
        this.destino.idCiudad,
        this.desde[index].idDesde
      )
      .subscribe(
        (res) => {
          this.hacia = res as TrasladosHacia[];

          if (this.tipo == 2) {
            console.log("Entra a seleccionar hacia otra");
            for (let index = 0; index < this.hacia.length; index++) {
              if (this.hacia[index].haciaOriginal.includes("Centro")) {

                let h = this.hacia[index].nombre.split("Centro");
                if (h[0].length > 0) {
                  console.log("centro", this.hacia[index], index);
                  this.haciaActual = this.hacia[index];
                  break;                }

              }
          }
          } else { 
            this.haciaActual = this.hacia[0];
          }

          this.getDescripcion();
         
         
            if (this.haciaActual.idHacia == -1 ||this.desdeActual.idDesde== -1 ) {
              this.esDireccionEspecifica = true;
              this.trasladoOtro.descripcion =
                this.descripcionParte1 +
                `  ` +
                this.descripcionParte2 +
                this.haciaActual.nombre;
                if (this.haciaActual.idHacia == -1) {
                  this.trasladoOtro.hacia = "";
                }
          
                if (this.desdeActual.idDesde == -1) {
                  this.trasladoOtro.desde = "";
                }
        
              this.esDirEspecifica();
            } else {
              this.esDireccionEspecifica = false;
            }
          this.getTraslado();
        },
        (err) => console.error(err)
      );
  }

  setHacia(index) {
    $('#desde').val("");
    $('#hacia').val("");
    this.mejoras = [];
    this.mejorasOtros = [];
    this.validando = false;
    this.deseleccionarMejoras();
    // this.esDireccionEspecifica = false;
    this.haciaActual = this.hacia[index];
    console.log("hacia actual", this.haciaActual);
    this.getDescripcion();
    //////console.log(this.trasladoAdquirido.descripcion.split(this.descripcionParte2));
    if (this.haciaActual.idHacia == -1 ||this.desdeActual.idDesde== -1 ) {
      this.esDireccionEspecifica = true;
      this.trasladoOtro.descripcion =
        this.descripcionParte1 +
        this.desdeActual.nombre +
        this.descripcionParte2;
      if (this.haciaActual.idHacia == -1) {
        this.trasladoOtro.hacia = "";
      }

      if (this.desdeActual.idDesde == -1) {
        this.trasladoOtro.desde = "";
      }


      this.esDirEspecifica();
    } else {
      this.esDireccionEspecifica = false;
    }
    this.getTraslado();
  }

  getTraslado() {
    this.trasladosService
      .getTrasladoByDesdeHacia(
        this.destino.idCiudad,
        this.desdeActual.idDesde,
        this.haciaActual.idHacia
      )
      .subscribe(
        (res: any) => {
          if (!this.editing) {
            this.trasladoActual = res[0];
          } else {            
            if (this.tipoTraslado == 2) this.trasladoActual = res[0];
            this.trasladoActual.comision = this.trasladoAdquirido.comision;
            this.comisionAgente = this.trasladoAdquirido.comisionAgente;
          }
          this.getCostos();
          this.getVehiculos();
        },
        (err) => console.error(err)
      );
  }

  getVehiculos() {
    this.trasladosService
      .listVehiculosByTraslado(this.trasladoActual.idTraslado)
      .subscribe(
        (res: any) => {
          this.vehiculos = res;
          //console.log("editingCarrito", this.editingCarrito);
          //console.log("vehiculos de editing", this.vehiculos);
          //console.log("costos",this.costos);
          if (this.editing) {

            if (this.tipoTraslado == 1) {
              this.vehiculoActual = this.vehiculos.find(v => v.idVehiculo === this.trasladoCostoActual.idVehiculo);
              this.ii=this.vehiculos.findIndex(v => v.idVehiculo == this.trasladoCostoActual.idVehiculo);
            } else {
              this.vehiculoActual = this.vehiculos.find(v => v.idVehiculo == this.trasladoOtro.idVehiculo);
              this.ii = this.vehiculos.findIndex(v => v.idVehiculo == this.trasladoOtro.idVehiculo);
            }
            
          } else {
            this.vehiculoActual = res[0];
          }
          
          // ////console.log(`vehiculo actual`,this.vehiculoActual);
          this.getTrasladoCosto();
        },
        (err) => console.error(err)
      );
  }

  
  setVehiculoActual(value) {
    this.ii = value;
    this.mejoras = [];
    this.deseleccionarMejoras();
    this.vehiculoActual = this.vehiculos[this.ii];
    this.getTrasladoCosto();
  }

  getTrasladoCosto() {
  
    this.trasladosCostosService
      .listByTrasladoVehiculo(
        this.trasladoActual.idTraslado,
        this.vehiculoActual.idVehiculo
      )
      .subscribe(
        (res: Traslado_costo) => {
          // if (!this.editing) {
             this.trasladoCostoActual = res[0];
          // }

          this.divisasService
            .getOne(this.trasladoCostoActual.idDivisa)
            .subscribe((resp: Divisa) => {
              this.divisaActual = resp;
              //  ////console.log(this.divisaActual);
              this.verificarEdicion();
              this.actualizarPrecioTraslados();
            });
        },
        (err) => console.error(err)
      );
  }

  actualizarPrecioTraslados(date?: any) {
   
    if (date != undefined) {
      this.trasladoAdquirido.fecha = date;
    }

    this.verificarEdicion();


    // ////console.log(`actualizarPrecioTraslados`);
    this.comisionChofer = 0;
    this.trasladosService
      .incrementoByTrasladoFecha(
        this.trasladoActual.idTraslado,
        this.datePipe.transform(this.trasladoAdquirido.fecha, "dd-MM")
      )
      .subscribe(
        (res3) => {
          // //console.log(res3);
          let porcentajes = res3 as PorcentajeChofer[];
          if (porcentajes.length == 0) {
            this.trasladosService
              .incrementoByTrasladoFechaVariable(
                this.trasladoActual.idTraslado,
                this.datePipe.transform(this.trasladoAdquirido.fecha, "dd-MM")
              )
              .subscribe(
                (res4) => {
                  let porcentajes = res4 as PorcentajeChofer[];

                  if (porcentajes.length == 0) {
                    this.trasladosService
                      .incrementoByTrasladoHora(
                        this.trasladoActual.idTraslado,
                        this.trasladoAdquirido.hora
                      )
                      .subscribe(
                        (res5) => {
                          let porcentajes = res5 as PorcentajeChofer[];
                          if (porcentajes.length != 0) {
                            this.comisionChofer = porcentajes[0].porcentaje;
                          }
                          this.getTotal();
                          // //console.log(this.comisionChofer);
                        },
                        (err) => console.error(err)
                      );
                  } else {
                    this.comisionChofer = porcentajes[0].porcentaje;
                    this.getTotal();
                  }
                },
                (err) => console.error(err)
              );
          } else {
            this.comisionChofer = porcentajes[0].porcentaje;
            this.getTotal();
          }
        },
        (err) => console.error(err)
      );
  }

  getTotal() {
    //console.log(`Obteniendo total...`);
    //console.log(this.trasladoCostoActual);
    let porcentajeCom = this.trasladoActual.comision / 100;
    let porcentajeAgente = this.comisionAgente / 100;

    if (!this.esDireccionEspecifica) {
      this.totalSinComision = this.trasladoCostoActual.costo *
        (1 + this.comisionChofer / 100);
      this.totalSinComision = this.totalSinComision / this.divisaActual.valor / this.divisaBase.valor;
      
      this.total =
        this.trasladoCostoActual.costo *
        (1 + this.comisionChofer / 100) *
        (1 + porcentajeCom) *
        (1 + porcentajeAgente / (1 - porcentajeAgente));
      this.total = this.total / this.divisaActual.valor / this.divisaBase.valor;
    } else {
      let respD = this.divisas.find(d => d.idDivisa == this.trasladoOtro.idDivisa);
      // this.divisasService
      //   .getOne(this.trasladoOtro.idDivisa)
      //   .subscribe((respD: Divisa) => {
          // porcentajeCom = this.trasladoActual.comision / 100;
          // porcentajeAgente = this.comisionAgente / 100;
          this.totalSinComision = this.trasladoOtro.tarifa *
            (1 + this.comisionChofer / 100);
      
          this.totalSinComision = this.totalSinComision / respD.valor / this.divisaBase.valor;
          this.total =
            this.trasladoOtro.tarifa *
            (1 + porcentajeCom) *
            (1 + porcentajeAgente / (1 - porcentajeAgente));
          this.total = this.total / respD.valor / this.divisaBase.valor;
     //   });
    }
  }
  //async agregar() {
  async agregar() {    
    this.validando = true;
    console.log("agregar!!!!",this.esDireccionEspecifica);

    console.log(this.trasladoOtro);

    if (!this.validarInfo()) return;

    if (this.adding) {
      console.log("this.adding");
      const { value: opcional } = await Swal.fire({
        input: 'checkbox',
        inputValue: 0,
        backdrop: false,
        inputPlaceholder:
          'Este es un traslado opcional',
        confirmButtonText:
          'Continuar <i class="fa fa-arrow-right"></i>',
      })

      this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
      this.productoPrecioTotal.tipoProducto = 1;
      this.productoPrecioTotal.total = this.total;

      if (!this.esDireccionEspecifica) {
        console.log("!this.esDireccionEspecifica");
        this.trasladoAdquirido.tarifa = this.totalSinComision;
        this.trasladoAdquirido.idTraslado = this.trasladoActual.idTraslado;
        this.trasladoAdquirido.idTrasladoCosto = this.trasladoCostoActual.idTrasladoCosto;
        this.trasladoAdquirido.comision = this.trasladoActual.comision;
        this.trasladoAdquirido.comisionAgente = this.comisionAgente;
        this.trasladoAdquirido.opcional = opcional;

        this.trasladoAdquirido.nuevo = true;
        this.trasladoAdquirido.id = this.trasladoAdquirido.idTrasladoAdquirido;
        this.trasladoAdquirido.type = 'Traslado';
        this.trasladoAdquirido.precio = this.trasladoAdquirido.tarifa;
        this.trasladoAdquirido.valido = true;
        this.trasladoAdquirido.idToSend = 1;
        this.trasladoAdquirido.idCiudad = this.destino.idCiudad;

        this.trasladoAdquirido.productoPrecioTotal = this.productoPrecioTotal;

        let product: any = [];
        product.push(this.trasladoAdquirido);
        product.push(this.mejoras);

        this.sendDataToEditService.sendProductToUpdate(product);
        $('.modalAddProducts').modal('close');
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Producto agregado correctamente`,
          showConfirmButton: false,
          timer: 1500
        });
      }
      else{
        console.log("this.esDireccionEspecifica");
        //Se agrega el traslado otros otro desde nueva version
        this.esDirEspecifica();
        this.trasladoOtro.comision = this.trasladoActual.comision;
        if(this.haciaActual.idHacia == -1) {
          this.trasladoOtro.desde = this.desdeActual.idDesde.toString();
        }
        if(this.desdeActual.idDesde == -1) {
          this.trasladoOtro.hacia = this.haciaActual.idHacia.toString();
        }

        this.trasladoOtro.idTraslado = this.trasladoActual.idTraslado;

        this.trasladoOtro.tarifa = this.totalSinComision;
        this.trasladoOtro.precio = this.totalSinComision;
        this.trasladoOtro.idDivisa = this.cotizacion.divisa;
        this.trasladoOtro.opcional = opcional;
        this.trasladoOtro.comisionAgente = this.comisionAgente;
        this.trasladoOtro.nuevo = true;
        this.trasladoOtro.type = 'Traslado Otro';
        this.trasladoOtro.valido = true;
        this.trasladoOtro.idToSend = 11;
        this.trasladoOtro.id = 0;
        let product: any = [];

        this.trasladoOtro.productoPrecioTotal = this.productoPrecioTotal;

        product.push(this.trasladoOtro);
        product.push(this.mejorasOtros);
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
      }
    } 
    
    else {
      console.log("!this.adding");
      console.log(this.trasladoOtro);

      const { value: opcional } = await Swal.fire({
        input: 'checkbox',
        inputValue: 0,
        backdrop: false,
        inputPlaceholder:
          'Este es un traslado opcional',
        confirmButtonText:
          'Continuar <i class="fa fa-arrow-right"></i>',
      })
      console.log(this.trasladoOtro);

      this.trasladoAdquirido.tarifa = this.totalSinComision;
      if (!this.esDireccionEspecifica) {
        console.log("!this.esDireccionEspecifica");

        this.trasladoAdquirido.idTraslado = this.trasladoActual.idTraslado;
        this.trasladoAdquirido.idTrasladoCosto = this.trasladoCostoActual.idTrasladoCosto;
        this.trasladoAdquirido.comision = this.trasladoActual.comision;
        this.trasladoAdquirido.comisionAgente = this.comisionAgente;
        this.trasladoAdquirido.opcional = opcional;
        this.trasladosAdquiridosService.create(this.trasladoAdquirido, this.mejoras).subscribe(
          (res1: any) => {

            this.trasladoAdquirido.tipo = 1;
            this.trasladoAdquirido.tipoNombre = "traslado";
            this.trasladoAdquirido.idTrasladoAdquirido = res1.insertId;
            this.trasladoAdquirido.ciudad = this.destino.ciudad;
            this.trasladoAdquirido.idCiudad = this.destino.idCiudad;
            this.trasladoAdquirido.horario = this.trasladoAdquirido.hora;
            this.canastaService.addProduct(this.trasladoAdquirido);
            delete this.trasladoAdquirido.tipo;
            delete this.trasladoAdquirido.tipoNombre;
            delete this.trasladoAdquirido.idCiudad;
            delete this.trasladoAdquirido.horario;
            delete this.trasladoAdquirido.ciudad;
             
            let canasta = new Canasta();
            canasta.idActividad = res1.insertId;
            canasta.tipo = 1; //es un traslado
            canasta.idCotizacion = this.destino.idCotizacion;
            this.productoPrecioTotal.idProducto = res1.insertId;
            this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
            this.productoPrecioTotal.tipoProducto = 1;
            this.productoPrecioTotal.total = this.total;
            this.productosPreciosTotalesService.create(this.productoPrecioTotal).subscribe((resTotal: any) => {
              this.productoPrecioTotal = new ProductosPreciosTotales();
            });
            this.canastaService.create(canasta).subscribe(
              (res: any) => {
                let version = new Version();
                version.idActividad = res1.insertId;
                version.tipo = 1; //Es un traslado
                // version.version = 1; //Es una insecion nueva por lo que se inicaliza en 1
                version.idCotizacion = this.cotizacion.idCotizacion;
                version.versionCotizacion = this.cotizacion.version;
                version.accion = 1;
                // this.usuariosService.list_oneByCorreo(localStorage.getItem(`correo`)).subscribe((usuario: Usuario) => {
                  //console.log(usuario);
                version.idUsuario = this.usuario.idUsuario;
                this.versionesService.create(version).subscribe((resp) => {
                  this.mejoras = [];
                  this.deseleccionarMejoras();
                  this.redirect.emit(1);
                  this.editing = false;
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `Producto agregado correctamente`,
                    showConfirmButton: false,
                    timer: 1500,
                  });
                });
            }, (err) => console.error(err));
          },
          (err) => console.error(err)
        );
      } 
      else {
        console.log("this.esDireccionEspecifica");
        console.log(this.trasladoOtro);
        console.log(this.trasladoActual);
       // console.log("traslado actual", this.trasladoActual);
        this.esDirEspecifica();
        this.trasladoOtro.comision = this.trasladoActual.comision;
       
        if (this.haciaActual.idHacia == -1 && this.desdeActual.idDesde !=-1) {
          this.trasladoOtro.desde = this.desdeActual.idDesde.toString();

        }
  
        if (this.desdeActual.idDesde == -1 && this.haciaActual.idHacia != -1) {
          this.trasladoOtro.hacia = this.haciaActual.idHacia.toString();
        }

        this.trasladoOtro.idTraslado = this.trasladoActual.idTraslado;


 
        this.trasladoOtro.tarifa = this.totalSinComision;
        this.trasladoOtro.comisionAgente = this.comisionAgente;
        this.trasladoOtro.opcional = opcional;
        console.log("despues",this.trasladoOtro);

        this.trasladosOtrosService.create(this.trasladoOtro, this.mejorasOtros).subscribe(
          (resTrasladoOtro: any) => {
            this.mejorasOtros = [];
            // this.trasladoOtroCanasta = Object.assign({},  this.trasladoOtro);
            // this.trasladoOtroCanasta.idProducto = "trasladoOtro";
            // this.trasladoOtroCanasta.tipo = 3;
            // this.trasladoOtroCanasta.desde = this.haciaActual.idHacia === -1 ? this.desdeActual.nombre : this.trasladoOtro.desde;
            // this.trasladoOtroCanasta.hacia = this.desdeActual.idDesde === -1 ? this.haciaActual.nombre : this.trasladoOtro.hacia;
            // this.trasladoOtroCanasta.vehiculo = this.vehiculoActual.nombre;
            // this.trasladoOtroCanasta.idTrasladoOtro = resTrasladoOtro.insertId;
            // this.trasladoOtroCanasta.idCiudad = this.destino.idCiudad;
            // this.trasladoOtroCanasta.ciudad = this.destino.ciudad;
            // this.trasladoOtroCanasta.fecha = this.trasladoOtro.fecha;

            // this.trasladoOtroCanasta.horario = this.trasladoOtro.hora;
            // this.trasladoOtroCanasta.tarifa = this.totalSinComision;
            // this.trasladoOtroCanasta.comisionAgente = this.trasladoOtro.comisionAgente;
            // this.trasladoOtroCanasta.comision = this.trasladoOtro.comision;

            this.trasladoOtro.tipo = 3;
            this.trasladoOtro.tipoNombre = "trasladoOtro";
            this.trasladoOtro.idTrasladoOtro = resTrasladoOtro.insertId;
            this.trasladoOtro.idCiudad = this.destino.idCiudad;
            this.trasladoOtro.ciudad = this.destino.ciudad;
            this.trasladoOtro.desde = this.haciaActual.idHacia === -1 ? this.desdeActual.nombre : this.trasladoOtro.desde;
            this.trasladoOtro.hacia = this.desdeActual.idDesde === -1 ? this.haciaActual.nombre : this.trasladoOtro.hacia;
            this.trasladoOtro.vehiculo = this.vehiculoActual.nombre;
            this.trasladoOtro.horario = this.trasladoOtro.hora;
            console.log(this.trasladoOtro);
            this.canastaService.addProduct(this.trasladoOtro);
            delete this.trasladoOtro.ciudad;
            delete this.trasladoOtro.vehiculo;
            delete this.trasladoOtro.horario;


            let canasta = new Canasta();
            canasta.idActividad = resTrasladoOtro.insertId;
            canasta.tipo = 3; //es un traslado otro
            canasta.idCotizacion = this.destino.idCotizacion;
            this.productoPrecioTotal.idProducto = resTrasladoOtro.insertId;
            this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
            this.productoPrecioTotal.tipoProducto = 3;
            this.productoPrecioTotal.total = this.total;
            this.productosPreciosTotalesService.create(this.productoPrecioTotal).subscribe((resTotal: any) => {
              this.productoPrecioTotal = new ProductosPreciosTotales();
            });
            this.canastaService.create(canasta).subscribe(
              (res: any) => {
                let version = new Version();
                version.idActividad = resTrasladoOtro.insertId;
                version.tipo = 3; //Es un traslado otro
                // version.version = 1; //Es una insecion nueva por lo que se inicaliza en 1
                version.idCotizacion = this.cotizacion.idCotizacion;
                version.versionCotizacion = this.cotizacion.version;
                version.accion = 1;
                // this.usuariosService.list_oneByCorreo(localStorage.getItem(`correo`)).subscribe((usuario: Usuario) => {
                //console.log(usuario);
                version.idUsuario = this.usuario.idUsuario;
                this.versionesService.create(version).subscribe((resp) => {
                  this.trasladoOtro.tarifa = 0;
                  this.trasladoOtro.idTrasladoOtro = 0;
                  $('#desde').val("");
                  $('#hacia').val("");
                  this.total = 0;
                  this.editing = false;
                  this.redirect.emit(1);
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `Producto agregado correctamente`,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                });
              },
              (err) => console.error(err)
            );
          },
          (err) => console.error(err)
        );
      }
    }
  }

  llenarActualizacion() {
    this.trasladoOtro.idTrasladoOtro = this.trasladoAdquirido.idTrasladoOtro;
    this.trasladoOtro.idCiudad = this.destino.idCiudad;
    (this.trasladoAdquirido.idDesde != undefined) ? this.trasladoOtro.desde = this.trasladoAdquirido.idDesde : this.trasladoOtro.desde = this.trasladoAdquirido.desde;  
    (this.trasladoAdquirido.idHacia != undefined) ? this.trasladoOtro.hacia = this.trasladoAdquirido.idHacia : this.trasladoOtro.hacia = this.trasladoAdquirido.hacia;  
    this.trasladoOtro.idVehiculo = this.trasladoAdquirido.idVehiculo;
    this.trasladoOtro.tarifa = this.trasladoAdquirido.tarifa;
    this.trasladoOtro.idDivisa = this.trasladoAdquirido.idDivisa;
    this.trasladoOtro.cancelaciones = this.trasladoAdquirido.cancelaciones;
    this.trasladoOtro.comision = this.trasladoAdquirido.comision;
    this.trasladoOtro.comisionAgente = this.trasladoAdquirido.comisionAgente;
    this.trasladoOtro.notas = this.trasladoAdquirido.notas;
    this.trasladoOtro.fecha = this.trasladoAdquirido.fecha;
    this.trasladoOtro.hora = this.trasladoAdquirido.hora;
    this.trasladoOtro.pasajeros = this.trasladoAdquirido.pasajeros;
    this.trasladoOtro.descripcion = this.trasladoAdquirido.descripcion;
    this.trasladoOtro.opcional = this.trasladoAdquirido.opcional;
    this.trasladoActual.comision = this.trasladoAdquirido.comision; 

  }
  esDirEspecifica() {
   // this.total = this.trasladoOtro.tarifa;
    this.esDireccionEspecifica = true;
    this.trasladoOtro.idVehiculo = this.vehiculoActual.idVehiculo;
     this.trasladoOtro.idCiudad = this.destino.idCiudad;
     this.trasladoOtro.pasajeros = this.trasladoAdquirido.pasajeros;
    this.trasladoOtro.fecha = this.trasladoAdquirido.fecha;
    this.trasladoOtro.hora = this.trasladoAdquirido.hora;
    // this.trasladoOtro.notas = this.trasladoAdquirido.notas;
  
  }

  setDescripcionHacia() {
    this.trasladoOtro.descripcion =
      this.descripcionParte1 +
      this.desdeActual.nombre +
      this.descripcionParte2 +
      this.trasladoOtro.hacia;
      this.verificarEdicion();
  }

  setDescripcionDesde() {
    this.trasladoOtro.descripcion =
      this.descripcionParte1 +
      this.trasladoOtro.desde +
      this.descripcionParte2 +
      this.haciaActual.nombre;
    this.verificarEdicion();
  }

  cambiarComision5rives() {
    this.trasladoActual.comision = this.comision5rivesNueva;
    this.comision5rivesNueva =this.trasladoActual.comision
    this.actualizarPrecioTraslados();
    this.mostrarComision5rives = false;
    this.trasladoAdquirido.comision = this.trasladoActual.comision;
    this.verificarEdicion();
  }

  
  cambiarComisionAgente() {
    this.comisionAgente = this.comisionAgenteNueva;
    this.comisionAgenteNueva =    this.comisionAgente 
    this.actualizarPrecioTraslados();
    this.mostrarComisionAgente = false;
    this.trasladoAdquirido.comisionAgente = this.comisionAgente;
    this.verificarEdicion();

  }



  actualizacion(trasladoEditing) {
    if (this.tipoTraslado == 1) {
          this.trasladoAdquiridoBase = Object.assign({}, trasladoEditing);
          this.trasladoAdquirido = Object.assign({}, trasladoEditing);
          this.trasladoAdquirido.hora = trasladoEditing.horario.split(":")[0]+":"+trasladoEditing.horario.split(":")[1] ;
          this.trasladoAdquiridoBase.hora = this.trasladoAdquirido.hora;
          this.trasladoAdquirido.fecha = this.trasladoAdquirido.fecha.split(`T`)[0];
          this.trasladoAdquiridoBase.fecha = this.trasladoAdquirido.fecha;
     
          this.trasladosService.getOne(this.trasladoAdquirido.idTraslado).subscribe(
            (resp2: Traslado) => {
              this.trasladoActual = resp2;
              setTimeout(() => {
                this.initDatepicker(this.trasladoAdquirido.fecha);
              }, 1300);
              this.trasladosCostosService.listOne(this.trasladoAdquirido.idTrasladoCosto).subscribe(
                (resp3: Traslado_costo) => {
                  this.trasladoCostoActual = resp3;
                  this.destino.idCotizacion = Number.parseInt(localStorage.getItem(`idCotizacion`));
                  this.destino.idCiudad = resp2.idCiudad;
                  this.getCotizacion();
                  if (this.editingCarrito) {
                    this.trasladosAdquiridosService.getMejoras(this.trasladoAdquirido.idTrasladoAdquirido).subscribe(
                      (resMejoras: TrasladoAdquiridoUpgrade[]) => {
                        this.mejoras = resMejoras;
                        //console.log("mejoras", this.mejoras);
                      }
                    );
                  }

                  $('#modalDetalleTraslado').modal({ dismissible: false });
                  $('.modalSendProducts').modal('open');
                }
              );
            }
          );
       
    } else {
        this.trasladoAdquirido = trasladoEditing;
        this.trasladoAdquirido.hora = trasladoEditing.horario;
        this.trasladoAdquirido.fecha = this.trasladoAdquirido.fecha.split(`T`)[0];
      //this.esDirEspecifica();
      
      this.trasladoOtro = Object.assign({}, trasladoEditing);
      // this.trasladoOtro = trasladoEditing;
      (this.trasladoAdquirido.idDesde != undefined) ? this.trasladoOtro.desde = this.trasladoAdquirido.idDesde : this.trasladoOtro.desde = this.trasladoAdquirido.desde;  
      (this.trasladoAdquirido.idHacia != undefined) ? this.trasladoOtro.hacia = this.trasladoAdquirido.idHacia : this.trasladoOtro.hacia = this.trasladoAdquirido.hacia;
      this.trasladoOtro.idDivisa = this.trasladoAdquirido.idDivisa;
      this.trasladoActual.comision = this.trasladoAdquirido.comision; 
      this.trasladoOtroBase = Object.assign({}, this.trasladoOtro);

      this.destino.idCiudad = this.trasladoAdquirido.idCiudad;
      this.destino.idCotizacion = Number.parseInt(localStorage.getItem(`idCotizacion`));
      this.getCotizacion();

      setTimeout(() => {
        this.initDatepicker(this.trasladoOtro.fecha);
      }, 1300);

      $('#modalDetalleTraslado').modal({ dismissible: false });
      $('.modalSendProducts').modal('open');


    }

   
  }

  abrirModalDetalle(){
    $('#modalDetalleTraslado').modal('open');
  }

  async actualizar() {
    let idActividad = this.trasladoAdquirido.idTrasladoAdquirido;
    this.trasladoAdquirido.tarifa = this.totalSinComision;
    if (!this.esDireccionEspecifica) {
      this.trasladoAdquirido.idTraslado = this.trasladoActual.idTraslado;
      this.trasladoAdquirido.idTrasladoCosto = this.trasladoCostoActual.idTrasladoCosto;
      this.trasladoAdquirido.comision = this.trasladoActual.comision;
      this.trasladoAdquirido.comisionAgente = this.comisionAgente;
      this.trasladoAdquirido.notasVersion = $('#detalle').val();
      this.trasladoAdquirido.editado = true;
      this.trasladoAdquirido.valido = true;
      this.trasladoAdquirido.idToSend = 1;
      this.trasladoAdquirido.type = 'Traslado';
      this.trasladoAdquirido.id = this.trasladoAdquirido.idTrasladoAdquirido;
      this.trasladoAdquirido.horario = this.trasladoAdquirido.hora;
      $('#detalle').val("");

      this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
      this.productoPrecioTotal.tipoProducto = 1;
      this.productoPrecioTotal.total = this.total;
      this.trasladoAdquirido.productoPrecioTotal = this.productoPrecioTotal;
    


      if(this.trasladoAdquirido.notasVersion.trim() === ''){
        M.toast({
          html: 'Error: El campo es obligatorio',
          classes: 'rounded red darken-3'
        });
      }else{
        let product: any = [];
        this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
        this.productoPrecioTotal.tipoProducto = 1;
        this.productoPrecioTotal.total = this.total;
        this.trasladoAdquirido.productoPrecioTotal = this.productoPrecioTotal;
        product.push(this.trasladoAdquirido);
        product.push(undefined);
        
        product.idToSend = 1;
        // console.log("product",product);
        this.sendDataToEditService.sendProductToUpdate(product);
        this.trasladoAdquirido = new TrasladoAdquirido();
        this.trasladoOtro = new TrasladoOtro();
        this.editado = false;
       // this.editing = false;
        $('.modalSendProducts').modal('close');
        $('#modalDetalleTraslado').modal('close');
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Producto actualizado correctamente`,
          showConfirmButton: false,
          timer: 2000,
        });
      }
  
    } else {
       this.esDirEspecifica();
        this.trasladoOtro.comision = this.trasladoActual.comision;
        if(this.haciaActual.idHacia == -1) {
          this.trasladoOtro.desde = this.desdeActual.idDesde.toString();
        }
        if(this.desdeActual.idDesde == -1) {
          this.trasladoOtro.hacia = this.haciaActual.idHacia.toString();
        }
        this.trasladoOtro.tarifa = this.totalSinComision;
        this.trasladoOtro.precio = this.totalSinComision;
       // this.trasladoOtro.idDivisa = this.cotizacion.divisa;
        this.trasladoOtro.comisionAgente = this.comisionAgente;
        this.trasladoOtro.editado = true;
        this.trasladoOtro.type = 'Traslado Otro';
        this.trasladoOtro.notasVersion = $('#detalle').val();
        this.trasladoOtro.valido = true;
        this.trasladoOtro.idToSend = 11;
        // this.trasladoOtro.id = 0;
      
        this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
        this.productoPrecioTotal.tipoProducto = 1;
        this.productoPrecioTotal.total = this.total;
        this.trasladoOtro.productoPrecioTotal = this.productoPrecioTotal;

        let product: any = [];
        this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
        this.productoPrecioTotal.tipoProducto = 1;
        this.productoPrecioTotal.total = this.total;
        this.trasladoOtro.productoPrecioTotal = this.productoPrecioTotal;
        product.push(this.trasladoOtro);
        product.push(this.mejorasOtros);

        this.sendDataToEditService.sendProductToUpdate(product);
        $('.modalSendProducts').modal('close');
        $('#modalDetalleTraslado').modal('close');
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Producto agregado correctamente`,
          showConfirmButton: false,
          timer: 1500
        });


      // if (this.haciaActual.idHacia == -1) {
      //   this.trasladoOtro.desde = this.desdeActual.idDesde.toString();
      // }

      // if (this.desdeActual.idDesde == -1) {
      //   this.trasladoOtro.hacia = this.haciaActual.idHacia.toString();
      // }
      // this.trasladosOtrosService.create(this.trasladoOtro).subscribe(
      //   (resTrasladoOtro: any) => {
      //     let canasta = new Canasta();
      //     canasta.idActividad = resTrasladoOtro.insertId;
      //     canasta.tipo = 3; //es un traslado otro
      //     canasta.idCotizacion = this.destino.idCotizacion;
      //     this.canastaService.create(canasta).subscribe(
      //       (res: any) => {
      //         let version = new Version();
      //         version.idActividad = resTrasladoOtro.insertId;
      //         version.tipo = 3; //Es un traslado otro
      //         // version.version = 1; //Es una insecion nueva por lo que se inicaliza en 1
      //         version.idCotizacion = this.cotizacion.idCotizacion;
      //         version.versionCotizacion = this.cotizacion.version;
      //         version.accion = 1;
      //         this.versionesService.getLastVersion(this.cotizacion.idCotizacion).subscribe(
      //           (v: number) => {
      //             version.versionCotizacion = v + 1;
      //             this.usuariosService.list_oneByCorreo(localStorage.getItem(`correo`)).subscribe(
      //               (usuario: Usuario) => {
      //                 //console.log(usuario);
      //                 version.idUsuario = usuario.idUsuario;
      //                 this.versionesService.create(version).subscribe((resp) => {
      //                   this.trasladoAdquirido = new TrasladoAdquirido();
      //                   this.trasladoOtro = new TrasladoOtro();
      //                   Swal.fire({
      //                     position: "center",
      //                     icon: "success",
      //                     title: `Producto actualizado correctamente`,
      //                     showConfirmButton: false,
      //                     timer: 2000,
      //                   });
      //                 });
      //               }
      //             );
      //           });
      //       },
      //       (err) => console.error(err)
      //     );
      //   },
      //   (err) => console.error(err)
      // );
    }
  }

  completarInformacion(value: string, type: string){
    switch(type){
      case 'tipoTraslado':
        this.infoExtra.tipoTraslado = value;
        break;
      case 'codigoR':
        this.infoExtra.codigoReserva = value;
        break;
    }
  }

  onComplete(){
    this.infoExtra.idTrasladoAdquiridoInfo = 0;
    this.infoExtra.idTrasladoAdquirido = this.trasladoAdquirido.idTrasladoAdquirido;
    this.trasladosAdquiridosService.completarInfo(this.infoExtra).subscribe((res: any) => {
      if(this.editado){
        this.trasladoAdquirido.complete = true;
        this.trasladoAdquirido.editado = true;
        this.trasladoAdquirido.case = 1;
        this.sendDataToEditService.sendProductToUpdate(this.trasladoAdquirido);
      }else{
        let obj = {
          id: this.trasladoAdquirido.idTrasladoAdquirido,
          case: 1,
          complete: 1
        }
        this.sendDataToEditService.sendProductToUpdate(obj);
      }
      $('.modalSendProducts').modal('close');
      $('#modalDetalleTraslado').modal('close');
    }, err => { console.log(err) });
  }

  getDiferencia(idVehiculo) {
    let costo, totalSinComision, total;
    costo = this.costos.find(c=> c.idVehiculo == idVehiculo);
      this.getTotal();
                let porcentajeCom = this.trasladoActual.comision / 100;
                let porcentajeAgente = this.comisionAgente / 100;
    
                if (!this.esDireccionEspecifica) {
                    totalSinComision = costo.costo * (1 + this.comisionChofer / 100);
                    totalSinComision = this.totalSinComision / this.divisaActual.valor / this.divisaBase.valor;
                    total = costo.costo * (1 + this.comisionChofer / 100) * (1 + porcentajeCom) * (1 + porcentajeAgente / (1 - porcentajeAgente));
                     total = total / this.divisaActual.valor / this.divisaBase.valor;
                  return total-this.total;
                  
                } else {
                  return 0;
                  //PREGUNTAR QUEn PASA CON DIRECCIONES ESPECIFICAS
            
    }
  }

 
  setMejoras(idVehiculo) {
    this.mejoras = [];

    for (let index = 0; index < this.vehiculos.length; index++) {
      
      if(this.vehiculos[index].idVehiculo != idVehiculo){
        $(`#${this.vehiculos[index].idVehiculo}_m`).prop('checked', false);

      }
    }


    let tau = new TrasladoAdquiridoUpgrade();
    tau.idCotizacion = this.cotizacion.idCotizacion;

    tau.idVehiculo = idVehiculo;
    tau.diferencia= this.getDiferencia(idVehiculo);
    tau.fecha = this.trasladoAdquirido.fecha;
    if(this.adding) tau.versionCotizacion  = this.cotizacion.version + 1;
    let index = this.mejoras.findIndex(m=> m.idVehiculo == tau.idVehiculo);
    (index == -1) ? this.mejoras.push(tau): this.mejoras.splice(index,1);
  }


  deseleccionarMejoras(){
    for (let index = 0; index < this.vehiculos.length; index++) {
      
      if(this.vehiculos[index].idVehiculo != this.vehiculoActual.idVehiculo){
        $(`#${this.vehiculos[index].idVehiculo}_m`).prop('checked', false);

      }
    }
  }


  vehiculosMejoras() {
    return this.vehiculos.filter(v => v.idVehiculo != this.vehiculoActual.idVehiculo);
  }

  agregarMejoraOtro() {
    this.mejorasOtros = [];
    this.mejoraOtro.idCotizacion = this.cotizacion.idCotizacion;
    this.mejoraOtro.fecha=  this.trasladoAdquirido.fecha;
    this.mejoraOtro.diferencia = this.getDieferenciaOtros(this.mejoraOtro);
    if(this.adding) this.mejoraOtro.versionCotizacion  =  this.cotizacion.version + 1;
    this.mejorasOtros.push(this.mejoraOtro);
    this.mejoraOtro = new TrasladoOtroUpgrade();
  }


  getDieferenciaOtros(mejoraOtro: TrasladoOtroUpgrade) {
    let totalMejora=0;
    let respD = this.divisas.find(d => d.idDivisa == mejoraOtro.idDivisa);
    let porcentajeCom = this.trasladoActual.comision / 100;
    let porcentajeAgente = this.comisionAgente / 100;
    totalMejora =
    mejoraOtro.tarifa *
      (1 + porcentajeCom) *
      (1 + porcentajeAgente / (1 - porcentajeAgente));
    totalMejora = totalMejora / respD.valor / this.divisaBase.valor;
    return totalMejora - this.total;
  }

  getNombreVehiculo(idVehiculo) {
   return this.vehiculos.find(v => v.idVehiculo == idVehiculo).nombre;
  }

  getDivisa(idDivisa) {
   return  this.divisas.find(d => d.idDivisa == idDivisa);
  }

  eliminarMejor(index) {
    this.mejorasOtros.splice(index,1);
  }

  mejoraChecked(idVehiculo) {
    return (this.mejoras.find(m => m.idVehiculo == idVehiculo) == undefined) ? false : true;
  }

  verificarMaxPas() {
    if (this.trasladoAdquirido.pasajeros > (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12)) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `El número de pasajeros excede el número de personas totales de la cotización`,
        text: "Se reiniciará al número de personas totales de la cotización",
        showConfirmButton: true,
      });
      this.trasladoAdquirido.pasajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
    }
    this.verificarEdicion();
  }


  verificarEdicion() {
    if (this.editing) {
      // console.log(this.esDireccionEspecifica);
      if (!this.esDireccionEspecifica) {
        if (this.trasladoAdquiridoBase.idTrasladoCosto != this.trasladoCostoActual.idTrasladoCosto ||JSON.stringify(this.trasladoAdquiridoBase) !== JSON.stringify(this.trasladoAdquirido)  ) {
          this.editado = true;
        } else {
          this.editado = false;
        }
      } else {
        this.trasladoOtro.idDivisa = Number.parseInt(this.trasladoOtro.idDivisa);
        this.trasladoOtro.idVehiculo = this.vehiculoActual.idVehiculo;

        // console.log("verificando edicion otro");
        // console.log("traslado otro", this.trasladoOtro);
        // console.log("tralado otro base", this.trasladoOtroBase);

        if (JSON.stringify(this.trasladoOtroBase) != JSON.stringify(this.trasladoOtro)) {
          this.editado = true;
        } else {
          this.editado = false;
        }
      }
    }
  }

  cerrarModalEditar() {
    $('.modalSendProducts').modal('close');
  }

  esMejora(idVehiculo) {
    return (this.mejoras.find(mejora => mejora.idVehiculo == idVehiculo) != undefined) ? true: false;
  }

  actualizarCarrito() {
    
    this.trasladoAdquirido.tarifa = this.totalSinComision;
    if (!this.esDireccionEspecifica) {
      this.trasladoAdquirido.idTraslado = this.trasladoActual.idTraslado;
      this.trasladoAdquirido.idTrasladoCosto = this.trasladoCostoActual.idTrasladoCosto;
      this.trasladoAdquirido.comision = this.trasladoActual.comision;
      this.trasladoAdquirido.comisionAgente = this.comisionAgente;
      this.trasladoAdquirido.total = this.total;
      this.trasladoAdquirido.idCotizacion = this.cotizacion.idCotizacion;

      this.trasladosAdquiridosService.update(this.trasladoAdquirido, this.mejoras).subscribe(
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

    } else {
      
    }
    
  }


  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
  }

  validarInfo() {
    console.log(this.trasladoAdquirido);
    console.log(this.esDireccionEspecifica);
    if (this.trasladoAdquirido.pasajeros == 0 || this.trasladoAdquirido.pasajeros == null) {
      return false;
    }


    if (this.esDireccionEspecifica) {
      if (this.desdeActual.idDesde == -1) {
        if (this.trasladoOtro.desde.length < 1) {
          return false;
        }
      }
     
      if (this.haciaActual.idHacia == -1) {
        if (this.trasladoOtro.hacia.length < 1) {
          return false;
        } 
      }

    }
    return true;
  }

  esOtraCiudad(desde: string, hacia) {
    
    if (desde.includes("Centro") && hacia.haciaOriginal.includes("Centro")) {
      let h = hacia.nombre.split("Centro");
      if (h[0].length == 0) {
        return false;
      }
      return true;
    }
    //return (desde.includes("Centro") && hacia.haciaOriginal.includes("Centro")) ? true : false;
  }

  nombreOtraCiudad(nombre) {
    let h:string[] = nombre.split("Centro");
    
    return h[0].replace("-","");
  }
  
  seleccionarDesdeOtra() {
    if (this.tipo == 2) {
      for (let index = 0; index < this.desde.length; index++) {
        if (this.desde[index].desdeOriginal.includes("Centro")) {
          this.setDesde(index);
          return 0;
        }
    }
    } else { 
      this.setDesde(0);
    }
    
  }

  seleccionarHaciaOtra() {
    if (this.tipo == 2) {
      console.log("Entra a seleccionar hacia otra");
      for (let index = 0; index < this.hacia.length; index++) {
        if (this.hacia[index].haciaOriginal.includes("Centro")) {
          console.log("centro", this.hacia[index], index);
          this.setHacia(index);
          return 0;
        }
    }
    } else { 
      this.setHacia(0);
    }
    
  }

  getDescripcion() {
    console.log("Obteniedno descripcion");
    if (this.desdeActual.desdeOriginal.includes("Centro") && this.haciaActual.haciaOriginal.includes("Centro")) {
      let h =  this.haciaActual.nombre.split("Centro");
      if (h[0].length > 0) {
        this.trasladoAdquirido.descripcion =
        this.descripcionParte1 +
      this.desdeActual.nombre+ 
      this.descripcionParte2 +
      h[0].replace("-","");
      }

    } else {
      console.log("entra 2");
      this.trasladoAdquirido.descripcion =
      this.descripcionParte1 +
      this.desdeActual.nombre+
      this.descripcionParte2 +
      this.haciaActual.nombre;
    }

  }
}
