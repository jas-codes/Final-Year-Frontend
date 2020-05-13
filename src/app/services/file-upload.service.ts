import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  fileName: string;
  task: AngularFireUploadTask;

  constructor(
    private aFireStorage: AngularFireStorage
  ) { }

  //constructs a filename
  createFileName(fileName) {
    this.fileName = fileName + '-' + (Math.round(Math.random()*10000)).toString();
  }

  //upload any file, used for images though
  uploadFile(file:File, blobLocation: string ,result) {
    this.createFileName(file[0].name);

    //blob location allows for method reuses for any folder on blob storage
    var storageRef = this.aFireStorage.ref(`${blobLocation}/${this.fileName}`);
    this.task = this.aFireStorage.upload(`${blobLocation}/${this.fileName}`, file[0]);

    this.task.then(() => {
      storageRef.getDownloadURL().toPromise().then(data => {
        result(data);//return data to result callback
      });
    }).catch((error) => {
      this.errorHandler(error);
      result('error');
    })
  }

  deleteFile(url: string) {
    this.aFireStorage.storage.refFromURL(url).delete();
  }

  errorHandler(error) {
    //log error with firebase analytics
    console.log(error);
    return error.statusText;
  }
}


