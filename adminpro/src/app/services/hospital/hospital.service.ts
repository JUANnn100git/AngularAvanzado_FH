import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Hospital } from '../../models/hospital.model';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';

import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( public http: HttpClient,
               public _usuarioService: UsuarioService) {
  }

  cargarHospitales( desde: number = 0 ) {

    let url = URL_SERVICIOS + '/hospital?desde=' + desde;

    return this.http.get( url );

  }

  obtenerHospital( id: string ) {

    let url = URL_SERVICIOS + '/hospital/' + id;

    return this.http.get( url );

  }

  borrarHospital(	id:	string ) {

    let url = URL_SERVICIOS + '/hospital/' + id + '?token=' + this._usuarioService.token;

    return this.http.delete( url )
                .pipe(
                  map( resp => {
                    Swal.fire(
                      'Hospital borrado',
                      'El hospital ha sido eliminado correctamente',
                      'success'
                    );
                    return true;
                  })
                );

  }

  crearHospital( nombre:	string ) {

    const url = URL_SERVICIOS + '/hospital?token=' + this._usuarioService.token;

    var hospital = new Hospital(nombre);
    

    return this.http.post( url, hospital )
            .pipe(
              map( (resp: any) => {
                Swal.fire(
                  'Hospital creado',
                  hospital.nombre,
                  'success'
                );
                return resp.hospital;
              })
            );
  }

  buscarHospital(	termino:	string ) {
  
  }

  actualizarHospital(	hospital:	Hospital ) {

    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, hospital )
            .pipe(
              map( (resp: any) => {
              
                Swal.fire(
                  'Hospital actualizado',
                  hospital.nombre,
                  'success'
                );
                return true;
                
              })
            ); 

  }
  
}
