import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { HospitalService, MedicoService } from '../../services/service.index';
import { Medico } from '../../models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor( 
    public _medicoService: MedicoService,
    public _hospitalService: HospitalService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _modalUploadService: ModalUploadService
  ) { 

    activatedRoute.params.subscribe( params => {
      const id = params.id;

      if ( id !== 'nuevo' ) {
        this.cargarMedico( id );
      }
    });
  
  }

  ngOnInit() {

    this._hospitalService.cargarHospitales()
    .subscribe( (resp: any) => {
      this.hospitales = resp;
    });

    this._modalUploadService.notificacion
        .subscribe( (resp: any) => {
          console.log(resp);
          this.medico.img = resp.medicoActualizado.img;
        });

  }

  guardarMedico( f: NgForm ) {
    console.log( f.valid );
    console.log( f.value );

    if (f.invalid) {
      return;
    }
    
    this._medicoService.guardarMedico( this.medico )
        .subscribe( resp => {
          console.log('[resp]=>', resp);
          this.medico._id = resp._id;
          this.router.navigate(['/medico', resp._id]);
         
        });

  }

  cambioHospital( id: string ) {

    this._hospitalService.obtenerHospital(id)
        .subscribe( resp => this.hospital = resp );

  }

  cargarMedico( id: string ) {

    this._medicoService.cargarMedico(id)
        .subscribe( resp => {
          console.log(resp.hospital);
          this.medico = resp;
          this.medico.hospital = resp.hospital._id;
          this.cambioHospital( this.medico.hospital );
        });

  }

  cambiarFoto() {

    this._modalUploadService.mostrarModal( 'medicos', this.medico._id );

  }


}
