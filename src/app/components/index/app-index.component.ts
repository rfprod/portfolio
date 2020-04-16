import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { concatMap, mapTo, tap } from 'rxjs/operators';
import { AppContactComponent } from 'src/app/components/contact/app-contact.component';
import {
  IFlatNode,
  IGithubRepoLanguages,
  IGithubUserOrganization,
  IGithubUserRepo,
  IGuthubUser,
  ITreeNode,
} from 'src/app/interfaces';
import { GithubService } from 'src/app/services/github/github.service';
import { WINDOW } from 'src/app/services/providers.config';
import { UserConfigService } from 'src/app/services/user-config/user-config.service';
import { IUserConfig, IUserConfigProfile } from '../../interfaces/user-config.interface';

/**
 * Application index component.
 */
@Component({
  selector: 'app-index',
  templateUrl: './app-index.component.html',
  styleUrls: ['./app-index.component.scss'],
  host: {
    class: 'mat-body-1',
  },
})
export class AppIndexComponent {
  public readonly loadData$ = this.githubService.getGithubAccessToken().pipe(
    concatMap(_ => this.getUserConfig()),
    concatMap(userConfig =>
      combineLatest([this.getGithubProfile(), this.getGithubRepos()]).pipe(mapTo(userConfig)),
    ),
    concatMap(userConfig => this.getGithubUserOrganizations().pipe(mapTo(userConfig))),
    concatMap(userConfig =>
      this.getGithubUserPublicEvents(userConfig.username.github).pipe(mapTo(userConfig)),
    ),
  );

  /**
   * Component data.
   */
  public data: {
    profiles: IUserConfigProfile[];
    userConfig: IUserConfig;
    github: IGuthubUser;
    githubRepos: IGithubUserRepo[];
    githubLanguages: IGithubRepoLanguages;
    githubLanguagesKeys: string[];
    githubUserOrganizations: IGithubUserOrganization[];
    githubOrgUrl$: BehaviorSubject<string>;
    publicEvents$: BehaviorSubject<any[]>;
  } = {
    profiles: [],
    userConfig: null,
    github: null,
    githubRepos: [],
    githubLanguages: {},
    githubLanguagesKeys: [],
    githubUserOrganizations: [],
    githubOrgUrl$: new BehaviorSubject<string>(''),
    publicEvents$: new BehaviorSubject<any[]>([]),
  };

  /**
   * Images 'show' state.
   */
  public imgShow: any = {
    github: true as boolean,
    codepen: true as boolean,
    codewars: true as boolean,
    hackerrank: true as boolean,
  };

  /**
   * Gets Github organizations.
   */
  public getGithubOrganization$;

  /**
   * Material dialog instance.
   */
  private dialogInstance: MatDialogRef<AppContactComponent>;
  /**
   * Material dialog subscription.
   */
  private dialogSub: any;

  constructor(
    private readonly dialog: MatDialog,
    private readonly userConfigService: UserConfigService,
    private readonly githubService: GithubService,
    @Inject(WINDOW) private readonly win: Window,
  ) {}

  /**
   * Resolves if tree node has a child.
   * @param _ node index
   * @param node node data
   */
  public hasChild(_: number, node: IFlatNode): boolean {
    return node.expandable;
  }

  /**
   * Shows contact dialog.
   */
  public showContactDialog(): void {
    this.dialogInstance = this.dialog.open(AppContactComponent, {
      height: '80vh',
      width: '90vw',
      maxWidth: '1204px',
      maxHeight: '768px',
      disableClose: false,
      data: {
        domain: this.win.location.origin,
      },
    });
    this.dialogSub = this.dialogInstance.afterClosed().subscribe((result: any) => {
      this.dialogSub.unsubscribe();
      this.dialogInstance = undefined;
    });
  }

  /**
   * Image show event handler.
   * @param imageKey image key
   */
  public showImage(imageKey: string): boolean {
    return this.imgShow[imageKey];
  }

  /**
   * Image loaded event handler.
   * @param imageKey image key
   */
  public imgLoaded(imageKey: string): void {
    this.imgShow[imageKey] = true;
  }

  /**
   * Image error event handler.
   * @param imageKey image key
   */
  public imgError(imageKey: string): void {
    this.imgShow[imageKey] = false;
  }

  /**
   * Tree transformer.
   */
  private readonly transformer = (node: ITreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      link: node.link,
      imgRef: node.imgRef,
      urls: node.urls,
      tag: node.tag,
      level,
    };
  };

  /**
   * Tree control.
   */
  // tslint:disable-next-line: member-ordering
  public treeControl = new FlatTreeControl<IFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  /**
   * Tree flattener.
   */
  // tslint:disable-next-line: member-ordering
  public treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  /**
   * Tree data source.
   */
  // tslint:disable-next-line: member-ordering
  public treeDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  /**
   * Updates tree data with new values.
   */
  private updateTreeData(): void {
    const TREE_DATA: ITreeNode[] = [
      {
        name: 'Profiles',
        children: this.data.profiles,
      },
      {
        name: 'Applications',
        children: [
          {
            name: 'AngularJS',
            children:
              'apps' in this.data.userConfig
                ? this.data.userConfig.apps.filter((item: any) => item.tag === 'angularjs')
                : [],
          },
          {
            name: 'Angular',
            children:
              'apps' in this.data.userConfig
                ? this.data.userConfig.apps.filter((item: any) => item.tag === 'angular')
                : [],
          },
          {
            name: 'Other',
            children:
              'apps' in this.data.userConfig
                ? this.data.userConfig.apps.filter((item: any) => item.tag === 'other')
                : [],
          },
        ],
      },
    ];
    this.treeDataSource.data = TREE_DATA;
  }
  /**
   * Gets user config.
   */
  private getUserConfig() {
    return this.userConfigService.getUserConfig().pipe(
      tap((data: IUserConfig) => {
        this.data.userConfig = data;
        this.data.profiles = data.profiles;
        this.updateTreeData();
      }),
    );
  }

  /**
   * Gets user Github profile.
   */
  private getGithubProfile() {
    return this.githubService.getProfile(this.data.userConfig.username.github).pipe(
      tap((data: IGuthubUser) => {
        this.data.github = data;
      }),
    );
  }

  /**
   * Gets user Github repos.
   */
  private getGithubRepos() {
    return this.githubService.getRepos(this.data.userConfig.username.github).pipe(
      concatMap((data: IGithubUserRepo[]) => {
        this.data.githubRepos = data;
        const languageObservables: Observable<IGithubRepoLanguages>[] = [];
        for (let i = 0, max = this.data.githubRepos.length; i < max; i = i + 1) {
          languageObservables.push(this.getGithubRepoLanguages(this.data.githubRepos[i].name));
        }
        return combineLatest(languageObservables);
      }),
    );
  }

  /**
   * Gets user Github repo languages.
   * @param repoName repository name
   */
  private getGithubRepoLanguages(repoName: string) {
    return this.githubService.getRepoLanguages(this.data.userConfig.username.github, repoName).pipe(
      tap((data: IGithubRepoLanguages) => {
        loop: for (const [lang, value] of Object.entries(data)) {
          if (lang.indexOf('$') !== -1) {
            // Don't copy object properties other than languages
            break loop;
          }
          if (this.data.githubLanguages.hasOwnProperty(lang)) {
            this.data.githubLanguages[lang] += data[lang];
          } else {
            this.data.githubLanguages[lang] = data[lang];
          }
          this.data.githubLanguagesKeys = Object.keys(this.data.githubLanguages);
        }
      }),
    );
  }

  /**
   * Gets Github user organizations.
   */
  private getGithubUserOrganizations() {
    return this.githubService.getUserOrganizations(this.data.userConfig.username.github).pipe(
      tap((data: IGithubUserOrganization[]) => {
        this.data.githubUserOrganizations = data;
        const org = this.data.github.company.trim().substring(1);
        this.getGithubOrganization$ = this.githubService
          .getOrganization(org)
          .pipe(
            tap(organization => {
              this.data.githubOrgUrl$.next(organization.blog);
            }),
          )
          .subscribe();
      }),
    );
  }

  private getGithubUserPublicEvents(username: string) {
    return this.githubService.getPublicEvents(username).pipe(
      tap(publicEventsData => {
        this.data.publicEvents$.next(publicEventsData);
      }),
    );
  }
}
