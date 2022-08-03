import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-nueva-version',
  templateUrl: './nueva-version.component.html',
  styleUrls: ['./nueva-version.component.css']
})
export class NuevaVersionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $(document).ready(function(){
      $('.modalNuevaVersion').modal();
      $('.modalNuevaVersion').modal({ dismissible: false });
      $('.modalNuevaVersion').modal('open');
    });
  }
}
