import { Component, OnInit } from '@angular/core';
import { Agencia } from 'src/app/models/Agencia';
import { AgenciasService } from 'src/app/services/agencias.service';
import Swal from "sweetalert2";

declare var $: any;

@Component({
  selector: 'app-agencias',
  templateUrl: './agencias.component.html',
  styleUrls: ['./agencias.component.css']
})
export class AgenciasComponent implements OnInit {

  agencias: Agencia[] = [];
  agencia: Agencia = new Agencia();
  constructor(
    private agenciasService: AgenciasService
  ) { }

  ngOnInit(): void {
    $(".modal").modal();
    $("select").formSelect();
    this.getAgencias();
  }


  getAgencias() {
    this.agenciasService.list().subscribe(
      (agencias: Agencia[]) => {
        this.agencias = agencias;
      }
    );
  }

  abrirNuevaAgencia() {
    $("#nuevaAgencia").modal("open");
    this.agencia = new Agencia();
  }

  guardarAgencia() {
    this.agenciasService.create(this.agencia).subscribe(
      res => {
        this.getAgencias();
        $("#nuevaAgencia").modal("close");
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Guardado correctamente",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    );
  }


  editar(agencia: Agencia) {
    this.agencia = agencia;
    $("#editarAgencia").modal("open");
  }

  actualizar() {
    this.agenciasService.update(this.agencia).subscribe(
      res => {
        this.getAgencias();
        $("#editarAgencia").modal("close");
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Guardado correctamente",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    );
  }


  eliminar(idAgencia: number) {
    Swal.fire({
      title: "¿Realmente quieres eliminar esta agencia?",
      text:"Se eliminaran los agentes y cualquier otra información relacionada a esta agencia",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.agenciasService.delete(idAgencia).subscribe(
          res => {
            this.getAgencias();
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
