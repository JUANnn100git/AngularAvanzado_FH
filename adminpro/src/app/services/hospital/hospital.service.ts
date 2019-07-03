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

  totalHospitales: number = 0;

  constructor( public http: HttpClient,
               public _usuarioService: UsuarioService) {
  }

  cargarHospitales( desde: number = 0 ) {

    const url = URL_SERVICIOS + '/hospital?desde=' + desde;

    return this.http.get( url )
                .pipe(
                  map( (resp: any) => {
                    this.totalHospitales = resp.total;
                    return resp.hospitales;
                  })
                );

  }

  obtenerHospital( id: string ) {

    const url = URL_SERVICIOS + '/hospital/' + id;

    return this.http.get( url )
                 .pipe(
                   map( (resp: any) => resp.hospital)
                 );

  }

  borrarHospital(	id:	string ) {

    const url = URL_SERVICIOS + '/hospital/' + id + '?token=' + this._usuarioService.token;

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


    return this.http.post( url, { nombre } )
            .pipe(
              map( (resp: any) => {
                Swal.fire(
                  'Hospital creado',
                  nombre,
                  'success'
                );
                return resp.hospital;
              })
            );
  }

  buscarHospital(	termino:	string ) {

    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;

    return this.http.get( url )
                 .pipe(
                   map( (resp: any) => {
                    this.totalHospitales = resp.total;
                    return resp.hospitales;
                   })
                 );
    
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
                return resp.hospital;
                
              })
            ); 

  }
  
}
