import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  title = 'Final-Year-Frontend';
  showmaps: boolean = true;
  showMyJobs: boolean = false;
  showJobHistory: boolean = false;
  showMyPage: boolean = false;
  showChats: boolean = false;

  ngOnInit(){
    
  }

  setAllComponents(){
    this.showmaps = false;
    this.showMyJobs = false;
    this.showJobHistory = false;
    this.showMyPage = false;
    this.showChats = false;
  }

  mapSelected() {
    this.setAllComponents();
    this.showmaps = !this.showmaps;
  }

  myJobsSelected() {
    this.setAllComponents();
    this.showMyJobs = !this.showMyJobs;
  }
  
  jobHistorySelected() {
    this.setAllComponents();
    this.showJobHistory = !this.showJobHistory;
  }

  myPageSelected() {
    this.setAllComponents();
    this.showMyPage = !this.showMyPage;
  }

  chatsSelected() {
    this.setAllComponents();
    this.showChats = !this.showChats;
  }

}
