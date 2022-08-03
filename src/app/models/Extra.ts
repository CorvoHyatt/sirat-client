import {formatDate} from '@angular/common';

export class Extra {
    idExtras: number;
    idCiudad: number;
    idDestino: number;
    tarifa: number;
    comision: number;
    comisionAgente: number;
    extras: string;
    fecha: string;
    notas: string;
    opcional: number;

    constructor() {
        let fechaI = localStorage.getItem('fechaInicio');
        let minDate: any = new Date(fechaI += 'T00:00:00');
        this.idExtras = 0;
        this.idCiudad = 0;
        this.idDestino = 0;
        this.tarifa = 0;
        this.comision = 0;
        this.comisionAgente = 0;
        this.extras = ``;
        this.fecha = formatDate(minDate, 'yyyy-MM-dd', 'en');
        this.notas = ``;
        this.opcional = 0;
    }
} 