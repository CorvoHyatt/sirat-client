import {formatDate} from '@angular/common';

export class Vuelo{
    idVuelo: number;
    idDestino: number;
    noViajeros: number;
    tarifa: number;
    comision: number;
    comisionAgente: number;
    clase: string;
    fecha: string;
    origen: number;
    destino: number;
    horaSalida: string;
    horaLlegada: string;
    maletaPeso: number;
    descripcion: string;
    notas: string;
    opcional: number;

    constructor() {
        let fechaI = localStorage.getItem('fechaInicio');
        let minDate: any = new Date(fechaI += 'T00:00:00');
        this.idVuelo = 0;
        this.idDestino = 0;
        this.noViajeros = 0;
        this.tarifa = 0;
        this.comision = 0;
        this.comisionAgente = 0;
        this.clase = ``;
        this.fecha = formatDate(minDate, 'yyyy-MM-dd', 'en');
        this.origen = 0;
        this.destino = 0;
        this.horaSalida = ``;
        this.horaLlegada = ``;
        this.maletaPeso = 0;
        this.descripcion = ``;
        this.notas = ``;
        this.opcional = 0;
    }
}
