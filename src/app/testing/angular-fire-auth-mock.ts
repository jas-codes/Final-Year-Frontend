import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, of } from 'rxjs';

export class AngularFireAuthMock extends AngularFireAuth {
    authState: Observable<any> = of(undefined);
    user$ = undefined;
}