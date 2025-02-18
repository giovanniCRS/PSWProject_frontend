import { Component, EventEmitter, OnInit, Output, ɵɵqueryRefresh } from '@angular/core';
import { CarrelloService } from '../services/carrello.service';
import { Acquisto, CarrelloDto, CheckFormDto, Utente } from '../dataTypes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{

  @Output() ordineEffettuato = new EventEmitter<void>(); // Nuovo evento

  checkForm:FormGroup; //form Checkout
  acquistiList:Acquisto[]=[] //lista Acquisti locale
  storicoOrdini: any[] = [];

  constructor(private formBuilder:FormBuilder, private carrelloService:CarrelloService, private userService: UserService){
    this.checkForm=this.formBuilder.group({
      indirizzo:[''],
      numeroDiTelefono:['', [Validators.required, Validators.pattern("^((00|\\+)39?[\\. ]??)??3\\d{2}[\\. ]??\\d{6,7}$")]],
      metodoDiPagamento:['']
    })
  }

  //operazioni che avvengono a caricamento pagina
  ngOnInit(): void {
    this.acquistiList=this.carrelloService.acquistiList
  }

  //facciamo richiesta al service di procedere col Checkout
  checkout(): void {
    if (this.acquistiList.length == 0) return;
  
    let carrelloDto: CarrelloDto = this.buildCarrello();
  
    this.carrelloService.checkout(carrelloDto, () => {
      this.aggiornaStoricoOrdini(); // Aggiorna lo storico ordini
  
      // SVUOTA IL CARRELLO NEL COMPONENTE (AGGIORNA LA UI)
      this.acquistiList = [];
      window.location.reload();
    });
  } 

  aggiornaStoricoOrdini(): void {
    this.userService.getOrdini(localStorage.getItem('email')).subscribe((res) => {
      this.storicoOrdini = res;
    });
  }

  //prende l'array locale di Acquisti e i valori nel Checkoutform e costruisce un Carrello da spedire 
  private buildCarrello():CarrelloDto{
    let value:CheckFormDto = this.checkForm.value
    return new CarrelloDto(localStorage.getItem('email'), this.acquistiList, value.indirizzo, value.numeroDiTelefono, value.metodoDiPagamento)
  }

  updateQuantity(pos:number,num:number):void{
    this.carrelloService.updateQuantity(pos, num)
  }

  getErrorMessage():String{
    return this.carrelloService.errorMessage
  }

  getTotale():number{
    return this.carrelloService.getTotale()
  }
}
