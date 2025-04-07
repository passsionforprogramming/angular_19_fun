import { HttpInterceptorFn } from '@angular/common/http';

// Hardcoded because of requirements
const TOKEN = '91141f43a987429cb84958cf76d769347144d11c5ad0ad1c7b9e1520d2e094d0';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
  return next(clonedRequest);
};
