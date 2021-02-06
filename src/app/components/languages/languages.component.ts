import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IGithubRepoLanguages, IGithubRepoLanguagesRate } from 'src/app/interfaces';

import { UserService } from '../../state/user/user.service';

/**
 * Application languages component.
 */
@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLanguagesComponent {
  @Input() public githubLanguages?: IGithubRepoLanguages;

  @Input() public githubLanguagesKeys: string[] = [];

  @Input() public githubLanguagesRate?: IGithubRepoLanguagesRate;

  /**
   * Images 'show' state.
   */
  public imgShow: {
    [key: string]: boolean;
  } = {};

  /**
   * Constructor.
   */
  constructor(private readonly domSanitizer: DomSanitizer, private readonly user: UserService) {}

  /**
   * Image show event handler.
   */
  public showImage(imageKey: string): boolean {
    return this.imgShow[imageKey];
  }

  /**
   * Image loaded event handler.
   */
  public imgLoaded(imageKey: string): void {
    this.imgShow[imageKey] = true;
  }

  /**
   * Image error event handler.
   */
  public imgError(imageKey: string): void {
    this.imgShow[imageKey] = false;
  }

  /**
   * Returns language icon.
   */
  public languageIcon$(
    githubLangKeys: string[],
  ): Observable<{ url: SafeResourceUrl; key: string }[]> {
    return this.user.languageIcons$.pipe(
      map(languageIcons => {
        const result: { url: SafeResourceUrl; key: string }[] = [];
        for (const key of githubLangKeys) {
          const icon = languageIcons?.find(item => item.name === key)?.icon ?? '';
          const url = this.domSanitizer.bypassSecurityTrustUrl(icon);
          const obj = { key, url };
          result.push(obj);
        }
        return result;
      }),
    );
  }
}
