import { Component, OnInit, DoCheck } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HotelesTarifasService } from '../../../services/hoteles-tarifas.service'
import { CiudadesService } from './../../../services/ciudades.service';
import { HotelTarifa } from './../../../models/HotelTarifa';
import { Ciudad } from './../../../models/Ciudad';
import * as M from 'materialize-css/dist/js/materialize';
declare var $: any;

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit, DoCheck {
  public hotelTarifa: HotelTarifa = new HotelTarifa();
  public actualCity: Ciudad[] = [];
  public cities: Ciudad[] = [];
  public hotelesTarifas: HotelTarifa[] = [];
  public dataAutocomplete: any = [];
  public totalItems: number = 0;
  public totalPages: number[] = [];
  public subtotalTurista: Object = {
    tarifaTurista: 0,
    desayunoTurista: 0,
    cityTaxTurista: 0
  };
  public subtotalTuristaSup: Object = {
    tarifaTuristaSup: 0,
    desayunoTuristaSup: 0,
    cityTaxTuristaSup: 0
  };
  public subtotalPremium: Object = {
    tarifaPremium: 0,
    desayunoPremium: 0,
    cityTaxPremium: 0
  };
  public subtotalLujo: Object = {
    tarifaLujo: 0,
    desayunoLujo: 0,
    cityTaxLujo: 0
  };

  constructor(
    private _hotelesTarifasService: HotelesTarifasService,
    private _ciudadesService: CiudadesService,
    private _datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    $(function(){
      $(".wrapper-up").scroll(function(){
        $(".wrapper-down").scrollLeft($(".wrapper-up").scrollLeft());
      });
      $(".wrapper-down").scroll(function(){
        $(".wrapper-up").scrollLeft($(".wrapper-down").scrollLeft());
      });
    });
    $(document).ready(function(){
      $('input.autocomplete').autocomplete({
        data: {
          "": null
        },
      });
    });
    this.getHotelesTarifasByPagination();
    this.getCities();
  }

  ngDoCheck(){
    $(document).ready(function() {
      M.updateTextFields();
    });
  }

  getMaxDate(){
    let year = new Date().getFullYear();
    let date = String(year);
    let result = date += '-12-31';
    return new Date(result);
  }

  getCities() {
    this._ciudadesService.list().subscribe(
      (res: Ciudad[]) => {
        this.cities = res;
        let datos = '{';
        for (const ll of this.cities) {
          if (datos === '{')
            datos += '"' + ll.nombre + '": ""';
          else
            datos += ',"' + ll.nombre + '": ""';
        }
        datos += '}';
        this.dataAutocomplete = JSON.parse(datos);
        $('input.autocomplete').autocomplete({
          data: this.dataAutocomplete,
          onAutocomplete: (citySelected) => {
            this.actualCity = this.cities.filter((city) => city.nombre === citySelected);
            this.hotelTarifa.idCiudad = this.actualCity[0].idCiudad;
          }
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  getHotelesTarifasByPagination(){
    this._hotelesTarifasService.pagination(1, 5).subscribe(
      (res: any[]) => {
        this.hotelesTarifas = res;
        this.totalItems = res[0].total;
      },
      err => {
        console.log(err);
      }
    );
  }

  pagination(id){
    console.log('id', id);
  }

  onSubmit(form){
    this._hotelesTarifasService.create(this.hotelTarifa).subscribe(
      res => {
        this.getOneTarifaHotel(res);
        form.reset();
      },
      err => {
        console.log(err);
      }
    )
  }

  getOneTarifaHotel(object){
    if(object){
      this._hotelesTarifasService.listOne(object.insertId).subscribe(
        res => {
          this.hotelesTarifas.push(res[0]);
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  update(hotelTarifa){
    const object = {
      idHotelTarifa: hotelTarifa.idHotelTarifa,
      idCiudad: hotelTarifa.idCiudad,
      turista: hotelTarifa.turista,
      turistaSup: hotelTarifa.turistaSup,
      premium: hotelTarifa.premium,
      lujo: hotelTarifa.lujo,
      turistaT: hotelTarifa.turistaT,
      turistaSupT: hotelTarifa.turistaSupT,
      premiumT: hotelTarifa.premiumT,
      lujoT: hotelTarifa.lujoT,
      diasAltos: hotelTarifa.diasAltos
    }
    this._hotelesTarifasService.update(object).subscribe(
      res => {
        //console.log('res', res);
      },
      err => {
        console.log(err);
      }
    );
  }

  delete(id: number, index){
    this._hotelesTarifasService.delete(id).subscribe(
      res => {
        //this.hotelesTarifas.splice(index, 1);
      },
      err => {
        console.log(err);
      }
    );
  }

  calculateTarifaTurista(id: string, value: number){
    switch(id){
      case 'tarifa':
        this.subtotalTurista['tarifaTurista'] = value;
        break;
      case 'desayuno':
        this.subtotalTurista['desayunoTurista'] = value;
        break;
      case 'cityTax':
        this.subtotalTurista['cityTaxTurista'] = value;
        break;
    }
    this.hotelTarifa.turista = (
      this.subtotalTurista['tarifaTurista'] +
      this.subtotalTurista['desayunoTurista'] +
      this.subtotalTurista['cityTaxTurista']
    );
  }

  calculateTarifaTuristaSup(id: string, value: number){
    switch(id){
      case 'tarifa':
        this.subtotalTuristaSup['tarifaTuristaSup'] = value;
        break;
      case 'desayuno':
        this.subtotalTuristaSup['desayunoTuristaSup'] = value;
        break;
      case 'cityTax':
        this.subtotalTuristaSup['cityTaxTuristaSup'] = value;
        break;
    }
    this.hotelTarifa.turistaSup = (
      this.subtotalTuristaSup['tarifaTuristaSup'] +
      this.subtotalTuristaSup['desayunoTuristaSup'] +
      this.subtotalTuristaSup['cityTaxTuristaSup']
    );
  }

  calculateTarifaPremium(id: string, value: number){
    switch(id){
      case 'tarifa':
        this.subtotalPremium['tarifaPremium'] = value;
        break;
      case 'desayuno':
        this.subtotalPremium['desayunoPremium'] = value;
        break;
      case 'cityTax':
        this.subtotalPremium['cityTaxPremium'] = value;
        break;
    }
    this.hotelTarifa.premium = (
      this.subtotalPremium['tarifaPremium'] +
      this.subtotalPremium['desayunoPremium'] +
      this.subtotalPremium['cityTaxPremium']
    );
  }

  calculateTarifaLujo(id: string, value: number){
    switch(id){
      case 'tarifa':
        this.subtotalLujo['tarifaLujo'] = value;
        break;
      case 'desayuno':
        this.subtotalLujo['desayunoLujo'] = value;
        break;
      case 'cityTax':
        this.subtotalLujo['cityTaxLujo'] = value;
        break;
    }
    this.hotelTarifa.lujo = (
      this.subtotalLujo['tarifaLujo'] +
      this.subtotalLujo['desayunoLujo'] +
      this.subtotalLujo['cityTaxLujo']
    );
  }
}
