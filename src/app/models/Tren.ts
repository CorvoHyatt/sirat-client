import {formatDate} from '@angular/common';

export class Tren{
    idTren: number;
    idDestino: number;
    fecha: string;
    noViajerosMayores: number;
    tarifaMayores: number;
    noViajerosMenores: number;
    tarifaMenores: number;
    tarifa: number;
    comision: number;
    comisionAgente: number;
    clase: string;
    origen: number;
    destino: number;
    horario: string;
    notas: string;
    descripcion: string;
    opcional: number;

    constructor() {
        let fechaI = localStorage.getItem('fechaInicio');
        let minDate: any = new Date(fechaI += 'T00:00:00');
        this.idTren = 0;
        this.idDestino = 0;
        this.noViajerosMayores = 0;
        this.tarifaMayores = 0;
        this.noViajerosMenores = 0;
        this.tarifaMenores = 0;
        this.tarifa = 0;
        this.comision = 0;
        this.comisionAgente = 0;
        this.clase = ``;
        this.origen = 0;
        this.fecha = formatDate(minDate, 'yyyy-MM-dd', 'en');
        this.destino = 0;
        this.horario = ``;
        this.notas = ``;
        this.descripcion = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, beatae perferendis modi natus totam quos repellat nostrum maxime error repudiandae facilis? Eius molestias ducimus, earum quis assumenda consequuntur magnam illo?`;
        this.opcional = 0;
    }
}