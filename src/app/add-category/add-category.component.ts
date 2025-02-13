import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { Categoria } from '../dataTypes';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit{

  categoryForm:FormGroup; //form aggiunta Categoria
  updateCategoryForm:FormGroup; //form aggiornamento Categoria

  categoryList:undefined | Categoria[] //contiene tutte le Categorie

  private lastUpdate:undefined | String //ultima categoria cliccata che si vuole modificare

  constructor(private formBuilder:FormBuilder, private categoryService:CategoryService){
    this.categoryForm=this.formBuilder.group({
      nome:['', [Validators.required, Validators.pattern("^[a-zA-Z][a-zA-Z\\s]+"), Validators.minLength(4)]]
    })
    this.updateCategoryForm=this.formBuilder.group({
      nome:['', [Validators.required, Validators.pattern("^[a-zA-Z][a-zA-Z\\s]+"), Validators.minLength(4)]]
    })
  }

  //operazioni che avvengono a caricamento pagina
  ngOnInit(): void {

    //facciamo richiesta per tutte le Categorie
    this.categoryService.getAllCategories().subscribe((result)=>{
    if(result){this.categoryList=result}
    })
  }

  //serve a far comparire / scomparire form aggiornamento Categoria nel Html
  togglePopup(nome:String){

    this.lastUpdate = nome //registriamo su quale Categoria avviene il click (passerà il suo nome come parametro della funzione)

    document.getElementById("popup-1")?.classList.toggle("active")
    document.getElementById("bl")?.classList.toggle("active")
  }

  //chiede al service di far richiesta per aggiunta di una Categoria
  addCategory():void{
    const category:Categoria=this.categoryForm.value;
    this.categoryService.addCategory(category).subscribe((res)=>{
      console.log("Categoria aggiunta con successo!!!")
      window.location.reload()
    })
  }

  //chiede al service di far richiesta per aggiornare una Categoria
  updateCategory():void{
    const category:Categoria=this.updateCategoryForm.value;
    this.categoryService.updateCategory(category, this.lastUpdate).subscribe((res)=>{
      console.log("Categoria aggiunta con successo!!!")
      window.location.reload()
    })
  }

  //chiede al service di far richiesta per rimuovere una Categoria
  removeCategory(nome:String):void{
    this.categoryService.removeCategory(nome).subscribe((res)=>{
      console.log("Categoria rimossa con successo!!!")
      window.location.reload()
    })
  }
}
