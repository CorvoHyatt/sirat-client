import { NumberValueAccessor } from '@angular/forms';

export class TrasladoOtro{
    idTrasladoOtro: number;
    idTraslado: number;
    idCiudad: number;
    idVehiculo: number;
    desde: string;
    hacia: string;
    tarifa: number;
    idDivisa: number;
    cancelaciones: string;
    comision: number;
    comisionAgente: number;
    notas: string;
    pasajeros: number;
    equipaje: number;
    fecha: string;
    hora: string;
    descripcion: string;
    opcional: number;


    constructor() {
        this.idTrasladoOtro = 0;
        this.idTraslado = 0;
        this.idCiudad = 0;
        this.idVehiculo = 0;
        this.desde = ``;
        this.hacia=``;
        this.tarifa=0;
        this.idDivisa=0;
        this.cancelaciones=``;
        this.comision=0;
        this.comisionAgente=0;
        this.notas=``;
        this.pasajeros=0;
        this.equipaje = 0;
        this.fecha = ``;
        this.hora = ``;
        this.descripcion = ``;
        this.opcional = 0;
        
    }
}