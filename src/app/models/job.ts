import { CompletionState } from '../enums/completionState';
import { TradeType } from '../enums/trade-types';

export class Job {
    id: string;
    title: string;
    quotes: string[] = [];
    budget: number;
    postcode: string;
    address: string;
    lngLat: google.maps.LatLngLiteral;
    description: string;
    picture?: string;
    timeframe: string;
    trade: TradeType;
    issueDate: number;
    conclusionDate: number;
    completionState: CompletionState;
    workCandidates: string[] = [];
    issueUid: string;
    userReviewScore: string;
    reviewScore: number;
    reviewed: {
        user: boolean;
        trader: boolean;
    } = { user: false, trader: false};
}