import { Component, OnInit } from '@angular/core';
import { Vehiculo } from 'src/app/models/Vehiculo';
import { VehiculosService } from '../../../services/vehiculos.service';
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {

  vehiculos: Vehiculo[] = [];
  vehiculo: Vehiculo = new Vehiculo();
  constructor(
    private vehiculosService: VehiculosService
  ) { }

  ngOnInit(): void {
    $(".modal").modal();
    $("select").formSelect();
    this.getVehiculos();
  }

  getVehiculos() {
    this.vehiculosService.list().subscribe((vehiculos: Vehiculo[]) => {
      this.vehiculos = vehiculos;
    });
  }


  abrirNuevoVehiculo() {
    this.vehiculo = new Vehiculo();
    $("#nuevoVehiculo").modal("open");
  }

  guardarVehiculo() {
    this.vehiculosService.create(this.vehiculo).subscribe(
      res => {
        this.getVehiculos();
        $("#nuevoVehiculo").modal("close");
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

  abrirEditar(vehiculo: Vehiculo) {
    this.vehiculo = vehiculo;
    $("#editarVehiculo").modal("open");

  }

  actualizarVehiculo() {
    this.vehiculosService.update(this.vehiculo).subscribe(
      res => {
        this.getVehiculos();
        $("#editarVehiculo").modal("close");
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


  eliminar(idVehiculo) {
    
    Swal.fire({
      title: "¿Realmente quieres eliminar este vehiculo?",
      text:"Se eliminaran los traslados, disposiciones de chofer, tours y cualquier otra información relacionada a este vehiculo",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Continuar`,
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.vehiculosService.delete(idVehiculo).subscribe(
          res => {
            this.getVehiculos();
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
