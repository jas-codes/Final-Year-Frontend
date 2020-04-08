import { CompletionState } from '../enums/completionState';
import { TradeType } from '../enums/trade-types';

export class Job {
    title: string;
    quote: number;
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
    issueUid: string;
}