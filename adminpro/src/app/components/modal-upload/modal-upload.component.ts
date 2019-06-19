import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: any;

  @ViewChild('txtFile') txtFile: ElementRef;

  constructor( public _subirArchivoService: SubirArchivoService,
               public _modalUploadService: ModalUploadService) {
  }

  ngOnInit() {
  }

  cerrarModal() {
    this.imagenSubir = null;
    this.imagenTemp = null;

    this._modalUploadService.ocultarModal();
    this.txtFile.nativeElement.value = null;
  }
  
  seleccionImagen( archivo: File ) {

    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if ( archivo.type.indexOf('image') < 0 ) {
      Swal.fire(
        'Sólo imágenes',
        'El archivo seleccionado no es una imagen',
        'error'
      );
      this.imagenSubir = null;
      return;
    }
    
    this.imagenSubir = archivo;

    // Vanilla JavaScript

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend =  () =>   this.imagenTemp = reader.result;
   
  }
  
  subirImagen() {

    this._subirArchivoService.subirArchivo( this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id )
            .then( resp => {
              // Emitir un mensaje para todos que la imagen ya se subio
              this._modalUploadService.notificacion.emit( resp );
              this.cerrarModal();
            })
            .catch( resp => {
              console.log('Error en la carga...');
            });

  }


}
