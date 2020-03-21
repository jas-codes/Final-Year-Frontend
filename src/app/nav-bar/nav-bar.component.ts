import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  title = 'Final-Year-Frontend';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(){
    this.router.navigate([{outlets: {'nav-links':['map']}}], {relativeTo: this.route});
  }
}
