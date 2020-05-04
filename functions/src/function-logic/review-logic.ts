import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';


export const createReviewUpdate = functions
    .region('europe-west3') //set hosting region
    .firestore.document(`reviews/{reviewId}`) //document to spy on
    .onCreate(event => { //on document creation do this
        const reviewId = event.id
        const docReviewRef = admin.firestore().collection('reviews').doc(reviewId); //get do ref
        return docReviewRef.get().then(querySnapshotReview => {
            return processReviewData(querySnapshotReview)
        }).catch(error => console.log(error));
    })

//begin processing the data
function processReviewData(querySnapshotReview: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>) {
    const reviewData = querySnapshotReview.data(); //get the review doc data
    if (reviewData) {
        const reviewCollectionRef = admin.firestore().collection('reviews').where('uid', '==', reviewData.uid); // get all reviews for user
        return reviewCollectionRef.get().then(querySnapshotAllReviews => {
            return createAverageReviewScore(querySnapshotAllReviews, reviewData.uid); //work out average review score
        }).catch(error => console.log(error));
    } else {
        return undefined;
    }
}

function createAverageReviewScore(querySnapshotAllReviews: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>, uid: string) {
    let reviewsTotal = 0;
    querySnapshotAllReviews.forEach(review => {
        reviewsTotal += review.data().score
    });
    let averageReviewScore = reviewsTotal / querySnapshotAllReviews.size;
    averageReviewScore = Math.round((averageReviewScore + Number.EPSILON)*100)/100;
    editCompanyReviewData(averageReviewScore, uid); //update companies linked to user
    editJobReviewData(averageReviewScore, uid); //update jobs linked to user
    return editUserReviewData(averageReviewScore, uid); //update user linked to review
}

function editCompanyReviewData(reviewScore: number, uid: string) {
    const companyCollectionRef = admin.firestore().collection('companies').doc(uid);
    companyCollectionRef.get().then(querySnapshotCompany => {
        const companyData = querySnapshotCompany.data();
        if (companyData) { //if they don't have a company
            companyData.reviewScore = reviewScore;
            companyCollectionRef.update(companyData)
                .catch(error => console.log(error));
        }
    }).catch(error => console.log(error));
}

function editJobReviewData(reviewScore: number, uid: string) {
    const jobCollectionRef = admin.firestore().collection('jobs').where('issueUid', '==', uid); //get all jobs
    jobCollectionRef.get().then(querySnapshotJobs => {
        querySnapshotJobs.forEach((jobRef) => { //for each job ref, if they are a trader this will be 0
            const jobData = jobRef.data();
            jobData.reviewScore = reviewScore;
            jobRef.ref.update(jobData).catch(error => console.log(error));
        });
    }).catch(error => console.log(error))
}

function editUserReviewData(reviewScore: number, uid: string) {
    const userCollectionRef = admin.firestore().collection('users').doc(uid); //get user docRef
    return userCollectionRef.get().then(querySnapshotUser => {
        const userData = querySnapshotUser.data();
        if (userData) {
            userData.reviewScore = reviewScore
            return userCollectionRef.update(userData)
                .catch(error => console.log(error));
        } else
            return undefined
    }).catch(error => console.log(error));
}