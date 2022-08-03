import {formatDate} from '@angular/common';

export class VueloEscala{
    idVueloEscala: number;
    idVuelo: number;
    fecha: string;
    lugar: string;
    tiempo: string;

    constructor() {
        let fechaI = localStorage.getItem('fechaInicio');
        let minDate: any = new Date(fechaI += 'T00:00:00');
        this.idVueloEscala = 0;
        this.idVuelo = 0;
        this.fecha = formatDate(minDate, 'yyyy-MM-dd', 'en');
        this.lugar = ``;
        this.tiempo = ``;
    }
}