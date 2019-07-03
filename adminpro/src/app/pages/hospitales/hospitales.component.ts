import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospital: Hospital;
  hospitales: Hospital[] = [];
  desde: number = 0;

  totalRegistros: number = 0;
  cargando: boolean = false;

  constructor( public _hospitalService: HospitalService,
               public _modalUploadService: ModalUploadService ) { }

  ngOnInit() {
    this.cargarHospitales();
    
    this._modalUploadService.notificacion
          .subscribe( resp => this.cargarHospitales() );
  }

  actualizarimagen( hospital: Hospital ) {
    this._modalUploadService.mostrarModal('hospitales', hospital._id);
  }

  cargarHospitales() {

    this.cargando = true;
    
    this._hospitalService.cargarHospitales(this.desde)
          .subscribe( (resp: any) => {
            
            console.log(resp);
            this.totalRegistros = this._hospitalService.totalHospitales;
            this.hospitales = resp;
            this.cargando = false;
          });
  }

  obtenerHospital( id: string ) {
      
    this._hospitalService.obtenerHospital( id )
          .subscribe( resp => {
            console.log('obtenerHospital', resp);
          });

  }

  crearHospital( ) {

    Swal.fire({
      title: 'Crear Hospital',
      type: 'info',
      input: 'text',
      text: 'Ingrese el nombre del Hospital',
      inputPlaceholder: 'Ingrese el nombre del Hospital..',
      inputValue: '',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancelar',
      inputValidator: (valor) => {
        if (!valor || valor.length === 0) {
          return 'El nombre es obligatorio!';
        }
      }
    }).then( (nombre: any) => {
        if (nombre.value) {
          this._hospitalService.crearHospital( nombre.value )
            .subscribe( resp => {
              this.cargarHospitales();
            });
        }
    });

  }

  borrarHospital( id: string ) {

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar el Hospital con id ' + id,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((borrar) => {

      if (borrar.value) {

        this._hospitalService.borrarHospital( id )
              .subscribe( (borrado: any) => {
                console.log(borrado);
                this.cargarHospitales();
              });

      }

    });

  }

  actualizarHospital(	hospital:	Hospital ) {

    this._hospitalService.actualizarHospital( hospital )
          .subscribe( resp => console.log(resp) );
          
  }

  cambiarDesde( valor: number ) {
    const desde = this.desde + valor;
    console.log(desde);
    if ( desde >= this.totalRegistros ) {
      return;
    }
    if ( desde < 0 ) {
      return;
    }
    this.desde += valor;
    this.cargarHospitales();
  }

  buscarHospital( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;
    
    this._hospitalService.buscarHospital(termino)
          .subscribe( (resp: any) => {
            console.log(resp);
            this.hospitales = resp;
            this.cargando = false;
          });
    
  }

}
