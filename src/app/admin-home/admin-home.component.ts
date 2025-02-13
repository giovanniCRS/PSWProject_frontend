import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';


@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit{

  constructor(private adminService:AdminService){}

  ngOnInit():void{}

  signOut():void{
    this.adminService.signOut()
  }
}
