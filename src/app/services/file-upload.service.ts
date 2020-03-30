import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  fileToUpload: File = null;
  fileName: string;
  storage = firebase.storage();
  storageRef: firebase.storage.Reference;
  constructor() { }

  ngOnInit(): void {
  }

  createFileName(fileName) {
    this.fileName = fileName + '-' + (Math.random()*1000).toString();
  }

  createReference() {
    this.storageRef = this.storage.ref();
    var newRef = this.storageRef.child(this.fileName);
    var newImageRef = this.storageRef.child(`images/${this.fileName}`);
  }

  async uploadFile(file:File, result) {
    this.createFileName(file[0].name);
    this.createReference();
    var uploadTask = this.storageRef.child(`images/${this.fileName}`).put(file[0]);

    return uploadTask.on(
      'state_changed', function(snapshot){
      // Observe state change events
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    },
    function(error) {
      console.log(error);
      result('error');
    }, function() {
      // Handle successful uploads on complete
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        result(downloadURL);
      });
    });
    
  }

  errorHandler(error) {
    //log error with firebase analytics
    console.log(error);
    return  error.statusText;
  }
}


