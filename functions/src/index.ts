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
            if (reviewData) {
                const userCollectionRef = admin.firestore().collection('users').doc(reviewData.uid);
                const reviewCollectionRef = admin.firestore().collection('reviews').where('uid', '==', reviewData.uid);
                const companyCollectionRef = admin.firestore().collection('companies').doc(reviewData.uid);
                const jobCollectionRef = admin.firestore().collection('jobs').where('issueUid', '==', reviewData.uid)

                return reviewCollectionRef.get().then(querySnapshotAllReviews => {
                    let reviewsTotal = 0;
                    querySnapshotAllReviews.forEach(review => {
                        reviewsTotal += review.data().score
                    });
                    let averageReviewScore = reviewsTotal / querySnapshotAllReviews.size;
                    averageReviewScore = Math.round((averageReviewScore + Number.EPSILON)*100)/100;
                    companyCollectionRef.get().then(querySnapshotCompany => {
                        const companyData = querySnapshotCompany.data();
                        if (companyData) {
                            companyData.reviewScore = averageReviewScore
                            companyCollectionRef.update(companyData)
                                .catch(error => console.log(error));
                        }
                    }).catch(error => console.log(error));
                    jobCollectionRef.get().then(querySnapshotJobs => {
                        querySnapshotJobs.forEach((jobRef) => {
                            const jobData = jobRef.data();
                            jobData.reviewScore = averageReviewScore;
                            jobRef.ref.update(jobData).catch(error => console.log(error));
                        })
                    }).catch(error => console.log(error))
                    return userCollectionRef.get().then(querySnapshotUser => {
                        const userData = querySnapshotUser.data();
                        if (userData) {
                            userData.reviewScore = averageReviewScore
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

