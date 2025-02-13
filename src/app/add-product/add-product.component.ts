import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria, Prodotto } from '../dataTypes';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit{

  productForm:FormGroup; //form aggiunta Prodotto
  updateProductForm:FormGroup; //form aggiornamento Prodotto

  categoryList:undefined | Categoria[] //contiene tutte le Categorie
  productList:undefined | Prodotto[] //contiene tutte le Prodotti

  private lastUpdate:undefined | String //ultimo Prodotto cliccato che si vuole modificare

  constructor(private formBuilder:FormBuilder, private productService:ProductService, private categoryService:CategoryService){
    this.productForm=this.formBuilder.group({
      ean:['', [Validators.required, Validators.pattern("^[0-9]+"), Validators.minLength(13)]],
      quantitaInMagazzino:['', [Validators.required, Validators.pattern("^[1-9]\\d*$")]],
      prezzo:['', [Validators.required, Validators.pattern("^[1-9]\\d*$")]],
      nome:['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]+$"), Validators.minLength(4)]],
      marca:['', [Validators.required]],
      categoria:['']
    })
    this.updateProductForm=this.formBuilder.group({
      ean:['', [Validators.required, Validators.pattern("^[0-9]+"), Validators.minLength(13)]],
      quantitaInMagazzino:['', [Validators.required, Validators.pattern("^[1-9]\\d*$")]],
      prezzo:['', [Validators.required, Validators.pattern("^[1-9]\\d*$")]],
      nome:['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]+$"), Validators.minLength(4)]],
      marca:['', [Validators.required]],
      categoria:['']
    })
  }

  //operazioni che avvengono a caricamento pagina
  ngOnInit(): void {

    //facciamo richiesta per tutte le Categorie
    this.categoryService.getAllCategories().subscribe((result)=>{
      if(result){this.categoryList=result}
    })

    //facciamo richiesta per tutti i Prodotti
    this.productService.getAllProducts().subscribe((result)=>{
      if(result){this.productList=result}
    })
  }

  //serve a far comparire / scomparire form aggiornamento Prodotto nel Html
  togglePopup(ean:String){

    this.lastUpdate = ean //registriamo su quale Prodotto avviene il click (passerà il suo ean come parametro della funzione)

    document.getElementById("popup-1")?.classList.toggle("active")
    document.getElementById("bl")?.classList.toggle("active")
  }

  //chiede al service di far richiesta per aggiunta di un Prodotto
  addProduct():void{
    const product:Prodotto=this.productForm.value;
    this.productService.addProduct(product).subscribe((res)=>{
      console.log("Prodotto aggiunto con successo!!!")
      window.location.reload()
    })
  }

  //chiede al service di far richiesta per aggiornamento di un Prodotto
  updateProduct():void{
    const product:Prodotto=this.updateProductForm.value;
    this.productService.updateProduct(product, this.lastUpdate).subscribe((res)=>{
      console.log("Prodotto modificato con successo!!!")
      window.location.reload()
    })
  }

  //chiede al service di far richiesta per rimozione di un Prodotto
  removeProduct(ean:String):void{
    this.productService.removeProduct(ean).subscribe((res)=>{
      console.log("Prodotto rimosso con successo!!!")
      window.location.reload()
    })
  }
}
