import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/service.index';
import { Medico } from 'src/app/models/medico.model';


@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];

  desde: number = 0;
  totalRegistros: number = 0;

  cargando: boolean = true;

  constructor( public _medicoService: MedicoService ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this._medicoService.cargarMedicos(this.desde)
        .subscribe( resp => {
          this.totalRegistros = this._medicoService.totalMedicos;
          this.medicos = resp;
        });
  }

  buscarMedico( termino: string ) {

    if ( termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

    this._medicoService.buscarMedico(termino)
        .subscribe( resp => {
          console.log(resp);
          this.medicos = resp;

        });
            
  }

  borrarMedico( id: string ) {
    this._medicoService.borrarMedico(id)
        .subscribe( () => this.cargarMedicos() );
  }

  cambiarDesde( valor: number ) {
    const desde = this.desde + valor;
    if ( desde >= this.totalRegistros ) {
      return;
    }
    if ( desde < 0 ) {
      return;
    }
    this.desde += valor;
    this.cargarMedicos();
  }



}
