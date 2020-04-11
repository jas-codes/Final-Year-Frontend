import { CompletionState } from '../enums/completionState';
import { TradeType } from '../enums/trade-types';
import { Quote } from './quote';


export class Job {
    id: string;
    title: string;
    quote: any[] = [];
    budget: number;
    postcode: string;
    address: string;
    lngLat: google.maps.LatLngLiteral;
    description: string;
    picture?: string;
    timeframe: string;
    trade: TradeType;
    issueDate: Date;
    conclusionDate: Date;
    completionState: CompletionState;
    workCandidates: any[] = [];
    issueUid: string;
    userReviewScore: string;
}