import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() { }

  subirArchivo( archivo: File, tipo: string, id: string ) {

    // Crearemos una promesa para notificar a las demás pantallas que la imagen ya subio

    return new Promise( (resolve, reject) => {

      // formData es lo que debemos mandar a la petición por ajax el Payload
      const formData = new FormData();
      // inicializamos la petición AJAX
      const xhr = new XMLHttpRequest();
  
      // configuración del formData
      formData.append( 'imagen', archivo, archivo.name );
  
      // configuración de la petición AJAX
      xhr.onreadystatechange = function() {
        // es como un observable que se esta ejecutando, aca recibiremos información cada vez
        // que el estado cambie, pero solo nos interesa el estado readyState en 4 que es cuando
        // termina el proceso
        
        if (xhr.readyState === 4) {
  
          if (xhr.status === 200) {
            console.log('Imagen subida');
            resolve( JSON.parse( xhr.response ) );
          } else {
            console.log('Fallo la subida');
            reject ( xhr.response );
          }

        }
      };

      let url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;

      xhr.open('PUT', url, true);
      xhr.send( formData ) ;

  });
  


  }
}
