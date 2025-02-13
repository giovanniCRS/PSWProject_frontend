import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-auth',
  templateUrl: './admin-auth.component.html',
  styleUrls: ['./admin-auth.component.css']
})
export class AdminAuthComponent implements OnInit{

  loginForm:FormGroup; //form di login

    constructor(private formBuilder:FormBuilder, private adminService:AdminService){
      this.loginForm=this.formBuilder.group({
        //nessun validatore (il be non risponde per opzioni non valide)
        email:[''],
        password:['']
      })
    }

    //operazioni che avvengono a caricamento pagina
    ngOnInit(): void {
      this.adminService.reloadAdmin()
    }

    login():void{
      this.adminService.login(this.loginForm.value);
    }

    //serve a far apparire il messaggio di errore nel Html
    getErrorMessage():String{
      return this.adminService.errorMessage
    }

}
