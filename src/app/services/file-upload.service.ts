import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  fileName: string;
  task: AngularFireUploadTask;
  percentage: Observable<number>;

  constructor(
    private aFireStorage: AngularFireStorage
  ) { }

  createFileName(fileName) {
    this.fileName = fileName + '-' + (Math.round(Math.random()*10000)).toString();
  }

  uploadFile(file:File, blobLocation: string ,result) {
    this.createFileName(file[0].name);

    var storageRef = this.aFireStorage.ref(`${blobLocation}/${this.fileName}`);
    this.task = this.aFireStorage.upload(`${blobLocation}/${this.fileName}`, file[0]);
    this.percentage = this.task.percentageChanges();

    this.task.then(() => {
      storageRef.getDownloadURL().toPromise().then(data => {
        result(data);
      });
    }).catch((error) => {
      this.errorHandler(error);
      result('error');
    })
  }

  errorHandler(error) {
    //log error with firebase analytics
    console.log(error);
    return error.statusText;
  }
}


