import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  fileToUpload: File = null;

  constructor(
    private http: HttpClient
  ) { }

  fileInput(files: FileList) {
    this.fileToUpload = files.item(0)
  }

  uploadFile(file: File): Observable<boolean> {
    const endpoint = '';
    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);
    return this.http
      .post(endpoint, formData)
      .pipe(
        map(() => { return true}),
        catchError((error) => {
          return Observable.throw(this.errorHandler(error))
        })
      );
    }

  errorHandler(error) {
    //log error with firebase analytics
    console.log(error);
    return  error.statusText;
  }
}


