import { Component, OnInit, DoCheck, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { Agencia } from "src/app/models/Agencia";
import { Cotizacion } from "src/app/models/Cotizacion";
import { Usuario } from "src/app/models/Usuario";
import { AgenciasService } from "src/app/services/agencias.service";
import { CotizacionesService } from "src/app/services/cotizaciones.service";
import { UsuariosService } from "src/app/services/usuarios.service";
import { Agente } from '../../models/Agente';
import { AgentesService } from '../../services/agentes.service';
import { CanastaService } from 'src/app/services/canasta.service';
import { DatePipe } from '@angular/common';
import Sweet from "sweetalert2";
import * as M from 'materialize-css/dist/js/materialize';
import { ImagenesService } from "src/app/services/imagenes.service";
import Swal from "sweetalert2";
import { Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { Timeline } from "src/app/models/Timeline";
import { NotificacionesService } from '../../services/notificaciones.service';
import { Notificacion } from 'src/app/models/Notificacion';
declare var $: any;

@Component({
  selector: "app-diseno-cotizaciones",
  templateUrl: "./diseno-cotizaciones.component.html",
  styleUrls: ["./diseno-cotizaciones.component.css"],
})
export class DisenoCotizacionesComponent implements OnInit, DoCheck, OnDestroy {

 
  public comisiones: any[] = [
    { "idAgente": 0, "nombre": "Traslados", "tipoActividad": 1, "comision": 0 },
    { "idAgente": 0, "nombre": "Disposiciones", "tipoActividad": 2, "comision": 0 },
    { "idAgente": 0, "nombre": "Tours privados a pie", "tipoActividad": 3, "comision": 0 },
    { "idAgente": 0, "nombre": "Tours privados en transporte", "tipoActividad": 4, "comision": 0 },
    { "idAgente": 0, "nombre": "Tours de grupo", "tipoActividad": 5, "comision": 0 },
    { "idAgente": 0, "nombre": "Actividades", "tipoActividad": 6, "comision": 0 },
    { "idAgente": 0, "nombre": "Hoteles", "tipoActividad": 7, "comision": 0 },
    { "idAgente": 0, "nombre": "Vuelos", "tipoActividad": 8, "comision": 0 },
    { "idAgente": 0, "nombre": "Trenes", "tipoActividad": 9, "comision": 0 },
    { "idAgente": 0, "nombre": "Extras", "tipoActividad": 10, "comision": 0 },
  ];
  private suscripciones: Subscription[] = [];
  public agencias: Agencia[] = [];
  public agencia: Agencia = new Agencia();
  public usuario: Usuario = new Usuario();
  public userSelected: Usuario = new Usuario();
  public usuarios: Usuario[] = [];
  public usuariosToTransfer: Usuario[] = [];
  public cotizacion: any = new Cotizacion();
  public cotizaciones: Cotizacion[] = [];
  public cotizacionesFilter: Cotizacion[] = [];
  public agentes: Agente[] = [];
  public timeline: Timeline = new Timeline();
  public idAgencia: number = 0;
  public search: string = '';
  public showDefault: boolean = true;
  public showVerTodo: boolean = false;
  public showCancelar: boolean = false;
  public showNuevaVersion: boolean = false;
  public showEnviar: boolean = false;
  public showHistorial: boolean = false;
  public showCaducada: boolean = false;
  public versiones: any[] = [];
  public notas: string[] = [];
  public nota: string = '';
  public asunto: string = '';
  public traslado: any = {};
  public disposicion: any = {};
  public hotel: any = {};
  public vuelo: any = {};
  public tren: any = {};
  public tourPie: any = {};
  public tourTransporte: any = {};
  public tourGrupo: any = {};
  public actividad: any = {};
  public extra: any = {};
  public mayor: number = 0;
  public prioridad: number = 1;
  public caducidad: number = 1;
  public idsToDelete7: any = [];
  public imagenesParaMostrar: any[] = [];
  public imagenesParaGuardar: any[] = [];
  public PDFsParaGuardar: any[] = [];
  public countImagenes: number = 1;
  public countPDFs: number = 1;
  public archivos: any[] = [];
  public filePath: string = environment.API_URI_IMAGES;
  public cotizacionesRecahzadas: any[] = [];
  public agente: any = new Agente();
  public cotizacionForm: FormGroup;
  public agenteForm: FormGroup;
  public validando: boolean = false;
  public validandoAgenteForm: boolean = false;
  public notificacion = new Notificacion();
  public arrayValidarComisiones: any[] = new Array(this.comisiones.length);

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private agenciasService: AgenciasService,
    private usuariosService: UsuariosService,
    private cotizacionesService: CotizacionesService,
    private agentesService: AgentesService,
    private canastaService: CanastaService,
    private datePipe: DatePipe,
    private imagenesService: ImagenesService,
    private notificacionesService: NotificacionesService
  ) {}

  ngOnInit(): void {
    this.arrayValidarComisiones.fill(false);
    this.getUsuario();
    this.getUsuarios();
    setTimeout(() => {
      $(".modal").modal({dismissible: false});
      $("#modalCotizacionNueva").modal({dismissible: false});
    }, 0);
    $('select').formSelect();
    this.getAgencias();
    this.validarFormulario();
  }

  validarFormulario(){
    this.cotizacionForm = this.fb.group({
      idAgente: [0, [Validators.required, Validators.min(1)]],
      titulo: ['', [Validators.required]],
      viajeroNombre: ['', [Validators.required]],
      viajeroApellido: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFinal: ['', [Validators.required]],
      numM: [0, [Validators.required]],
      num18: [0, [Validators.required]],
      num12: [0, [Validators.required]],
      divisa: [1, [Validators.required]],
      comisionAgente: [2, [Validators.required]],
    });
  }
  
  ngDoCheck(): void {
    M.updateTextFields();
  }

  ngOnDestroy(): void{
    this.suscripciones.map((s: any) => s.unsubscribe());
  }

  getAgencias() {
    this.agenciasService.list().subscribe((resp: Agencia[]) => {
      this.agencias = resp;
      this.idAgencia = this.agencias[0].idAgencia;
      this.agente.idAgencia = this.agencias[0].idAgencia;
      this.getAgentes(1);
    });
  }

  getAgentes(tipo, idAgencia: any = 0) {
    this.idAgencia = idAgencia === 0 ? this.idAgencia : parseInt(idAgencia);
    this.agentesService.listByIdAgencia(this.idAgencia).subscribe((agentes: Agente[]) => {
      this.agentes = agentes;
      if (tipo == 1) {
        if (this.agentes.length > 0) {
          this.cotizacion.idAgente = this.agentes[0].idAgente;
          console.log( this.cotizacion.idAgente);
        }
      }
    });
  }

  getUsuario() {
    let s = this.usuariosService.getUser().subscribe(usuario => {
      if(Object.keys(usuario).length === 0) return false;
      this.usuario = usuario;
      this.filterCotizaciones(10);
    });
    this.suscripciones.push(s);
  }

  guardar() {
    this.validando = true;
    if(this.cotizacionForm.invalid) return;
    this.cotizacion = Object.assign(this.cotizacion, this.cotizacionForm.value);
    this.cotizacion.version = 1;

    this.cotizacionesService.create(this.cotizacion).subscribe((resp: any) => {
  
      this.cotizacion.idCotizacion = resp.insertId;
      // this.cotizacion.ref = `${resp.insertId}-${this.cotizacion.viajeroNombre}`;
      this.cotizacion.ref = this.formarCotizacionRef(
        resp.insertId,
        this.cotizacion.viajeroNombre + this.cotizacion.viajeroApellido,
        this.idAgencia,
        this.cotizacion.version
      );
      this.cotizacionesService.update(this.cotizacion).subscribe((resp: any) => {

        //GENERAR REGISTRO TIMELINE
        this.timeline = new Timeline();
        this.timeline.idCotizacion = this.cotizacion.idCotizacion;
        this.timeline.notas = 'Cotización creada';
        this.timeline.tipo = 1;
        this.cotizacionesService.addTimeline(this.timeline).subscribe(res => {});

        //GUARDAR IMAGENES ADJUNTADAS
        this.imagenesParaGuardar.forEach(img => {
          let name: string = `${new Date().getTime()}-${this.cotizacion.idCotizacion}.${img.ext}`;
          this.imagenesService.uploadImagenesCotizaciones(img.data, name, this.cotizacion.idCotizacion, img.notas).subscribe(res => {});
        });

        //GUARDAR PDFS ADJUNTOS
        this.PDFsParaGuardar.forEach(pdf => {
          let name: string = `${new Date().getTime()}-${this.cotizacion.idCotizacion}.${pdf.ext}`;
          this.imagenesService.uploadPDFsCotizaciones(pdf.data, name, this.cotizacion.idCotizacion, pdf.notas).subscribe(res => {});
        });
        localStorage.setItem(`idCotizacion`, this.cotizacion.idCotizacion.toString()); 
        localStorage.setItem(`fechaInicio`, this.cotizacion.fechaInicio); 
        localStorage.setItem(`fechaFinal`, this.cotizacion.fechaFinal); 
        //this.router.navigate(["cotizacionDestinos", this.cotizacion.idCotizacion]);
        this.router.navigate(['home/cotizacionDestinos']);
      });
    });
  }

  formarCotizacionRef(idCotizacion: number, viajeroNombre: string, idAgencia: number, version: number){
    return `${idCotizacion}-${this.cadenaInicialesAgencia(idAgencia)}-${this.cadenaNombreViajeroFecha(viajeroNombre)}-${version}`
  }

  cadenaNombreViajeroFecha(viajeroNombre: string){
    let cadena: string[] = viajeroNombre.split('');
    let letras = cadena.slice(0, 6).join('').toUpperCase() + this.cadenaFecha();
    return letras;
  }

  cadenaFecha(){
    let mes: number = new Date().getMonth() + 1;
    let fecha: string = `${mes < 10 ? '0' + mes : mes}${(new Date().getFullYear() + '').slice(-2)}`;
    return fecha;
  }

  cadenaInicialesAgencia(idAgencia: number){
    let agencia: any = this.agencias.find(agencia => agencia.idAgencia == idAgencia);
    let size: number = agencia !== undefined ? agencia.nombre.split(' ').length : 0;
    let iniciales: string = '';
    switch(size){
      case 0:
        iniciales = 'NA';
        break;
      case 1:
        let cadena: string[] = agencia.nombre.split('');
        iniciales = `${cadena[0].toUpperCase()}${cadena[1].toUpperCase()}`;
        break;
      default:
        let cadena1: string = agencia.nombre.split(' ')[0];
        let cadena2: string = agencia.nombre.split(' ')[1];
        iniciales = `${cadena1.split('')[0].toUpperCase()}${cadena2.split('')[0].toUpperCase()}`;
        break;
    }
    return iniciales;
  }

  getCotizaciones(filter: number){
    this.cotizaciones = [];
    this.cotizacionesFilter = [];
    this.cotizacionesService.listByUserWithFilter(this.usuario.idUsuario, filter).subscribe((res: any) => {
      this.cotizaciones = res;
      this.cotizacionesFilter = res;
      this.cotizacionesRecahzadas = this.cotizaciones.filter((cotizacion: any) => cotizacion.estado == 2);
      this.cotizacionesRecahzadas.forEach(async(cotizacion: any, index: number) => {
        cotizacion.disponibleHasta = new Date(cotizacion.createdAt).setDate(new Date(cotizacion.createdAt).getDate() + 31);
        let start = new Date(cotizacion.createdAt).setDate(new Date(cotizacion.createdAt).getDate() + 30);
        let now = +new Date();
        if(now >= start && now < cotizacion.disponibleHasta){
          cotizacion.caducada = true;
        }else{
          cotizacion.caducada = false;
        }
        if(new Date(now) >= new Date(cotizacion.disponibleHasta)){
          await this.delete(cotizacion.idCotizacion, index, 'eliminacionAutomatica');
        }
      });
      setTimeout(() => {
        $('.accionesCotizaciones').dropdown({coverTrigger: false});
      }, 0);
    }, err => console.log(err));
  }

  actualizarTiempoCotizacion(cotizacion: any){
    this.cotizacionesService.updateCreatedAt(cotizacion.idCotizacion).subscribe((res) => {
      this.cotizaciones.map((cot: any) => {
        if(cot.idCotizacion === cotizacion.idCotizacion){
          cot.caducada = false;
        }
      });
      $("#modalVerCotizacion").modal('close');
      Sweet.fire({
        position: 'center',
        icon: 'success',
        title: 'Su cotizacion se guardó por 30 días más',
        showConfirmButton: false,
        timer: 2500
      });
    });
  }

  redirect(type: string, idCotizacion: number, versionCotizacion?: number){
    switch(type){
      case 'productos':
        this.router.navigate(["home/versionado", idCotizacion, versionCotizacion]);
        break;
      case 'procesado':
        this.router.navigate(["home/procesado", idCotizacion, versionCotizacion]);
        break;
    }
  }

  async delete(id: number, index: number, message: string){
    await this.getProductsByCotizacion(id);
    this.idsToDelete7.length === 0 ? this.idsToDelete7 = 0 : this.idsToDelete7;
    if(message === 'eliminacionAutomatica'){
      this.canastaService.cancelarCotizacion(id, this.idsToDelete7).subscribe(res => {
        this.cotizaciones.splice(index, 1);
        this.idsToDelete7 = [];
      }, err => { console.log(err) });
    }else{
      Sweet.fire({
        title: message,
        showCancelButton: true,
        cancelButtonText: 'No, regresar',
        confirmButtonText: `Si, continuar`,
        confirmButtonColor: '#b71c1c'
      }).then((result) => {
        if(result.isConfirmed){
          this.canastaService.cancelarCotizacion(id, this.idsToDelete7).subscribe(res => {
            this.cotizaciones.splice(index, 1);
            this.idsToDelete7 = [];
            Sweet.fire({
              position: 'center',
              icon: 'success',
              title: 'Cotización eliminada correctamente',
              showConfirmButton: false,
              timer: 1500
            });
            $('#modalVerCotizacion').modal('close');
          }, err => { console.log(err) });
        }
      });
    }
  }

  cancelarCotizacion(id: number, estado: number){
    if(estado === 0){
      let index = this.cotizaciones.findIndex((cotizacion) => cotizacion.idCotizacion = id);
      let message = 'Al cancelar una cotización, será eliminada automáticamente, ¿Desea continuar?';
      this.delete(id, index, message);
    }
  }

  filterCotizaciones(value: number){
    this.getCotizaciones(value);
  }

  buscarCotizacion(search: any){
    if(!search){
      this.cotizaciones = this.cotizacionesFilter;
    }else{
      this.cotizacionesService.search(search).subscribe((res: any[]) => {
        this.cotizaciones = res;
        setTimeout(() => {
          $('.accionesCotizaciones').dropdown({coverTrigger: false});
        }, 0);
      }, err => console.log(err));
    }
    setTimeout(() => {
      $('.accionesCotizaciones').dropdown({coverTrigger: false});
    }, 0);
  }

  changeCotizacion(cotizacion: any){
    this.cotizacion = cotizacion;
    if(!cotizacion.caducada){
      this.setContent(true, false, false, false);
    }else{
      this.setContent(false, false, false, true);
    }
  }

  async changeContent(idContent: number, cotizacion?: any){
    switch(idContent){
      case 0:
        this.setContent(true, false, false, false);
        break;
      case 1:
        this.setContent(false, false, false, false);
        break;
      case 2:
        await this.getVersiones(cotizacion);
        localStorage.setItem('idCotizacion', cotizacion.idCotizacion);
        localStorage.setItem(`fechaInicio`, this.cotizacion.fechaInicio); 
        localStorage.setItem(`fechaFinal`, this.cotizacion.fechaFinal); 
        this.router.navigate(['home/nuevaVersion', cotizacion.idCotizacion, this.mayor]);
        break;
      case 3:
        localStorage.setItem('idCotizacion', this.cotizacion.idCotizacion.toString()); 
        localStorage.setItem(`fechaInicio`, this.cotizacion.fechaInicio); 
        localStorage.setItem(`fechaFinal`, this.cotizacion.fechaFinal); 
        this.router.navigate(['home/cotizacionProductos']);
        break;
      case 4:
        this.cotizacionesService.getVersionesByCotizacion(this.cotizacion.idCotizacion).subscribe((res: any) => {
          this.versiones = res;
        },  err => { console.log(err) });
        this.setContent(false, false, true, false);
        break;
    }
  }

  getVersiones(cotizacion: any){
    let promise = new Promise<void>((resolve, reject) => {
      let s = this.cotizacionesService.getVersionesByCotizacion(cotizacion.idCotizacion).subscribe((res: any) => {
        this.versiones = res;
        this.versiones.map((version) => {
          if(version.versionCotizacion > this.mayor){
            this.mayor = version.versionCotizacion;
          }
        });
        resolve();
      }, err => {
        console.log(err);
        reject();
      });
      this.suscripciones.push(s);
    });
    return promise;
  }

  setContent(def: boolean, nuevaV: boolean, historial: boolean, caducada: boolean){
    this.showDefault = def;
    this.showNuevaVersion = nuevaV;
    this.showHistorial = historial;
    this.showCaducada = caducada;
  }

  insertNota(type: string) {
    switch(type){
      case 'nota':
        if(this.asunto.trim() === '' || this.nota.trim() === ''){
          M.toast({
            html: 'Error: Todos los campos son obligatorios',
            classes: 'rounded red darken-3'
          });
        }else{
          let obj = {
            idCotizacion: this.cotizacion.idCotizacion,
            idUsuario: this.usuario.idUsuario,
            asunto: this.asunto,
            nota: this.nota,
            prioridad: this.prioridad,
            caducidad: this.caducidad
          }
          let message = 'Su nota fue agregada correctamente';
          this.helperNota(obj, message, 10);
        }
        break;
      case 'motivo':
        if(this.nota.trim() === ''){
          M.toast({
            html: 'Error: Todos los campos son obligatorios',
            classes: 'rounded red darken-3'
          });
        }else{
          let obj = {
            idCotizacion: this.cotizacion.idCotizacion,
            idUsuario: this.usuario.idUsuario,
            asunto: 'Rechazo',
            nota: this.nota,
            prioridad: 3,
            caducidad: 30
          }
          let data: any = { estatus: 2 };
          this.canastaService.updateStatus(this.cotizacion.idCotizacion, data).subscribe((res: any) => {
            this.helperNota(obj, 'La cotización fua agregada a rechazadas correctamente', 2);
            $('#modalRechazo').modal('close');
            this.cotizacion.estado = 2;
          }, err => { console.log(err) });
        }
        break;
    }
  }

  helperNota(obj: Object, message: string, category: number){
    this.cotizacionesService.createNota(obj).subscribe((res: any) => {
      this.nota = '';
      this.asunto = '';
      this.notas.unshift(res[0]); //Error: se muestra en todas las cotizaciones
      Sweet.fire({
        position: 'center',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 2000
      });
      $('#modalVerCotizacion').modal('close');
    }, err => { console.log(err) });
  }

  reactivarCotizacion(){
    let obj: any = {
      idCotizacion: this.cotizacion.idCotizacion,
      idUsuario: this.usuario.idUsuario,
      asunto: 'Reactivación',
      prioridad: 3,
      nota: 'Cotización reactivada por solicitud.'
    }
    let data: any = { estatus: 100 };
    this.canastaService.updateStatus(this.cotizacion.idCotizacion, data).subscribe((res: any) => {
      this.helperNota(obj, 'La cotización fua reactivada correctamente', 1);
      this.cotizacion.estado = 100;
    }, err => { console.log(err) });
  }

  confirmarCotizacion(){
    Sweet.fire({
      title: `Esta por generar la orden de compra para la cotización ${this.cotizacion.ref}(Versión: ${this.cotizacion.version}), ¿Desea continuar?`,
      showCancelButton: true,
      cancelButtonText: 'No, regresar',
      confirmButtonText: 'Si, generar orden',
      backdrop: false,
      confirmButtonColor: '#1b5e20'
    }).then( async(result) => {
      if(result.isConfirmed){
        localStorage.setItem('idCotizacion', this.cotizacion.idCotizacion);
        localStorage.setItem(`fechaInicio`, this.cotizacion.fechaInicio); 
        localStorage.setItem(`fechaFinal`, this.cotizacion.fechaFinal); 
        // localStorage.setItem('idDestino', this.cotizacion.idDestino);
        await this.getVersiones(this.cotizacion);
        this.router.navigate(['home/ordenCompra', this.cotizacion.idCotizacion, this.mayor]);
      }
    });
  }

  cambiarEstadoCotizacion(cotizacion: any, estado: number){
    let data: any = { estatus: estado };
    this.canastaService.updateStatus(cotizacion.idCotizacion, data).subscribe((res: any) => {
      this.cotizacion.estado = estado;
      Sweet.fire({
        position: 'center',
        icon: 'success',
        title: 'Cotización garantizada',
        showConfirmButton: false,
        timer: 2000
      });
    }, err => { console.log(err) });
  }

  getNotas(cotizacion: any){
    this.notas = [];
    this.cotizacion = cotizacion;
    let s = this.cotizacionesService.getNotasByCotizacion(cotizacion.idCotizacion).subscribe((res: any) => {
      this.notas = res;
    }, err => console.log(err));
    this.suscripciones.push(s);
  }

  getProductsByCotizacion(idCotizacion: number){
    let promise = new Promise<void>((resolve, reject) => {
      let s = this.canastaService.listOneCotizacionByUser(this.usuario.idUsuario, idCotizacion).subscribe((res: any) => {
        res.canasta.map((product: any) => {
          switch(product.tipo){
            case 1:
              this.traslado = product.traslado;
              break;
            case 2:
              this.disposicion = product.disposicion;
              break;
            case 4:
              this.hotel = product.hotel;
              break;
            case 5:
              this.vuelo = product.vuelo;
              break;
            case 6:
              this.tren = product.tren;
              break;
            case 7:
              if(product.tourPie){
                this.tourPie = product.tourPie;
                this.idsToDelete7.push(product.tourPie.idProductoAdquirido);
              }else if(product.tourTransporte){
                this.tourTransporte = product.tourTransporte;
                this.idsToDelete7.push(product.tourTransporte.idProductoAdquirido);
              }else if(product.tourGrupo){
                this.tourGrupo = product.tourGrupo;
                this.idsToDelete7.push(product.tourGrupo.idProductoAdquirido);
              }else if(product.actividad){
                this.actividad = product.actividad;
                this.idsToDelete7.push(product.actividad.idProductoAdquirido);
              }
              break;
            case 8:
              this.extra = product.extra;
              break;
          }
        });
        resolve();
      }, err => console.log(err));
    this.suscripciones.push(s);
    });
    return promise;
  }

  getUsuariosToTransfer(cotizacion: any){
    this.cotizacion = cotizacion;
    let s = this.usuariosService.getUsuariosToTransfer(cotizacion.idUsuario).subscribe((usuarios: Usuario[]) => {
      this.usuariosToTransfer = usuarios;
      this.userSelected = this.usuariosToTransfer[0];
    }, err => { console.log(err) });
    this.suscripciones.push(s);
  }

  getUsuarios(){
    this.usuariosService.list().subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
    }, err => { console.log(err) });
  }

  cambiarResponsable(event){
    this.cotizacion.idUsuario = +event.target.value;
  }

  changeUserToTransfer(usuario: any){
    this.userSelected = usuario;
  }

  transferirCotizacion(form: any){
    if(form.invalid) return false;
    Sweet.fire({
      title: `¿Ésta seguro de transferir la cotización ${this.cotizacion.ref} a el usuario ${this.userSelected.nombre}?`,
      showCancelButton: true,
      cancelButtonText: 'No, regresar',
      confirmButtonText: 'Si, transferir',
      confirmButtonColor: '#1b5e20'
    }).then((result) => {
      if(result.isConfirmed){
        this.cotizacionesService.changeOwner(this.userSelected.idUsuario, this.cotizacion.idCotizacion).subscribe((res: any) => {
          Sweet.fire({
            position: 'center',
            icon: 'success',
            title: 'Cotización transferida con éxito',
            showConfirmButton: false,
            timer: 2000
          });
          setTimeout(() => {
            $('.modal').modal('close');
            let index = this.cotizaciones.findIndex((cotizacion) => cotizacion.idCotizacion === this.cotizacion.idCotizacion);
            this.cotizaciones.splice(index, 1);
          }, 2000);
        }, err => console.log(err));
      }
    });
  }

  async completarInfo(cotizacion: any){
    await this.getVersiones(cotizacion);
    localStorage.setItem('idCotizacion', cotizacion.idCotizacion);
    localStorage.setItem(`fechaInicio`, cotizacion.fechaInicio); 
    localStorage.setItem(`fechaFinal`, cotizacion.fechaFinal); 
    // localStorage.setItem('idDestino', cotizacion.idDestino);
    this.router.navigate(['home/completarCotizacion', cotizacion.idCotizacion, this.mayor]);
  }
  

  setFechaAl(fecha) {
    let f = new Date(fecha);
    let f1 = new Date(fecha);
    let fechaAl = this.datePipe.transform(
      new Date(f.setDate(f.getDate() + 2)),
      "yyyy-MM-dd"
    );
    let fechaDel = this.datePipe.transform(
      new Date(f1.setDate(f1.getDate() + 1)),
      "yyyy-MM-dd"
    );
    this.cotizacionForm.patchValue({
      fechaInicio: fechaDel,
      fechaFinal: fechaAl
    });
  }

  abrirModalCotizacionNueva(){
    this.validarFormulario();
    this.cotizacion = new Cotizacion();
    this.cotizacion.idUsuario = this.usuario.idUsuario;
    this.setFechaAl(this.datePipe.transform(new Date(), "yyyy-MM-dd"));
    $("#modalCotizacionNueva").modal({ dismissible: false });
    $("#modalCotizacionNueva").modal("open");
    this.imagenesParaGuardar = [];
    this.imagenesParaMostrar = [];
    this.PDFsParaGuardar = [];
  }

  getFileBlob(file) {
    var reader = new FileReader();
    let a: any =  new Promise(function (resolve, reject) {
      reader.onload = (function (thefile) {
        return function (e) {
          resolve(e.target.result);
        };
      })(file);
      reader.readAsDataURL(file);
    });
    a.then(async(data) => {
      // console.log('val', $('input[type=file]').val().split('\\').pop());
      let d = data.split(',');
      d = d[0].split(';');
      d = d[0].split('/');
      d = d[1];
      switch(d){
        case 'jpeg':
        case 'jpg':
        case 'png':
          let containerImage: any = `<img src="${data}" height="150" width="220">`;
          let objImg = {
            id: `IMG-${this.countImagenes}`,
            type: 'img',
            img: containerImage,
            name: `${new Date().getTime()}.${d}`
          }
          this.imagenesParaMostrar.push(objImg);

          var { value: notaIMG } = await Swal.fire({
            input: 'textarea',
            inputLabel: 'Ingresa una nota que describa la imagen que acabas de agregar',
            backdrop: false,
          });
          notaIMG = !notaIMG ? 'N/A' : notaIMG;
          let dataImg = {
            id: `IMG-${this.countImagenes}`,
            ext: d,
            data: data,
            notas: notaIMG
          }
          this.imagenesParaGuardar.push(dataImg);
          this.countImagenes ++;
          break;
        case 'pdf':
          let containerPDF: any = `<img src="assets/img/pdf.png" height="150" width="220">`;
          let objPDF = {
            id: `PDF-${this.countPDFs}`,
            type: 'pdf',
            img: containerPDF,
            name: `${new Date().getTime()}.${d}`
          }
          this.imagenesParaMostrar.push(objPDF);

          var { value: notaPDF } = await Swal.fire({
            input: 'textarea',
            inputLabel: 'Ingresa una nota que describa el archivo que acabas de agregar',
            backdrop: false,
          });
          notaPDF = !notaPDF ? 'N/A' : notaPDF;
          let dataPDF = {
            id: `PDF-${this.countPDFs}`,
            ext: d,
            data: data,
            notas: notaPDF
          }
          this.PDFsParaGuardar.push(dataPDF);
          this.countPDFs ++;
          break;
        default:
          Swal.fire({
            icon: 'error',
            title: 'Archivo no valido',
            text: 'Extensiones permitidas: JPEG, JPG, PNG, PDF',
          });
          break;
      }
    }).catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Su archivo no pudo ser procesado, por favor intentelo nuevamente.',
      });
    });
    return a;
  }

  async cargarArchivo(files: FileList, index?: number){
    let fileToUpload = files[0];
    await this.getFileBlob(fileToUpload);
  }

  eliminarArchivo(info: any, index: number): void {
    switch(info.type){
      case 'img':
        let iImg: number = this.imagenesParaGuardar.findIndex((img) => img.id == info.id);
        this.imagenesParaGuardar.splice(iImg, 1);
        break;
      case 'pdf':
        let iPDF: number = this.PDFsParaGuardar.findIndex((pdf) => pdf.id == info.id);
        this.PDFsParaGuardar.splice(iPDF, 1);
        break;
    }
    this.imagenesParaMostrar.splice(index, 1);
  }

  verArchivo(file: any){
    window.open(`${this.filePath}/archivosCotizaciones/${file.nombre}`);
  }

  verEstadoCotizacion(cotizacion: any){
    this.cotizacion = cotizacion;
    this.router.navigate(['/home/estado', this.cotizacion.idCotizacion]);
  }

  verArchivos(cotizacion: any){
    this.cotizacion = cotizacion;
    this.cotizacionesService.getArchivosCotizacion(this.cotizacion.idCotizacion).subscribe((archivos: any) => {
      archivos.map((a: any) => {
        let ext: string = a.nombre.split('.');
        switch(ext[1]){
          case 'pdf':
            a.fullPath = 'assets/img/pdf.png';
            break;
          default:
            a.fullPath = `${this.filePath}/archivosCotizaciones/${a.nombre}`;
            break;
        }
      });
      this.archivos = archivos;
      $('#modalArchivos').modal('open');
    });
  }

  itinerario(cotizacion: any){
    this.router.navigate(['/home/itinerario', cotizacion.idCotizacion, cotizacion.version]);
  }

  validarComision(comision: any, index: number){
    console.log('comision', comision, index);
    if(comision === null || comision < 0){
      this.comisiones[index].invalid = true;
      this.arrayValidarComisiones[index] = true;
    }else{
      delete this.comisiones[index].invalid;
      this.arrayValidarComisiones[index] = false;
    }
  }

  modalAgregarAgente(){
    this.validandoAgenteForm = false
    $('#modalAgregarAgente').modal({dismissible: false});
    $('#modalAgregarAgente').modal('open');
    this.agente = new Agente();
    this.agente.idAgencia = this.agencias[0].idAgencia;
    this.comisiones = this.comisiones.map(data => {
      return { "idAgente": 0, "nombre": data.nombre, "tipoActividad": data.tipoActividad, "comision": 0 };
    });
  }


  guardarAgenteNuevo(form: any) {
    this.validandoAgenteForm = true;
    if(form.invalid || this.arrayValidarComisiones.includes(true)) return false;
    this.agentesService.create(this.agente, this.comisiones).subscribe((resAgente: any) => {
      let nombreAgencia = this.agencias.find(a => a.idAgencia == this.agente.idAgencia).nombre;
      this.notificacion = new Notificacion();
      this.notificacion.receptor = -1; //Todos los del area
      this.notificacion.asunto = "Agente nuevo agregado";
      this.notificacion.tipo = 1;
      this.notificacion.prioridad = 3;
      this.notificacion.estatus = 0;
      this.notificacion.caducidad = "3";
      this.notificacion.data.tarea = `Se ha agregado el agente ${this.agente.nombre} ${this.agente.apellidos} en la agencia ${nombreAgencia}, revisa su información porfavor`;
      this.notificacion.emisor = this.usuario.idUsuario;
      this.notificacionesService.create(this.notificacion, 2).subscribe(res => {
        this.agente = new Agente();
        this.cotizacion.idAgente = resAgente.insertId;
        this.getAgentes(2);
        $("#modalAgregarAgente").modal("close");
        form.reset();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Guardado correctamente",
          showConfirmButton: false,
          timer: 1000,
        });
      }, err => console.log(err));
    }, err => console.log(err));
  }

}

