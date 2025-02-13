import { Injectable } from '@angular/core';
import { Acquisto, CarrelloDto, Prodotto } from '../dataTypes';
import { ApiService } from './api.service';
import { API } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class CarrelloService {

  acquistiList:Acquisto[]=[] //lista Acquisti locale (non ancora inviati al be)

  headers = {'Authorization':'Bearer '+localStorage.getItem('user-token')}; //costante che definisce l'header di autorizzazione delle richieste 

  errorMessage!:String //messaggio di errore

  constructor(private apiService:ApiService) {

    //check se lista vuota 
    if(this.acquistiList.length == 0)

      //check se in localStorage abbiamo un Carrello salvato
      if(localStorage.getItem('carrello')!=null)
      {
        //caso positivo -> rigeneriamo la lista
        const s:string = localStorage.getItem('carrello') as string
        let arr:Acquisto[] = JSON.parse(s)
        for(var i=0; i<arr.length; i++)
          this.acquistiList[i] = new Acquisto(arr[i].idAcquisto, arr[i].prodottoVenduto, arr[i].quantita)
      }
    
    this.headers = {'Authorization':'Bearer '+localStorage.getItem('user-token')};
  }

  //aggiungiamo un Prodotto al Carrello
  addProduct(prod:Prodotto):void{

    //controlliamo se già presente
    for(var i=0; i<this.acquistiList.length; i++){
      if(this.acquistiList[i].getProd().ean.includes(prod.ean)){

        //non aggiungiamo se quantità in magazzino non sufficiente
        if(this.acquistiList[i].getProd().quantitaInMagazzino < this.acquistiList[i].getQuantita()+1)
          return

        //altrimenti settiamo la nuova quantità
        this.acquistiList[i].setQuantita(this.acquistiList[i].getQuantita()+1)
        localStorage.setItem('carrello', JSON.stringify(this.acquistiList))
        return
      }
    }

    //caso Prodotto esaurito
    if(prod.quantitaInMagazzino == 0)
      return

    //se Acquisto non presente lo creiamo (aggiunta al Carrello)
    this.acquistiList.push(new Acquisto(this.acquistiList.length, prod, 1))

    //lo aggiungiamo in locale
    localStorage.setItem('carrello', JSON.stringify(this.acquistiList))
  }

  //aggiorniamo quantità Acquisto nel Carrello
  updateQuantity(pos:number,num:number):void{

    for(var i=0; i<this.acquistiList.length; i++)
    {
      if(this.acquistiList[i].getId() == pos){

        //caso quantità in magazzino insufficiente
        if(this.acquistiList[i].getQuantita()+num <= 0)
        {
          this.acquistiList.splice(i, 1)
          localStorage.setItem('carrello', JSON.stringify(this.acquistiList))
          return
        }
        else
        {

          //caso nuova quantità minore di 0
          if(this.acquistiList[i].getProd().quantitaInMagazzino < this.acquistiList[i].getQuantita()+num)
            return

          //settiamo la nuova quantità
          this.acquistiList[i].setQuantita(this.acquistiList[i].getQuantita()+num)
          localStorage.setItem('carrello', JSON.stringify(this.acquistiList))
          return
        }
      }
    }
  }

  //restituisce il totale importo che si vuole acquistare
  getTotale():number{
    let tot:number = 0
    for(var i=0; i<this.acquistiList.length; i++){
      tot = tot + ( this.acquistiList[i].getProd().prezzo*this.acquistiList[i].getQuantita() )
    }
    return tot
  }

  //restituisce il numero totale dei prodotti che si vuole acquistare
  getTotProd():number{
    let tot:number = 0
    for(var i=0; i<this.acquistiList.length; i++){
      tot = tot + this.acquistiList[i].getQuantita() 
    }
    return tot
  }

  //invia una richiesta al be per creare un nuovo Carrello (con i relativi acquisti)
  checkout(cart:CarrelloDto):void{

    this.headers = {'Authorization':'Bearer '+localStorage.getItem('user-token')};

    //richiesta
    this.apiService.makeRequest("POST", API.carts, cart, this.headers).subscribe((res)=>{

      //caso positivo -> svuotiamo la lista in locale (andrà nello storico acquisti)
      this.acquistiList = []
      localStorage.setItem('carrello', JSON.stringify(this.acquistiList))
      window.location.reload()
    },
    error=>{
      this.errorMessage=error.error
    })
  }
}
