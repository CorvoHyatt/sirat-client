import { Component, OnInit } from '@angular/core';
import readXlsxFile from 'read-excel-file';
import { Disposicion } from '../../../models/Disposicion';
import { CiudadesService } from '../../../services/ciudades.service';
import { DisposicionesService } from '../../../services/disposiciones.service';
import { Ciudad } from '../../../models/Ciudad';
import Swal from "sweetalert2";
import { DivisasService } from '../../../services/divisas.service';
import { LugaresService } from '../../../services/lugares.service';
import { DisposicionCosto } from '../../../models/DisposicionCosto';
import { VehiculosService } from '../../../services/vehiculos.service';
import { stringify } from 'querystring';
import { Lugar } from 'src/app/models/Lugar';
import { threadId } from 'worker_threads';
import { Incremento } from 'src/app/models/incremento';
import { incrementoHora } from '../../../models/IncrementoHora';
import { IncrementoFecha } from '../../../models/incrementoFecha';
import { Producto } from '../../../models/Producto';
import { ProductoInfo } from '../../../models/ProductoInfo';
import { DatePipe } from '@angular/common';
import { ProductoHorario } from '../../../models/productoHorarios';
import { ProductoTarifa } from 'src/app/models/ProductoTarifa';
import { ProductoEntrada } from '../../../models/ProductoEntrada';
import { ProductoOpcion } from '../../../models/ProductoOpcion';
import { ProductoDiaCerrado } from '../../../models/ProductoDiaCerrado';
import { SubcategoriasService } from '../../../services/subcategorias.service';
import { Subcategoria } from '../../../models/Subcategoria';
import { ProductosService } from '../../../services/productos.service';
import { Vehiculo } from 'src/app/models/Vehiculo';
import { ProductoTransporte } from '../../../models/productoTransporte';
import * as moment from 'moment';
import { Traslado } from '../../../models/Traslado';

declare var $: any;

@Component({
  selector: 'app-procesar-disposiciones',
  templateUrl: './procesar-disposiciones.component.html',
  styleUrls: ['./procesar-disposiciones.component.css']
})
export class ProcesarDisposicionesComponent implements OnInit {

  public procesar: boolean = false;
  public disposicionesDataFull: any;
  public disposiciones: any = [];
  public disposicionesFinales = [];
  public cancelled = false;
  public toursPrivadosAPieDataFull: any;
  public textPreloader = "";
  public subcategorias: Subcategoria[] = [];
  public toursPrivadosAPie: any = [];
  public toursPrivadosEnTransporteDataFull: any;
  public vehiculos: Vehiculo[] = [];
  public toursPrivadosEnTransporte: any = [];
  public toursEnGrupoDataFull: any = [];
  public toursEnGrupo: any = [];
  public actividadesDataFull: any = [];
  public actividades: any = [];
  public trasladosDataFull: any = [];


  constructor(
    private ciudadesService: CiudadesService,
    private disposicionesService: DisposicionesService,
    private divisasService: DivisasService,
    private lugaresService: LugaresService,
    private vehiculosService: VehiculosService,
    private subcategoriasService: SubcategoriasService,
    private productosService: ProductosService,
    private datePipe: DatePipe,


  ) { }

  ngOnInit(): void {
    this.getSubcategorias();
    this.getVehiculos();
    $('.modal').modal({ dismissible: false });
   // $('#modalLoading').modal({ dismissible: false });

  }


  getSubcategorias() {
    this.subcategoriasService.list().subscribe(
      (res: Subcategoria[]) => {
        this.subcategorias = res;
    }
    );
  }

  getVehiculos() {
    this.vehiculosService.list().subscribe(
      (res: Vehiculo[]) => {
        this.vehiculos = res;
      }
    );
  }

  uploadListener($event: any) {
    $("#modalLoading").modal("open");
    this.textPreloader = "Comenzando procesado...";
    this.procesar = true;
    this.cancelled = false;
    let files = $event.srcElement.files;
    
    readXlsxFile(files[0], { sheet: 1 }).then((rows1) => {
      this.textPreloader = "Obteniendo datos de traslados...";
      this.trasladosDataFull = rows1;
      readXlsxFile(files[0], { sheet: 2 }).then((rows2) => {
        this.disposicionesDataFull = rows2;
        this.textPreloader = "Obteniendo datos de traslados...";
        readXlsxFile(files[0], { sheet: 3 }).then((rows3) => {
          this.toursPrivadosAPieDataFull = rows3;
          this.textPreloader = "Obteniendo datos de disposiciones de chófer...";
          readXlsxFile(files[0], { sheet: 4 }).then((rows4) => {
            this.textPreloader = "Obteniendo datos de tours privados en transporte...";
            this.toursPrivadosEnTransporteDataFull = rows4;        
            readXlsxFile(files[0], { sheet: 5 }).then((rows5) => {
              this.textPreloader = "Obteniendo datos de tours privados en transporte...";
              this.toursEnGrupoDataFull = rows5;
           
              readXlsxFile(files[0], { sheet: 6 }).then((rows6) => {
                this.textPreloader = "Obteniendo datos de actividades...";
                this.actividadesDataFull = rows6;
               // this.processDisposiciones();
                //this.processActividades();
                this.processTraslados();
              
              });
            });
          });
        });
      });
    });
  }


  processDisposiciones() {
    this.textPreloader="Procesando disposiciones de chófer";
    let lenghtValid = this.getValid();
    this.disposicionesDataFull.forEach((currentValue, index) => {
      //console.log(currentValue, index);
      if (index > 1) {
        this.getInfoCostos(0,currentValue, index, lenghtValid);
        this.getInfoCostos(1, currentValue, index, lenghtValid);
        this.getInfoCostos(2, currentValue, index, lenghtValid);
        this.getInfoCostos(3, currentValue, index, lenghtValid);
        this.getInfoCostos(4, currentValue, index, lenghtValid);
        this.getInfoCostos(5, currentValue, index, lenghtValid);
      }
      
    });

  }


  getInfoCostos(tipo, currentRow, rowNumber, lenghtValid) {
    let disposicion = new Disposicion();
    let disposicionCosto= new DisposicionCosto();

    if (tipo == 0) {
      if (this.cleanString(currentRow[6]) != "n/a") {
           
        this.vehiculosService.listByName(currentRow[3]).subscribe(
          (vehiculo: any) => {
            if (vehiculo != -1) {
    
              disposicionCosto.idVehiculo = vehiculo.idVehiculo;
              disposicionCosto.horasMinimo = 4;
              disposicionCosto.costo = currentRow[6];
              disposicionCosto.horaExtra = currentRow[7];
         

        this.ciudadesService.listByNameCityNameCountry(currentRow[2], currentRow[1]).subscribe(
          (ciudad: any) => {
            if (ciudad!= -1) {
              disposicion.idCiudad = ciudad;
              this.divisasService.listByName(currentRow[5]).subscribe(
                (divisa: any) => {
                  if (divisa != -1) {
                    disposicion.idDivisa = divisa.idDivisa;
                    
                    this.lugaresService.listByName("Centro de la ciudad (Hotel - Terminal de Autobús - Estación de tren…)").subscribe(
                      (lugar: any) => {
                        if (lugar != -1) {
                          disposicion.idLugar = lugar.idLugar;
                          disposicion.cancelaciones = currentRow[21];
                          disposicion.comision = currentRow[22];
                          disposicion.dentro = true;
                          this.disposiciones.push([disposicion, disposicionCosto, this.processIncrementosDisposiciones(currentRow)]);
                          this.orderDisposiciones(lenghtValid);
                         // console.log(this.disposiciones);
                        } else {
                          Swal.fire({
                            title: "¡Alerta!",
                            text: "El lugar: Centro de la ciudad (Hotel - Terminal de Autobús - Estación de tren…) no existe en la base de datos, ¿realmente quieres guardar el lugar de la disposición con este nombre? ",
                            showDenyButton: true,
                            confirmButtonText: `Continuar procesado`,
                            denyButtonText: `Cancelar `,
                          }).then((result) => {
                            if (result.isConfirmed) {
                              let lugar = new Lugar();
                              lugar.nombre = "Centro de la ciudad (Hotel - Terminal de Autobús - Estación de tren…)" ;
                              this.lugaresService.create(lugar).subscribe(
                                (respLugar: any) => {
                                  disposicion.idLugar = respLugar.insertId;
                                  disposicion.cancelaciones = currentRow[21];
                                  disposicion.comision = currentRow[22];
                                  disposicion.dentro = true;
                                  this.disposiciones.push([disposicion, disposicionCosto, this.processIncrementosDisposiciones(currentRow)]);
                                  this.orderDisposiciones(lenghtValid);
                                 // console.log(this.disposiciones);
                                }
                              );
                              } else if (result.isDenied) {
                              this.reset();
                            }
                          })
             
                        }
                      }
                    );
    
    
                  } else {
                    this.reset();
                    this.alertError(`La divisa ${currentRow[5]} no existe (Fila: ${rowNumber+2} Columna: 5 )`, "disposiciones de chófer" );
                  }
    
                }
              );
            } else {
              this.reset();
              this.alertError(`La ciudad ${currentRow[2]} del pais ${currentRow[1]} no existe (Fila: ${rowNumber+2} Columna: 3 )`, "disposiciones de chófer" );
              
            }
         }
        );
    
    
            } else {
              this.reset();
              this.alertError(`El vehiculo ${currentRow[3]} no existe. Agregalo desde la sección de "Vehiculos" (Fila: ${rowNumber+2} Columna: 4 )`, "disposiciones de chófer" );
            }
          }
        );         
       } 
    } else {
      let position = 0;
      switch (tipo) {
        case 1:
          position = 8;
          break;
        case 2:
          position = 9;
          break;
        case 3:
          position = 10;
          break;
        case 4:
          position = 11;
          break;
        case 5:
            position = 12;
            break;
      }

      if (this.cleanString(currentRow[position]) != "n/a") {
        this.vehiculosService.listByName(currentRow[3]).subscribe(
          (vehiculo: any) => {
            if (vehiculo != -1) {
     
              disposicionCosto.idVehiculo = vehiculo.idVehiculo;
              let infoDisposicion = currentRow[position].split("\n");
              infoDisposicion = infoDisposicion.filter(v => v.length > 0);
              disposicionCosto.horasMinimo = parseInt(infoDisposicion[1].split(" ")[0]);
              disposicionCosto.costo = infoDisposicion[2];
              disposicionCosto.horaExtra = currentRow[7];


              if (infoDisposicion.length != 3) { 
                this.reset();
                this.alertError(`La disposición no cuenta con la información requerida. Lugar de la disposición, horas mínimas, tarifa  (Fila: ${rowNumber+2} Columna: ${position+1} )`, "disposiciones de chófer" );
              } else {
              this.ciudadesService.listByNameCityNameCountry(currentRow[2], currentRow[1]).subscribe(
                (ciudad: any) => {
                  if (ciudad!= -1) {
                    disposicion.idCiudad = ciudad;
                    this.divisasService.listByName(currentRow[5]).subscribe(
                      (divisa: any) => {
                        if (divisa != -1) {
                          disposicion.idDivisa = divisa.idDivisa;
                          
                          this.lugaresService.listByName(infoDisposicion[0]).subscribe(
                            (lugar: any) => {
                              if (lugar != -1) {
                                disposicion.idLugar = lugar.idLugar;
                                disposicion.cancelaciones = currentRow[21];
                                disposicion.comision = currentRow[22];
                                disposicion.dentro = true;
                                this.disposiciones.push([disposicion, disposicionCosto, this.processIncrementosDisposiciones(currentRow)]);
                                this.orderDisposiciones(lenghtValid);
                                // console.log(this.disposiciones);
                              } else {
                                Swal.fire({
                                  title: "¡Alerta!",
                                  text: `El lugar: ${infoDisposicion[0]} no existe en la base de datos, ¿realmente quieres guardar el lugar de la disposición con este nombre?`,
                                  showDenyButton: true,
                                  confirmButtonText: `Continuar procesado`,
                                  denyButtonText: `Cancelar `,
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    let lugar = new Lugar();
                                    lugar.nombre = infoDisposicion[0] ;
                                    this.lugaresService.create(lugar).subscribe(
                                      (respLugar: any) => {
                                        disposicion.idLugar = respLugar.insertId;
                                        disposicion.cancelaciones = currentRow[21];
                                        disposicion.comision = currentRow[22];
                                        disposicion.dentro = true;
                                        this.disposiciones.push([disposicion, disposicionCosto, this.processIncrementosDisposiciones(currentRow)]);
                                        this.orderDisposiciones(lenghtValid);
                                        
                                         //console.log(this.disposiciones);
                                      }
                                    );
                                    } else if (result.isDenied) {
                                      this.reset();
                                  }
                                })
                   
                              }
                            }
                          );
          
          
                        } else {
                          this.reset();
                          this.alertError(`La divisa ${currentRow[5]} no existe (Fila: ${rowNumber+2} Columna: 6 )`, "disposiciones de chófer" );
                        }
          
                      }
                    );
                  } else {
                    this.reset();
                    this.alertError(`La ciudad ${currentRow[2]} del pais ${currentRow[1]} no existe (Fila: ${rowNumber+2} Columna: 4 )`, "disposiciones de chófer" );
                    
                  }
               }
              );
              }
              
            } else {
              this.reset();
              this.alertError(`El vehiculo ${currentRow[3]} no existe. Agregalo desde la sección de "Vehiculos" (Fila: ${rowNumber+2} Columna: 3 )`, "disposiciones de chófer" );
            }
          }
        );

        
      }
    }
  }


  processIncrementosDisposiciones(curruntRecord) {
  
    let incrementos = [];
    if (this.cleanString(curruntRecord[13]) != "n/a") {
      let incremento = new Incremento();
      incremento.tipoActividad = 3;
      incremento.tipo = this.getTipoIncremento(curruntRecord[14]); //Es del tipo reloj, calendario o periodo
      incremento.nombre = curruntRecord[13];
      incremento.porcentaje = curruntRecord[16];
      incrementos.push(this.processDetalleIncrementoDisposiciones(incremento, curruntRecord, 1));  
    }

    if (this.cleanString(curruntRecord[17]) != "n/a") {
      let incremento = new Incremento();
      incremento.tipoActividad = 3;
      incremento.tipo = this.getTipoIncremento(curruntRecord[18]); //Es del tipo reloj, calendario o periodo
      incremento.nombre = curruntRecord[17];
      incremento.porcentaje = curruntRecord[20];
     incrementos.push(this.processDetalleIncrementoDisposiciones(incremento, curruntRecord, 2));  
    }

    return incrementos;
  }



  processDetalleIncrementoDisposiciones(incremento: Incremento, curruntRecord, numeroIncremento) {
    let indexDetalle;
    (numeroIncremento == 1)? indexDetalle = 15: indexDetalle = 19;

    if (incremento.tipo == 1) {//Se llena horasIncrementos
      let horasIncremento = [];
      let listHoras = curruntRecord[indexDetalle].split("\n");
      for (let index = 0; index < listHoras.length; index++) {
        let h1 = listHoras[index].split("-")[0];
        let h2 = listHoras[index].split("-")[1];

        let horaIncremento = new incrementoHora();
        if (h2 < h1) {
          horaIncremento = new incrementoHora();
          horaIncremento.horaInicial = h1;
          horaIncremento.horaFinal = "23:59"
          horaIncremento.idIncremento = incremento.idIncremento;
          horasIncremento.push(horaIncremento);


          horaIncremento = new incrementoHora();
          horaIncremento.horaInicial = "00:00";
          horaIncremento.horaFinal = h2;
          horaIncremento.idIncremento = incremento.idIncremento;
          horasIncremento.push(horaIncremento);


        } else {
          horaIncremento = new incrementoHora();
          horaIncremento.horaInicial = h1;
          horaIncremento.horaFinal = h2;
          horaIncremento.idIncremento = incremento.idIncremento;
          horasIncremento.push(horaIncremento);

        }
      }

      return [incremento, horasIncremento];

    } else {//Se llena fechasIncrementos

      let fechasIncremento = [];
      let listFechas = curruntRecord[indexDetalle].split("\n");

      for (let index = 0; index < listFechas.length; index++) {
        let fechaIncremento = new IncrementoFecha();

        if (listFechas[index].split("-" || "–").length > 1) {
          fechaIncremento.fechaInicial = this.getFechaConFormato(listFechas[index].split("-" || "–")[0]);
          fechaIncremento.fechaFinal = this.getFechaConFormato(listFechas[index].split("-" || "–")[1]);
        } else {

          fechaIncremento.fechaInicial = this.getFechaConFormato(listFechas[index]);
          fechaIncremento.fechaFinal = this.getFechaConFormato(listFechas[index]);

        }

        fechasIncremento.push(fechaIncremento);
      }

      return [incremento, fechasIncremento];
    }

  }



  cleanString(string: string) {
    if (string == null) return "n/a";
    string=  string.toString();
    return string.replace(/ /g, "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }


  alertError(message, product) {
    $("#modalLoading").modal("close");
    this.reset();
    Swal.fire({
      icon: "error",
      title: `¡Error! procesado de ${product} cancelado`,
      text:
        message
    });
  }

  alertWarning(message) {
    
  }

  getValid() {
    let c = 0;
    for (let index = 2; index < this.disposicionesDataFull.length; index++) {
      
      if (this.cleanString(this.disposicionesDataFull[index][6]) != "n/a") {
        c++;
      }
      if (this.cleanString(this.disposicionesDataFull[index][8]) != "n/a") {
        c++;
      }
      if (this.cleanString(this.disposicionesDataFull[index][9]) != "n/a") {
        c++;
      }
      if (this.cleanString(this.disposicionesDataFull[index][10]) != "n/a") {
        c++;
      }
      if (this.cleanString(this.disposicionesDataFull[index][11]) != "n/a") {
        c++;
      }
      if (this.cleanString(this.disposicionesDataFull[index][12]) != "n/a") {
        c++;
      }

     
  
    }
    return c;

  }


  orderDisposiciones(lenghtValid) {
    if (lenghtValid == this.disposiciones.length) {
     // console.log("Finalizado");
     // console.log(this.disposiciones);
      this.disposiciones.forEach(disposicion => {
        let i = this.disposicionesFinales.findIndex(dpf => dpf[0].idLugar == disposicion[0].idLugar);
        if (i == -1) {
          this.disposicionesFinales.push([disposicion[0],[disposicion[1]], disposicion[2]]);
        } else {
          this.disposicionesFinales[i][1].push(disposicion[1]);
        }
      });
      //console.log(this.disposicionesFinales);
      //this.reset();
      this.disposicionesService.createDataComplete(this.disposicionesFinales).subscribe(
        res => {
          this.processToursPrivadosAPie();
          // this.procesar = false;
          // Swal.fire({
          //   position: "center",
          //   icon: "success",
          //   title: "Disposiciones procesadas correctamente",
          //   showConfirmButton: false,
          //   timer: 1000,
          // });
          // console.log(res);
        }
      );
    }
  }


  getTipoIncremento(incremento) {
    if (this.cleanString(incremento) == "reloj")
      return 1;
    if (this.cleanString(incremento) == "calendario")
      return 2;
    if (this.cleanString(incremento) == "periodo")
      return 3;
    return undefined;
  }

  getFechaConFormato(fecha) {
    let f = fecha.trim().split("/");
    return `${f[0]}-${f[1]}`;
  }


  processToursPrivadosAPie() {
    this.textPreloader = "Procesando tours privados a pie...";
    console.log("Procesando tours privados a pie...");
    console.log(this.toursPrivadosAPieDataFull);

    this.toursPrivadosAPieDataFull.forEach((currentRow, index) => {
      if (index > 2) {
      this.processModelProducto(currentRow, index, 1);
      }
    });
  }


  processToursPrivadosEnTransporte() {
    this.textPreloader = "Procesando tours privados en transporte...";
    console.log(this.toursPrivadosEnTransporteDataFull);

    this.toursPrivadosEnTransporteDataFull.forEach((currentRow, index) => {
      if (index > 2) {
      this.processModelProducto(currentRow, index, 2);
      }
    });
  }


  processToursEnGrupo() {
    this.textPreloader = "Procesando tours en grupo...";
    console.log(this.toursEnGrupoDataFull);

    this.toursEnGrupoDataFull.forEach((currentRow, index) => {
      if (index > 2) {
      this.processModelProducto(currentRow, index, 3);
      }
    });
  }

  processActividades() {
    this.textPreloader = "Procesando actividades...";
    console.log(this.actividadesDataFull);

    this.actividadesDataFull.forEach((currentRow, index) => {
      if (index > 2) {
      this.processModelProducto(currentRow, index, 4);
      }
    });
  }

  processModelProducto(currentRow, rowNumber, categoria) {
   //1-Tours privados a pie 2-Tours privados en transporte 3.-Tours de grupo 4.- Actividades	
    //console.log(currentRow);
    let producto = new Producto();
    this.ciudadesService.listByNameCityNameCountry(currentRow[2], currentRow[1]).subscribe(
      (ciudad: any) => {
        if (ciudad != -1) {
          producto.idCiudad = ciudad;
          producto.titulo = currentRow[3];
          producto.resumen = currentRow[4];
          producto.descripcion = currentRow[6];
          producto.categoria = categoria;
          if (this.cleanString(currentRow[15]) != "n/a") producto.duracion = currentRow[15];
          if (categoria != 4) {
            if (categoria == 3) {
              producto.minimunViajeros = currentRow[25];
            } else 
            producto.maximunViajeros = currentRow[26];
          } 
        //  console.log(producto);
         return  this.processModelProductoInfo(currentRow, rowNumber, producto);
          
        } else {
          this.reset();
          this.alertError(`La ciudad ${currentRow[2]} del pais ${currentRow[1]} no existe (Fila: ${rowNumber+2} Columna: 4 )`, "disposiciones de chófer" );
        }

    });

  }

  processModelProductoInfo(currentRow, rowNumber, producto: Producto) {
    let productoInfo = new ProductoInfo();
    switch (producto.categoria) {
      case 1:
        productoInfo.frasesGoogle = currentRow[7];
        productoInfo.puntoEncuentro = currentRow[9];
        productoInfo.puntuacion = currentRow[10];
        productoInfo.notas = currentRow[11];
        productoInfo.cancelacion = currentRow[14];
        productoInfo.incluye = currentRow[17];
        productoInfo.noIncluye = currentRow[18];
        productoInfo.notasCruceros = currentRow[12];
        productoInfo.incluyeCrucero = currentRow[19];
        productoInfo.noIncluyeCrucero = currentRow[20];
        (this.cleanString(currentRow[21]) == "ok") ? productoInfo.muelle = 1 : productoInfo.muelle = 0;
        this.divisasService.listByName(currentRow[22]).subscribe(
          (divisa: any) => {
            if (divisa != -1) {
              productoInfo.idDivisa = divisa.idDivisa;
              if (this.cleanString(currentRow[37]) != "n/a") productoInfo.audifonos = currentRow[37];
              if (this.cleanString(currentRow[38]) != "n/a") productoInfo.guiaAcademico = currentRow[38];
              if (this.cleanString(currentRow[54]) != "n/a") productoInfo.tarifaCientifica = currentRow[54];
              if (this.cleanString(currentRow[66]) != "n/a") productoInfo.horaExtraGuia = currentRow[66];
              if (this.cleanString(currentRow[75]) == "ok") productoInfo.reserva2Meses = true;
              productoInfo.link = currentRow[97];
              if (this.cleanString(currentRow[98]) != "n/a") productoInfo.com = currentRow[98];
              if (this.cleanString(currentRow[99]) != "n/a") productoInfo.superiorGratuidad = currentRow[99];
              if (currentRow[100].toString().split("-") > 1) { 
                productoInfo.edadMinima = currentRow[100].split("-")[0];
                productoInfo.edadMinima = currentRow[100].split("-")[1];
              }
              productoInfo.operadorCompra = currentRow[102];
              let tarifas = this.processTarifas(currentRow, 55);
              let entradas = this.processEntradas(currentRow, 27);
              let opciones = this.processOpciones(currentRow, 39,1);
              let horarios = this.processHorarios(currentRow, 16);
              let diasCerrados = this.processDiasCerrados(currentRow, 13);
              let subcategorias = this.processSubcategorias(currentRow, 76,1);
              let incrementos = this.processIncrementos(currentRow, 67, 1);
              this.toursPrivadosAPie.push([producto, productoInfo, tarifas, entradas, opciones, horarios, diasCerrados, subcategorias,incrementos]);
              if (this.toursPrivadosAPie.length == (this.toursPrivadosAPieDataFull.length - 3)) {
                this.saveToursPrivadosAPie();
              }
            } else {
              this.reset();
              this.alertError(`La divisa ${currentRow[22]} no existe (Fila: ${rowNumber+2} Columna: 23 )`, "tours privados a pie" );
            }
          }
        );

        break;
    
      case 2:
        console.log("Procesando info de tours privados en pie", producto);
        
        productoInfo.frasesGoogle = currentRow[7];
        productoInfo.puntoEncuentro = currentRow[9];
        productoInfo.puntuacion = currentRow[10];
        productoInfo.notas = currentRow[11];
        productoInfo.notasCruceros = currentRow[12];
        productoInfo.cancelacion = currentRow[14];
        productoInfo.incluye = currentRow[17];
        productoInfo.noIncluyeCrucero = currentRow[18];

        if (this.cleanString(currentRow[21]) == "ok") productoInfo.muelle = 1;
        this.divisasService.listByName(currentRow[22]).subscribe(
          (divisa: any) => {
            if (divisa != -1) {
              productoInfo.idDivisa = divisa.idDivisa;
              if (this.cleanString(currentRow[37]) != "n/a") productoInfo.audifonos = currentRow[37];
              if (this.cleanString(currentRow[58]) != "n/a") productoInfo.tarifaCientifica = currentRow[58];
              if (this.cleanString(currentRow[38]) != "n/a") productoInfo.guiaAcademico = currentRow[38];
              if (this.cleanString(currentRow[56]) != "n/a") productoInfo.choferGuia = currentRow[56];
              if (this.cleanString(currentRow[57]) != "n/a") productoInfo.choferGuiaMaximun = currentRow[57];
              if (this.cleanString(currentRow[93]) != "n/a") productoInfo.horaExtraGuia = currentRow[93];
              if (this.cleanString(currentRow[102]) == "ok") productoInfo.reserva2Meses = true;
              productoInfo.link = currentRow[124];
              if (this.cleanString(currentRow[125]) != "n/a") productoInfo.com = currentRow[125];
              if (this.cleanString(currentRow[126]) != "n/a") productoInfo.superiorGratuidad = currentRow[126];
              if (currentRow[127].toString().split("-") > 1) { 
                productoInfo.edadMinima = currentRow[127].split("-")[0];
                productoInfo.edadMinima = currentRow[127].split("-")[1];
              }
              
              productoInfo.operadorCompra = currentRow[129];
              let tarifas = this.processTarifas(currentRow, 82);
              let entradas = this.processEntradas(currentRow, 27);
              let opciones = this.processOpciones(currentRow, 39,2);
              let horarios = this.processHorarios(currentRow,16);
              let transporte = this.processTransporteTourPrivadoEnTransporte(currentRow);
              let diasCerrados = this.processDiasCerrados(currentRow, 13);
              let subcategorias = this.processSubcategorias(currentRow, 103, 2);
              let incrementos = this.processIncrementos(currentRow, 94, 1);
              this.toursPrivadosEnTransporte.push([producto, productoInfo, tarifas, entradas, opciones, horarios,diasCerrados,transporte, subcategorias, incrementos]);
              if (this.toursPrivadosEnTransporte.length == (this.toursPrivadosEnTransporteDataFull.length - 3)) {
                this.saveToursPrivadosEnTransporte();
              }


            } else {
              this.reset();
              this.alertError(`La divisa ${currentRow[22]} no existe (Fila: ${rowNumber + 2} Columna: 23 )`, "tours privados a pie");
            }
          }
        );
        break;
      
      
      case 3:
        productoInfo.frasesGoogle = currentRow[7];
        productoInfo.puntoEncuentro = currentRow[9];
        productoInfo.puntuacion = currentRow[10];
        productoInfo.notas = currentRow[11];
        productoInfo.notasCruceros = currentRow[12];
        productoInfo.cancelacion = currentRow[14];
        productoInfo.incluye = currentRow[17];
        productoInfo.noIncluyeCrucero = currentRow[18];
        if (this.cleanString(currentRow[21]) == "ok") productoInfo.muelle = 1;
        this.divisasService.listByName(currentRow[22]).subscribe(
          (divisa: any) => {
            if (divisa != -1) {
              if (this.cleanString(currentRow[27]) != "n/a") productoInfo.tarifaCientifica = currentRow[27];
              productoInfo.link = currentRow[74];
              if (this.cleanString(currentRow[75]) != "n/a") productoInfo.com = currentRow[75];
              if (this.cleanString(currentRow[76]) != "n/a") productoInfo.superiorGratuidad = currentRow[76];
              if (currentRow[77].toString().split("-") > 1) {
                productoInfo.edadMinima = currentRow[77].split("-")[0];
                productoInfo.edadMinima = currentRow[77].split("-")[1];
              }     
              productoInfo.operadorCompra = currentRow[78];
              if (this.cleanString(currentRow[24]) == "ok" || this.cleanString(currentRow[24]) == "si") productoInfo.freeTour =  true;
              if (this.cleanString(currentRow[80]) != "n/a") productoInfo.minimoMenor = currentRow[80];
              if (this.cleanString(currentRow[81]) != "n/a") productoInfo.maximoMenor = currentRow[81];
              if (this.cleanString(currentRow[82]) != "n/a") productoInfo.tarifaMenor = currentRow[82];
              let opciones = this.processOpciones(currentRow, 41,3);
              let horarios = this.processHorarios(currentRow, 16);
              let diasCerrados = this.processDiasCerrados(currentRow, 13);
              let transportes = this.processTransporteToursEnGrupo(currentRow);
              let subcategorias = this.processSubcategorias(currentRow, 53, 3);
              let incrementos = this.processIncrementos(currentRow, 33, 1);
              this.toursEnGrupo.push([producto, productoInfo, opciones, horarios,diasCerrados,transportes, subcategorias, incrementos]);
              if (this.toursEnGrupo.length == (this.toursEnGrupoDataFull.length - 3)) {
                this.saveToursEnGrupo();
              }




            } else {
              this.reset();
              this.alertError(`La divisa ${currentRow[22]} no existe (Fila: ${rowNumber + 2} Columna: 23 )`, "tours privados a pie");
            }
        });
        break;
      
      case 4:
        let regexp = /^[0-9]+([,.][0-9]+)?$/g;
        
        productoInfo.frasesGoogle = currentRow[7];
        productoInfo.puntoEncuentro = currentRow[9];
        if (this.cleanString(currentRow[10]) != "n/a" && regexp.test(currentRow[10])) productoInfo.puntuacion = currentRow[10];
        productoInfo.notas = currentRow[11];
        productoInfo.notasCruceros = currentRow[12];
        productoInfo.cancelacion = currentRow[14];
        productoInfo.incluye = currentRow[17];
        productoInfo.noIncluyeCrucero = currentRow[18];
        if (this.cleanString(currentRow[21]) == "ok") productoInfo.muelle = 1;
        this.divisasService.listByName(currentRow[22]).subscribe(
          (divisa: any) => {
            if (divisa != -1) {
              if (this.cleanString(currentRow[24]) != "n/a") productoInfo.tarifaCientifica = currentRow[24];
              if (this.cleanString(currentRow[43]) != "n/a") productoInfo.guiaEspecializado = currentRow[43];
              if (this.cleanString(currentRow[44]) != "n/a") {
                let regex = /(\d+)/g;
                let tarifaAudioguia = currentRow[44].match(regex);
                if (tarifaAudioguia != null) {
                  productoInfo.audioguia = tarifaAudioguia;

                }
              };
              productoInfo.link = currentRow[71];
              if (this.cleanString(currentRow[72]) != "n/a") productoInfo.com = currentRow[72];
              if (this.cleanString(currentRow[73]) != "n/a") productoInfo.superiorGratuidad = currentRow[73];
              if (currentRow[74].toString().split("-") > 1) {
                productoInfo.edadMinima = currentRow[74].split("-")[0];
                productoInfo.edadMinima = currentRow[74].split("-")[1];
              }     
              productoInfo.operadorCompra = currentRow[75];
              if (this.cleanString(currentRow[25]) != "n/a") productoInfo.minimoMenor = currentRow[25];
              if (this.cleanString(currentRow[26]) != "n/a") productoInfo.maximoMenor = currentRow[26];
              if (this.cleanString(currentRow[27]) != "n/a") productoInfo.tarifaMenor = currentRow[27];
              let opciones = this.processOpciones(currentRow, 28, 4);
              let horarios = this.processHorarios(currentRow, 16);
              let diasCerrados = this.processDiasCerrados(currentRow, 13);
              let transportes = this.processTransporteActividades(currentRow);
              let subcategorias = this.processSubcategorias(currentRow, 50, 4);
              this.actividades.push([producto, productoInfo, opciones, horarios,diasCerrados,transportes, subcategorias]);
              if (this.actividades.length == (this.actividadesDataFull.length - 3)) {
                this.saveActividades();
              }

            } else {
              this.reset();
              this.alertError(`La divisa ${currentRow[22]} no existe (Fila: ${rowNumber + 2} Columna: 23 )`, "tours privados a pie");
            }
          });
        break;
    }
  }

  reset() {
    $("#txtFileUploadCYC").val('');
    this.cancelled = true;
    this.procesar = false;
    this.disposicionesDataFull = [];
    this.disposiciones =[];
    this.disposicionesFinales = [];

    this.toursPrivadosAPieDataFull =[];
    this.toursPrivadosAPie = [];

    this.toursPrivadosEnTransporteDataFull = [];
    this.toursPrivadosEnTransporte = [];
    
    this.toursEnGrupoDataFull = [];
    this.toursEnGrupo = [];
  

    $("#modalLoading").modal("close");
  }

  processHorarios(currentRow, row) {
    
    let horarios = [];
    let h = currentRow[row].toString().split("\n");
    
    if (h.length > 1) {
      h.forEach(hour => {
        let horario = new ProductoHorario();
        horario.hora = hour + ":00";
        horarios.push(horario);
      });
    } else {
      if (h[0].includes(":")) {
        let horario = new ProductoHorario();
        horario.hora = h[0] + ":00";
        horarios.push(horario);
      } else {
      h[0]=(h[0] * 86400) / 60/60
      var n = new Date(0,0);
        n.setSeconds(+h[0] * 60 * 60);
        let horario = new ProductoHorario();
        horario.hora = n.toTimeString().slice(0, 8);
        horarios.push(horario);
      }
      
      
    }
   
    return horarios;
  }

   isCommaDecimalNumber(value) {
    return /^-?(?:\d+(?:,\d*)?)$/.test(value);
  }

  
  processTarifas(currentRow, startRow) {
    let tarifas = [];
    for (let index = 0; index <=10 ; index++) {
      if (this.cleanString(currentRow[startRow + index]) != "n/a") {
        let productoTarifa = new ProductoTarifa();
        productoTarifa.numPersonas = index +1;
        productoTarifa.tarifa = currentRow[startRow + index];
        tarifas.push(productoTarifa);
      } 
    }
    return tarifas; 
  }

  processEntradas(currentRow, startRow) {
    let entradas = [];
    if (this.cleanString(currentRow[startRow]) != "n/a") {
      let productoEntrada = new ProductoEntrada();
      productoEntrada.nombre = currentRow[startRow];
      if(this.cleanString(currentRow[startRow + 1])!="n/a")  productoEntrada.tarifaAdulto = currentRow[startRow + 1];
      if(this.cleanString(currentRow[startRow + 2])!="n/a")  productoEntrada.minimoMenor = currentRow[startRow + 2];
      if(this.cleanString(currentRow[startRow + 3])!="n/a")  productoEntrada.maximoMenor = currentRow[startRow + 3];
      if(this.cleanString(currentRow[startRow + 4])!="n/a")  productoEntrada.tarifaMenor = currentRow[startRow + 4];
      entradas.push(productoEntrada);
    }

    let startRow2 = startRow + 5;

    if (this.cleanString(currentRow[startRow2]) != "n/a") {
      let productoEntrada = new ProductoEntrada();
      productoEntrada.nombre = currentRow[startRow2];
      if(this.cleanString(currentRow[startRow2 + 1])!="n/a")  productoEntrada.tarifaAdulto = currentRow[startRow2 + 1];
      if(this.cleanString(currentRow[startRow2 + 1])!="n/a")  productoEntrada.minimoMenor = currentRow[startRow2 + 2];
      if(this.cleanString(currentRow[startRow2 + 1])!="n/a")  productoEntrada.maximoMenor = currentRow[startRow2 + 3];
      if(this.cleanString(currentRow[startRow2 + 1])!="n/a")  productoEntrada.tarifaMenor = currentRow[startRow2 + 4];
      entradas.push(productoEntrada);
    }
    return entradas;
  }








  processOpciones(currentRow, startRow, categoria) {
    let opciones = [];
    if (this.cleanString(currentRow[startRow]) != "n/a" && this.cleanString(currentRow[startRow]) != "no") {
      let regexp =/^[0-9]+([,.][0-9]+)?$/g;
      let productoOpcion = new ProductoOpcion();
      productoOpcion.nombre = currentRow[startRow];
      if(this.cleanString(currentRow[startRow + 1])!="n/a" && regexp.test(currentRow[startRow + 1]))  productoOpcion.tarifaAdulto = currentRow[startRow + 1];
      if (this.cleanString(currentRow[startRow + 2]) != "n/a"&& regexp.test(currentRow[startRow + 2])) productoOpcion.minimoMenor = currentRow[startRow + 2];
      
      if(this.cleanString(currentRow[startRow + 3])!="n/a" && regexp.test(currentRow[startRow + 3]))  productoOpcion.maximoMenor = currentRow[startRow + 3];
      if(this.cleanString(currentRow[startRow + 4])!="n/a" && regexp.test(currentRow[startRow + 4]))  productoOpcion.tarifaMenor = currentRow[startRow + 4];
    
      if (categoria == 1 ||categoria == 3) {
        if (this.cleanString(currentRow[startRow + 5]) != "n/a"&& regexp.test(currentRow[startRow + 5])) productoOpcion.horasExtras = currentRow[startRow + 5];
      }
      if (categoria == 3) {
        if(this.cleanString(currentRow[startRow + 6])!="n/a" && regexp.test(currentRow[startRow + 6]))  productoOpcion.horaExtraChofer = currentRow[startRow + 6];

      }
      opciones.push(productoOpcion);
    }

    let startRow2 =0;

    switch (categoria) {
      case 1:
        startRow2 = startRow + 6;
        break;

        case 2:
          startRow2 = startRow + 7;
          break;

        case 3:
            startRow2 = startRow + 5;
        break;
      
      case 4:
        startRow2 = startRow + 5;
        break;
    }

    if (this.cleanString(currentRow[startRow2]) != "n/a") {
      let productoOpcion = new ProductoOpcion();
      let regexp =/^[0-9]+([,.][0-9]+)?$/g;

      productoOpcion.nombre = currentRow[startRow2];
      if(this.cleanString(currentRow[startRow2 + 1])!="n/a"  && regexp.test(currentRow[startRow2 + 1]))  productoOpcion.tarifaAdulto = currentRow[startRow2 + 1];
      if(this.cleanString(currentRow[startRow2 + 2])!="n/a"  && regexp.test(currentRow[startRow2 + 2]))  productoOpcion.minimoMenor = currentRow[startRow2 + 2];
      if(this.cleanString(currentRow[startRow2 + 3])!="n/a" && regexp.test(currentRow[startRow2 + 3]))  productoOpcion.maximoMenor = currentRow[startRow2 + 3];
      if(this.cleanString(currentRow[startRow2 + 4])!="n/a" && regexp.test(currentRow[startRow2 + 4]))  productoOpcion.tarifaMenor = currentRow[startRow2 + 4];
      if (categoria == 1 ||categoria == 3) {
        if (this.cleanString(currentRow[startRow + 5]) != "n/a"  && regexp.test(currentRow[startRow2 + 5])) productoOpcion.horasExtras = currentRow[startRow2 + 5];
      }

      if (categoria == 3) {
        if(this.cleanString(currentRow[startRow + 6])!="n/a"  && regexp.test(currentRow[startRow2 + 6]))  productoOpcion.horaExtraChofer = currentRow[startRow2 + 6];

      }


      opciones.push(productoOpcion);
    }
    return opciones;
  }


  processDiasCerrados(currentRow, row) {
    let diasCerrados = [];
    let dc = currentRow[row].split("\n");
    dc.forEach(diaCerrado => {
      if (diaCerrado.includes("lu") ||  diaCerrado.includes("ma") ||  diaCerrado.includes("mi") ||  diaCerrado.includes("ju") ||  diaCerrado.includes("vi") ||  diaCerrado.includes("sa") ||  diaCerrado.includes("do") ) {
        let diaC = new ProductoDiaCerrado();
        switch (diaCerrado) {
          case "lu":
            diaC.fecha = "1";
            break;
            case "ma":
              diaC.fecha = "2";
            break;
            case "mi":
              diaC.fecha = "3";
            break;
            case "ju":
              diaC.fecha = "4";
            break;
            case "vi":
              diaC.fecha = "5";
            break;
            case "sa":
              diaC.fecha = "6";
            break;
            case "do":
              diaC.fecha = "7";
              break;
        }
        diasCerrados.push(diaC);

      } else {
        if (this.cleanString(diaCerrado) != "n/a") {
          if (diaCerrado.split("-").length > 1) {
            let startDate = diaCerrado.split("-")[0] +"/"+ new Date().getFullYear();
            let stopDate = diaCerrado.split("-")[1] + "/" + new Date().getFullYear();
            let diasCC =this.getDatesBetween2Dates(`${(startDate).split("/")[1]}-${(startDate).split("/")[0]}-${(startDate).split("/")[2]}`,  `${(stopDate).split("/")[1]}-${(stopDate).split("/")[0]}-${(stopDate).split("/")[2]}`);
            diasCC.forEach(dia => {
              let diaC = new ProductoDiaCerrado();
              diaC.fecha = dia;
              diasCerrados.push(diaC);
            });
          } else {
            let diaC = new ProductoDiaCerrado();
            diaC.fecha = diaCerrado.replace("/", "-");
            diasCerrados.push(diaC);
          }
        
        
       
        }
        
      }
     
    });
    return diasCerrados;
  }

  processSubcategorias(currentRow, startRow, categoria) {
    let subcategorias = [];
    for (let index = startRow; index < (startRow + 21); index++) {
      if (index == (startRow + 12)) {
        this.toursPrivadosAPieDataFull[2][index] = "Excursiones de cruceros en grupo";
      }

      if (index == (startRow + 13)) {
        this.toursPrivadosAPieDataFull[2][index] = "Excursiones de cruceros en privado";
      }

      if (index == (startRow + 15)) {
        this.toursPrivadosAPieDataFull[2][index] = "Segunda vez en el muelle de cruceros";
      }

      if (this.cleanString(currentRow[index]) == "ok") {
        
        switch (categoria) {
          case 1:
            subcategorias.push(this.subcategorias.find(s=> this.cleanString(s.nombre)==this.cleanString(this.toursPrivadosAPieDataFull[2][index])));
            break;
        
          case 2:
            subcategorias.push(this.subcategorias.find(s=> this.cleanString(s.nombre)==this.cleanString(this.toursPrivadosEnTransporteDataFull[2][index])));
            break;
          
          case 3:
              subcategorias.push(this.subcategorias.find(s=> this.cleanString(s.nombre)==this.cleanString(this.toursEnGrupoDataFull[2][index])));
            break;
          case 4:

              subcategorias.push(this.subcategorias.find(s=> this.cleanString(s.nombre)==this.cleanString(this.actividadesDataFull[2][index])));
              break;
        }
      }

    }

    return subcategorias;
    
  }

  saveToursPrivadosAPie() {
    this.textPreloader = "Guardando tours privados a pie...";
    this.productosService.createTPAP_fromList(this.toursPrivadosAPie).subscribe( 
      res => {
        this.textPreloader = "Tours privados a pie guardados correctamente...";
        this.saveToursPrivadosEnTransporte();
      }
    );
  }


  saveToursPrivadosEnTransporte() {
    this.textPreloader = "Guardando tours privados en transporte...";
    console.log(this.toursPrivadosEnTransporte);
    this.productosService.createTPET_fromList(this.toursPrivadosEnTransporte).subscribe( 
      res => {
        this.processToursEnGrupo();
        this.textPreloader = "Tours privados en transporte guardados correctamente...";

      }
    );
  }

  saveToursEnGrupo() {
    this.textPreloader = "Guardando tours en grupo...";
    console.log(this.toursEnGrupo);
    this.productosService.createTEG_fromList(this.toursEnGrupo).subscribe( 
      res => {
        this.processActividades();
        this.textPreloader = "Tours en grupo guardados correctamente...";

      }
    );
  }

  saveActividades() {
    this.textPreloader = "Guardando actividades...";
    console.log(this.actividades);
    this.productosService.createActividad_fromList(this.actividades).subscribe( 
      res => {
        this.reset();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Archivo procesado correctamente",
          showConfirmButton: false,
          timer: 1000,
        });

      }
    );
  }


  processIncrementos(curruntRecord,startRow, tipoActividad) {
  
    let incrementos = [];
    if (this.cleanString(curruntRecord[startRow]) != "n/a") {
      let incremento = new Incremento();
      incremento.tipoActividad = tipoActividad;
      incremento.tipo = this.getTipoIncremento(curruntRecord[startRow+1]); //Es del tipo reloj, calendario o periodo
      incremento.nombre = curruntRecord[startRow];
      incremento.porcentaje = curruntRecord[startRow+3];
      incrementos.push(this.processDetalleIncremento(incremento, curruntRecord, 1, startRow));  
    }

    let startRow2 = startRow + 4;

    if (this.cleanString(curruntRecord[startRow2]) != "n/a") {
      let incremento = new Incremento();
      incremento.tipoActividad = tipoActividad;
      incremento.tipo = this.getTipoIncremento(curruntRecord[startRow2+1]); //Es del tipo reloj, calendario o periodo
      incremento.nombre = curruntRecord[startRow];
      incremento.porcentaje = curruntRecord[startRow+3];
     incrementos.push(this.processDetalleIncremento(incremento, curruntRecord, 2, startRow2));  
    }

    return incrementos;
  }


  processDetalleIncremento(incremento: Incremento, curruntRecord, numeroIncremento, currentRow) {
    let indexDetalle = currentRow+2;

    if (incremento.tipo == 1) {//Se llena horasIncrementos
      let horasIncremento = [];
      let listHoras = curruntRecord[indexDetalle].split("\n");
      for (let index = 0; index < listHoras.length; index++) {
        let h1 = listHoras[index].split("-")[0];
        let h2 = listHoras[index].split("-")[1];

        let horaIncremento = new incrementoHora();
        if (h2 < h1) {
          horaIncremento = new incrementoHora();
          horaIncremento.horaInicial = h1;
          horaIncremento.horaFinal = "23:59"
          horaIncremento.idIncremento = incremento.idIncremento;
          horasIncremento.push(horaIncremento);


          horaIncremento = new incrementoHora();
          horaIncremento.horaInicial = "00:00";
          horaIncremento.horaFinal = h2;
          horaIncremento.idIncremento = incremento.idIncremento;
          horasIncremento.push(horaIncremento);


        } else {
          horaIncremento = new incrementoHora();
          horaIncremento.horaInicial = h1;
          horaIncremento.horaFinal = h2;
          horaIncremento.idIncremento = incremento.idIncremento;
          horasIncremento.push(horaIncremento);

        }
      }

      return [incremento, horasIncremento];

    } else {//Se llena fechasIncrementos

      let fechasIncremento = [];
      curruntRecord[indexDetalle] = curruntRecord[indexDetalle].replaceAll("al", "-");
      curruntRecord[indexDetalle]  = curruntRecord[indexDetalle].replace(/ /g, "");
      let listFechas = curruntRecord[indexDetalle].split("\n");

      for (let index = 0; index < listFechas.length; index++) {

        if (listFechas[index].split("-" || "–").length == 2) {
          let fechaIncremento = new IncrementoFecha();
          fechaIncremento.fechaInicial = this.getFechaConFormato(listFechas[index].split("-" || "–")[0]);
          fechaIncremento.fechaFinal = this.getFechaConFormato(listFechas[index].split("-" || "–")[1]);
          fechasIncremento.push(fechaIncremento);

        } else if(listFechas[index].split("-" || "–").length == 1 && listFechas[index].length>4) {
          let fechaIncremento = new IncrementoFecha();
          fechaIncremento.fechaInicial = this.getFechaConFormato(listFechas[index]);
          fechaIncremento.fechaFinal = this.getFechaConFormato(listFechas[index]);
          fechasIncremento.push(fechaIncremento);
        }

      }

      return [incremento, fechasIncremento];
    }

  }

  processTransporteTourPrivadoEnTransporte(currentRow) {
    let transportes:any[]= [];
    for (let index = 59; index < 71; index++) {  
      let nombre = this.toursPrivadosEnTransporteDataFull[2][index];
      nombre = nombre.replaceAll("Opción","");
      nombre = nombre.replaceAll("Coche", "");

      if (this.cleanString(nombre) == "transportepublico") {
        if (this.cleanString(currentRow[index]) != "n/a") {
          let transporte = new ProductoTransporte();
          transporte.idVehiculo = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString(nombre)).idVehiculo;
          transporte.noPersonas = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString(nombre)).pasajerosMax;
          transporte.tarifa = currentRow[index];
          transportes.push(transporte);
        }
      } else {
        if (this.cleanString(currentRow[index]) != "n/a") {
          let transporte = new ProductoTransporte();
          if (this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString(nombre)) != undefined) {
            transporte.idVehiculo = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString(nombre)).idVehiculo;
            transporte.noPersonas = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString(nombre)).pasajerosMax;
            transporte.tarifa = currentRow[index];
            if (this.cleanString(currentRow[index + 11]) != "n/a")  transporte.horasExtras = currentRow[index + 11];
            transportes.push(transporte);
          } else {
            this.reset();
            this.alertError(`El vehiculo ${nombre.trim()} no existe en la base de datos. Agrégalo desde el administrador (seción de "vehiculos")`,"tour privado en transporte");
          }
          
        }
      }
      
    }
    return transportes;
  }


  processTransporteToursEnGrupo(currentRow) {
    let transportes = [];
    if (this.cleanString(currentRow[31]) != "n/a") {
      let transporte = new ProductoTransporte();
      if (this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("s")) != undefined) {
        transporte.idVehiculo = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("s")).idVehiculo;
        transporte.tarifa = currentRow[31];
        transporte.noPersonas = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("s")).pasajerosMax;
        transportes.push(transporte);
      }else {
        this.reset();
        this.alertError(`El vehiculo S no existe en la base de datos. Agrégalo desde el administrador (seción de "vehiculos")`,"tour privado en transporte");
      }
    }

    if (this.cleanString(currentRow[32]) != "n/a") {
      let transporte = new ProductoTransporte();
      if (this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("MV")) != undefined) {
        transporte.idVehiculo = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("s")).idVehiculo;
        transporte.tarifa = currentRow[32];
        transporte.noPersonas = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("s")).pasajerosMax;
        transportes.push(transporte);
      }else {
        this.reset();
        this.alertError(`El vehiculo MV no existe en la base de datos. Agrégalo desde el administrador (seción de "vehiculos")`,"tour privado en transporte");
      }
    }

    return transportes;

    
  }


  

  getDatesBetween2Dates(startDate, stopDate) {
    const dateArray = [];
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(stopDate)) {
     
      dateArray.push( this.datePipe.transform(
        new Date(currentDate),
        "dd-MM"
      ));
      // Use UTC date to prevent problems with time zones and DST
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
  
    return dateArray;
  }
  

  processTransporteActividades(currentRow) {
    let transportes = [];
    if (this.cleanString(currentRow[45]) != "n/a") {
      let transporte = new ProductoTransporte();
      if (this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("sedan")) != undefined) {
        transporte.idVehiculo = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("sedan")).idVehiculo;
        transporte.tarifa = currentRow[45];
        transporte.noPersonas = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("sedan")).pasajerosMax;
        transportes.push(transporte);
      }else {
        this.reset();
        this.alertError(`El vehiculo Sedan no existe en la base de datos. Agrégalo desde el administrador (seción de "vehiculos")`,"actividades");
      }
    }

    if (this.cleanString(currentRow[46]) != "n/a") {
      let transporte = new ProductoTransporte();
      if (this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("minivan")) != undefined) {
        transporte.idVehiculo = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("minivan")).idVehiculo;
        transporte.tarifa = currentRow[46];
        transporte.noPersonas = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("minivan")).pasajerosMax;
        transportes.push(transporte);
      }else {
        this.reset();
        this.alertError(`El vehiculo Minivan no existe en la base de datos. Agrégalo desde el administrador (seción de "vehiculos")`,"tour privado en transporte");
      }
    }
    return transportes;
  } 

  
  processTraslados() {
    this.textPreloader = "Procesando traslados en...";
    console.log(this.trasladosDataFull);
    this.trasladosDataFull.forEach((currentValue, index) => {
      //console.log(currentValue, index);
      if (index > 2) {
        this.processModelTraslado(currentValue, index);
      }
      
    });

  }

  processModelTraslado(currentRow, rowNumber) {
    let traslado = new Traslado();
    this.ciudadesService.listByNameCityNameCountry(currentRow[2], currentRow[1]).subscribe(
      (ciudad: any) => {
        if (ciudad != -1) {
          console.log(ciudad);
          traslado.idCiudad = ciudad.idCiudad;
          console.log(traslado);
        } else {
          this.reset();
          this.alertError(`La ciudad ${currentRow[2]} del pais ${currentRow[1]} no existe (Fila: ${rowNumber + 2} Columna: 3 )`, "Traslados");
          
        }
      });

  }
}
