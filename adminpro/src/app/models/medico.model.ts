import { Hospital } from './hospital.model';
import { Usuario } from './usuario.model';

export class Medico {

    constructor(
        public nombre: string,
        public img?: string,
        public usuario?: string,
        public hospital?: string,
        public _id?: string
    ) { }
}
