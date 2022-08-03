import { Component, OnInit } from '@angular/core';
import { Jerarquia } from 'src/app/models/Jerarquia';
import { Area } from '../../../models/Area';
import { AreasService } from '../../../services/areas.service';
import { JerarquiasService } from '../../../services/jerarquias.service';
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: 'app-jerarquias',
  templateUrl: './jerarquias.component.html',
  styleUrls: ['./jerarquias.component.css']
})
export class JerarquiasComponent implements OnInit {

  jerarquias: Jerarquia[] = [];
  areas: Area[] = [];
  idAreaPrincipal: number = 0;
  jerarquiasVista: any = [];
  areasDisponibles: Area[] = [];
  jerarquiaActual: any;
  constructor(
    private areasService: AreasService,
    private jerarquiasService: JerarquiasService
  ) { }

  ngOnInit(): void {
    $(".modal").modal();
    $("select").formSelect();
    this.getAreas();
    this.getJerarquias();
  }

  getAreas() {
    this.areasService.list().subscribe(
      (resp: Area[]) => {
        this.areas = resp;
      }
    );
  }


  abrirNuevaJerarquia() {
    this.jerarquias = [];
    this.idAreaPrincipal = this.areas[0].idArea;

    this.jerarquiasService.list_areasDisponibles().subscribe(
      (resp: Area[]) => {
        this.areasDisponibles = resp;
        if(this.areasDisponibles.length>0)
        this.idAreaPrincipal = this.areasDisponibles[0].idArea;
        $("#agregarJerarquia").modal("open");
      }
    );

  }

  setIdAreaSubordinada(idArea) {
    let j = new Jerarquia();
    j.idAreaPrincipal = this.idAreaPrincipal;
    j.idAreaSubordinada = idArea;
    let i = this.jerarquias.findIndex(jj => jj.idAreaSubordinada == j.idAreaSubordinada);
    (i==-1)?(this.jerarquias.push(j)):(this.jerarquias.splice(i,1));
  }


  agregar() {
    this.jerarquiasService.create_list(this.jerarquias).subscribe(
      res => {
        this.getJerarquias();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Agredado correctamente",
          showConfirmButton: false,
          timer: 1000,
        });
        $("#agregarJerarquia").modal("close");

      }
    );
  }

  getJerarquias() {
    this.jerarquiasService.list_agrupado().subscribe(
      (resp: any) => {
        this.jerarquiasVista = resp;
        //console.log(this.jerarquiasVista);
      }
    );
  }

  editar(jerarquia) {
    //console.log(jerarquia);
    this.jerarquiaActual = JSON.parse(JSON.stringify(jerarquia));
    $("#editarJerarquia").modal("open");

  }

  existe(idArea) {
    if (this.jerarquiaActual.subordinados.findIndex(as => as.idAreaSubordinada == idArea) >= 0) {
      return true;
    }
    return false;
  }

  setIdAreaSubordinadaEditar(area) {
   // console.log(area);
    let i = this.jerarquiaActual.subordinados.findIndex(jj => jj.idAreaSubordinada == area.idArea);
    let a: any = {};
    a.idAreaSubordinada = area.idArea;
    a.nombre = area.nombre;
    (i == -1) ? (this.jerarquiaActual.subordinados.push(a)) : (this.jerarquiaActual.subordinados.splice(i, 1));
    //console.log(this.jerarquiaActual);
  }


  actualizar() {
    this.jerarquiasService.update(this.jerarquiaActual).subscribe(
      res => {
        this.getJerarquias();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Actualizado correctamente",
          showConfirmButton: false,
          timer: 1000,
        });
        $("#editarJerarquia").modal("close");

      }
    );
  }

  eliminar(idAreaPrincipal) {
    Swal.fire({
      title: '¿Está seguro que desea eliminar esta jerarquia?',
      showCancelButton: true,
      cancelButtonText: 'No, volver',
      confirmButtonText: `Si, eliminar`,
      confirmButtonColor: '#b71c1c'
    }).then(async (result) => {
      if(result.isConfirmed){
        this.jerarquiasService.delete(idAreaPrincipal).subscribe(
          res => {
            this.getJerarquias();
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Eliminado correctamente",
              showConfirmButton: false,
              timer: 1000,
            });
    
          }
        );
      }
    });

 
  }
}
