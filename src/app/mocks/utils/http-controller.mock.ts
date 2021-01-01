import { HttpRequest } from '@angular/common/http';
import { HttpTestingController, RequestMatch, TestRequest } from '@angular/common/http/testing';

export type THttpRequestMatcher<T> = string | RequestMatch | ((req: HttpRequest<T>) => boolean);

export const flushHttpRequests = <T>(
  httpController: HttpTestingController,
  verify = false,
  matcher: THttpRequestMatcher<T> = (req: HttpRequest<T>): boolean => true,
  responseData:
    | string
    | number
    | Record<string, unknown>
    | ArrayBuffer
    | Blob
    | (string | number | Record<string, unknown> | null)[]
    | null = {},
): void => {
  httpController.match(matcher).forEach((req: TestRequest) => {
    req.flush(responseData);
  });
  if (verify) {
    httpController.verify();
  }
};
