import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { ToastController } from '@ionic/angular';

import { CommonService } from './common.service';
// import { FilesystemDirectory, Plugins } from "@capacitor/core";
// const { Filesystem, Storage } = Plugins;
export const File_Key = 'files';

const httpOptionsWithString = {
  headers: new HttpHeaders({ Authorization: 'Basic YWRtaW46YWRtaW4=' }),
  // withCredentials: true
  responseType: 'text' as 'json',
};

const httpOptionsWithJson = {
  headers: new HttpHeaders({
    Authorization: 'Basic YWRtaW46YWRtaW4=',
    'Content-Type': 'application/json;charset=utf-8',
  }),
  // withCredentials: true
};

const httpNormalString = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  }),
  responseType: 'text' as 'json',
};

const httpOptionWithFormData = {
  headers: new HttpHeaders({
    'Content-Type': 'multipart/form-data',
  }),
  responseType: 'text' as 'json',
};

@Injectable({
  providedIn: 'root',
})
export class AjaxService {
  downloadprogress: number;
  myFiles = [];

  constructor(
    private http: HttpClient,
    public toastController: ToastController,
    public commonService: CommonService
  ) {}

  handleError = async (error: HttpErrorResponse) => {
    if (this.commonService.isLoading == true) {
      this.commonService.dismissLoader();
    }
    console.log('Orginal Error' + JSON.stringify(error));
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message

    // this.toast('Something bad happened; please try again later.');
    //  const toast = await this.toastController.create({
    //     message: "Reaching server time out, please try after sometimes ",
    //     duration: 2000
    // });
    // toast.present();
    return null;
  };

  private returnhandleError(error: HttpErrorResponse) {
    // if(error.status === 200) {
    return error.error.text;
    // }
  }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }
  private extractDataError(res: Response) {
    const body: any = JSON.stringify(res);
    return body;
  }

  private extractStringData(res: Response) {
    const body = res;
    return body || '';
  }

  ajaxGet(url: string): Observable<any> {
    return this.http
      .get(url)
      .pipe(map(this.extractStringData), catchError(this.toast));
  }
  ajaxGetJson(url: string): Observable<any> {
    return this.http
      .get(url)
      .pipe(map(this.extractData), catchError(this.toast));
  }
  ajaxGetPerference(url: string): Observable<any> {
    return this.http
      .get(url)
      .pipe(map(this.extractStringData), catchError(this.toast));
  }
  ajaxGetObject(url: string): Observable<any> {
    return this.http
      .get(url, httpNormalString)
      .pipe(map(this.extractData), catchError(this.handleError));
  }
  ajaxGetWithString(url: string): Observable<any> {
    return this.http
      .get(url, httpOptionsWithString)
      .pipe(map(this.extractStringData), catchError(this.handleError));
  }

  ajaxGetWithBody(url: string): Observable<any> {
    // let newurl = "/Web/api/company/user/checkname/9600696008";
    return this.http
      .get(url, httpOptionsWithString)
      .pipe(map(this.extractData), catchError(this.handleError));
  }
  ajaxPutAsText(url: string, data: any): Observable<any> {
    return this.http
      .put(url, data, httpOptionsWithString)
      .pipe(map(this.extractStringData), catchError(this.handleError));
  }
  ajaxGetWithErr(url: string) {
    return this.http
      .get(url)
      .pipe(map(this.extractStringData), catchError(this.handleDeleteError));
  }
  ajaxGetWithBodyWithoutString(url: string): Observable<any> {
    return this.http
      .get(url, httpOptionsWithJson)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  ajaxPostWithBody(url: string, data: any): Observable<any> {
    return this.http
      .post(url, data, httpOptionsWithJson)
      .pipe(map(this.extractStringData), catchError(this.handleError));
  }
  ajaxPostWithFile(url: string, data: any): Observable<any> {
    return this.http
      .post(url, data)
      .pipe(map(this.extractStringData), catchError(this.handleError));
  }

  ajaxPostWithString(url: string, data: any): Observable<any> {
    return this.http
      .post(url, data, httpOptionsWithString)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  ajaxPutMethod(url: string, data: any): Observable<any> {
    return this.http
      .put(url, data, httpOptionsWithString)
      .pipe(map(this.extractStringData), catchError(this.handleError));
  }

  ajaxPutMethod2(url: string, data: FormData): Observable<any> {
    return this.http
      .put(url, data)
      .pipe(map(this.extractStringData), catchError(this.handleError));
  }

  ajaxPostMethod(url: string, data: any): Observable<any> {
    return this.http
      .post(url, data)
      .pipe(map(this.extractData), catchError(this.handleDeleteError));
  }

  ajaxPostMethodWithoutData(url: string): Observable<any> {
    return this.http
      .post(url, httpOptionsWithString, httpOptionsWithString)
      .pipe(map(this.extractStringData), catchError(this.returnhandleError));
  }

  ajaxPostWithErrorBody(url: string, data: any): Observable<any> {
    return this.http
      .post(url, data, httpOptionsWithJson)
      .pipe(map(this.extractDataError), catchError(this.returnhandleError));
  }

  requestDataFromMultipleSources(url: string, data: any): Observable<any[]> {
    const responses = [];
    data.forEach((element) => {
      const detailsforinsert = {};
      detailsforinsert['type'] = element.type;
      detailsforinsert['id'] = element.id;
      responses.push(
        this.http.put(
          url,
          JSON.stringify(detailsforinsert),
          httpOptionsWithString
        )
      );
    });
    // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
    return forkJoin(responses);
  }
  async toast() {
    // const toast = await this.toastController.create({
    //     message: "Something went wrong",
    //     duration: 2000
    // });
    // toast.present();
    console.log('Something went wrong');
  }

  deleteMultipleData(url: string, data: any): Observable<any[]> {
    const responses = [];
    data.forEach((element) => {
      let detailsforinsert = {};
      detailsforinsert['type'] = element.type;
      detailsforinsert['id'] = element.id;
      const options = {
        headers: new HttpHeaders({
          responseType: 'JSON',
        }),
        body: detailsforinsert,
      };
      responses.push(this.http.delete(url, options));
    });
    // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
    return forkJoin(responses);
  }
  ajaxDeleteWithBody(url: string, data: object): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        responseType: 'JSON',
      }),
      body: data,
    };
    return this.http
      .delete(url, options)
      .pipe(map(this.extractStringData), catchError(this.handleDeleteError));
  }
  async handleDeleteError(error: Response) {
    return error;
  }

  ajaxReportServices(
    reportName: string,
    body: object,
    outputRoute: string,
    callback: any,
    type = ''
  ) {
    var url = 'https://mvt.apmkingstrack.com/fleettracking' + '' + reportName;
    // if (app.appName != "FMS") {
    //   url = ServerUrl.web + "" + reportName;
    // } else {
    //   // url = ServerUrl.fmsUrl + "" + reportName;
    // }

    this.ajaxPostMethod(url, body).subscribe((res) => {
      console.log(res);
      callback(res, outputRoute);
    });
  }

  ajaxPutMethodJson(url: string, data: any): Observable<any> {
    return this.http
      .put(url, data, httpOptionsWithJson)
      .pipe(map(this.extractStringData), catchError(this.handleError));
  }

  ajaxDeleteWithString(url: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        responseType: 'JSON',
      }),
    };
    return this.http
      .delete(url, options)
      .pipe(map(this.extractStringData), catchError(this.handleDeleteError));
  }

  ajaxGetFile(url) {
    return this.http.get(url, {
      responseType: 'blob',
      reportProgress: true,
      observe: 'events',
    });
  }
}
