import { Component, OnInit } from '@angular/core';
import readXlsxFile from 'read-excel-file';
import { Ciudad } from 'src/app/models/Ciudad';
import { Divisa } from 'src/app/models/Divisa';
import { Incremento } from 'src/app/models/incremento';
import { IncrementoFecha } from 'src/app/models/incrementoFecha';
import { incrementoHora } from 'src/app/models/IncrementoHora';
import { Lugar } from 'src/app/models/Lugar';
import { Traslado } from 'src/app/models/Traslado';
import { Traslado_costo } from 'src/app/models/Traslado_costo';
import { Vehiculo } from 'src/app/models/Vehiculo';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { DivisasService } from 'src/app/services/divisas.service';
import { IncrementosService } from 'src/app/services/incrementos.service';
import { LugaresService } from 'src/app/services/lugares.service';
import { PaisesService } from 'src/app/services/paises.service';
import { TrasladosService } from 'src/app/services/traslados.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-procesar-traslados',
  templateUrl: './procesar-traslados.component.html',
  styleUrls: ['./procesar-traslados.component.css']
})
export class ProcesarTrasladosComponent implements OnInit {

  public traslados: Traslado[] = [];
  public trasladosCostos: any[] = [];
  public ciudades: Ciudad[] = [];
  public ciudad: any = new Ciudad();
  public lugaresDesde: Lugar[] = [];
  public lugaresHacia: Lugar[] = [];
  public lugar: any = new Lugar();
  public vehiculos: Vehiculo[] = [];
  public incrementos: Incremento[] = [];
  public incrementosPorHora: incrementoHora[] = [];
  public incrementosPorFecha: IncrementoFecha[] = [];
  public procesar: boolean = false;
  public error: boolean = false;

  constructor(
    private paisesService: PaisesService,
    private ciudadesService: CiudadesService,
    private lugaresService: LugaresService,
    private trasladosService: TrasladosService,
    private vehiculosService: VehiculosService,
    private divisasService: DivisasService,
    private incrementosService: IncrementosService,
  ) { }

  ngOnInit(): void {
      
  }

  

  uploadListener($event: any){
    this.procesar = true;
    let files = $event.srcElement.files;
    readXlsxFile(files[0], { sheet: 1 }).then((rows) => {
      this.procesarTraslados(rows);
    });
  }

  procesarTraslados(traslados: any){
    traslados.forEach((actualTraslado, index) => {
      if(index < 3) return false;
      let traslado: any = new Traslado();
      //VALIDAR CIUDAD Y PAÍS
      this.ciudadesService.listByName(actualTraslado[2]).subscribe((ciudad: any) => {
        if(ciudad === -1){
          this.paisesService.listByName(actualTraslado[1]).subscribe((pais: any) => {
            if(pais === -1){
              this.error = true;
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: `No existe el país <strong>${actualTraslado[1]}</strong>, insértelo desde el panel de administración y cargue de nuevo su archivo`,
                showConfirmButton: true,
              });
              return false;
            }else{
              this.ciudad.idPais = pais.id;
              this.ciudad.nombre = actualTraslado[2];
              this.ciudad.presentacion = 'Ciudad Nueva';
              this.ciudad.id = index;
              this.ciudades.push(this.ciudad);
              this.ciudad = new Ciudad();
            }
          });
        }else{
          traslado.idCiudad = ciudad.idCiudad;
        }
      });
      //VALIDAR DESDE
      if(this.limpiarCadena(actualTraslado[3]) !== 'n/a' && this.limpiarCadena(actualTraslado[4]) === 'n/a'){//1-text, 2-n/a
        this.lugaresService.listByName(actualTraslado[3]).subscribe((lugar: any) => {
          if(lugar === -1){
            this.lugar.nombre = actualTraslado[3];
            this.lugar.id = index;
            this.lugaresDesde.push(this.lugar);
            this.lugar = new Lugar();
          }else{
            traslado.idDesde = lugar.idLugar;
          }
        });
      }else if(this.limpiarCadena(actualTraslado[3]) === 'n/a' && this.limpiarCadena(actualTraslado[4]) !== 'n/a'){//1-n/a, 2-text
        this.lugaresService.listByName(actualTraslado[4]).subscribe((lugar: any) => {
          if(lugar === -1){
            this.lugar.nombre = actualTraslado[4];
            this.lugar.id = index;
            this.lugaresDesde.push(this.lugar);
            this.lugar = new Lugar();
          }else{
            traslado.idDesde = lugar.idLugar;
          }
        });
      }else if(this.limpiarCadena(actualTraslado[3]) !== 'n/a' && this.limpiarCadena(actualTraslado[4]) !== 'n/a'){//1-text, 2-text
        this.lugaresService.listByName(actualTraslado[3]).subscribe((lugar: any) => {
          if(lugar === -1){
            this.lugar.nombre = actualTraslado[3];
            this.lugar.id = index;
            this.lugaresDesde.push(this.lugar);
            this.lugar = new Lugar();
          }else{
            traslado.idDesde = lugar.idLugar;
          }
        });
      }else if(this.limpiarCadena(actualTraslado[3]) === 'direccionespecifica'){//1-DirEs
        traslado.idDesde = -1;
      }
      //VALIDAR HACIA
      if(this.limpiarCadena(actualTraslado[5]) !== 'n/a' && this.limpiarCadena(actualTraslado[6]) === 'n/a'){//1-text, 2-n/a
        this.lugaresService.listByName(actualTraslado[5]).subscribe((lugar: any) => {
          if(lugar === -1){
            this.lugar.nombre = actualTraslado[5];
            this.lugar.id = index;
            this.lugaresHacia.push(this.lugar);
            this.lugar = new Lugar();
          }else{
            traslado.idHacia = lugar.idLugar;
          }
        });
      }else if(this.limpiarCadena(actualTraslado[5]) === 'n/a' && this.limpiarCadena(actualTraslado[6]) !== 'n/a'){//1-n/a, 2-text
        this.lugaresService.listByName(actualTraslado[6]).subscribe((lugar: any) => {
          if(lugar === -1){
            this.lugar.nombre = actualTraslado[6];
            this.lugar.id = index;
            this.lugaresHacia.push(this.lugar);
            this.lugar = new Lugar();
          }else{
            traslado.idHacia = lugar.idLugar;
          }
        });
      }else if(this.limpiarCadena(actualTraslado[5]) !== 'n/a' && this.limpiarCadena(actualTraslado[6]) !== 'n/a'){//1-text, 2-text
        this.lugaresService.listByName(actualTraslado[5]).subscribe((lugar: any) => {
          if(lugar === -1){
            this.lugar.nombre = actualTraslado[5];
            this.lugar.id = index;
            this.lugaresHacia.push(this.lugar);
            this.lugar = new Lugar();
          }else{
            traslado.idHacia = lugar.idLugar;
          }
        });
      }else if(this.limpiarCadena(actualTraslado[5]) === 'direccionespecifica'){//1-DirEs
        traslado.idDesde = -1;
      }
      traslado.cancelaciones = actualTraslado[29];
      traslado.comision = actualTraslado[35];
      traslado.id = index;
      this.traslados.push(traslado);
    });
    if(this.error){
      this.procesar = false;
      this.limpiarArreglos();
    }else{
      this.procesarTrasladosCostos(traslados);
    }
  }

  procesarTrasladosCostos(traslados: any){
    let vehiculosNombres: any[] = [];
    traslados.forEach(async(actualTraslado: any, index: number) => {
      if(index === 2){
        vehiculosNombres = actualTraslado.slice(9, 20);
        vehiculosNombres.push(actualTraslado[30]);
        let name = actualTraslado[32].replace('/', '-');
        vehiculosNombres.push(name);
      }
      if(index < 3) return false;
      let vehiculos = actualTraslado.slice(9, 20);
      vehiculos.push(actualTraslado[30]);
      vehiculos.push(actualTraslado[32]);
      const tCostos: any = await Promise.all(vehiculos.map((vehiculo: any, indexV: number) => {
        return this.costosVehiculos(index, indexV, vehiculosNombres, vehiculos, actualTraslado, vehiculo);
      }));
      let tc: any = await tCostos.filter((data: any) => data !== 'n/a');
      if(tc.length > 0){
        this.trasladosCostos[index - 3] = tc;
        if(index === (traslados.length -1)){
          if(this.error){
            this.limpiarArreglos();
          }else{
            this.procesarTrasladosIncrementos(traslados);
          }
        }
      }else{
        this.procesar = false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Se encontró un traslado sin costos asignados, por favor revise su archivo e inténtelo nuevamente',
          showConfirmButton: true,
        });
      }
    });
  }

  costosVehiculos(index: number, indexV: number, vehiculosNombres: any, vehiculos: any, actualTraslado: any, vehiculo: any){
    return new Promise((resolve, reject) => {
      try{
        let trasladoCosto: any = new Traslado_costo();
        if(index === vehiculos.length - 1){
          trasladoCosto.notas = actualTraslado[31];
        }else if(index === vehiculos.length - 2){
          trasladoCosto.notas = actualTraslado[33];
        }else{
          trasladoCosto.notas = actualTraslado[28];
        }
        switch(String(vehiculo).toLocaleLowerCase()){
          case 'n/a':
            resolve('n/a');
            break;
          case 'correo':
            this.vehiculosService.listByName(vehiculosNombres[indexV]).subscribe((findVehiculo: any) => {
              if(findVehiculo === -1){
                this.error = true;
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: `No se encontró el vehículo <strong>${vehiculosNombres[indexV]}</strong>, insértelo desde el panel de administración y cargue de nuevo su archivo`,
                  showConfirmButton: true,
                });
                reject('n/a');
              }else{
                trasladoCosto.idVehiculo = findVehiculo.idVehiculo;
                trasladoCosto.costo = -1;
                this.divisasService.listByName(actualTraslado[8]).subscribe((divisa: any) => {
                  if(divisa === -1){
                    this.error = true;
                    Swal.fire({
                      position: 'center',
                      icon: 'error',
                      title: `No se encontró la divisa <strong>${actualTraslado[8]}</strong>, agréguela desde el panel de administración y cargue de nuevo su archivo`,
                      showConfirmButton: true,
                    });
                    reject('n/a');
                  }else{
                    trasladoCosto.idDivisa = divisa.idDivisa;
                    resolve(trasladoCosto);
                  }
                });
              }
            });

            break;
          default:
            this.vehiculosService.listByName(vehiculosNombres[indexV]).subscribe((findVehiculo: any) => {
              if(findVehiculo === -1){
                if(String(vehiculosNombres[indexV]).toLocaleLowerCase() === 'bus-metro'){
                  vehiculosNombres[indexV] = vehiculosNombres[indexV].replace('-', '/');
                }
                this.error = true;
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: `No se encontró el vehículo <strong>${vehiculosNombres[indexV]}</strong>, insértelo desde el panel de administración y cargue de nuevo su archivo`,
                  showConfirmButton: true,
                });
                reject('n/a');
              }else{
                trasladoCosto.idVehiculo = findVehiculo.idVehiculo;
                trasladoCosto.costo = vehiculo;
                this.divisasService.listByName(actualTraslado[8]).subscribe((divisa: any) => {
                  if(divisa === -1){
                    this.error = true;
                    Swal.fire({
                      position: 'center',
                      icon: 'error',
                      title: `No se encontró la divisa <strong>${actualTraslado[8]}</strong>, agréguela desde el panel de administración y cargue de nuevo su archivo`,
                      showConfirmButton: true,
                    });
                    reject('n/a');
                  }else{
                    trasladoCosto.idDivisa = divisa.idDivisa;
                    resolve(trasladoCosto);
                  }
                });
              }
            });
            break;
        }
      }catch(err){
        console.log(err);
        reject('n/a');
      }
    });
  }

  procesarTrasladosIncrementos(traslados: any){
    for (var index = 3; index < traslados.length; index++){
      let actualTraslado = traslados[index];
      let incremento1: any = new Incremento();
      let incremento2: any = new Incremento();
      incremento1.tipoActividad = 2;
      incremento1.id = index;
      incremento2.tipoActividad = 2;
      incremento2.id = index;
      switch(this.limpiarCadena(actualTraslado[21])){
        case 'reloj':
          incremento1.tipo = 1;
          this.incrementoPorHora(index, actualTraslado[22]);
          break;
        default:
          incremento1.tipo = 2;
          this.incrementoPorFecha(index, actualTraslado[22]);
          break;
      }
      switch(this.limpiarCadena(actualTraslado[25])){
        case 'reloj':
          incremento2.tipo = 1;
          this.incrementoPorHora(index, actualTraslado[26]);         
          break;
        default:
          incremento2.tipo = 2;  
          this.incrementoPorFecha(index, actualTraslado[26]);    
          break;
      }
      incremento1.nombre  = actualTraslado[20];
      incremento2.nombre  = actualTraslado[24];
      incremento1.porcentaje  = actualTraslado[23];
      incremento2.porcentaje  = actualTraslado[27];
      this.incrementos.push(incremento1);
      this.incrementos.push(incremento2);
    }
    if(this.error){
      this.limpiarArreglos();
    }else{
      this.inserciones();
      // this.print(this.traslados, this.ciudades, this.lugaresDesde, this.lugaresHacia, this.trasladosCostos, this.incrementos, this.incrementosPorHora, this.incrementosPorFecha);
    }
  }

  incrementoPorHora(index: number, horas: any){
    let hrs = horas.split('\n');
    hrs.forEach((hr) => {
      let incrementoH: any = new incrementoHora();
      let h1 = hr.split('-')[0];
      let h2 = hr.split('-')[1];
      if (this.obtenerMinutos(h2) < this.obtenerMinutos(h1)){
        incrementoH.horaInicial = h1;
        incrementoH.horaFinal = '23:59';
        incrementoH.id = index;
        incrementoH.tipo = 1;
        this.incrementosPorHora.push(incrementoH);
        incrementoH = new incrementoHora();
        incrementoH.horaInicial = '00:00';
        incrementoH.horaFinal = h2;
        incrementoH.id = index;
        incrementoH.tipo = 1;
        this.incrementosPorHora.push(incrementoH);
      }else{
        incrementoH.horaInicial = h1;
        incrementoH.horaFinal = h2;
        incrementoH.id = index;
        incrementoH.tipo = 1;
        this.incrementosPorHora.push(incrementoH);
      }
    });
  }

  incrementoPorFecha(index: number, fechas: any){
    let fchs = fechas.split('\n');
    fchs.forEach((fecha) => {
      let incrementoF: any = new IncrementoFecha();
      let f = fecha.split('-');
      let fLength = f.length === 1 ? 1 : 2;
      incrementoF.tipo = 2;
      switch(fLength){
        case 1:
          f[0] = f[0].replace('/', '-');
          incrementoF.fechaInicial = f[0];
          incrementoF.fechaFinal = f[0];
          incrementoF.id = index;
          this.incrementosPorFecha.push(incrementoF);
          break;
        case 2:
          let re = /['/']/g;
          f[0] = f[0].replace(re, '-');
          f[1] = f[1].replace(re, '-');
          let val1 = f[0].split('-');
          let val2 = f[1].split('-');
          if(val1.length === 3 && val2.length === 3){
            f[0] = val1[0] + '-' + val1[1];
            f[1] = val2[0] + '-' + val2[1];
          }
          incrementoF.fechaInicial = f[0];
          incrementoF.fechaFinal = f[1];
          incrementoF.id = index;
          this.incrementosPorFecha.push(incrementoF);
          break;
      }
    });
  }

  async inserciones(){
    let p: any[] = [];
    let p2: any[] = [];
    let p3: any[] = [];
    //INSERTAR CIUDADES
    for(let index = 0; index < this.ciudades.length; index++){
      let actualCiudad: any = this.ciudades[index];
      let ciudad: any = Object.assign({}, actualCiudad);
      delete ciudad.id;
      let promise: any = this.ciudadesService.create(ciudad).toPromise();
      promise.then((res) => {
        for(let indexT = 0; indexT < this.traslados.length; indexT++){
          let traslado: any = this.traslados[indexT];
          if(actualCiudad.id === traslado.id){
            traslado.idCiudad = res.insertId; 
            return false;
          }
        }
      });
      p.push(promise);
      await Promise.all(p);
    }
    // //INSERTAR LUGARES DESDE
    for(let index = 0; index < this.lugaresDesde.length; index++){
      let actualDesde: any = this.lugaresDesde[index];
      let desde: any = Object.assign({}, actualDesde);
      delete desde.id;
      let promise: any = this.lugaresService.create(desde).toPromise();
      promise.then((res) => {
        for(let indexT = 0; indexT < this.traslados.length; indexT++){
          let traslado: any = this.traslados[indexT];
          if(actualDesde.id === traslado.id){
            traslado.idDesde = res.insertId; 
            return false;
          }
        }
      });
      p2.push(promise);
      await Promise.all(p2);
    }
    // //INSERTAR LUGARES HACIA
    for(let index = 0; index < this.lugaresHacia.length; index++){
      let actualHacia: any = this.lugaresHacia[index];
      let hacia: any = Object.assign({}, actualHacia);
      delete hacia.id;
      let promise: any = this.lugaresService.create(hacia).toPromise();
      promise.then((res) => {
        for(let indexT = 0; indexT < this.traslados.length; indexT++){
          let traslado: any = this.traslados[indexT];
          if(actualHacia.id === traslado.id){
            traslado.idHacia = res.insertId; 
            return false;
          }
        }
      });
      p3.push(promise);
      await Promise.all(p3);
    }
    for (var index = 0; index < this.traslados.length; index++){ //Recorrer traslados
      let actualTraslado: any = this.traslados[index];
      this.trasladosService.create(actualTraslado, this.trasladosCostos[index], this.trasladosCostos[index][0].idDivisa).subscribe((res) => { // Guardar los traslados con sus traslados_costo
        let incrementosArray: any[] = [];
        let incrementosPorTraslado: any = this.incrementos.filter((incremento: any) => incremento.id === actualTraslado.id); // Buscar los incrementos por traslado
        incrementosPorTraslado.forEach((incrementoPT: any) => { // Recorrer los incrementos por traslados
          let data: any[] = [];
          let incrementosHoras: any[] = this.incrementosPorHora.filter((incrementoH: any) => { //Buscar los incrementos por hora que pertenecen a un incremento
            if(incrementoH.id === incrementoPT.id && incrementoH.tipo === incrementoPT.tipo){
              delete incrementoH.id;
              delete incrementoH.tipo;
              return incrementoH;
            }
          });
          let incrementosFechas: any[] = this.incrementosPorFecha.filter((incrementoF: any) => { //Buscar lso incrementos por fecha que pertenecen a un incremento
            if(incrementoF.id === incrementoPT.id && incrementoF.tipo === incrementoPT.tipo){
              delete incrementoF.id
              delete incrementoF.tipo;
              return incrementoF;
            }
          });
          delete incrementoPT.id;
          let incrementosFechaHora: any[] = incrementosHoras.concat(incrementosFechas);
          data.push(incrementoPT);
          data.push(incrementosFechaHora);
          incrementosArray.push(data);
        });
        this.incrementosService.create_list(incrementosArray, res).subscribe((res1) => { //Guardar incrementos
          // console.log('res1', res1);
        });
      });
      this.procesar = false;
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: '¡Su archivo se proceso correctamente!',
        showConfirmButton: true,
      });
    }
  }

  print(traslados: any, ciudades: any, lugaresDesde: any, lugaresHacia: any, trasladosCostos: any, incrementos: any, iH: any, iF: any){
    console.log('ciudades', ciudades);//listo
    console.log('lugares', lugaresDesde);//listo
    console.log('lugares', lugaresHacia);//listo
    console.log('traslados', traslados);//listo
    console.log('trasladosCostos', trasladosCostos);//listo
    console.log('incrementos', incrementos); //listo
    console.log('incrementosHoras', iH);//listo
    console.log('incrementosFechas', iF);//listo
  }

  limpiarArreglos(){
    this.vehiculos = [];
    this.trasladosCostos = [];
    this.traslados = [];
    this.ciudades = [];
    this.lugaresDesde = [];
    this.lugaresHacia = [];
    this.procesar = false;
  }

  limpiarCadena(cadena: string){
    return cadena.replace(/ /g, "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  obtenerMinutos(hora: any){
    let h = hora.trim().split(':');
    return (h[0] * 60 + parseInt(h[1]));
  }

}
