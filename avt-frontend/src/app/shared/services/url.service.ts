import { Injectable } from '@angular/core';
import { NavigationEnd, Router, Event as RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  previousUrl!: string;
  currentUrl: string;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;

    router.events
      .pipe(
        filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.urlAfterRedirects;
      });
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }
}
