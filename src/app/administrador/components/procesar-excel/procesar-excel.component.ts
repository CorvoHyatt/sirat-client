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
import { Traslado_costo } from '../../../models/Traslado_costo';
import { Divisa } from 'src/app/models/Divisa';
import { TrasladosService } from '../../../services/traslados.service';

declare var $: any;

@Component({
  selector: 'app-procesar-excel',
  templateUrl: './procesar-excel.component.html',
  styleUrls: ['./procesar-excel.component.css']
})
export class ProcesarExcelComponent implements OnInit {

  
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
  public divisas: Divisa[] = [];
  public traslados: any = [];
  public error: any = {};
  public files: any;


  constructor(
    private ciudadesService: CiudadesService,
    private disposicionesService: DisposicionesService,
    private divisasService: DivisasService,
    private lugaresService: LugaresService,
    private vehiculosService: VehiculosService,
    private subcategoriasService: SubcategoriasService,
    private productosService: ProductosService,
    private datePipe: DatePipe,
    private trasladosService: TrasladosService


  ) { }

  ngOnInit(): void {
    this.getSubcategorias();
    this.getVehiculos();
    this.getDivisas();
    $('.modal').modal({ dismissible: false });
    // $('#modalLoading').modal({ dismissible: false });
    let regexp = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/g;
    //console.log(regexp.test("07:30"));
    //console.log(this.datePipe.transform(
     // "Sat Dec 30 1899 00:53:24 GMT-0636 (hora estándar central)",
     //  "hh:mm"
  // ));

  }

  getDivisas() {
    this.divisasService.getAll().subscribe(
      (res: Divisa[]) => {
        this.divisas = res;
      },
      err => console.error(err)
    );
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
    this.textPreloader = "Iniciando procesado...";
    this.procesar = true;
    this.cancelled = false;
    this.files = $event.srcElement.files;
    
    // readXlsxFile(files[0], { sheet: 1, dateFormat: 'mm/dd/yyyy' }).then((rows1) => {
    //   this.textPreloader = "Obteniendo datos de traslados...";
    //   this.trasladosDataFull = rows1;
    //   readXlsxFile(files[0], { sheet: 2, dateFormat: 'mm/dd/yyyy' }).then((rows2) => {
    //     this.disposicionesDataFull = rows2;
    //     this.textPreloader = "Obteniendo datos de traslados...";
    //     readXlsxFile(files[0], { sheet: 3, dateFormat: 'mm/dd/yyyy' }).then((rows3) => {
    //       this.toursPrivadosAPieDataFull = rows3;
    //       this.textPreloader = "Obteniendo datos de disposiciones de chófer...";
    //       readXlsxFile(files[0], { sheet: 4, dateFormat: 'mm/dd/yyyy' }).then((rows4) => {
    //         this.textPreloader = "Obteniendo datos de tours privados en transporte...";
    //         this.toursPrivadosEnTransporteDataFull = rows4;
    //         readXlsxFile(files[0], { sheet: 5, dateFormat: 'mm/dd/yyyy' }).then((rows5) => {
    //           this.textPreloader = "Obteniendo datos de tours privados en transporte...";
    //           this.toursEnGrupoDataFull = rows5;
           
    //           readXlsxFile(files[0], { sheet: 6, dateFormat: 'mm/dd/yyyy' }).then((rows6) => {
    //             this.textPreloader = "Obteniendo datos de actividades...";
    //             this.actividadesDataFull = rows6;
    //             // this.processDisposiciones();
    //             //this.processActividades();
    //             this.processTraslados();
    //             // this.processToursEnGrupo();
              
    //           });
    //         });
    //       });
    //     });
    //   });
    // });

      readXlsxFile(this.files[0], { sheet: 1, dateFormat: 'mm/dd/yyyy' }).then((rows1) => 
      {
        console.log("************************************************Obteniendo datos de traslados...");
      this.textPreloader = "Obteniendo datos de traslados...";
        this.trasladosDataFull = rows1;
        this.processTraslados();
      });

      //this.processActividades();

    

    
  }


  processDisposiciones() {
    this.textPreloader = "Obteniendo datos de disposiciones...";
    readXlsxFile(this.files[0], { sheet: 2, dateFormat: 'mm/dd/yyyy' }).then((rows1) => {
      this.disposicionesDataFull = rows1;
      console.log("Disposiciones",this.disposicionesDataFull);

        this.textPreloader = "Procesando disposiciones de chófer";
      //console.log(this.disposicionesDataFull);
      if (this.sheetValid(this.disposicionesDataFull,"Disposiciones")) {
          console.log("Entra a procesar disposicion...");
        let lenghtValid = this.getValid();
        let indexValid = this.indexValid(this.disposicionesDataFull);
        console.log(indexValid);
          this.disposicionesDataFull.forEach((currentValue, index) => {
        console.log(currentValue, index);
          if ( index > indexValid ) 
          {
            console.log("aca1");
            this.getInfoCostos(0, currentValue, index, lenghtValid);
            console.log("aca2");
            this.getInfoCostos(1, currentValue, index, lenghtValid);
            console.log("aca3");
            this.getInfoCostos(2, currentValue, index, lenghtValid);
            console.log("aca4");
            this.getInfoCostos(3, currentValue, index, lenghtValid);
            console.log("aca5");
            this.getInfoCostos(4, currentValue, index, lenghtValid);
            console.log("aca6");
            this.getInfoCostos(5, currentValue, index, lenghtValid);
            console.log("aca7");
          } 
      });
    } else {
      console.log("Fallo en Diuspocisiones");
      this.processToursPrivadosAPie();
    }

    });
  }


  getInfoCostos(tipo, currentRow, rowNumber, lenghtValid) {
    let disposicion = new Disposicion();
    let disposicionCosto = new DisposicionCosto();
    console.log("procesando getInfoCostos",tipo);
    if (tipo == 0) {
      if (this.cleanString(currentRow[6]) != "n/a") {
           
        this.vehiculosService.listByName(currentRow[3]).subscribe(
          (vehiculo: any) => {
            if (vehiculo != -1) {
    
              disposicionCosto.idVehiculo = vehiculo.idVehiculo;
              disposicionCosto.horasMinimo = 4;
              disposicionCosto.costo = currentRow[6];

              if (this.numeroValido(currentRow[6])) {
                disposicionCosto.costo = currentRow[6];
              } else {
                let regex = /(\d+)/g;
                let costo = currentRow[6].match(regex);
                if (costo != null) {
                  disposicionCosto.costo = costo;
                }
              }

              if (this.cleanString(currentRow[7].toString())!="n/a") {
                disposicionCosto.horaExtra = parseFloat(currentRow[7].toString().trim());
              }         

              this.ciudadesService.listByNameCityNameCountry(currentRow[2], currentRow[1]).subscribe(
                (ciudad: any) => {
                  if (ciudad != -1) {
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
                              } else {
                                let lugar = new Lugar();
                                lugar.nombre = "Centro de la ciudad (Hotel - Terminal de Autobús - Estación de tren…)";
                                this.lugaresService.create(lugar).subscribe(
                                  (respLugar: any) => {
                                    disposicion.idLugar = respLugar.insertId;
                                    disposicion.cancelaciones = currentRow[21];
                                    disposicion.comision = currentRow[22];
                                    disposicion.dentro = true;
                                    this.disposiciones.push([disposicion, disposicionCosto, this.processIncrementosDisposiciones(currentRow)]);
                                    this.orderDisposiciones(lenghtValid);
                                  }
                                );
                              }
                            }
                          );
    
    
                        } else {
                          this.reset();
                          this.alertError(`La divisa ${currentRow[5]} no existe (Fila: ${rowNumber + 2} Columna: 5 )`, "disposiciones de chófer");
                        }
    
                      }
                    );
                  } else {
                    this.reset();
                    this.alertError(`La ciudad ${currentRow[2]} del pais ${currentRow[1]} no existe (Fila: ${rowNumber + 2} Columna: 3 )`, "disposiciones de chófer");
              
                  }
                }
              );
    
    
            } else {
              this.reset();
              this.alertError(`El vehiculo ${currentRow[3]} no existe. Agregalo desde la sección de "Vehiculos" (Fila: ${rowNumber + 2} Columna: 4 )`, "disposiciones de chófer");
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
      console.log("position",position);
      console.log(currentRow[position]);

      if (this.cleanString(currentRow[position]) != "n/a") 
      {
        console.log("Diferente de n/a");
        console.log(currentRow[3]);
        this.vehiculosService.listByName(currentRow[3]).subscribe(
          (vehiculo: any) => {
            console.log("vehiculo",vehiculo);
            if (vehiculo != -1) {
     
              disposicionCosto.idVehiculo = vehiculo.idVehiculo;
              let infoDisposicion = currentRow[position].split("\n");
              console.log("infoDisposicion",infoDisposicion);
              console.log("infoDisposicion.length",infoDisposicion.length);
              infoDisposicion = infoDisposicion.filter(v => v.length > 0);
//              disposicionCosto.horasMinimo = parseInt(infoDisposicion[1].trim().split("hrs")[0].trim());
              disposicionCosto.horasMinimo = infoDisposicion[1];
              console.log("-----------------disposicionCosto.horasMinimo",disposicionCosto.horasMinimo);
              

              console.log("-----------------infoDisposicion[2].trim()",infoDisposicion[2].trim());

              if (this.numeroValido(infoDisposicion[2].trim())) {
                console.log("numero valido");
                disposicionCosto.costo = infoDisposicion[2].trim();
              } else {
                let regex = /(\d+)/g;
                let costo = infoDisposicion[2].trim().match(regex);
                if (costo != null) {
                  disposicionCosto.costo = costo;
                }
              }
              
              if (this.cleanString(currentRow[7].toString())!="n/a") {
                disposicionCosto.horaExtra = parseFloat(currentRow[7].toString().trim());

              }


              if (infoDisposicion.length != 3) {
                this.reset();
                this.alertError(`La disposición no cuenta con la información requerida. Lugar de la disposición, horas mínimas, tarifa  (Fila: ${rowNumber + 2} Columna: ${position + 1} )`, "disposiciones de chófer");
              } else {
                this.ciudadesService.listByNameCityNameCountry(currentRow[2], currentRow[1]).subscribe(
                  (ciudad: any) => {
                    if (ciudad != -1) {
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
                                  // Swal.fire({
                                  //   title: "¡Alerta!",
                                  //   text: `El lugar: ${infoDisposicion[0]} no existe en la base de datos, ¿realmente quieres guardar el lugar de la disposición con este nombre?`,
                                  //   showDenyButton: true,
                                  //   confirmButtonText: `Continuar procesado`,
                                  //   denyButtonText: `Cancelar `,
                                  // }).then((result) => {
                                  //   if (result.isConfirmed) {
                                  let lugar = new Lugar();
//                                  lugar.nombre = infoDisposicion[0].replaceAll("'","’");
                                  lugar.nombre = infoDisposicion[0].replace(/'/g,"’");
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
                                  //     } else if (result.isDenied) {
                                  //       this.reset();
                                  //   }
                                  // })
                   
                                }
                              }
                            );
          
          
                          } else {
                            this.reset();
                            this.alertError(`La divisa ${currentRow[5]} no existe (Fila: ${rowNumber + 2} Columna: 6 )`, "disposiciones de chófer");
                          }
          
                        }
                      );
                    } else {
                      this.reset();
                      this.alertError(`La ciudad ${currentRow[2]} del pais ${currentRow[1]} no existe (Fila: ${rowNumber + 2} Columna: 4 )`, "disposiciones de chófer");
                    
                    }
                  }
                );
              }
              
            } else {
              this.reset();
              this.alertError(`El vehiculo ${currentRow[3]} no existe. Agregalo desde la sección de "Vehiculos" (Fila: ${rowNumber + 2} Columna: 3 )`, "disposiciones de chófer");
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
//      incremento.nombre = curruntRecord[13].replaceAll("'","’");
      incremento.nombre = curruntRecord[13].replace(/'/g,"’");;
      if (this.numeroValido(curruntRecord[16])) incremento.porcentaje = curruntRecord[16];
      
      incrementos.push(this.processDetalleIncrementoDisposiciones(incremento, curruntRecord, 1));
    }

    if (this.cleanString(curruntRecord[17]) != "n/a") {
      let incremento = new Incremento();
      incremento.tipoActividad = 3;
      incremento.tipo = this.getTipoIncremento(curruntRecord[18]); //Es del tipo reloj, calendario o periodo
      //incremento.nombre = curruntRecord[17].replaceAll("'","’");
      incremento.nombre = curruntRecord[17].replace(/'/g,"’");
      if (this.numeroValido(curruntRecord[20])) incremento.porcentaje = curruntRecord[20];
      incrementos.push(this.processDetalleIncrementoDisposiciones(incremento, curruntRecord, 2));
    }

    return incrementos;
  }



  processDetalleIncrementoDisposiciones(incremento: Incremento, curruntRecord, numeroIncremento) {
    let indexDetalle;
    (numeroIncremento == 1) ? indexDetalle = 15 : indexDetalle = 19;

    if (incremento.tipo == 1) {//Se llena horasIncrementos
      let horasIncremento = [];
      let listHoras = curruntRecord[indexDetalle].split("\n");
      for (let index = 0; index < listHoras.length; index++) {
        let h1 = listHoras[index].split("-")[0];
        let h2 = listHoras[index].split("-")[1];

        let horaIncremento = new incrementoHora();
        if (h2 < h1) {
          horaIncremento = new incrementoHora();
          horaIncremento.horaInicial = h1.replace(/ /g, "");
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
          horaIncremento.horaInicial = h1.replace(/ /g, "");
          horaIncremento.horaFinal = h2.replace(/ /g, "");
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
    string = string.toString();
    //console.log("cambiando N/A",string.replace(/ /g, "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
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
    //console.log(this.indexValid(this.disposicionesDataFull)+1);
    for (let index = (this.indexValid(this.disposicionesDataFull)+1); index < this.disposicionesDataFull.length; index++) {
      
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
   // console.log("orderDisposiciones", lenghtValid,this.disposiciones.length);
    if (lenghtValid == this.disposiciones.length) {
      this.disposiciones.forEach(disposicion => {
        let i = this.disposicionesFinales.findIndex(dpf => dpf[0].idLugar == disposicion[0].idLugar);
        if (i == -1) {
          this.disposicionesFinales.push([disposicion[0], [disposicion[1]], disposicion[2]]);
        } else {
          this.disposicionesFinales[i][1].push(disposicion[1]);
        }
      });

      this.processToursPrivadosAPie();
      
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
    console.log(this.textPreloader);    
    readXlsxFile(this.files[0], { sheet: 3, dateFormat: 'mm/dd/yyyy' }).then((rows1) => {
      this.toursPrivadosAPieDataFull = rows1;
      //console.log("Procesando tours privados a pie...");
      //console.log(this.toursPrivadosAPieDataFull);
      console.log("Tours privados a pie",this.toursPrivadosAPieDataFull);
 
      if (this.sheetValid(this.toursPrivadosAPieDataFull,"Tours privados a pie")) {
        //console.log("sheet valid");
        let indexValid = this.indexValid(this.toursPrivadosAPieDataFull);
        console.log(indexValid);
        this.toursPrivadosAPieDataFull.forEach((currentRow, index) => {
           
          if (index > indexValid) {
           // if (this.tourValido(currentRow, 16)) {
              this.processModelProducto(currentRow, index, 1);
          //  }
         }
        });
      } else {
        this.processToursPrivadosEnTransporte();
      }
    });
    
  }


  processToursPrivadosEnTransporte() {
    this.textPreloader = "Procesando tours privados en transporte...";
    console.log(this.textPreloader);
    readXlsxFile(this.files[0], { sheet: 4, dateFormat: 'mm/dd/yyyy' }).then((rows1) => {
      this.toursPrivadosEnTransporteDataFull = rows1;
      console.log("Tours privados en transporte",this.toursPrivadosEnTransporteDataFull);
      //console.log(this.toursPrivadosEnTransporteDataFull);
      if (this.sheetValid(this.toursPrivadosEnTransporteDataFull,"Tours privados en transporte")) {
        let indexValid = this.indexValid(this.toursPrivadosEnTransporteDataFull);
        //console.log(indexValid);
        this.toursPrivadosEnTransporteDataFull.forEach((currentRow, index) => {
          
          if (index > indexValid) {
        //  if (this.tourValido(currentRow, 16)) {
              this.processModelProducto(currentRow, index, 2);

        //   }
          }
        });
      } else {
        this.processToursEnGrupo();
      }
    });
  }


  processToursEnGrupo() {
    this.textPreloader = "Procesando tours en grupo...";
    console.log(this.textPreloader);
    readXlsxFile(this.files[0], { sheet: 5, dateFormat: 'mm/dd/yyyy' }).then((rows1) => {
      this.toursEnGrupoDataFull = rows1;
      console.log("Tours en grupo",this.toursEnGrupoDataFull);
      //console.log(this.toursEnGrupoDataFull);
      if (this.sheetValid(this.toursEnGrupoDataFull,"tours en grupo")) {
        let indexValid = this.indexValid(this.toursEnGrupoDataFull);
        //console.log(indexValid);
        this.toursEnGrupoDataFull.forEach((currentRow, index) => {
          
          if (index > indexValid) {
            //console.log(currentRow);
            //if (this.tourValido(currentRow, 16)) { 
              this.processModelProducto(currentRow, index, 3);
           // }
          }
        });
      } else {
        this.processActividades();
      }
    });
  }

  processActividades() {
    this.textPreloader = "Procesando actividades...";
    console.log(this.textPreloader);
     
    readXlsxFile(this.files[0], { sheet: 6, dateFormat: 'mm/dd/yyyy' }).then((rows1) => {
      this.actividadesDataFull = rows1;
      console.log("Actividades",this.actividadesDataFull);

      //console.log(this.actividadesDataFull);
      if (this.sheetValid(this.actividadesDataFull, "actividades")) {
        console.log("actividades!!!!");
        let indexValid = this.indexValid(this.actividadesDataFull);
        console.log(indexValid);
        this.actividadesDataFull.forEach((currentRow, index) => {
          console.log("Indesx********", index, indexValid);
          if (index > indexValid) {
            // if (this.tourValido(currentRow, 16)) { 
              this.processModelProducto(currentRow, index, 4);

            //}
          }
        });
      } else {
        console.log("saveTraslados");
        this.saveTraslados();
      }
    });
  }

  processModelProducto(currentRow, rowNumber, categoria) {
    //1-Tours privados a pie 2-Tours privados en transporte 3.-Tours de grupo 4.- Actividades	
    //console.log(currentRow);
    let producto = new Producto();
    if (currentRow[2] != null && currentRow[1] != null) {
      this.ciudadesService.listByNameCityNameCountry(currentRow[2], currentRow[1]).subscribe(
        (ciudad: any) => {
          if (ciudad != -1) {
            producto.idCiudad = ciudad;
            if (currentRow[3] != null)  producto.titulo = currentRow[3];
//             if (currentRow[4] != null) producto.resumen = currentRow[4].replaceAll("'","’");
  //           if (currentRow[6] != null) producto.descripcion = currentRow[6].replaceAll("'","’");
             if (currentRow[4] != null) producto.resumen = currentRow[4].replace(/'/g,"’");
             if (currentRow[6] != null) producto.descripcion = currentRow[6].replace(/'/g,"’");


             producto.categoria = categoria;
             if (currentRow[15] != null) producto.duracion = currentRow[15];
            // if (this.numeroValido(currentRow[15])){
            //   producto.duracion = currentRow[15];
            //    } else {
            //     let regex = /(\d+)/g;
            //     let duracion = currentRow[15].match(regex);
            //   if (duracion != null) {
            //     producto.duracion = duracion;
            //   }
            //  }
           
              
            if (categoria != 4) {
              if (categoria == 3) {
                if(this.numeroValido(currentRow[25]))  producto.minimunViajeros = currentRow[25];
               
              }

              if(this.numeroValido( currentRow[26]))  producto.maximunViajeros = currentRow[26];
            }
            //  console.log(producto);
            return this.processModelProductoInfo(currentRow, rowNumber, producto);
            
          } else {
            this.reset();
            switch (categoria) {
              case 1:
                this.alertError(`La ciudad ${currentRow[2]} del pais ${currentRow[1]} no existe (Fila: ${rowNumber + 2} Columna: 4 )`, "tours privado a pie");
                break;
            
              case 2:
                this.alertError(`La ciudad ${currentRow[2]} del pais ${currentRow[1]} no existe (Fila: ${rowNumber + 2} Columna: 4 )`, "tours privado en transporte");
                break;
              
              case 3:
                this.alertError(`La ciudad ${currentRow[2]} del pais ${currentRow[1]} no existe (Fila: ${rowNumber + 2} Columna: 4 )`, "tours en grupo");
                break;
              case 4:
                this.alertError(`La ciudad ${currentRow[2]} del pais ${currentRow[1]} no existe (Fila: ${rowNumber + 2} Columna: 4 )`, "actividades");
                break;
            }
          }
  
        });
    } else {
      switch (categoria) { 
        case 1:
          this.alertError(`Ingresaste valores vacios para el pais o ciudad (Fila: ${rowNumber + 1} )`, "tours privados a pie");
          break;
        
          case 2:
            this.alertError(`Ingresaste valores vacios para el pais o ciudad (Fila: ${rowNumber + 1} )`, "tours privados en transporte");
          break;
        
          case 3:
            this.alertError(`Ingresaste valores vacios para el pais o ciudad (Fila: ${rowNumber + 1}  )`, "tours en grupo");
          break;
        
          case 4:
            this.alertError(`Ingresaste valores vacios para el pais o ciudad (Fila: ${rowNumber + 1}  )`, "actividades");
            break;
      }

    }

  }

  processModelProductoInfo(currentRow, rowNumber, producto: Producto) {
    let productoInfo = new ProductoInfo();
    switch (producto.categoria) {
      case 1:
        productoInfo.frasesGoogle = currentRow[7];
        productoInfo.puntoEncuentro = currentRow[9];
        if (this.numeroValido(currentRow[10])) productoInfo.puntuacion = currentRow[10];
        productoInfo.notas = currentRow[11];
        productoInfo.cancelacion = currentRow[14];
        productoInfo.incluye = currentRow[17];
        productoInfo.noIncluye = currentRow[18];
        productoInfo.notasCruceros = currentRow[12];
        productoInfo.incluyeCrucero = currentRow[19];
        productoInfo.noIncluyeCrucero = currentRow[20];
        (this.cleanString(currentRow[21]) == "ok") ? productoInfo.muelle = 1 : productoInfo.muelle = 0;
        console.log(currentRow);
        console.log(currentRow[22]);
        this.divisasService.listByName(currentRow[22]).subscribe(
          (divisa: any) => {
            // console.log("Divisa en productos");
            // console.log(divisa);
            if (divisa != -1) {
              productoInfo.idDivisa = divisa.idDivisa;
              // console.log(productoInfo);
              if (this.numeroValido(currentRow[37])) productoInfo.audifonos = currentRow[37];
              if (this.numeroValido(currentRow[38])) productoInfo.guiaAcademico = currentRow[38];
              if (this.numeroValido(currentRow[54])) productoInfo.tarifaCientifica = currentRow[54];
              if (this.numeroValido(currentRow[66])) productoInfo.horaExtraGuia = currentRow[66];
              if (this.cleanString(currentRow[75]) == "ok") productoInfo.reserva2Meses = true;
              productoInfo.link = currentRow[97];
              if (this.numeroValido(currentRow[98])) productoInfo.com = currentRow[98];
              if (this.numeroValido(currentRow[99])) productoInfo.superiorGratuidad = currentRow[99];
              if (currentRow[100] != null) {
                if (currentRow[100].toString().split("-").length > 1) {
                  productoInfo.edadMinima = currentRow[100].toString().split("-")[0];
                  productoInfo.edadMaxima = currentRow[100].toString().split("-")[1];
                } else {

                  if (this.numeroValido(currentRow[100])) {
                    productoInfo.edadMinima = 0 ;
                    productoInfo.edadMaxima = currentRow[100]; 
                  } else {
                    productoInfo.edadMinima = 0 ;
                    productoInfo.edadMaxima = 99; 
                  }
                }
              }
              
              productoInfo.operadorCompra = currentRow[102];
              let tarifas = this.processTarifas(currentRow, 55);
              let entradas = this.processEntradas(currentRow, 27);
              let opciones = this.processOpciones(currentRow, 39, 1);
              let horarios = this.processHorarios(currentRow, 16);
              let diasCerrados = this.processDiasCerrados(currentRow, 13);
              let subcategorias = this.processSubcategorias(currentRow, 76, 1);
              let incrementos = this.processIncrementos(currentRow, 67, 1);
              this.toursPrivadosAPie.push([producto, productoInfo, tarifas, entradas, opciones, horarios, diasCerrados, subcategorias, incrementos]);
              if (this.toursPrivadosAPie.length == (this.toursPrivadosAPieDataFull.length - 3)) {
                //console.log("todos los tours provados a pie", this.toursPrivadosAPie);
                this.processToursPrivadosEnTransporte();
              }
            } else {
              this.reset();
              this.alertError(`La divisa ${currentRow[22]} no existe (Fila: ${rowNumber + 2} Columna: 23 )`, "tours privados a pie");
            }
          }
        );

        break;
    
      case 2:
        // console.log("Procesando info de tours privados en transporte", producto);
        
        productoInfo.frasesGoogle = currentRow[7];
        productoInfo.puntoEncuentro = currentRow[9];
        if (this.numeroValido(currentRow[10])) productoInfo.puntuacion = currentRow[10];
        productoInfo.notas = currentRow[11];
        productoInfo.notasCruceros = currentRow[12];
        productoInfo.cancelacion = currentRow[14];
        productoInfo.incluye = currentRow[17];
        productoInfo.noIncluyeCrucero = currentRow[18];

        if (this.cleanString(currentRow[21]) == "ok") productoInfo.muelle = 1;
        this.divisasService.listByName(currentRow[22]).subscribe(
          (divisa: any) => {
            // console.log("Divisa en productos");
            // console.log(divisa);
            if (divisa != -1) {
              productoInfo.idDivisa = divisa.idDivisa;
              // console.log(productoInfo);
              if (this.numeroValido(currentRow[37])) productoInfo.audifonos = currentRow[37];
              if (this.numeroValido(currentRow[58])) productoInfo.tarifaCientifica = currentRow[58];
              if (this.numeroValido(currentRow[38])) productoInfo.guiaAcademico = currentRow[38];
              if (this.numeroValido(currentRow[56])) productoInfo.choferGuia = currentRow[56];
              if (this.numeroValido(currentRow[57])) productoInfo.choferGuiaMaximun = currentRow[57];
              if (this.numeroValido(currentRow[93])) productoInfo.horaExtraGuia = currentRow[93];
              if (this.cleanString(currentRow[102]) == "ok") productoInfo.reserva2Meses = true;
              productoInfo.link = currentRow[124];
              if (this.numeroValido(currentRow[125])) productoInfo.com = currentRow[125];
              if (this.numeroValido(currentRow[126])) productoInfo.superiorGratuidad = currentRow[126];
              if (currentRow[127] != null) {
                if (currentRow[127].toString().split("-").length > 1) {
                  productoInfo.edadMinima = currentRow[127].toString().split("-")[0];
                  productoInfo.edadMaxima = currentRow[127].toString().split("-")[1];
                } else {
                  if (this.numeroValido(currentRow[127])) {
                    productoInfo.edadMinima = 0 ;
                    productoInfo.edadMaxima = currentRow[127]; 
                  } else {
                    productoInfo.edadMinima = 0 ;
                    productoInfo.edadMaxima = 99; 
                  }
                }
              }
             
              
              productoInfo.operadorCompra = currentRow[129];
              let tarifas = this.processTarifas(currentRow, 82);
              let entradas = this.processEntradas(currentRow, 27);
              let opciones = this.processOpciones(currentRow, 39, 2);
              let horarios = this.processHorarios(currentRow, 16);
              let transporte = this.processTransporteTourPrivadoEnTransporte(currentRow);
              let diasCerrados = this.processDiasCerrados(currentRow, 13);
              let subcategorias = this.processSubcategorias(currentRow, 103, 2);
              let incrementos = this.processIncrementos(currentRow, 94, 1);
              this.toursPrivadosEnTransporte.push([producto, productoInfo, tarifas, entradas, opciones, horarios, diasCerrados, transporte, subcategorias, incrementos]);
              if (this.toursPrivadosEnTransporte.length == (this.toursPrivadosEnTransporteDataFull.length - 3)) {
                this.processToursEnGrupo();
              }


            } else {
              this.reset();
              this.alertError(`La divisa ${currentRow[22]} no existe (Fila: ${rowNumber + 2} Columna: 23 )`, "tours privados en transporte");
            }
          }
        );
        break;
      
      
      case 3:
       // console.log("Procesando un grupo");
        productoInfo.frasesGoogle = currentRow[7];
        productoInfo.puntoEncuentro = currentRow[9];
        if (this.numeroValido(currentRow[10]))  productoInfo.puntuacion = currentRow[10];
        productoInfo.notas = currentRow[11];
        productoInfo.notasCruceros = currentRow[12];
        productoInfo.cancelacion = currentRow[14];
        productoInfo.incluye = currentRow[17];
        productoInfo.noIncluyeCrucero = currentRow[18];
        if (this.cleanString(currentRow[21]) == "ok") productoInfo.muelle = 1;
        this.divisasService.listByName(currentRow[22]).subscribe(
          (divisa: any) => {
            // console.log("Divisa en productos");
            // console.log(divisa);
            if (divisa != -1) {
              productoInfo.idDivisa = divisa.idDivisa;
              // console.log(productoInfo);
              if (this.numeroValido(currentRow[27])) productoInfo.tarifaCientifica = currentRow[27];
              productoInfo.link = currentRow[74];
              if (this.numeroValido(currentRow[75])) productoInfo.com = currentRow[75];
              if (this.numeroValido(currentRow[76])) productoInfo.superiorGratuidad = currentRow[76];
              if (currentRow[77] != null) {
                if (currentRow[77].toString().split("-").length > 1) {
                  productoInfo.edadMinima = currentRow[77].toString().split("-")[0];
                  productoInfo.edadMaxima = currentRow[77].toString().split("-")[1];
                }else {
                  if (this.numeroValido(currentRow[77])) {
                    productoInfo.edadMinima = 0 ;
                    productoInfo.edadMaxima = currentRow[77]; 
                  } else {
                    productoInfo.edadMinima = 0 ;
                    productoInfo.edadMaxima = 99; 
                  }                }
              }
              
              productoInfo.operadorCompra = currentRow[78];
              if (this.cleanString(currentRow[24]) == "ok" || this.cleanString(currentRow[24]) == "si") productoInfo.freeTour = true;
              if (this.numeroValido(currentRow[28])) productoInfo.minimoMenor = currentRow[28];
              if (this.numeroValido(currentRow[29])) productoInfo.maximoMenor = currentRow[29];
              if (this.numeroValido(currentRow[30]) ) productoInfo.tarifaMenor = currentRow[30];
              let opciones = this.processOpciones(currentRow, 41, 3);
              let horarios = this.processHorarios(currentRow, 16);
              let diasCerrados = this.processDiasCerrados(currentRow, 13);
              let transportes = this.processTransporteToursEnGrupo(currentRow);
              let subcategorias = this.processSubcategorias(currentRow, 53, 3);
              let incrementos = this.processIncrementos(currentRow, 33, 1);
             // console.log(producto);
              this.toursEnGrupo.push([producto, productoInfo, opciones, horarios, diasCerrados, transportes, subcategorias, incrementos]);
              if (this.toursEnGrupo.length == (this.toursEnGrupoDataFull.length - 3)) {
                //console.log(this.toursEnGrupo);
                this.processActividades();
              }
            } else {
              this.reset();
              this.alertError(`La divisa ${currentRow[22]} no existe (Fila: ${rowNumber + 2} Columna: 23 )`, "tours en grupo");
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
            // console.log("Divisa en productos");
            // console.log(divisa);
            if (divisa != -1) {
              productoInfo.idDivisa = divisa.idDivisa;
              // console.log(productoInfo);
              if (this.numeroValido(currentRow[24]) ) productoInfo.tarifaCientifica = currentRow[24];
              if (this.numeroValido(currentRow[43])) productoInfo.guiaEspecializado = currentRow[43];
              console.log(currentRow);
              console.log(currentRow[44]);
              if (this.nombreValido(currentRow[44])) {
                if (this.numeroValido(currentRow[44])) {
                  productoInfo.audioguia = currentRow[44];
                } else {
                  let regex = /(\d+)/g;
                let tarifaAudioguia = currentRow[44].match(regex);
                  if (tarifaAudioguia != null) {
                    productoInfo.audioguia = tarifaAudioguia;
                  }
                 }
                
              };

              productoInfo.link = currentRow[71];
              if (this.numeroValido(currentRow[72])) productoInfo.com = currentRow[72];
              if (this.numeroValido(currentRow[73])) productoInfo.superiorGratuidad = currentRow[73];
              if (currentRow[74] != null) {
                if (currentRow[74].toString().split("-").length  > 1) {
                  productoInfo.edadMinima = currentRow[74].toString().split("-")[0];
                  productoInfo.edadMaxima = currentRow[74].toString().split("-")[1];
                }else {
                  if (this.numeroValido(currentRow[74])) {
                    productoInfo.edadMinima = 0 ;
                    productoInfo.edadMaxima = currentRow[74]; 
                  } else {
                    productoInfo.edadMinima = 0 ;
                    productoInfo.edadMaxima = 99; 
                 }
                }
              }
              
              productoInfo.operadorCompra = currentRow[75];
              if (this.numeroValido(currentRow[25])) productoInfo.minimoMenor = currentRow[25];
              if (this.numeroValido(currentRow[26])) productoInfo.maximoMenor = currentRow[26];
              if (this.numeroValido(currentRow[27])) productoInfo.tarifaMenor = currentRow[27];
              let opciones = this.processOpciones(currentRow, 28, 4);
              let horarios = this.processHorarios(currentRow, 16);
              let diasCerrados = this.processDiasCerrados(currentRow, 13);
              let transportes = this.processTransporteActividades(currentRow);
              let subcategorias = this.processSubcategorias(currentRow, 50, 4);
              this.actividades.push([producto, productoInfo, opciones, horarios, diasCerrados, transportes, subcategorias]);
              //console.log(this.actividades);
              if (this.actividades.length == (this.actividadesDataFull.length - 3)) {
                this.saveTraslados();
              }   

            } else {
              this.reset();
              this.alertError(`La divisa ${currentRow[22]} no existe (Fila: ${rowNumber + 2} Columna: 23 )`, "actividades");
            }
          });
        break;
    }
  }

  reset() {
    $("#txtFileUploadCYC").val('');
    this.cancelled = true;
    this.procesar = false;
    this.trasladosDataFull = [];
    this.traslados = [];


    this.disposicionesDataFull = [];
    this.disposiciones = [];
    this.disposicionesFinales = [];

    this.toursPrivadosAPieDataFull = [];
    this.toursPrivadosAPie = [];

    this.toursPrivadosEnTransporteDataFull = [];
    this.toursPrivadosEnTransporte = [];
    
    this.toursEnGrupoDataFull = [];
    this.toursEnGrupo = [];
  

    $("#modalLoading").modal("close");
  }

  processHorarios(currentRow, row) {
    let horarios = [];

    if (currentRow[row] != null) {
      let h = currentRow[row].toString().split("\n");
      //console.log(currentRow);
      //console.log("horarios",h);
      if (h.length > 1) {
        //console.log("Entrando condición 1....");
  
        h.forEach(hour => {
          let horario = new ProductoHorario();
          horario.hora = hour.replace(/ /g, "") + ":00";
          horarios.push(horario);
        });
      } else {
        let regexp = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/g;
        if (h[0].toString().split("-").length > 1 && !h[0].includes("GMT") ) {
          //console.log("Hora formato hh:mm - hh:mm");
          let horario = new ProductoHorario();
          horario.hora = h[0].toString().split("-")[0].replace(/ /g, "") + ":00";
          horarios.push(horario);
          horario = new ProductoHorario();
          horario.hora = h[0].toString().split("-")[1].replace(/ /g, "") + ":00";
          horarios.push(horario);
        }else if (regexp.test(h[0])) {
          //console.log("Hora formato hh:mm");
          let horario = new ProductoHorario();
          horario.hora = h[0].replace(/ /g, "") + ":00";
          horarios.push(horario);
        } else if (this.numeroValido(h[0])) {
         // console.log("Hora formato decimal");
          h[0] = (h[0] * 86400) / 60 / 60
          var n = new Date(0, 0);
          n.setSeconds(+h[0] * 60 * 60);
          let horario = new ProductoHorario();
          horario.hora = n.toTimeString().slice(0, 8);
          horarios.push(horario);
        } else {
          // console.log("Hora formato fecha");
           console.log("h[0]",h[0]);
           console.log("new Date(h[0]",new Date(h[0]));           
          let horario = new ProductoHorario();
          horario.hora = this.datePipe.transform(
              new Date(h[0]),
              "hh:mm"
          );
         //  console.log(horario)
          horarios.push(horario); 
        }
        
        
      }
     
    }
    return horarios;

    
   
  }

  isCommaDecimalNumber(value) {
    return /^-?(?:\d+(?:,\d*)?)$/.test(value);
  }

  
  processTarifas(currentRow, startRow) {
    let tarifas = [];
    for (let index = 0; index <= 10; index++) {
      if (this.cleanString(currentRow[startRow + index]) != "n/a") {
        let productoTarifa = new ProductoTarifa();
        productoTarifa.numPersonas = index + 1;
        if(this.numeroValido(currentRow[startRow + index])) productoTarifa.tarifa = currentRow[startRow + index];
        
        tarifas.push(productoTarifa);
      }
    }
    return tarifas;
  }

  processEntradas(currentRow, startRow) {
    let entradas = [];
    if ( this.nombreValido(currentRow[startRow])) {
      let productoEntrada = new ProductoEntrada();
//      productoEntrada.nombre = currentRow[startRow].replaceAll("'","’");
      productoEntrada.nombre = currentRow[startRow].replace(/'/g,"’");
      if (this.numeroValido(currentRow[startRow + 1])) productoEntrada.tarifaAdulto = currentRow[startRow + 1];
      if (this.numeroValido(currentRow[startRow + 2])) productoEntrada.minimoMenor = currentRow[startRow + 2];
      if (this.numeroValido(currentRow[startRow + 3])) productoEntrada.maximoMenor = currentRow[startRow + 3];
      if (this.numeroValido(currentRow[startRow + 4])) productoEntrada.tarifaMenor = currentRow[startRow + 4];
      entradas.push(productoEntrada);
    }

    let startRow2 = startRow + 5;

    if (this.nombreValido(currentRow[startRow2])) {
      let productoEntrada = new ProductoEntrada();
//      productoEntrada.nombre = currentRow[startRow2].toString().replaceAll("'","’");
      productoEntrada.nombre = currentRow[startRow2].toString().replace(/'/g,"’");
      if (this.numeroValido(currentRow[startRow2 + 1])) productoEntrada.tarifaAdulto = currentRow[startRow2 + 1];
      if (this.numeroValido(currentRow[startRow2 + 2])) productoEntrada.minimoMenor = currentRow[startRow2 + 2];
      if (this.numeroValido(currentRow[startRow2 + 3])) productoEntrada.maximoMenor = currentRow[startRow2 + 3];
      if (this.numeroValido(currentRow[startRow2 + 4])) productoEntrada.tarifaMenor = currentRow[startRow2 + 4];
      entradas.push(productoEntrada);
    }
    return entradas;
  }








  processOpciones(currentRow, startRow, categoria) {
    let opciones = [];
    if (this.nombreValido(currentRow[startRow])) {
      let productoOpcion = new ProductoOpcion();
      //      productoOpcion.nombre = currentRow[startRow].toString().replaceAll("'","’");;
      productoOpcion.nombre = currentRow[startRow].toString().replace(/'/g,"’");;
      if (this.numeroValido(currentRow[startRow + 1])) productoOpcion.tarifaAdulto = currentRow[startRow + 1];
      if (this.numeroValido(currentRow[startRow + 2])) productoOpcion.minimoMenor = currentRow[startRow + 2];
      
      if (this.numeroValido(currentRow[startRow + 3])) productoOpcion.maximoMenor = currentRow[startRow + 3];
      if (this.numeroValido(currentRow[startRow + 4]) ) productoOpcion.tarifaMenor = currentRow[startRow + 4];
    
      if (categoria == 1 || categoria == 3) {
        if (this.numeroValido(currentRow[startRow + 5])) productoOpcion.horasExtras = currentRow[startRow + 5];
      }
      if (categoria == 3) {
        if (this.numeroValido(currentRow[startRow + 6])) productoOpcion.horaExtraChofer = currentRow[startRow + 6];

      }
      opciones.push(productoOpcion);
    }

    let startRow2 = 0;

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

    if (this.nombreValido(currentRow[startRow2])) {
      let productoOpcion = new ProductoOpcion();
      //console.log("nombre del producto", currentRow[startRow2]);
//      productoOpcion.nombre = currentRow[startRow2].toString().replaceAll("'","’");
      productoOpcion.nombre = currentRow[startRow2].toString().replace(/'/g,"’");;
      if (this.numeroValido(currentRow[startRow2 + 1])) productoOpcion.tarifaAdulto = currentRow[startRow2 + 1];
      if (this.numeroValido(currentRow[startRow2 + 2])) productoOpcion.minimoMenor = currentRow[startRow2 + 2];
      if (this.numeroValido(currentRow[startRow2 + 3])) productoOpcion.maximoMenor = currentRow[startRow2 + 3];
      if (this.numeroValido(currentRow[startRow2 + 4])) productoOpcion.tarifaMenor = currentRow[startRow2 + 4];
      if (categoria == 1 || categoria == 3) {
        if (this.numeroValido(currentRow[startRow2 + 5])) productoOpcion.horasExtras = currentRow[startRow2 + 5];
      }

      if (categoria == 3) {
        if (this.numeroValido(currentRow[startRow2 + 6])) productoOpcion.horaExtraChofer = currentRow[startRow2 + 6];

      }


      opciones.push(productoOpcion);
    }

    
    if (categoria == 4) { //Las actividades tienen 3 opciones
      let startRow3 = startRow2 + 5;
      console.log("procesando opcion 3 en actividades");
      console.log("nombre del producto", currentRow[startRow3]);

      if (this.nombreValido(currentRow[startRow3])) {
        let productoOpcion = new ProductoOpcion();
      //  console.log("nombre del producto", currentRow[startRow3]);
//        productoOpcion.nombre = currentRow[startRow3].toString().replaceAll("'","’");;
        productoOpcion.nombre = currentRow[startRow3].toString().replace(/'/g,"’");;
        if (this.numeroValido(currentRow[startRow3 + 1])) productoOpcion.tarifaAdulto = currentRow[startRow3 + 1];
        if (this.numeroValido(currentRow[startRow3 + 2])) productoOpcion.minimoMenor = currentRow[startRow3 + 2];
        if (this.numeroValido(currentRow[startRow3 + 3])) productoOpcion.maximoMenor = currentRow[startRow3 + 3];
        if (this.numeroValido(currentRow[startRow3 + 4])) productoOpcion.tarifaMenor = currentRow[startRow3 + 4];
        console.log(productoOpcion);
        opciones.push(productoOpcion);
      }
    }
    return opciones;
  }


  processDiasCerrados(currentRow, row) {
    let diasCerrados = [];
    if (currentRow[row]!= null) {
      let dc = currentRow[row].split("\n");
    dc.forEach(diaCerrado => {
      if (diaCerrado.includes("lu") || diaCerrado.includes("ma") || diaCerrado.includes("mi") || diaCerrado.includes("ju") || diaCerrado.includes("vi") || diaCerrado.includes("sa") || diaCerrado.includes("do")) {
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
            let startDate = diaCerrado.split("-")[0].trim() + "/" + new Date().getFullYear();
            let stopDate = diaCerrado.split("-")[1].trim() + "/" + new Date().getFullYear();
            let diasCC = this.getDatesBetween2Dates(`${(startDate).split("/")[1]}-${(startDate).split("/")[0]}-${(startDate).split("/")[2]}`, `${(stopDate).split("/")[1]}-${(stopDate).split("/")[0]}-${(stopDate).split("/")[2]}`);
            diasCC.forEach(dia => {
              let diaC = new ProductoDiaCerrado();
              diaC.fecha = dia;
              diasCerrados.push(diaC);
            });
          } else if (diaCerrado.split("al").length > 1) {
            let startDate = diaCerrado.split("al")[0].trim() + "/" + new Date().getFullYear();
            let stopDate = diaCerrado.split("al")[1].trim() + "/" + new Date().getFullYear();
            let diasCC = this.getDatesBetween2Dates(`${(startDate).split("/")[1]}-${(startDate).split("/")[0]}-${(startDate).split("/")[2]}`, `${(stopDate).split("/")[1]}-${(stopDate).split("/")[0]}-${(stopDate).split("/")[2]}`);
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
   }
    return diasCerrados;
  }

  processSubcategorias(currentRow, startRow, categoria) {
    let subcategorias = [];
    for (let index = startRow; index < (startRow + 21); index++) {
      if (index == (startRow + 12)) {
       if(categoria ==1) this.toursPrivadosAPieDataFull[2][index] = "Excursiones de cruceros en grupo";
        if(categoria ==2) this.toursPrivadosEnTransporteDataFull[2][index] = "Excursiones de cruceros en grupo";
        if(categoria ==3) this.toursEnGrupoDataFull[2][index] = "Excursiones de cruceros en grupo";
        if(categoria ==4) this.actividadesDataFull[2][index] = "Excursiones de cruceros en grupo";
      }

      if (index == (startRow + 13)) {
        if(categoria ==1) this.toursPrivadosAPieDataFull[2][index] = "Excursiones de cruceros en privado";
        if(categoria ==2) this.toursPrivadosEnTransporteDataFull[2][index] = "Excursiones de cruceros en privado";
        if(categoria ==3) this.toursEnGrupoDataFull[2][index] = "Excursiones de cruceros en privado";
        if(categoria ==4) this.actividadesDataFull[2][index] = "Excursiones de cruceros en privado";
      }

      if (index == (startRow + 15)) {
        if(categoria ==1) this.toursPrivadosAPieDataFull[2][index] = "Segunda vez en el muelle de cruceros";
        if(categoria ==2) this.toursPrivadosEnTransporteDataFull[2][index] = "Segunda vez en el muelle de cruceros";
        if(categoria ==3) this.toursEnGrupoDataFull[2][index] = "Segunda vez en el muelle de cruceros";
        if(categoria ==4) this.actividadesDataFull[2][index] = "Segunda vez en el muelle de cruceros";

      }

      if (this.cleanString(currentRow[index]) == "ok") {
        
        switch (categoria) {
          case 1:
            // console.log(this.toursPrivadosAPieDataFull[2][index], this.subcategorias.find(s => this.cleanString(s.nombre) == this.cleanString(this.toursPrivadosAPieDataFull[2][index])));
            subcategorias.push(this.subcategorias.find(s => this.cleanString(s.nombre) == this.cleanString(this.toursPrivadosAPieDataFull[2][index])));
            break;
        
          case 2:
            // console.log(this.toursPrivadosEnTransporteDataFull[2][index], this.subcategorias.find(s => this.cleanString(s.nombre) == this.cleanString(this.toursPrivadosEnTransporteDataFull[2][index])));
            subcategorias.push(this.subcategorias.find(s => this.cleanString(s.nombre) == this.cleanString(this.toursPrivadosEnTransporteDataFull[2][index])));
            break;
          
          case 3:
            // console.log(this.toursEnGrupoDataFull[2][index], this.subcategorias.find(s => this.cleanString(s.nombre) == this.cleanString(this.toursEnGrupoDataFull[2][index])));
            subcategorias.push(this.subcategorias.find(s => this.cleanString(s.nombre) == this.cleanString(this.toursEnGrupoDataFull[2][index])));
            break;
          case 4:
            // console.log(this.actividadesDataFull[2][index], this.subcategorias.find(s => this.cleanString(s.nombre) == this.cleanString(this.actividadesDataFull[2][index])));
            subcategorias.push(this.subcategorias.find(s => this.cleanString(s.nombre) == this.cleanString(this.actividadesDataFull[2][index])));
            break;
        }
      }

    }
    // console.log(subcategorias);
    return subcategorias;
    
  }

  saveTraslados() {
    console.log("Traslados",this.traslados);
    this.textPreloader = "Guardando traslados...";

    this.trasladosService.create_fromList(this.traslados).subscribe(
      res => {
        this.textPreloader = "traslados en guardados correctamente...";

        this.saveDisposiciones();

      }
      , err => {
        this.reset();
        this.error = err.error.error;
        console.log(err);
        $("#modalError").modal("open");
      });

   
    
  }


  saveDisposiciones() {
    console.log("Disposiciones",this.disposiciones);
    this.textPreloader = "Guardando disposiciones...";
    console.log(this.textPreloader);

    this.disposicionesService.createDataComplete(this.disposicionesFinales).subscribe(
      res => {
        this.textPreloader = "Disposiciones de chófer guardadas correctamente...";
        this.saveToursPrivadosAPie();
      }
      , err => {
        this.reset();
        this.error = err.error.error;
        console.log(err);
        $("#modalError").modal("open");
      });
  }





  saveToursPrivadosAPie() {
    this.textPreloader = "Guardando tours privados a pie...";
    console.log(this.textPreloader);

    console.log("Tours privados a pie",this.toursPrivadosAPie);
    this.productosService.createTPAP_fromList(this.toursPrivadosAPie).subscribe(
      res => {
        this.textPreloader = "Tours privados a pie guardados correctamente...";
        this.saveToursPrivadosEnTransporte();
      }
      , err => {
        this.reset();
        this.error = err.error.error;
        console.log(err);
        $("#modalError").modal("open");
      });
  }


  saveToursPrivadosEnTransporte() {
    this.textPreloader = "Guardando tours privados en transporte...";
    console.log(this.textPreloader);

    console.log("Tours privados en transporte",this.toursPrivadosEnTransporte);
    this.productosService.createTPET_fromList(this.toursPrivadosEnTransporte).subscribe(
      res => {
        console.log("Salvando los torus en transporte");
        console.log(res);
        this.saveToursEnGrupo();
        this.textPreloader = "Tours privados en transporte guardados correctamente...";

      }
      , err => {
        console.log("No se puedo salvar tours privados en transporte");
        this.reset();
        this.error = err.error.error;
        console.log(err);
        $("#modalError").modal("open");
      });
  }

  saveToursEnGrupo() {
    this.textPreloader = "Guardando tours en grupo...";
    console.log(this.textPreloader);

    console.log("tours en grupo",this.toursEnGrupo);
    this.productosService.createTEG_fromList(this.toursEnGrupo).subscribe(
      res => {
        this.saveActividades();
        this.textPreloader = "Tours en grupo guardados correctamente...";

      }
      , err => {
        this.reset();
        this.error = err.error.error;
        console.log(err);
        $("#modalError").modal("open");
      });
  }

  saveActividades() {
    this.textPreloader = "Guardando actividades...";
    console.log("Actividades",this.actividades);
    this.productosService.createActividad_fromList(this.actividades).subscribe(
      res => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Archivo procesado correctamente",
          showConfirmButton: true,
        });
        this.reset();


      }, err => {
        this.reset();
        this.error = err.error.error;
        console.log(err);
        $("#modalError").modal("open");
      });
  }


  processIncrementos(curruntRecord, startRow, tipoActividad) {
  
    let incrementos = [];
    if (this.cleanString(curruntRecord[startRow]) != "n/a") {
      let incremento = new Incremento();
      incremento.tipoActividad = tipoActividad;
      incremento.tipo = this.getTipoIncremento(curruntRecord[startRow + 1]); //Es del tipo reloj, calendario o periodo
//      incremento.nombre = curruntRecord[startRow].replaceAll("'","’");;
      incremento.nombre = curruntRecord[startRow].replace(/'/g,"’");;
      if (this.numeroValido(curruntRecord[startRow + 3])) incremento.porcentaje = curruntRecord[startRow + 3];
      incrementos.push(this.processDetalleIncremento(incremento, curruntRecord, 1, startRow));
    }

    let startRow2 = startRow + 4;

    if (this.cleanString(curruntRecord[startRow2]) != "n/a") {
      let incremento = new Incremento();
      incremento.tipoActividad = tipoActividad;
      incremento.tipo = this.getTipoIncremento(curruntRecord[startRow2 + 1]); //Es del tipo reloj, calendario o periodo
//      incremento.nombre = curruntRecord[startRow2].replaceAll("'","’");;
      incremento.nombre = curruntRecord[startRow2].replace(/'/g,"’");;
      if (this.numeroValido(curruntRecord[startRow2 + 3])) incremento.porcentaje = curruntRecord[startRow2 + 3];
      incrementos.push(this.processDetalleIncremento(incremento, curruntRecord, 2, startRow2));
    }

    return incrementos;
  }


  processDetalleIncremento(incremento: Incremento, curruntRecord, numeroIncremento, currentRow) {
    let indexDetalle = currentRow + 2;
    console.log("detalle increento", curruntRecord[indexDetalle]);

    if (curruntRecord[indexDetalle] != null) {
      if (incremento.tipo == 1) {//Se llena horasIncrementos
        let horasIncremento = [];
        let listHoras = curruntRecord[indexDetalle].split("\n");
        for (let index = 0; index < listHoras.length; index++) {
          let h1 = listHoras[index].split("-")[0];
          let h2 = listHoras[index].split("-")[1];
  
          let horaIncremento = new incrementoHora();
          if (h2 < h1) {
            horaIncremento = new incrementoHora();
            horaIncremento.horaInicial = h1.replace(/ /g, "");
            horaIncremento.horaFinal = "23:59"
            horaIncremento.idIncremento = incremento.idIncremento;
            horasIncremento.push(horaIncremento);
  
  
            horaIncremento = new incrementoHora();
            horaIncremento.horaInicial = "00:00";
            horaIncremento.horaFinal = h2.replace(/ /g, "");
            horaIncremento.idIncremento = incremento.idIncremento;
            horasIncremento.push(horaIncremento);
  
  
          } else {
            horaIncremento = new incrementoHora();
            horaIncremento.horaInicial = h1.replace(/ /g, "");
            horaIncremento.horaFinal = h2.replace(/ /g, "");
            horaIncremento.idIncremento = incremento.idIncremento;
            horasIncremento.push(horaIncremento);
  
          }
        }
  
        return [incremento, horasIncremento];
  
      } else {//Se llena fechasIncrementos
  
        let fechasIncremento = [];
//        curruntRecord[indexDetalle] = curruntRecord[indexDetalle].replaceAll("al", "-");
  //      curruntRecord[indexDetalle] = curruntRecord[indexDetalle].replace(/ /g, "");
        curruntRecord[indexDetalle] = curruntRecord[indexDetalle].replace(/al/g, "-");
        curruntRecord[indexDetalle] = curruntRecord[indexDetalle].replace(/ /g, "");
        let listFechas = curruntRecord[indexDetalle].split("\n");
  
        for (let index = 0; index < listFechas.length; index++) {
  
          if (listFechas[index].split("-" || "–").length == 2) {
            let fechaIncremento = new IncrementoFecha();
            fechaIncremento.fechaInicial = this.getFechaConFormato(listFechas[index].split("-" || "–")[0]);
            fechaIncremento.fechaFinal = this.getFechaConFormato(listFechas[index].split("-" || "–")[1]);
            fechasIncremento.push(fechaIncremento);
  
          } else if (listFechas[index].split("-" || "–").length == 1 && listFechas[index].length > 4) {
            let fechaIncremento = new IncrementoFecha();
            fechaIncremento.fechaInicial = this.getFechaConFormato(listFechas[index]);
            fechaIncremento.fechaFinal = this.getFechaConFormato(listFechas[index]);
            fechasIncremento.push(fechaIncremento);
          }
  
        }
  
        return [incremento, fechasIncremento];
      }
    } else {
      return [incremento, []];
    }

    

  }

  processTransporteTourPrivadoEnTransporte(currentRow) {
    let transportes: any[] = [];
    for (let index = 59; index < 71; index++) {
      let nombre = this.toursPrivadosEnTransporteDataFull[2][index];
//      nombre = nombre.replaceAll("Opción", "");
//      nombre = nombre.replaceAll("Coche", "");
      nombre = nombre.replace(/Opción/g, "");
      nombre = nombre.replace(/Coche/g, "");

      if (this.cleanString(nombre) == "transportepublico") {
        if (this.cleanString(currentRow[index]) != "n/a") {
          let transporte = new ProductoTransporte();
          transporte.idVehiculo = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString(nombre)).idVehiculo;
          transporte.noPersonas = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString(nombre)).pasajerosMax;
          if(this.numeroValido(currentRow[index])) transporte.tarifa = currentRow[index];
          transportes.push(transporte);
        }
      } else {
        if (this.cleanString(currentRow[index]) != "n/a") {
          let transporte = new ProductoTransporte();
          if (this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString(nombre)) != undefined) {
            transporte.idVehiculo = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString(nombre)).idVehiculo;
            transporte.noPersonas = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString(nombre)).pasajerosMax;
            if(this.numeroValido(currentRow[index])) transporte.tarifa = currentRow[index];
            if(this.numeroValido(currentRow[index + 11])) transporte.horasExtras = currentRow[index + 11];
            transportes.push(transporte);
          } else {
            this.reset();
            this.alertError(`El vehiculo ${nombre.trim()} no existe en la base de datos. Agrégalo desde el administrador (seción de "vehiculos")`, "tour privado en transporte");
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
      if (this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("Taxi en Sedan")) != undefined) {
        transporte.idVehiculo = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("Taxi en Sedan")).idVehiculo;
        if(this.numeroValido(currentRow[31])) transporte.tarifa = currentRow[31];
        transporte.noPersonas = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("Taxi en Sedan")).pasajerosMax;
        transportes.push(transporte);
      } else {
        this.reset();
        this.alertError(`El vehiculo S no existe en la base de datos. Agrégalo desde el administrador (seción de "vehiculos")`, "tour privado en transporte");
      }
    }

    if (this.cleanString(currentRow[32]) != "n/a") {
      let transporte = new ProductoTransporte();
      if (this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("Taxi en Minivan")) != undefined) {
        transporte.idVehiculo = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("Taxi en Minivan")).idVehiculo;
        if(this.numeroValido(currentRow[32])) transporte.tarifa = currentRow[32];
        transporte.noPersonas = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("Taxi en Minivan")).pasajerosMax;
        transportes.push(transporte);
      } else {
        this.reset();
        this.alertError(`El vehiculo Taxi en Minivan no existe en la base de datos. Agrégalo desde el administrador (seción de "vehiculos")`, "tour privado en transporte");
      }
    }

    return transportes;

    
  }


  

  getDatesBetween2Dates(startDate, stopDate) {
    const dateArray = [];
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(stopDate)) {
     
      dateArray.push(this.datePipe.transform(
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
      if (this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("Taxi en Sedan")) != undefined) {
        transporte.idVehiculo = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("Taxi en Sedan")).idVehiculo;
        if(this.numeroValido(currentRow[45]))  transporte.tarifa = currentRow[45];
        transporte.noPersonas = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("Taxi en Sedan")).pasajerosMax;
        transportes.push(transporte);
      } else {
        this.reset();
        this.alertError(`El vehiculo Taxi en Sedan no existe en la base de datos. Agrégalo desde el administrador (seción de "vehiculos")`, "actividades");
      }
    }

    if (this.cleanString(currentRow[46]) != "n/a") {
      let transporte = new ProductoTransporte();
      if (this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("Taxi en Minivan")) != undefined) {
        transporte.idVehiculo = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("Taxi en Minivan")).idVehiculo;
        transporte.tarifa = currentRow[46];
        transporte.noPersonas = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("Taxi en Minivan")).pasajerosMax;
        transportes.push(transporte);
      } else {
        this.reset();
        this.alertError(`El vehiculo Taxi en Minivan no existe en la base de datos. Agrégalo desde el administrador (seción de "vehiculos")`, "tour privado en transporte");
      }
    }
    return transportes;
  }

  
  processTraslados() {
    this.textPreloader = "Procesando traslados en...";
    console.log(this.textPreloader);

    if (this.sheetValid(this.trasladosDataFull, "traslados")) 
    {
      console.log("---------------------------------------Validos");
      console.log("Traslados",this.trasladosDataFull);

      let indexValid = this.indexValid(this.trasladosDataFull);
      console.log(indexValid);
      this.trasladosDataFull.forEach((currentValue, index) => {
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@",currentValue, index);
          
          if ( index > indexValid ) 
          {
          this.processModelTraslado(currentValue, index);
          console.log("currentValue",currentValue);
        }
      });
    } else 
    {
      console.log("---------------------------------------Invalidos");
      this.processDisposiciones();
    }
  }



  processModelTraslado(currentRow, rowNumber) {
    console.log("processModelTraslado",currentRow[2], currentRow[1])
    let traslado = new Traslado();
    console.log(traslado);
    this.ciudadesService.listByNameCityNameCountry(currentRow[2], currentRow[1]).subscribe(
      (ciudad: any) => {
        console.log("respues ",ciudad);
        if (ciudad != -1) {
          console.log("ciudad",ciudad);
          traslado.idCiudad = ciudad;
          let nombreDesde;
          traslado.desdeOriginal = currentRow[3];
          traslado.haciaOriginal = currentRow[5];
          currentRow[4]=currentRow[4].toString();
          currentRow[3]=currentRow[3].toString();
          console.log(traslado.desdeOriginal,traslado.haciaOriginal,currentRow[4]);
//          (this.cleanString(currentRow[4]) != "n/a") ? nombreDesde = currentRow[4].toString().replaceAll("'","’") : nombreDesde = currentRow[3].replaceAll("'","’");
          (this.cleanString(currentRow[4]) != "n/a") ? nombreDesde = currentRow[4].toString().replace(/'/,"’") : nombreDesde = currentRow[3].replace(/'/,"’");

          
          if (this.cleanString(nombreDesde) != "direccionespecifica") 
          {
            this.lugaresService.listByName(nombreDesde).subscribe(
              (lugar: any) => {
                if (lugar != -1) {
                  console.log("desde base de datos");
                  console.log(lugar);
                  traslado.idDesde = lugar.idLugar;
                  this.continueProcessingHacia(currentRow, rowNumber, traslado);
  
                } else {
                  console.log("desde insertar");
                  let lugar = new Lugar();
                  lugar.nombre = nombreDesde;
                  console.log(lugar);
                  this.lugaresService.create(lugar).subscribe(
                    (respLugar: any) => {
                      console.log(respLugar);
                      traslado.idDesde = respLugar.insertId;
                      this.continueProcessingHacia(currentRow, rowNumber, traslado);
                    }
                  );
                }
              });
          } else {
            traslado.idDesde = -1;
            this.continueProcessingHacia(currentRow, rowNumber, traslado);
          }
          
        } else {
          this.reset();
          this.alertError(`La ciudad ${currentRow[2]} del pais ${currentRow[1]} no existe (Fila: ${rowNumber + 2} Columna: 3 )`, "Traslados");
          
        }
      });
      console.log("Terminando processModelTraslado ******************");

  }


  continueProcessingHacia(currentRow, rowNumber, traslado: Traslado) {
    let nombreHacia;
//    (this.cleanString(currentRow[6]) != "n/a") ? nombreHacia = currentRow[6].replaceAll("'","’") : nombreHacia = currentRow[5].replaceAll("'","’");
    (this.cleanString(currentRow[6]) != "n/a") ? nombreHacia = currentRow[6].replace(/'/g,"’") : nombreHacia = currentRow[5].replace(/'/g,"’");

    console.log("continueProcessingHacia********************************","hacia", nombreHacia);
    if (this.cleanString(nombreHacia) != "direccionespecifica") {
      this.lugaresService.listByName(nombreHacia).subscribe(
        (lugar: any) => {
          if (lugar != -1) {
           // console.log("hacia",lugar);
            traslado.idHacia = lugar.idLugar;
            this.continueProcessingTraslado(currentRow, rowNumber, traslado);
  
          } else {
            let lugar = new Lugar();
            lugar.nombre = nombreHacia;
            this.lugaresService.create(lugar).subscribe(
              (respLugar: any) => {
               // console.log("hacia",respLugar);
  
                traslado.idHacia = respLugar.insertId;
                this.continueProcessingTraslado(currentRow, rowNumber, traslado);
              }
            );
          }
        });
    } else {
      traslado.idHacia = -1;
      this.continueProcessingTraslado(currentRow, rowNumber, traslado);
    }
    
  }

  continueProcessingTraslado(currentRow, rowNumber, traslado: Traslado) {
    if (this.cleanString(currentRow[5]) != "otraciudad") { // Verifica si el traslado es a otra ciudad
      traslado.otraCiudad = 0;
    } else {
      traslado.otraCiudad = 1;
    }
    
    traslado.cancelaciones = currentRow[29];
    if (this.cleanString(currentRow[34]) == "n/a") {  //Verifica si se puede trasladar desde el muelle
      traslado.muelle = 0;
    } else {
      traslado.muelle = 1;
    }
    if (this.numeroValido(currentRow[35])) traslado.comision = parseFloat(currentRow[35]); //Obtiene la comision 
    let costos = this.processCostosTraslado(currentRow, rowNumber, traslado);
    let incrementos = this.processIncrementos(currentRow, 20, 2);
    this.traslados.push([traslado, costos, incrementos]);
    this.verifyTraslados();

  }


  processCostosTraslado(currentRow, rowNumber, traslado: Traslado) {
    let costos = [];
    for (let index = 9; index <= 19; index++) {
      let trasladoCosto = new Traslado_costo();

      if (!isNaN(Number(currentRow[index]))) {
        trasladoCosto.costo = currentRow[index];
        trasladoCosto.idDivisa = this.obtenerDivisa(currentRow[8]);
        trasladoCosto.notas = currentRow[28];
        trasladoCosto.idVehiculo = this.getIdVehiculoTraslados(index);
        costos.push(trasladoCosto);

      } else {
        if (this.cleanString(currentRow[index]) != "n/a") {
          if (this.cleanString(currentRow[index]) == "correo") {
            trasladoCosto.costo = -1;
            trasladoCosto.idDivisa = this.obtenerDivisa(currentRow[8]);
            trasladoCosto.notas = currentRow[31];
            trasladoCosto.idVehiculo = this.getIdVehiculoTraslados(index);
            costos.push(trasladoCosto);

          }
        }
      }

    }   


    if (this.numeroValido(currentRow[30])) {
      let trasladoCosto = new Traslado_costo();
      trasladoCosto.costo = currentRow[30];
      trasladoCosto.idDivisa = this.obtenerDivisa(currentRow[8]);
      trasladoCosto.notas = currentRow[31];
      trasladoCosto.idVehiculo = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("shuttle")).idVehiculo;
      costos.push(trasladoCosto);

    }


    if (this.numeroValido(currentRow[32])) {
      let trasladoCosto = new Traslado_costo();
      trasladoCosto.costo = currentRow[32];
      trasladoCosto.idDivisa = this.obtenerDivisa(currentRow[8]);
      trasladoCosto.notas = currentRow[33];
      trasladoCosto.idVehiculo = this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString("Bus/Metro")).idVehiculo;
      costos.push(trasladoCosto);

    }


    return costos;

  }

  obtenerDivisa(divisa: string) {
    if (this.divisas.find(d => this.cleanString(d.divisa) == this.cleanString(divisa)) != undefined) {
      return this.divisas.find(d => this.cleanString(d.divisa) == this.cleanString(divisa)).idDivisa;
    } else {
      return -1;
    }
  }


  numeroValido(string) {
    let regexp = /^[0-9]+([,.][0-9]+)?$/g;
    if (this.cleanString(string) != "n/a" && this.cleanString(string) != "no" && this.cleanString(string) != "ok" && this.cleanString(string) != "si" && regexp.test(string)) return true;
    return false;
  }

  nombreValido(string) {
    if (this.cleanString(string) != "n/a" && this.cleanString(string) != "no" && this.cleanString(string) != "ok" && this.cleanString(string) != "si") return true;
    return false;
  }


  getIdVehiculoTraslados(index) {
    return this.vehiculos.find(vehiculo => this.cleanString(vehiculo.nombre) == this.cleanString(this.trasladosDataFull[2][index])).idVehiculo;
  }

  verifyTraslados() {
    if (this.traslados.length == (this.trasladosDataFull.length - 3)) {
      this.processDisposiciones();
      console.log("verifyTraslados");
    }
  }


  sheetValid(sheet,nombre) {
    let c = 0;
    let pais=  false;
    sheet.forEach(element => {
      if (this.cleanString(element[1]) == "pais") {
        pais = true;
      }
      if (element[1] != null && pais) {

        c++;
      }
    });

    if(!pais) {
      this.alertError(`No contiene el nombre de columna "pais" colocaselo, es muy importante para determinar el inicio de los datos`,nombre );

    }


  //  console.log(c);
    return (c > 1) ? true : false;
  }


  tourValido(currentRow, index) {
    console.log("tour valido", currentRow, currentRow[index]);
    if (currentRow[index] != null) {
      return (currentRow[index].toString().toLowerCase() != ("n/a"))? true : false;
    } else {
      return false;
    }
  }

  indexValid(sheet) {

    for (let index = 0; index < sheet.length; index++) {
      if (this.cleanString(sheet[index][1]) == "pais") {
        return index;
      }
     
    }
    return -1;
  }


}
