import { Component, OnInit } from '@angular/core';
import { Agente } from '../../../models/Agente';
import { AgentesService } from '../../../services/agentes.service';
import { AgenciasService } from '../../../services/agencias.service';
import { Agencia } from '../../../models/Agencia';
import Swal from "sweetalert2";
import { ComisionAgente } from '../../../models/ComisionAgente';
import { JerarquiasService } from '../../../services/jerarquias.service';
declare var $: any;

@Component({
  selector: 'app-agentes',
  templateUrl: './agentes.component.html',
  styleUrls: ['./agentes.component.css']
})
export class AgentesComponent implements OnInit {

  agentes: Agente[] = [];
  agencias: Agencia[] = [];
  agenciaSeleccionada: number = -1;
  agente: any = new Agente();
  comisiones: any[] = [
    { "idAgente": 0, "nombre": "Traslados", "tipoActividad": 1, "comision": 0 },
    { "idAgente": 0, "nombre": "Disposiciones", "tipoActividad": 2, "comision": 0 },
    { "idAgente": 0, "nombre": "Tours privados a pie", "tipoActividad": 3, "comision": 0 },
    { "idAgente": 0, "nombre": "Tours privados en transporte", "tipoActividad": 4, "comision": 0 },
    { "idAgente": 0, "nombre": "Tours de grupo", "tipoActividad": 5, "comision": 0 },
    { "idAgente": 0, "nombre": "Actividades", "tipoActividad": 6, "comision": 0 },
    {"idAgente":0,"nombre": "Hoteles", "tipoActividad": 7,"comision":0},
    {"idAgente":0,"nombre": "Vuelos", "tipoActividad": 8,"comision":0},
    {"idAgente":0,"nombre": "Trenes", "tipoActividad": 9,"comision":0},
    {"idAgente":0,"nombre": "Extras", "tipoActividad": 10,"comision":0},

  ];

  constructor(
    private agenciasService: AgenciasService,
    private agentesService: AgentesService
  ) { }

  ngOnInit(): void {
    this.getAgencias();
    this.getAgentes();
    $(".modal").modal();

  }

  getAgencias() {
    this.agenciasService.list().subscribe(
      (agencias: Agencia[]) => {
        this.agencias = agencias;
      }
    );
  }

  abrirNuevoAgente() {
    this.agente = new Agente();
    this.agente.idAgencia = this.agencias[0].idAgencia;
    $("#nuevoAgente").modal("open");
  }

  getAgentes() {
    this.agentesService.listByIdAgenciaWithAgencia(this.agenciaSeleccionada).subscribe(
      (agentes: Agente[]) => {
        this.agentes = agentes;
      }
    );
  }

  guardarAgenteNuevo() {
    //console.log(this.agente);
    //console.log(this.comisiones);
    this.agentesService.create(this.agente, this.comisiones).subscribe(
      res => {
        this.getAgentes();
        $("#nuevoAgente").modal("close");
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


  abrirVerAgente(agente: Agente) {
    this.agente = agente;
    this.agentesService.listComisionesByIdAgente(this.agente.idAgente).subscribe(
      (comisiones: any[])=> {
        this.comisiones = comisiones;
        $("#verAgente").modal("open");

      }
    );
  }


  abrirEditarAgente(agente: Agente) {
    this.agente = agente;
    this.agentesService.listComisionesByIdAgente(this.agente.idAgente).subscribe(
      (comisiones: any[])=> {
        this.comisiones = comisiones;
        $("#editarAgente").modal("open");

      }
    );
  }

  actualizar() {
    this.agentesService.update(this.agente, this.comisiones).subscribe(
      res => {
        this.getAgentes();
        $("#editarAgente").modal("close");
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Actualizado correctamente",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    );
  }

  eliminar(idAgente) {
    Swal.fire({
      title: "¿Realmente quieres eliminar este agente?",
      text:"Se eliminaran todas las cotizaciones y cualquier otra información relacionada a este agente",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.agentesService.delete(idAgente).subscribe(
          res => {
            this.getAgentes();
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
