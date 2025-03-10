import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  loginForm:FormGroup; //form di login

  constructor(private formBuilder:FormBuilder, private userService:UserService){
    this.loginForm=this.formBuilder.group({
      //nessun validatore (il be non risponde per opzioni non valide)
      email:[''],
      password:['']
    })
  }

  //operazioni che avvengono a caricamento pagina
  ngOnInit(): void {
    this.userService.reloadUser()
  }

  login(): void {
    this.userService.login(this.loginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('email', res.utente.email);
        localStorage.setItem('user', JSON.stringify(res.utente));
        window.location.href = '/user-home'; // Usa un redirect manuale per garantire il caricamento
      },
      error: (err) => console.error("Errore nel login", err)
    });
  }

  //serve a far apparire il messaggio di errore nel Html
  getErrorMessage():String{
    return this.userService.errorMessage
  }
}
