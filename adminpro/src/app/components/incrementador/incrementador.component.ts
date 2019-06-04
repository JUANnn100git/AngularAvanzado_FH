import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtProgress') txtProgress: ElementRef;

  @Input('nombre') leyenda: string = 'Leyenda';
  @Input() progreso: number = 50;

  @Output('actualizaValor') cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() { 
    // console.log('Constructor Leyenda:', this.leyenda);
    // console.log('Constructor Progreso:', this.progreso);
  }

  ngOnInit() {
    // console.log('Init Leyenda:', this.leyenda);
    // console.log('Init Progreso:', this.progreso);
  }

  onChanges( newValue: number) {

    // let elemHTML: any = document.getElementsByName('progreso')[0];

    // console.log( this.txtProgress );

    if ( newValue >= 100 ) {
      this.progreso = 100;
    } else if ( newValue <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = newValue; 
    }

    // elemHTML.value = Number( this.progreso );

    this.txtProgress.nativeElement.value = this.progreso;

    this.cambioValor.emit(this.progreso);

    this.txtProgress.nativeElement.focus();
  }

  cambiarValor( valor: number ) {
    
    this.progreso += valor;
    
    if ( this.progreso <= 0 ) {
      this.progreso = 0;
    }

    if ( this.progreso >= 100 ) {
      this.progreso = 100;
    }

    this.cambioValor.emit(this.progreso);

  }

}
