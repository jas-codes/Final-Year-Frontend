import * as functions from 'firebase-functions';
// The Firebase Admin SDK to access the Firebase Realtime Database.
import * as admin from 'firebase-admin';
import * as ReviewLogic from './function-logic/review-logic';

admin.initializeApp(functions.config().firebase);

export const updateReviewScores = ReviewLogic.createReviewUpdate;