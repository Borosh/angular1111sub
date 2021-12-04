import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class RandomHeaderInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    /*     console.log({ req });
    const updatedReq = req.clone({
      setHeaders: {
        random: "myRandomHeader",
      },
    });

  return next.handle(updatedReq); */

    return next.handle(req).pipe(tap((a) => console.log("AFTER REQUEST", a)));
  }
}
