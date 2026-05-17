import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, filter, switchMap, take, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  return next(addToken(req, auth.getToken())).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || req.url.includes('/auth/')) {
        return throwError(() => error);
      }
      return handleUnauthorized(req, next, auth, error);
    })
  );
};

function addToken(req: HttpRequest<unknown>, token: string | null) {
  return token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
}

function handleUnauthorized(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  auth: AuthService,
  originalError: HttpErrorResponse
) {
  // Another request is already refreshing — wait for the new token
  if (auth.isRefreshing) {
    return auth.refreshToken$.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap(token => next(addToken(req, token))),
      catchError(() => throwError(() => originalError))
    );
  }

  // We are the first to attempt a refresh
  const refresh$ = auth.doRefresh();
  if (!refresh$) {
    auth.logout();
    return throwError(() => originalError);
  }

  auth.beginRefresh();
  return refresh$.pipe(
    switchMap(res => {
      auth.completeRefresh(res.accessToken);
      return next(addToken(req, res.accessToken));
    }),
    catchError(err => {
      auth.failRefresh();
      auth.logout();
      return throwError(() => err);
    })
  );
}
