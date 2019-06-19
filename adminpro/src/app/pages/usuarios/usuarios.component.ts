import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario/usuario.service';

import Swal from 'sweetalert2';
import { Subscriber } from 'rxjs';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;

  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor( public _usuariosService: UsuarioService,
               public _modalUploadService: ModalUploadService ) { }

  ngOnInit() {
    this.cargarUsuarios();
    // suscribirme a cualquier emisión que la notificación haga

    this._modalUploadService.notificacion
          .subscribe( resp => this.cargarUsuarios() );
  }

  mostarModal( id: string) {
    this._modalUploadService.mostrarModal('usuarios', id);
  }
  
  cargarUsuarios() {

    this.cargando = true;

    this._usuariosService.cargarUsuarios( this.desde )
        .subscribe( (resp: any) => {
          
          this.totalRegistros = resp.total;
          this.usuarios = resp.usuarios;
          this.cargando = false;

        });
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
    this.cargarUsuarios();
  }

  buscarUsuario( termino: string ) {

    if ( termino.length <= 0 ){
      this.cargarUsuarios();
      return;
     }

    this.cargando = true;

    this._usuariosService.buscarUsuario( termino )
          .subscribe( (usuarios: Usuario[]) => {
                
            this.usuarios = usuarios;
            this.cargando = false;
          });
  }

  borrarUsuario( usuario: Usuario ) {

    if ( usuario._id === this._usuariosService.usuario._id ) {
      Swal.fire(
        'No puede borrar usuario',
        'No se puede borrar a si mismo...',
        'error'
      );
      return;
    }

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + usuario.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((borrar) => {

      if (borrar.value) {

        this._usuariosService.borrarUsuario( usuario._id )
        .subscribe( (borrado: any) => {
          console.log(borrado);
          this.cargarUsuarios();
          
        });

      }

    });

  }

  guardarUsuario( usuario: Usuario ) {

    this._usuariosService.actualizarUsuario(usuario)
          .subscribe();
  }

}
