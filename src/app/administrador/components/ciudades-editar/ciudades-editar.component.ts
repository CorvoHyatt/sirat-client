import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-ciudades-editar',
  templateUrl: './ciudades-editar.component.html',
  styleUrls: ['./ciudades-editar.component.css']
})
export class CiudadesEditarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $(".modal").modal();
    $("select").formSelect();
    console.log("Hola");
  }

}
