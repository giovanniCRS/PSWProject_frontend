import { Component, OnInit } from '@angular/core';
import { Acquisto } from '../dataTypes';
import { CarrelloService } from '../services/carrello.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general-interface',
  templateUrl: './general-interface.component.html',
  styleUrls: ['./general-interface.component.css']
})
export class GeneralInterfaceComponent implements OnInit{

  acquistiList:Acquisto[]=[] //contiene tutti gli acquisti locali (non ancora avvenuti)

  constructor(private carrelloService:CarrelloService, private userService:UserService, private router:Router){}

  //operazioni che avvengono a caricamento pagina
  ngOnInit(): void{
    this.acquistiList=this.carrelloService.acquistiList //settiamo la lista di questo componente esattamente uguale a quella del carrelloService
  }

  //serve per far apparire / scomparire l'elemento Html relativo al Carrello
  togglePopup(){
    document.getElementById("cart1")?.classList.toggle("active")
  }

  updateQuantity(pos:number,num:number):void{
    this.carrelloService.updateQuantity(pos, num)
  }

  getTotale():number{
    return this.carrelloService.getTotale()
  }

  //serve a cambiare pagina in base al fatto che Utente sia loggato o meno
  vai():void{
    if(this.userService.isUserLoggedIn.getValue())
      this.router.navigate(["checkout"])
    else 
      this.router.navigate(["login"])
  }
}
