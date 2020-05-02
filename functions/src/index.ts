import * as functions from 'firebase-functions';
// The Firebase Admin SDK to access the Firebase Realtime Database.
import * as admin from 'firebase-admin';
// import Company from '../../src/app/models/company';

admin.initializeApp(functions.config().firebase);

//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const testFunction = functions
    .region('europe-west3')
    .firestore.document(`reviews/{reviewId}`)
    .onCreate(event => {
        console.log('here', event.id, event.data());
        const reviewId = event.id
        const docReviewRef = admin.firestore().collection('reviews').doc(reviewId);

        return docReviewRef.get().then(querySnapshotReview => {
            const reviewData = querySnapshotReview.data();
            console.log('data from snapshot', reviewData);
            if (reviewData) {
                const userCollectionRef = admin.firestore().collection('users').doc(reviewData.uid);
                const reviewCollectionRef = admin.firestore().collection('reviews').where('uid', '==', reviewData.uid);
                const companyCollectionRef = admin.firestore().collection('companies').doc(reviewData.uid);
                return reviewCollectionRef.get().then(querySnapshotAllReviews => {
                    let reviewsTotal = 0;
                    querySnapshotAllReviews.forEach(review => {
                        reviewsTotal += review.data().score
                    });
                    console.log('sum of score', reviewsTotal);
                    const averageReviewScore = reviewsTotal / querySnapshotAllReviews.size;
                    console.log('average', averageReviewScore);
                    companyCollectionRef.get().then(querySnapshotCompany => {
                        const companyData = querySnapshotCompany.data();
                        if (companyData) {
                            companyData.reviewScore = Math.round((averageReviewScore + Number.EPSILON)*100)/100;
                            companyCollectionRef.update(companyData)
                                .catch(error => console.log(error));
                        }
                    }).catch(error => console.log(error));
                    return userCollectionRef.get().then(querySnapshotUser => {
                        const userData = querySnapshotUser.data();
                        if (userData) {
                            console.log('user', userData)
                            userData.reviewScore =  Math.round((averageReviewScore + Number.EPSILON)*100)/100;
                            return userCollectionRef.update(userData)
                                .catch(error => console.log(error));
                        } else
                            return undefined
                    }).catch(error => console.log(error));
                }).catch(error => console.log(error));;
            } else
                return undefined
        }).catch(error => console.log(error));
    })

