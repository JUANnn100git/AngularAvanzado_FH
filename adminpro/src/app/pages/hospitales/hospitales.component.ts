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

  mostarModal( id: string ) {
    this._modalUploadService.mostrarModal('hospitales', id);
  }

  cargarHospitales() {

    this.cargando = true;
    
    this._hospitalService.cargarHospitales(this.desde)
          .subscribe( (resp: any) => {
            
            console.log(resp);
            this.totalRegistros = resp.total;
            this.hospitales = resp.hospitales;
            this.cargando = false;
          });
  }

  obtenerHospital( id: string ) {
      
    this._hospitalService.obtenerHospital( id )
            .subscribe( resp => {
              console.log('obtenerHospital', resp);
            });

  }

  async alertCrearHospital() {

    const {value: nombreHospital} = await Swal.fire({
      title: 'Creando Hospital',
      input: 'text',
      inputPlaceholder: 'Ingrese el nombre del Hospital..',
      inputValue: '',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'El nombre es obligatorio!';
        }
      }
    });
    
    if (nombreHospital) {
      this.crearHospital( nombreHospital );
    }

  }

  crearHospital( nombre:	string ) {

    this._hospitalService.crearHospital( nombre )
    .subscribe( resp => {
      this.cargarHospitales();
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

    // this.hospital.nombre = hospital.nombre;

    console.log(hospital.nombre);

    // this._hospitalService.actualizarHospital( this.hospital ).subscribe();

  }

  cambiarDesde( valor: number ) {
    let desde = this.desde + valor;
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

}
