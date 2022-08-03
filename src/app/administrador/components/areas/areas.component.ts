import { Component, OnInit } from '@angular/core';


import {Area  } from '../../../../app/models/Area';
import { AreasService } from '../../../../app/services/areas.service';


import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements OnInit {

  public areas: any[] = [];
  public area: Area = new Area();
  public areaBase: Area = new Area();
  public esActualizacion: boolean = false;

  constructor(private areasService: AreasService) { }

  ngOnInit(): void {
    this.getAreas();
  }

  getAreas(){
    this.areasService.list().subscribe((areas: Area[]) => {
      this.areas = areas;
    });
  }

  abrirModal(){
    this.area = new Area();
    $('#modalArea').modal({ dismissible: false });
    $('#modalArea').modal('open');
    this.esActualizacion = false;
  }

  agregarArea(){
    if(this.area.nombre.trim() === ''){
      Swal.fire({
        icon: 'error',
        title: 'El campo es obligatorio'
      });
    }else{
      this.areasService.create(this.area).subscribe((res: any) => {
        this.area.idArea = res.insertId;
        this.areas.push(this.area);
        this.area = new Area();
        $('#modalArea').modal('close');
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Área agregada con éxito`,
          showConfirmButton: false,
          timer: 1500
        });
      }, err => console.log(err));
    }
  }

  actualizarArea(){
    if(this.area.nombre.trim() === ''){
      Swal.fire({
        icon: 'error',
        title: 'El campo es obligatorio'
      });
      this.area = this.areaBase;
    }else{
      this.areasService.actualizar(this.area).subscribe(res => {
        let i: number = this.areas.findIndex((a: any) => a.idArea === this.area.idArea);
        this.areas[i] = this.area;
        $('#modalArea').modal('close');
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Área actualizada con éxito`,
          showConfirmButton: false,
          timer: 1500
        });
      }, err => console.log(err));
    }
  }

  editar(area: any){
    this.abrirModal();
    this.area = Object.assign({}, area);
    this.areaBase = Object.assign({}, area);
    this.esActualizacion = true;
  }

  eliminar(area: any, i: number){
    Swal.fire({
      title: `¿Esta seguro de eliminar el área: <strong>${area.nombre}</strong>?`,
      showCancelButton: true,
      cancelButtonText: 'No, volver',
      confirmButtonText: `Si, continuar`,
      confirmButtonColor: '#b71c1c'
    }).then((result) => {
      if(result.isConfirmed){
        this.areasService.eliminar(area.idArea).subscribe(res => {
          this.areas.splice(i, 1);
          $('#modalArea').modal('close');
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `Área eliminada con éxito`,
            showConfirmButton: false,
            timer: 1500
          });
        }, err => console.log(err));
      }
    });
  }
}
