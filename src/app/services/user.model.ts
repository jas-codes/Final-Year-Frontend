export interface IUser {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    reviewScore?: number;
    phoneNumber?: number,
    firstName?: string,
    lastName?: string,
    dob?: Date,
    postcode?: string,
    accountType?: string,
    companyName?: string,
    tradeType?: string
}