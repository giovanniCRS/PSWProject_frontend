import { Component, OnInit } from '@angular/core';
import { Acquisto, CarrelloDto, Prodotto, Utente } from '../dataTypes';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit{

  user!: Utente; //oggetto dati Utente
  updateForm:FormGroup; //form di aggiornamento

  errorMessage!:String //messaggio di errore

  storicoOrdini:CarrelloDto[]=[]; //storico acquisti

  constructor(private formBuilder:FormBuilder, private userService:UserService, private router:Router){
    this.updateForm=this.formBuilder.group({
      nome:['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]+$"), Validators.minLength(2)]],
      cognome:['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]+$"), Validators.minLength(2)]],
      newpsw:['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$")]]
    })
  }

  //operazioni che avvengono a caricamento pagina
  ngOnInit(): void{

    //prendiamo oggetto Utente per mezzo della mail
    this.userService.getByEmail(localStorage.getItem('email')).subscribe((u)=>{
      this.user=u
    })

    //facciamo richiesta per ricevere tutti i suoi ordini
    this.userService.getOrdini(localStorage.getItem('email')).subscribe((res)=>{
      this.storicoOrdini=res
    })
  }

  //serve a far comparire / scomparire Pop-up aggiornamento nel Html
  togglePopup():void{
    document.getElementById("popup-update")?.classList.toggle("active")
  }

  //serve a far comparire / scomparire Pop-up rimozione nel Html
  deletePopup():void{
    document.getElementById("popup-delete")?.classList.toggle("active")
  }

  //serve a fare Sign Out
  signOut():void{
    this.userService.signOut()
  }

  //facciamo richiesta al service di aggiornamento dati
  updateUser():void{

    //prendiamo il valore nel form
    let valori=this.updateForm.value

    //prendiamo oggetto Utente loggato nel LocalStorage
    const u:string = localStorage.getItem('user') as string

    //creiamo un nuovo oggetto Utente settando i nuovi parametri
    let update:Utente=JSON.parse(u)
    update.nome=valori.nome
    update.cognome=valori.cognome
    update.email=this.user.email
    update.password=valori.newpsw

    //richiesta
    this.userService.updateUser(this.user?.email, update).subscribe((u)=>{

      //caso positivo -> salviamo in locale nuovo oggetto Utente
      this.user=u
      localStorage.setItem('user',JSON.stringify(update))
      window.location.reload()
    },
    error=>{

      //caso negativo -> mostriamo nel Html messaggio di errore
      this.errorMessage=error.error
    })
  }

  //facciamo richiesta al service di rimozione Utente
  deleteUser():void{
    this.userService.deleteUser(localStorage.getItem('email')).subscribe((u)=>{

      //in caso di avvenuta rimozione, rimuoviamo oggetti in locale
      localStorage.removeItem('user')
      localStorage.removeItem('email')
      this.router.navigate(['login'])
    })
  }

  getAcquisti(ordine:CarrelloDto):Acquisto[]{
    return ordine.acquisti;
  }

  getProd(a:Acquisto):Prodotto{
    return a.prodottoVenduto
  }
}