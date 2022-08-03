import { Component, OnInit, DoCheck, Input, ChangeDetectorRef, OnDestroy, Output, EventEmitter } from "@angular/core";
import { DisposicionesService } from "../../services/disposiciones.service";
import { Destino } from "../../models/Destino";
import { DestinosService } from "../../services/destinos.service";
import { Disposicion } from "../../models/Disposicion";
import { DisposicionResult } from "src/app/models/DisposicionResult";
import { Vehiculo } from "../../models/Vehiculo";
import { DisposicionAdquirida } from "../../models/DisposicionAdquirida";
import { DisposicionCosto } from "../../models/DisposicionCosto";
import { DisposicionesCostosService } from "../../services/disposiciones-costos.service";
import { PorcentajeChofer } from "src/app/models/porcentajeChofer.model";
import { Divisa } from "src/app/models/Divisa";
import { DisposicionesAdquiridasService } from "../../services/disposiciones-adquiridas.service";
import { Canasta } from "src/app/models/Canasta";
import { CanastaService } from "../../services/canasta.service";
import Swal from "sweetalert2";
import { DivisaBase } from "../../models/DivisaBase";
import { CotizacionesService } from "../../services/cotizaciones.service";
import { DivisasService } from "../../services/divisas.service";
import { Cotizacion } from "../../models/Cotizacion";
import { DatePipe } from "@angular/common";
import { ComisionesAgentesService } from 'src/app/services/comisiones-agentes.service';
import { Version } from 'src/app/models/Version';
import { VersionesService } from 'src/app/services/versiones.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from 'src/app/models/Usuario';
import * as M from 'materialize-css/dist/js/materialize';
import { SendDataToEditService } from 'src/app/services/sendDataToEdit.service';
import { ProductosPreciosTotalesService } from "src/app/services/productosPreciosTotales.service";
import { ProductosPreciosTotales } from './../../models/ProductosPreciosTotales';
import { DisposicionAdquiridaUpgrade } from '../../models/DisposicionAdquiridaUpgrade';
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

declare var $: any;


@Component({
  selector: "app-disposiciones",
  templateUrl: "./disposiciones.component.html",
  styleUrls: ["./disposiciones.component.css"],
})
export class DisposicionesComponent implements OnInit, OnDestroy {
  @Input() public editing: boolean = false;
  @Input() public adding: boolean = false;
  @Input() public idDisposicionAdquirida: number = 0;
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
  public destino: any = new Destino();
  public disposiciones: DisposicionResult[] = [];
  public disposicionActual: DisposicionResult = new DisposicionResult();
  public vehiculos: Vehiculo[] = [];
  public vehiculoActual: Vehiculo = new Vehiculo();
  public ii: number = 0;
  public disposicionAdquirida: any = new DisposicionAdquirida();
  public disposicionAdquiridaBase: any = new DisposicionAdquirida();
  public disposicionCostoActual: DisposicionCosto = new DisposicionCosto();
  public comisionChofer: number = 0;
  public divisaActual: Divisa = new Divisa();
  public divisaBase: DivisaBase = new DivisaBase();
  public cotizacion: Cotizacion = new Cotizacion();
  public usuario: any = new Usuario();
  public productoPrecioTotal: ProductosPreciosTotales = new ProductosPreciosTotales();
  public total: number = 0;
  public totalSinComision: number = 0;
  public disposicionCanasta: any = {};
  public trasladoCanasta: any = {};
  public comisionAgente: number = 0;
  public comision5rivesNueva: number = 0;
  public comisionAgenteNueva: number = 0;
  public mostrarComision5rives: boolean = false;
  public mostrarComisionAgente: boolean = false;


  public costos: any = [];
  public mejoras: DisposicionAdquiridaUpgrade[] = [];

  public editado: boolean = false;
  public validando: boolean = false;
  public disposicionForm: FormGroup;

  constructor(
    private disposicionesService: DisposicionesService,
    private destinosService: DestinosService,
    private disposicionCostoService: DisposicionesCostosService,
    private disposicionesAdquiridasService: DisposicionesAdquiridasService,
    private canastaService: CanastaService,
    private cotizacionesService: CotizacionesService,
    private divisasService: DivisasService,
    private datePipe: DatePipe,
    private comisionesAgentesService: ComisionesAgentesService,
    private versionesService: VersionesService,
    private usuariosService: UsuariosService,
    private sendDataToEditService: SendDataToEditService,
    private productosPreciosTotalesService: ProductosPreciosTotalesService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,

  ) { }

  ngOnInit(): void {
    if (this.router.url.includes("disposiciones")) {
      $(".tabs").tabs("select", "disposiciones");
    }
    this.validarFormulario();
    this.getUsuario();

    setTimeout(() => {
      this.initDatepicker();
    }, 0);
    if (!this.editingCarrito) {
      $(document).ready(function () {
        $(".modal").modal({ dismissible: false });
      });
    }


    if (this.editing) {
      $('#modalDetalleDisposicion').modal({ dismissible: false });
      this.sendDataToEditService.getProduct('disposicion').subscribe(
        (res: any) => {
          // this.idDisposicionAdquirida = res;

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
          this.getCotizacion();
          this.getListaDisposiciones();
        }
      );
    }
    if (this.editing) {
      // $('.modalSendProducts').modal('open');
    } else {
      //$('.modalAddProducts').modal('open');
    }
  }

  validarFormulario() {
    this.disposicionForm = this.fb.group({
      pickup: ['', [Validators.required]],
      numeroPersonas: [0, [Validators.required, Validators.min(1)]],
    });
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

  ngDoCheck(): void {
    M.updateTextFields();
  }

  initDatepicker(fecha?: any) {
    let fecha1 = localStorage.getItem('fechaInicio');
    let fecha2 = localStorage.getItem('fechaFinal');
    let minDate: any = new Date(fecha1 += 'T00:00:00');
    let maxDate: any = new Date(fecha2 += 'T00:00:00');
    let date = minDate;
    if (fecha) {
      date = new Date(fecha + 'T00:00:00');
    }
    $('#fechaDisposicion').datepicker({
      minDate: minDate,
      maxDate: maxDate,
      setDefaultDate: date,
      defaultDate: date,
      format: "yyyy-mm-dd",
      i18n: this.i18nOptions
    });
  }


  getCostos() {
    this.disposicionCostoService.listByIdDisposicion(this.disposicionActual.idDisposicion).subscribe(
      res => {
        this.costos = res;
        this.getListVehiculos();
      }
    );

  }


  getCotizacion() {
    this.cotizacionesService
      .list_one(this.destino.idCotizacion)
      .subscribe((resp: Cotizacion) => {
        this.cotizacion = resp;
        if (!this.editing) {
          this.disposicionAdquirida.pasajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
        }
        this.divisasService
          .divisaBase_getOne(this.cotizacion.divisa)
          .subscribe((resp: DivisaBase) => {
            this.divisaBase = resp;
            if (this.editing) {
              this.comisionAgente = this.disposicionAdquirida.comisionAgente;
            } else {
              if (this.cotizacion.comisionAgente == 2) { //Se incluye la comsión el agente
                this.comisionesAgentesService.listByIdAgenteTipoActividad(this.cotizacion.idAgente, 2).subscribe( //2 se refiere a que es la comisión sobre las disposiciones
                  (comisionAgente: number) => {
                    this.comisionAgente = comisionAgente;
                  }
                );
              }
            }
            this.getListaDisposiciones();
          });
      });
  }

  getListaDisposiciones() {
    this.disposiciones = [];
    this.disposicionesService
      .listByIdCiudad(this.destino.idCiudad)
      .subscribe((resp: DisposicionResult[]) => {
        if (resp.length > 0) {
          this.disposiciones = resp;
          if (!this.editing) {
            this.disposicionActual = this.disposiciones[0];
            setTimeout(() => {
              this.initDatepicker();
            }, 2000);
          }

          if (this.editing) {
            $('.modalSendProducts').modal('open');
          } else {
            $('.modalAddProducts').modal('open');
          }
          this.getCostos();
        }
      });
  }

  getListVehiculos() {
    this.disposicionesService
      .listVehiculosByIdDisposicion(this.disposicionActual.idDisposicion)
      .subscribe((resp: Vehiculo[]) => {
        this.vehiculos = resp;
        // if (this.editing) {
        this.vehiculoActual = this.vehiculos.find(v => v.idVehiculo == this.disposicionCostoActual.idVehiculo);

        $('#vehiculosDisp').val("3").change();

        // } else {
        //   this.vehiculoActual = this.vehiculos[0];
        // }
        this.getDisposicionCosto();
      });
  }

  setActual(ii) {
    this.mejoras = [];
    this.deseleccionarMejoras();
    this.disposicionActual = this.disposiciones[ii];
    this.getListVehiculos();

  }

  getDisposicionCosto() {
    if (this.vehiculoActual != undefined) {
      this.disposicionCostoService
        .listByIdDisposicionIdVehiculo(
          this.disposicionActual.idDisposicion,
          this.vehiculoActual.idVehiculo
        )
        .subscribe(
          (res: DisposicionCosto) => {
            // if (!this.editing) {
            this.disposicionCostoActual = res[0];
            // }
            this.divisasService
              .getOne(this.disposicionActual.idDivisa)
              .subscribe((resp: Divisa) => {
                this.divisaActual = resp;
                this.actualizarPrecio();
                this.verificarEdicion();
              });
          },
          (err) => console.error(err)
        );
    }

  }

  actualizarPrecio(date?: any) {
    if (date) {
      this.disposicionAdquirida.fecha = date;
    }
    this.verificarEdicion();
    this.comisionChofer = 0;
    this.disposicionesService
      .incrementoByDisposicionFecha(
        this.disposicionActual.idDisposicion,
        this.datePipe.transform(this.disposicionAdquirida.fecha, "dd-MM")
      )
      .subscribe(
        (res3) => {
          let porcentajes = res3 as PorcentajeChofer[];
          if (porcentajes.length == 0) {
            this.disposicionesService
              .incrementoByDisposicionFechaVariable(
                this.disposicionActual.idDisposicion,
                this.datePipe.transform(
                  this.disposicionAdquirida.fecha,
                  "dd-MM"
                )
              )
              .subscribe(
                (res4) => {
                  let porcentajes = res4 as PorcentajeChofer[];
                  if (porcentajes.length == 0) {
                    this.disposicionesService
                      .incrementoByDisposicionHora(
                        this.disposicionActual.idDisposicion,
                        this.disposicionAdquirida.hora
                      )
                      .subscribe(
                        (res5) => {
                          let porcentajes = res5 as PorcentajeChofer[];
                          if (porcentajes.length != 0) {
                            this.comisionChofer = porcentajes[0].porcentaje;
                          }
                          this.getTotal();
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

  setVehiculoActual(value) {
    this.mejoras = [];
    this.deseleccionarMejoras();
    this.vehiculoActual = this.vehiculos[value];
    this.getDisposicionCosto();
  }


  getTotal() {

    let incrementoHoraExtra = this.disposicionAdquirida.horasExtras * this.disposicionCostoActual.horaExtra;
    let porcentajeCom = this.disposicionActual.comision / 100;
    let porcentajeAgente = this.comisionAgente / 100;
    this.totalSinComision = ((this.disposicionCostoActual.costo + incrementoHoraExtra) / this.divisaActual.valor) / this.divisaBase.valor;
    this.total =
      (this.disposicionCostoActual.costo + incrementoHoraExtra) *
      (1 + porcentajeCom) *
      (1 + porcentajeAgente / (1 - porcentajeAgente));
    this.total = (this.total / this.divisaActual.valor) / this.divisaBase.valor;

  }

  async agregar() {
    this.validando = true;
    if (this.disposicionForm.invalid) return;
    if (this.adding) {
      const { value: opcional } = await Swal.fire({
        input: 'checkbox',
        inputValue: 0,
        backdrop: false,
        inputPlaceholder:
          'Es una disposición de chófer opcional',
        confirmButtonText:
          'Continuar <i class="fa fa-arrow-right"></i>',
      })

      this.disposicionAdquirida.idDisposicion = this.disposicionActual.idDisposicion;
      this.disposicionAdquirida.idDisposicionCosto = this.disposicionCostoActual.idDisposicionCosto;
      this.disposicionAdquirida.tarifa = this.totalSinComision;
      this.disposicionAdquirida.comision = this.disposicionActual.comision;
      this.disposicionAdquirida.comisionAgente = this.comisionAgente;
      this.disposicionAdquirida.opcional = opcional;

      this.disposicionAdquirida.nuevo = true;
      this.disposicionAdquirida.id = this.disposicionAdquirida.idDisposicionAdquirida;
      this.disposicionAdquirida.type = 'Disposición';
      this.disposicionAdquirida.precio = this.totalSinComision;
      this.disposicionAdquirida.valido = true;
      this.disposicionAdquirida.idToSend = 2;
      this.disposicionAdquirida.idCiudad = this.destino.idCiudad;

      this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
      this.productoPrecioTotal.tipoProducto = 2;
      this.productoPrecioTotal.total = this.total;
      this.disposicionAdquirida.productoPrecioTotal = this.productoPrecioTotal;

      let product: any = [];
      product.push(this.disposicionAdquirida);
      product.push(this.mejoras);
      product.idToSend = 2;


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
          'Es una disposición de chófer opcional',
        confirmButtonText:
          'Continuar <i class="fa fa-arrow-right"></i>',
      })

      this.disposicionAdquirida.idDisposicion = this.disposicionActual.idDisposicion;
      this.disposicionAdquirida.idDisposicionCosto = this.disposicionCostoActual.idDisposicionCosto;
      this.disposicionAdquirida.tarifa = this.totalSinComision;
      this.disposicionAdquirida.comision = this.disposicionActual.comision;
      this.disposicionAdquirida.comisionAgente = this.comisionAgente;
      this.disposicionAdquirida.opcional = opcional;
      this.disposicionesAdquiridasService.create(this.disposicionAdquirida, this.mejoras).subscribe((res1: any) => {
        let canasta = new Canasta();
        this.disposicionAdquirida.idDisposicionAdquirida = res1.insertId;
        canasta.idActividad = res1.insertId;
        canasta.tipo = 2; //es una disposicion
        canasta.idCotizacion = this.destino.idCotizacion;
        this.productoPrecioTotal.idProducto = res1.insertId;
        this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
        this.productoPrecioTotal.tipoProducto = 2;
        this.productoPrecioTotal.total = this.total;
        this.productosPreciosTotalesService.create(this.productoPrecioTotal).subscribe((resTotal: any) => {
          this.productoPrecioTotal = new ProductosPreciosTotales();
        });
        this.canastaService.create(canasta).subscribe(
          (res: any) => {

            let version = new Version();
            version.idActividad = res1.insertId;
            version.tipo = 2;//Es una disposicion
            // version.version = 1;//Es una insecion nueva por lo que se inicializa en 1
            version.idCotizacion = this.cotizacion.idCotizacion;
            version.versionCotizacion = this.cotizacion.version;
            version.accion = 1;
            // this.usuariosService.list_oneByCorreo(localStorage.getItem(`correo`)).subscribe((usuario: Usuario) => {
            //console.log(usuario);
            version.idUsuario = this.usuario.idUsuario;
            this.versionesService.create(version).subscribe(resp => {
              //this.disposicionAdquirida = new DisposicionAdquirida();
              this.mejoras = [];
              this.deseleccionarMejoras();
              this.redirect.emit(1);
              Swal.fire({
                position: "center",
                icon: "success",
                title: `Producto agregado correctamente`,
                showConfirmButton: false,
                timer: 1500,
              });
            });
          },
          (err) => console.error(err)
        );

        this.disposicionAdquirida.tipoNombre = 'disposicion';
        this.disposicionAdquirida.tipo = 2;
        this.disposicionAdquirida.idCiudad = this.destino.idCiudad;
        this.disposicionAdquirida.ciudad = this.destino.ciudad;
        this.disposicionAdquirida.horario = this.disposicionAdquirida.hora;
        this.disposicionAdquirida.lugar = this.disposicionAdquirida.pisckUp;
        this.disposicionAdquirida.titulo = this.disposicionActual.nombre;

        // this.disposicionCanasta.idProducto = 'disposicion';
        // this.disposicionCanasta.tipo = 2;
        // this.disposicionCanasta.opcional = opcional;
        // this.disposicionCanasta.idDisposicionAdquirida = res1.insertId;
        // this.disposicionCanasta.idCiudad = this.destino.idCiudad;
        // this.disposicionCanasta.ciudad = this.destino.ciudad;
        // this.disposicionCanasta.fecha = this.disposicionAdquirida.fecha;
        // this.disposicionCanasta.titulo = this.disposicionActual.nombre;
        // this.disposicionCanasta.horario = this.disposicionAdquirida.hora;
        // this.disposicionCanasta.comision = this.disposicionAdquirida.comision;
        // this.disposicionCanasta.comisionAgente = this.disposicionAdquirida.comisionAgente;
        // this.disposicionCanasta.tarifa = this.totalSinComision;

        this.canastaService.addProduct(this.disposicionAdquirida);

        delete this.disposicionAdquirida.tipoNombre;
        delete this.disposicionAdquirida.tipo;
        delete this.disposicionAdquirida.idCiudad;


      },
        (err) => console.error(err)
      );
    }
  }

  cambiarComision5rives() {
    this.disposicionActual.comision = this.comision5rivesNueva;
    this.comision5rivesNueva = this.disposicionActual.comision;
    this.actualizarPrecio();
    this.mostrarComision5rives = false;
    this.disposicionAdquirida.comision = this.comision5rivesNueva;
    this.verificarEdicion();
  }


  cambiarComisionAgente() {
    this.comisionAgente = this.comisionAgenteNueva;
    this.comisionAgenteNueva = this.comisionAgente;
    this.actualizarPrecio();
    this.mostrarComisionAgente = false;
    this.disposicionAdquirida.comisionAgente = this.comisionAgente;
    this.verificarEdicion();
  }


  cancelarComisionAgente() {
    this.comisionAgenteNueva = 0;
    $("#modalComisionAgenteDisp").modal('close');
  }

  actualizacion(da) {
    let fecha = da.fecha.split(`T`)[0];
    this.disposicionAdquirida = Object.assign({}, da);
    this.disposicionAdquirida.hora = da.horario;
    this.disposicionAdquirida.pisckUp = da.lugar;
    this.disposicionAdquiridaBase = Object.assign({}, da);
    this.disposicionAdquirida.fecha = fecha;
    this.disposicionAdquiridaBase.fecha = fecha;
    this.disposicionAdquiridaBase.hora = da.horario;
    this.disposicionAdquiridaBase.pisckUp = da.lugar;

    setTimeout(() => {
      this.initDatepicker(this.disposicionAdquirida.fecha);
    }, 1300);

    this.disposicionesService.listOne(this.disposicionAdquirida.idDisposicion).subscribe(
      (d: DisposicionResult) => {
        this.disposicionActual = d;
        this.disposicionCostoService.listOne(this.disposicionAdquirida.idDisposicionCosto).subscribe(
          (dc: DisposicionCosto) => {
            this.disposicionCostoActual = dc;
            this.disposicionActual.comision = this.disposicionAdquirida.comision;
            this.destino.idCiudad = this.disposicionActual.idCiudad;
            this.destino.idCotizacion = Number.parseInt(localStorage.getItem(`idCotizacion`));
            this.getCotizacion();

            this.disposicionesAdquiridasService.getMejoras(this.disposicionAdquirida.idDisposicionAdquirida).subscribe(
              (resMejoras: DisposicionAdquiridaUpgrade[]) => {
                this.mejoras = resMejoras;
                console.log("mejoras disposiciones", this.mejoras)
              }
            );
          }
        );
        if (!this.editing) {
          this.initDatepicker();
        } else {
          this.initDatepicker(this.disposicionAdquirida.fecha);
        }
      }
    );

  }

  abrirModalDetalle() {
    this.esActualizacion();
    $('#modalDetalleDisposicion').modal('open');
  }

  actualizar() {
    this.disposicionAdquirida.notasVersion = $('#detalle').val();
    this.disposicionAdquirida.editado = true;
    if (this.disposicionAdquirida.notasVersion.trim() === '') {
      M.toast({
        html: 'Error: El campo es obligatorio',
        classes: 'rounded red darken-3'
      });
    } else {

      // this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
      // this.productoPrecioTotal.tipoProducto = 2;
      // this.productoPrecioTotal.total = this.total;
      // this.disposicionAdquirida.productoPrecioTotal = this.productoPrecioTotal;

      this.disposicionAdquirida.idDisposicionCosto = this.disposicionCostoActual.idDisposicionCosto;
      this.disposicionAdquirida.tarifa = this.totalSinComision;
      this.disposicionAdquirida.comision = this.disposicionActual.comision;
      this.disposicionAdquirida.comisionAgente = this.comisionAgente;

      let product: any = [];

      this.productoPrecioTotal.idCotizacion = this.cotizacion.idCotizacion;
      this.productoPrecioTotal.tipoProducto = 2;
      this.productoPrecioTotal.total = this.total;
      this.disposicionAdquirida.productoPrecioTotal = this.productoPrecioTotal;

      product.push(this.disposicionAdquirida);
      product.push(undefined);
      product.idToSend = 2;

      this.sendDataToEditService.sendProductToUpdate(product);
      //this.editado = false;
      //this.editing = false;
      this.disposicionAdquirida = new DisposicionAdquirida();
      $('#modalSendProducts').modal('close');
      $('#modalDetalleDisposicion').modal('close');

      Swal.fire({
        position: "center",
        icon: "success",
        title: `Producto actualizado correctamente`,
        showConfirmButton: false,
        timer: 2000,
      });
    }



  }

  esActualizacion() {
    this.disposicionAdquirida.idDisposicionAdquirida = 0;
    this.disposicionAdquirida.idDisposicion = this.disposicionActual.idDisposicion;
    this.disposicionAdquirida.idDisposicionCosto = this.disposicionCostoActual.idDisposicionCosto;
    this.disposicionAdquirida.tarifa = this.totalSinComision;
    this.disposicionAdquirida.idToSend = 2;
  }


  setMejoras(idVehiculo) {
    this.mejoras = [];
    for (let index = 0; index < this.vehiculos.length; index++) {

      if (this.vehiculos[index].idVehiculo != idVehiculo) {
        $(`#${this.vehiculos[index].idVehiculo}_md`).prop('checked', false);

      }
    }
    let dau = new DisposicionAdquiridaUpgrade();
    dau.idCotizacion = this.cotizacion.idCotizacion;
    dau.idVehiculo = idVehiculo;
    dau.diferencia = this.getDiferencia(idVehiculo);
    dau.fecha = this.disposicionAdquirida.fecha;
    if (this.adding) {
      dau.versionCotizacion = this.cotizacion.version + 1;
    }
    //console.log(dau);
    let index = this.mejoras.findIndex(m => m.idVehiculo == dau.idVehiculo);
    (index == -1) ? this.mejoras.push(dau) : this.mejoras.splice(index, 1);
    //console.log(this.mejoras);
  }


  getDiferencia(idVehiculo) {
    let costo, totalSinComision, total;
    costo = this.costos.find(c => c.idVehiculo == idVehiculo);
    this.getTotal();

    let incrementoHoraExtra = this.disposicionAdquirida.horasExtras * costo.horaExtra;
    let porcentajeCom = this.disposicionActual.comision / 100;
    let porcentajeAgente = this.comisionAgente / 100;
    total =
      (costo.costo + incrementoHoraExtra) *
      (1 + porcentajeCom) *
      (1 + porcentajeAgente / (1 - porcentajeAgente));
    total = (total / this.divisaActual.valor) / this.divisaBase.valor;

    return total - this.total;
  }


  deseleccionarMejoras() {
    for (let index = 0; index < this.vehiculos.length; index++) {

      if (this.vehiculos[index].idVehiculo != this.vehiculoActual.idVehiculo) {
        $(`#${this.vehiculos[index].idVehiculo}_md`).prop('checked', false);

      }
    }
  }

  verificarEdicion() {
    if (this.editing) {
      if (this.disposicionAdquiridaBase.idDisposicionCosto != this.disposicionCostoActual.idDisposicionCosto || JSON.stringify(this.disposicionAdquiridaBase) !== JSON.stringify(this.disposicionAdquirida)) {
        this.editado = true;
      } else {
        this.editado = false;
      }
    }
  }

  cerrarModalEditar() {
    $('#modalSendProducts').modal('close');
  }

  verificarMaxPas() {
    if (this.disposicionAdquirida.pasajeros > (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12)) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `El número de pasajeros excede el número de personas totales de la cotización`,
        text: "Se reiniciará al número de personas totales de la cotización",
        showConfirmButton: true,
      });
      this.disposicionAdquirida.pasajeros = (this.cotizacion.numM + this.cotizacion.num18 + this.cotizacion.num12);
    }
    this.verificarEdicion();
  }


  esMejora(idVehiculo) {
    return (this.mejoras.find(mejora => mejora.idVehiculo == idVehiculo) != undefined) ? true : false;
  }

  actualizarCarrito() {

    this.disposicionAdquirida.idDisposicionCosto = this.disposicionCostoActual.idDisposicionCosto;
    this.disposicionAdquirida.tarifa = this.totalSinComision;
    this.disposicionAdquirida.comision = this.disposicionActual.comision;
    this.disposicionAdquirida.comisionAgente = this.comisionAgente;
    this.disposicionAdquirida.total = this.total;
    this.disposicionAdquirida.idCotizacion = this.cotizacion.idCotizacion;
    console.log(this.disposicionAdquirida);
    this.disposicionesAdquiridasService.update(this.disposicionAdquirida, this.mejoras).subscribe(
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


}
