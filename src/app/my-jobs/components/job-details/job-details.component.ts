import { Component, OnInit, OnDestroy } from '@angular/core';
import { JobsService } from 'src/app/services/jobs.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { Subscription, of } from 'rxjs';
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
import { Company } from 'src/app/models/company';
import { CompletionState } from 'src/app/enums/completionState';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Location, DatePipe } from '@angular/common';
import { ReviewService } from 'src/app/review/services/review.service';
import { Review } from 'src/app/models/review';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  job: Job = new Job();
  trader: boolean = false;
  provideQuote: boolean = false;
  statusText: string = '';
  chosenQuote: Quote;
  quotesCollection: AngularFirestoreCollection<Quote>;
  quotesList: Quote[] = [];
  tradersQuote: Quote = new Quote();
  companyInfo: boolean = false;
  onGoing: boolean = false;
  finishedJob: boolean = false;
  review: Review = new Review();
  provideReview: boolean = false;
  userReviewScore: number = 0;

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
    private reviewService: ReviewService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    if(history.state) {
      this.subscriptions.push(of(history.state.data).subscribe((data) => {
        if(data) {
          this.job = data;
          this.subscriptions.push(this.jobsService.getJob(this.job.id).valueChanges().subscribe((job) => {
            this.job = job;
            this.setStatusText();
            this.job.completionState == CompletionState.active ? this.onGoing = true : this.onGoing = false
            this.job.completionState == CompletionState.closed ? this.finishedJob = true : this.finishedJob = false;
            this.shouldDisplayReview();
          }));
        }
      }));
    }

    if (this.authService.user$) {
      this.userSub = this.authService.user$.subscribe((user) => {
        this.user = user;
        if(this.user && this.job.lngLat) {
          this.centre = this.calculateCentre(this.job.lngLat, this.user.lngLat);
          this.drawMapMarkers();
        }

        this.userReviewScore = this.job.reviewScore;

        if (this.user.accountType == UserTypes.trader) { //if trader
          this.trader = true; //get the company
          this.subscriptions.push(this.companyService.getCompanyByUid(user.uid).valueChanges().subscribe((company) => {
            this.company = company;
          }));
          this.quotesCollection = this.quoteService.getQuoteByTrader(this.user.uid, this.job.id); //get traders quote
          this.subscriptions.push(this.quotesCollection.valueChanges().subscribe((quotes) => {
            if (quotes[0])
              this.tradersQuote = quotes[0];
          }));
        }

        this.quotesCollection = this.quoteService.getQuotesForJob(this.job.id)
        this.subscriptions.push(this.quotesCollection.valueChanges().subscribe((quotes) => {
          if(this.job.completionState == CompletionState.active || this.job.completionState == CompletionState.closed){
            this.chosenQuote = quotes[0];
          }
          this.quotesList = quotes;
        }));          
      });
    }
  }

  shouldDisplayReview() {
    console.log(this.job.reviewed);
    console.log('here')
    console.log('finished', this.job.completionState == CompletionState.closed)
    if(this.job.completionState == CompletionState.closed){
      console.log('user review', (!this.job.reviewed.user && !this.trader))
      console.log('trader review', (!this.job.reviewed.trader && this.trader))
      if(!this.job.reviewed.user && !this.trader)
        this.provideReview = true;
      else if (!this.job.reviewed.trader && this.trader)
        this.provideReview = true;
    }
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  drawMapMarkers() {
    this.markers.push(this.mapService.addMarker(this.job.lngLat, this.job.title, this.job.trade));
    if (!this.mapService.CompareLngLatPoints(this.user.lngLat, this.job.lngLat))
      this.markers.push(this.mapService.addPersonalMarker(this.user.lngLat));
  }

  calculateCentre(jobLngLat: google.maps.LatLngLiteral, userLngLat: google.maps.LatLngLiteral) {
    let lat = (jobLngLat.lat + userLngLat.lat) / 2;
    let lng = (jobLngLat.lng + userLngLat.lng) / 2;
    return { lat: lat, lng: lng }
  }

  setStatusText() {
    switch (this.job.completionState) {
      case CompletionState.active:
        this.statusText = 'The job is currently in progress'
        break;
      case CompletionState.avialable:
        this.statusText = 'Still available for traders'
        break;
      case CompletionState.closed:
        this.statusText = 'The job was completed on: '
        if(this.job.conclusionDate != undefined)
          this.statusText += this.datePipe.transform(this.job.conclusionDate, 'MMM dd, yyyy');  
        break;
      case CompletionState.quoted:
        this.statusText = 'The job has quotes for review'
        break;
      case CompletionState.traderAccepted:
        this.statusText = 'A trader has accepted the job for the budget'
        break;
    }
  }

  showProvideQuote() {
    this.provideQuote = !this.provideQuote;
  }

  showProvideReview() {
    this.provideReview = !this.provideReview;
  }

  setAccepted() {
    if (this.user.accountType == UserTypes.user) {
      if (this.job.completionState == CompletionState.traderAccepted) {
        let findTraderInJobWC = this.job.workCandidates.find((wcUid) => {
          return this.chosenQuote.traderUid == wcUid;
        });
        if (findTraderInJobWC) {
          this.job.quotes.forEach((quoteId) => {
            if (quoteId != this.chosenQuote.id)
              this.quoteService.deleteQuote(quoteId);
          });

          this.job.quotes = [];
          this.job.quotes.push(this.chosenQuote.id);
          this.job.workCandidates = [];
          this.job.workCandidates = [this.chosenQuote.traderUid];
          this.job.completionState = CompletionState.active;
          this.jobsService.updateJob(this.job);
        }
      }
    } else if (this.user.accountType == UserTypes.trader) {
      let findTraderInJobWC = this.job.workCandidates.find((wcUid) => {
        return wcUid == this.user.uid
      });
      if (!findTraderInJobWC) {
        this.job.completionState = CompletionState.traderAccepted;
        this.jobsService.setAcceptedJob(this.job, this.company.uid);
      }
    }
  }

  setRejected() {
    this.job.quotes = this.quoteService.removeQuoteFromJob(this.quotesList, this.job.quotes, this.user.uid);
    this.job.workCandidates = this.jobsService.removeWorkCandidates(this.user.uid, this.job.workCandidates);
    if(this.job.quotes.length <= 0)
      this.job.completionState = CompletionState.avialable;
    this.jobsService.updateJob(this.job);
    this.location.back();
  }

  deleteJob() {
    this.quoteService.deleteAllQuotesFromJob(this.job.id);
    this.jobsService.deleteJob(this.job);
    this.location.back();
  }

  createQuote(event: number) {
    var quote = new Quote();
    quote.amount = event;
    quote.traderUid = this.user.uid;
    quote.jobId = this.job.id;
    quote.companyName = this.company.companyName; 
    this.subscriptions.push(this.quoteService.createOrUpdateQuote(quote).subscribe((update) => {
      if (!update) {
        this.quoteService.createQuote(quote).toPromise().then(() => {
          this.job.quotes.push(quote.id);
          this.jobsService.updateJob(this.job);
        });
      }
    }));
  }

  createChat() {
    let traderUid;
    if (this.user.accountType == UserTypes.user)
      traderUid = this.chosenQuote.traderUid;
    else
      traderUid = this.user.uid;

    this.subscriptions.push(this.companyService.getCompanyByUid(traderUid).valueChanges().subscribe((company) => {
      this.subscriptions.push(this.chatService.openExistingChat(this.job.id, this.job.issueUid, company.uid).valueChanges().subscribe((chats) => {
        if (chats[0])
          this.navigationLinks('chats', chats[0].id);
        else {
          var chat = new Chat();

          if (company.photos[0])
            chat.companyPicture = company.photos[0];
          if (this.job.picture)
            chat.jobPicture = this.job.picture;

          chat.userUid = this.job.issueUid;
          chat.companyName = company.companyName;
          chat.traderUid = company.uid;
          chat.jobTitle = this.job.title;
          chat.jobId = this.job.id;
          chat.lastContact = Date.now();
          this.chatService.createChat(chat)
            .then((id) => this.navigationLinks('chats', id));
        }
      })
      )
    }));
  }

  showCompanyInfo() {
    var companySubscription = this.companyService.getCompanyByUid(this.chosenQuote.traderUid).valueChanges().subscribe((company) => {
      this.company = company;
      this.companyInfo = !this.companyInfo;
      companySubscription.unsubscribe();
    });
  }

  completeJob() {
    this.job.conclusionDate = Date.now();
    this.job.completionState = CompletionState.closed;
    this.jobsService.updateJob(this.job);
  }

  postReview(reviewEvent: Review){
    if(this.user.accountType == UserTypes.user) {
      var review: Review = {comment: reviewEvent.comment, score: reviewEvent.score, uid: this.job.workCandidates[0] };
      this.job.reviewed.user = true;
    } else {
      var review: Review = { comment: reviewEvent.comment, score: reviewEvent.score, uid: this.job.issueUid};
      this.job.reviewed.trader = true;
    }
    this.jobsService.updateJob(this.job);
    this.reviewService.postReview(review);
    this.provideReview = false;
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
