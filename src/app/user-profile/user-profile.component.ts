import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  email: string = "";
  password: string = "";

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit(): void {
  }

}
