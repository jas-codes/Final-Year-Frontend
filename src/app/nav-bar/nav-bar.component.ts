import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  title = 'Final-Year-Frontend';

  constructor(
    public authService: AuthService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    if (this.authService.user$) { //get the user
      this.router.navigate([
        { outlets: { navLinks: ['map'] } }
      ],
        { relativeTo: this.activatedRoute });
    }
  }


}
