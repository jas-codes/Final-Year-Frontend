import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IUser } from '../services/user.model';
import { Subscription } from 'rxjs';
import { JobsService } from '../services/jobs.service';
import { MapService } from './map-services/map.service';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Job } from '../models/job';
import { UserTypes } from '../enums/user-types';
import { CompaniesService } from '../services/companies.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { CompletionState } from '../enums/completionState';
import { Quote } from '../models/quote';
import { Company } from '../models/company';
import { ChatService } from '../chats/services/chat.service';
import { Chat } from '../models/chat';
import { QuotesService } from '../services/quotes.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  //component Variables
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  private subscriptions: Subscription[] = [];
  selected: any;
  jobsList: Job[];
  jobCollection: AngularFirestoreCollection<Job>;
  quotedJobCollection: AngularFirestoreCollection<Quote>;
  companyList: Company[];
  companycollection: AngularFirestoreCollection<Company>;
  postJob: boolean = false;
  abilityToPostJobs: boolean = false;
  provideQuote: boolean = false;
  acceptedJob: boolean = false;

  //user variables
  user: IUser;
  userSub: Subscription;
  company: Company;

  //google maps variables
  getLocationOptions = { enableHighAccuracy: true, maximumAge: Infinity, timeout: 5000 };
  mapHeight: string = window.innerHeight + 'px';
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
    private companiesService: CompaniesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private quoteService: QuotesService,
    public mapService: MapService
  ) { }

  ngOnInit(): void {
    var self = this;

    if (this.authService.user$) { //get the user
      this.userSub = this.authService.user$.subscribe((user) => {
        if (user != null) {
          this.user = user;
          if (user.accountType == UserTypes.user) { //what type of user
            this.drawCompanyMarkers();
            this.abilityToPostJobs = true;
          }
          else {
            this.drawJobMarkers(); //draw job markers and get company of user
            this.subscriptions.push(this.companiesService.getCompanyByUid(user.uid).valueChanges()
              .subscribe((company) => this.company = company));
          }
        }
      });
    }

    navigator.geolocation.getCurrentPosition(function (position) {
      self.centre = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    },
      this.errorCallbackAccuracy,
      this.getLocationOptions
    );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  //draw the available job markers on map
  private drawJobMarkers() {
    this.jobCollection = this.jobsService.getMapJobs()
    this.subscriptions.push(this.jobCollection.valueChanges().subscribe((jobs) => {
      this.jobsList = jobs;
      this.markers = []; //reset markers

      jobs.forEach((job) => {
        this.markers.push(this.mapService.addMarker(job.lngLat, job.title, job.trade));
      });
    }));
  }

  //draw the company job markers on map
  private drawCompanyMarkers() {
    this.companycollection = this.companiesService.getCompanies()
    this.subscriptions.push(this.companycollection.valueChanges().subscribe((companies) => {
      this.companyList = companies;
      this.markers = []

      companies.forEach((company) => {
        this.markers.push(this.mapService.addMarker(company.latlng, company.companyName, company.tradeType))
      });
    }));
  }

  //geolocation error callback
  errorCallbackAccuracy(err) {
    console.log('you have committed an oopsie');
    console.error(err)
  }

  //toggle new-job component
  showPostJob() {
    this.postJob = !this.postJob;
  }

  //open marker content when clicked
  openInfo(marker: MapMarker, index) {
    if (this.user.accountType == UserTypes.trader)
      this.selected = this.jobsList[index];
    else
      this.selected = this.companyList[index];
    this.infoWindow.open(marker);
  }

  showProvideQuote() {
    this.provideQuote = !this.provideQuote;
  }

  createQuote(event: number) {
    var quote = new Quote();
    quote.amount = event;
    quote.traderUid = this.user.uid;
    quote.jobId = this.selected.id;
    quote.companyName = this.company.companyName;
    this.subscriptions.push(this.quoteService.createOrUpdateQuote(quote).subscribe((update) => {
      if(!update) {
        this.quoteService.createQuote(quote).toPromise().then(() => {
          this.selected.quotes.push(quote.id);
          this.jobsService.updateJob(this.selected);
        });
      }
    }));
  }

  setAccepted() {
    var quoteSubscription: Subscription;
    this.selected.completionState = CompletionState.traderAccepted;
    this.quotedJobCollection = this.quoteService.getQuotesForJob(this.selected.id);
    quoteSubscription = this.quotedJobCollection.valueChanges().subscribe((quotes) => {
      if(quotes) {
        console.log(quotes);
        let searchQuotesForTrader = quotes.find((quote) => {
          return quote.traderUid == this.user.uid
        });
        console.log(searchQuotesForTrader);
        if(searchQuotesForTrader) {
          this.jobsService.setAcceptedJob(this.selected, this.company.uid);
          quoteSubscription.unsubscribe();
        } else {
          this.createQuote(this.selected.budget);
          this.jobsService.setAcceptedJob(this.selected, this.company.uid);
          quoteSubscription.unsubscribe();
        }
      }
    });
    this.infoWindow.close();
  }

  //create a chat with the job owner
  createChat() {
    //if they already have a chat
    this.subscriptions.push(this.chatService.openExistingChat(this.selected.issueUid, this.user.uid).valueChanges().subscribe((chats) => {
      if(chats[0]) // will return 1 or none always, due to firebase collections this has to be an array
        this.navigationLinks('chats', chats[0].id);
      else { // create new chat
        var chat = new Chat();

        if(this.company.photos[0])
          chat.companyPicture = this.company.photos[0];
        if(this.selected.picture)
          chat.jobPicture = this.selected.picture;
    
        chat.userUid = this.selected.issueUid;
        chat.companyName = this.company.companyName;
        chat.traderUid = this.user.uid;
        chat.jobTitle = this.selected.title
        chat.lastContact = Date.now();
        this.chatService.createChat(chat)
        .then((id) => this.navigationLinks('chats', id));
      }
    }))
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
