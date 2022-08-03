import {formatDate} from '@angular/common';

export class Hotel {
    idHotelAdquirido: number;
    idDestino: number;
    nombre: string;
    direccion: string;
    telefono: string;
    noPersonas: number;
    comision: number;
    comisionAgente: number;
    checkIn: string;
    checkOut: string;
    tarifaTotal: number;
    tarifa: number;
    cityTax: number;
    desayuno: number;
    otros: number;
    descripcion: string;
    notas: string;
    opcional: number;
    categoria: string;
    estrellas: number;
    tipoHotel: number;

    constructor() {
        let fechaI = localStorage.getItem('fechaInicio');
        let minDate: any = new Date(fechaI += 'T00:00:00');
        this.idHotelAdquirido = 0;
        this.idDestino = 0;
        this.nombre = ``;
        this.direccion = ``;
        this.telefono = ``;
        this.noPersonas = 0;
        this.comision = 0;
        this.comisionAgente = 0;
        this.checkIn = formatDate(minDate, 'yyyy-MM-dd', 'en');
        this.checkOut = formatDate(minDate, 'yyyy-MM-dd', 'en');
        this.tarifaTotal = 0;
        this.tarifa = 0; //Esta propiedad no se guarda en la db
        this.cityTax = 0;
        this.desayuno = 0;
        this.otros = 0;
        this.descripcion = `Hospedaje en: `;
        this.notas = ``;
        this.opcional = 0;
        this.categoria = '';
        this.estrellas = 0;
        this.tipoHotel = 0;
    }
}