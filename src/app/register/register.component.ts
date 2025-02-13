import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  registerForm:FormGroup; //form di registrazione

  constructor(private formBuilder:FormBuilder, private userService:UserService){
    this.registerForm=this.formBuilder.group({
      nome:['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]+$"), Validators.minLength(2)]],
      cognome:['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]+$"), Validators.minLength(2)]],
      email:['', [Validators.required, Validators.pattern("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")]],
      password:['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$")]]
    })
  }

  //operazioni che avvengono a caricamento pagina
  ngOnInit(): void {
    this.userService.reloadUser()
  }

  signUp():void{
    this.userService.signUp(this.registerForm.value)
  }

  //serva a far apparire nel Html il messaggio di errore
  getErrorMessage():String{
    return this.userService.errorMessage
  }
}
