import { Component, OnInit } from '@angular/core';
import * as M from 'materialize-css/dist/js/materialize';
import { Pais } from './../../../models/Pais';
import { PaisesService } from './../../../services/paises.service';
declare var $: any;

@Component({
  selector: 'app-paises',
  templateUrl: './paises.component.html',
  styleUrls: ['./paises.component.css']
})
export class PaisesComponent implements OnInit {
  public i18nOptions: Object = {
    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
    weekdays: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    weekdaysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
    weekdaysAbbrev: ["D", "L", "M", "M", "J", "V", "S"],
  };
  public pais: Pais = new Pais();
  public paises: Pais[] = [];
  public paisSelected: Pais;
  public count: number = 0;
  public countUpdate: number = 0;
  public countRange: number = 0;
  public desde;
  public hasta;
  

  constructor(
    private _paisesService: PaisesService
  ) { }

  ngOnInit(): void {
    $( "#hasta" ).prop( "disabled", true );
    this.changeDatepicker('.datepicker', new Date());
    this.changeDatepicker('.datepicker-desde', new Date());
    let afterDate = new Date().setDate(new Date().getDate() + 1);
    this.changeDatepicker('.datepicker-hasta', new Date(afterDate));
    this.getPaisesByPagination();
  }

  changeDatepicker(id: string, date: Date, idPais?: number){
    var select;
    switch(id){
      case '.datepicker-desde':
        select = (date) => this.addRange('desde', date);
        break;
      case '.datepicker-hasta':
        select = (date) => this.addRange('hasta', date);
        break;
      case `.datepicker-desde${idPais}`:
        select = (date) => this.getPais(`desde${idPais}`, date);
        break;
      case `.datepicker-hasta${idPais}`:
        select = (date) => this.getPais(`hasta${idPais}`, date);
        break;
      default:
        break;
    }
    $(id).datepicker({
      minDate: date,
      maxDate: this.getMaxDate(),
      setDefaultDate: date,
      defaultDate: date,
      format: "yyyy-mm-dd",
      i18n: this.i18nOptions,
      onSelect: select
    });
  }

  getMaxDate(){
    let year = new Date().getFullYear();
    let date = String(year);
    let result = date += '-12-31';
    return new Date(result);
  }

  getPaisesByPagination(){
    this._paisesService.pagination(1, 5).subscribe(
      (res: Pais[]) => {
        this.paises = res;
        if(this.pais){
          this.paises.map((pais) => {
            setTimeout(() => {
              this.changeDatepicker(`.datepicker${pais.id}`, new Date(), pais.id);
              this.changeDatepicker(`.datepicker-desde${pais.id}`, new Date(), pais.id);
              let afterDate = new Date().setDate(new Date().getDate() + 1);
              this.changeDatepicker(`.datepicker-hasta${pais.id}`, new Date(afterDate), pais.id);
              $("#hasta" + pais.id).prop( "disabled", true );
            }, 0);
          });
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  onSubmit(form){
    console.log('this.pais', this.pais);
    this._paisesService.create(this.pais).subscribe(
      (res: Pais[]) => {
        console.log('res', res);
        form.reset();
      },
      err => {
        console.log(err);
      }
    );
  }

  update(pais){
    let data = {
      id: pais.id,
      idContinente: pais.idContinente,
      nombre: pais.nombre,
      bandera: pais.bandera,
      diasAltos: pais.diasAltos,
    }
    this._paisesService.update(data).subscribe(
      res => {
        console.log('res', res);
      },
      err => {
        console.log(err);
      }
    );
  }

  delete(id: number, index){
    
  }

  addDate(pais?: Pais){
    if(pais){
      let date = $(`#addDate${pais.id}`).val();
      if(pais.diasAltos   && this.countUpdate > 4){
        pais.diasAltos += ',' + date;
      }
      if(!pais.diasAltos  && this.countUpdate > 4){
        pais.diasAltos += date;
      }
      this.countUpdate++;
    }else{
      let date = $("#addDate").val();
      if(this.pais.diasAltos){
        this.pais.diasAltos += ',' + date;
      }
      if(!this.pais.diasAltos && this.count != 0){
        this.pais.diasAltos += date;
      }
      this.count = 1;
    }
  }

  addRange(id, date){
    if(id === 'desde'){
      $( "#hasta" ).prop( "disabled", false );
      this.desde = date;
      let afterDateSelected = new Date(date).setDate(new Date(date).getDate() + 1);
      this.changeDatepicker('.datepicker-hasta', new Date(afterDateSelected));
    }else{
      this.hasta = date;
      this.rangeConditionals(this.desde, this.pais);
      this.getDates(this.desde, this.hasta, this.pais);
      $("#hasta").prop("disabled", true);
    }
  }

  getDates(desde: Date, hasta: Date, pais){
    while(desde.getTime() < hasta.getTime()){
      desde.setDate(desde.getDate() + 1);
      this.rangeConditionals(desde, pais);
    }
  }

  rangeConditionals(desde, pais){
    if((desde.getMonth() + 1) < 10){
      var month = '0' + (desde.getMonth() + 1);
    }else{
      month = (desde.getMonth() + 1);
    }
    if(pais.diasAltos){
      pais.diasAltos += ',' + desde.getFullYear() + '-' + month + '-' + desde.getDate();
    }else{
      pais.diasAltos += desde.getFullYear() + '-' + month + '-' + desde.getDate();
    }
  }

  getPais(id: string, date: any, pais?: Pais){
    if(id === 'desdeView') this.paisSelected = pais;
    if(date === '') return false;
    if(id === `desde${this.paisSelected.id}`){
      $(`#hasta${this.paisSelected.id}`).prop( "disabled", false );
      this.desde = date;
      let afterDateSelected = new Date(date).setDate(new Date(date).getDate() + 1);
      this.changeDatepicker(`.datepicker-hasta${this.paisSelected.id}`, new Date(afterDateSelected), this.paisSelected.id);
    }else{
      this.hasta = date;
      this.rangeConditionals(this.desde, this.paisSelected);
      this.getDates(this.desde, this.hasta, this.paisSelected);
      $(`#hasta${this.paisSelected.id}`).prop("disabled", true);
    }
  }

}
