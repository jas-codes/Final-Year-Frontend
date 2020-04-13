import { Component, OnInit } from '@angular/core';
import { JobsService } from 'src/app/services/jobs.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/services/user.model';
import { UserTypes } from 'src/app/enums/user-types';
import { Router, ActivatedRoute } from '@angular/router';
import { Job } from 'src/app/models/job';
import { AuthService } from 'src/app/services/auth.service';
import { MapService } from 'src/app/map/map-services/map.service';
import { Chat } from 'src/app/models/chat';
import { Quote } from 'src/app/models/quote';
import { QuotesService } from 'src/app/services/quotes.service';
import { ChatService } from 'src/app/chats/services/chat.service';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { Company } from 'src/app/models/company';
import { CompletionState } from 'src/app/enums/completionState';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
  job: Job = new Job();
  trader: boolean = false;
  provideQuote: boolean = false;
  statusText: string = '';

  userSub: Subscription;
  user: IUser;
  company: Company = new Company();

  centre: google.maps.LatLngLiteral;
  markers: any[] = [];
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    styles: [{
      "featureType": "poi",
      "stylers": [{
        visibility: "off"
      }]
    }, {
      "featureType": "transit.station.bus",
      "stylers": [{
        visibility: "off"
      }]
    }],
    disableDefaultUI: true
  };

  constructor(
    private authService: AuthService,
    private jobsService: JobsService,
    private mapService: MapService,
    private companyService: CompaniesService,
    private chatService: ChatService,
    private quoteService: QuotesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.job = history.state.data
    this.setStatusText();
    if (this.authService.user$) {
      this.userSub = this.authService.user$.subscribe((user) => {
        this.user = user;
        this.centre = this.calculateCentre(this.job.lngLat, this.user.lngLat);
        this.markers.push(this.mapService.addMarker(this.job.lngLat, this.job.title, this.job.trade));
        this.markers.push(this.mapService.addPersonalMarker(this.user.lngLat));

        if (this.user.accountType == UserTypes.trader) { //if trader
          this.trader = true;
          this.companyService.getCompanyByUid(user.uid).valueChanges().subscribe((company) => {
            this.company = company
          })
        }
      });
    }
  }

  calculateCentre(jobLngLat: google.maps.LatLngLiteral, userLngLat: google.maps.LatLngLiteral) {
    let lat = (jobLngLat.lat + userLngLat.lat) / 2;
    let lng = (jobLngLat.lng + userLngLat.lng) / 2;
    return { lat: lat, lng: lng }
  }

  setStatusText(){
    switch (this.job.completionState) {
      case CompletionState.active:
        this.statusText = 'Active -> The job is currently in progress'
        break;
      case CompletionState.avialable:
        this.statusText = 'Available -> Still available for traders'
        break;
      case CompletionState.closed:
        this.statusText = 'Closed -> The job has concluded'
        break;
      case CompletionState.pending:
        this.statusText = 'Pending -> The job has quotes for review'
        break;
      case CompletionState.traderAccepted:
        this.statusText = 'Accepted -> A trader has accepted the job for the budget'
        break;
    }
  }

  showProvideQuote() {
    this.provideQuote = !this.provideQuote;
  }

  setAccepted() {
    this.job.completionState = CompletionState.traderAccepted;
    this.createQuote(this.job.budget);
    this.jobsService.setAcceptedJob(this.job, this.company.uid);
  }

  setRejected() {
    
  }

  createQuote(event: number) {
    var quote = new Quote();
    quote.amount = event;
    quote.traderUid = this.user.uid;
    quote.jobId = this.job.id;
    this.quoteService.createQuote(quote).toPromise().then(() => {
      this.job.quotes.push(quote.id);
      this.jobsService.updateJob(this.job);
    });
  }

  createChat() {
    this.chatService.openExistingChat(this.job.issueUid, this.user.uid).valueChanges().subscribe((chats) => {
      if(chats[0])
        this.navigationLinks('chats', chats[0].id);
      else {
        var chat = new Chat();

        if(this.company.photos[0])
          chat.companyPicture = this.company.photos[0];
        if(this.job.picture)
          chat.jobPicture = this.job.picture;
    
        chat.userUid = this.job.issueUid;
        chat.companyName = this.company.companyName;
        chat.traderUid = this.user.uid;
        chat.jobTitle = this.job.title
        chat.lastContact = Date.now();
        this.chatService.createChat(chat)
        .then((id) => this.navigationLinks('chats', id));
      }
    })
  }

  navigationLinks(url, id?) {
    if (id) {
      this.router.navigate([
        { outlets: { navLinks: [url, id] } }
      ],
        { relativeTo: this.activatedRoute.parent });
    } else {
      this.router.navigate([
        { outlets: { navLinks: [url] } }
      ],
        { relativeTo: this.activatedRoute.parent });
    }
  }
}
