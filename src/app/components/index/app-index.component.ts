import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { combineLatest } from 'rxjs';
import { catchError, concatMap, finalize, tap } from 'rxjs/operators';
import { AppContactComponent } from 'src/app/components/contact/app-contact.component';
import { IFlatNode, ITreeNode } from 'src/app/interfaces';
import { WINDOW } from 'src/app/services/app-services.module';
import { EventEmitterService } from 'src/app/services/emitter/event-emitter.service';
import { GithubService } from 'src/app/services/github/github.service';
import { UserConfigService } from 'src/app/services/user-config/user-config.service';

/**
 * Application index component.
 */
@Component({
  selector: 'app-index',
  templateUrl: './app-index.component.html',
  host: {
    class: 'mat-body-1',
  },
})
export class AppIndexComponent implements OnInit, OnDestroy {
  /**
   * Component data.
   */
  public data: {
    profiles: Array<{ name: string; link: string; imgRef: string }>;
    userConfig: {
      username: {
        github: string;
        hackerrank: string;
        codewars: string;
        codepen: string;
      };
      apps: Array<{
        name: string;
        imgRef: string;
        urls: { repo: string; web: string; android: string };
        tag: string;
      }>;
    };
    github: any;
    githubRepos: any[];
    githubLanguages: any;
    githubLanguagesKeys: string[];
    initialized: boolean;
  } = {
    profiles: [],
    userConfig: {} as any,
    github: {} as any,
    githubRepos: [] as string[],
    githubLanguages: {} as any,
    githubLanguagesKeys: [] as string[],
    initialized: false,
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
   * Material dialog instance.
   */
  private dialogInstance: MatDialogRef<AppContactComponent>;
  /**
   * Material dialog subscription.
   */
  private dialogSub: any;

  /**
   * Constructor.
   * @param dialog Material dialog
   * @param emitter Event emitter
   * @param userConfigService User configuration service
   * @param githubService Github service
   * @param window Window reference
   */
  constructor(
    private readonly dialog: MatDialog,
    private readonly emitter: EventEmitterService,
    private readonly userConfigService: UserConfigService,
    private readonly githubService: GithubService,
    @Inject(WINDOW) private readonly window: Window,
  ) {
    this.updateTreeData();
  }

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
        domain: this.window.location.origin,
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
   * Lifecycle hook called on component initialization.
   */
  public ngOnInit(): void {
    this.emitter.emitSpinnerStartEvent();
    this.getGithubAccessTokenFromServer()
      .pipe(
        concatMap(_ => this.getUserConfig()),
        concatMap(_ => combineLatest([this.getGithubProfile(), this.getGithubRepos()])),
        finalize(() => {
          this.emitter.emitSpinnerStopEvent();
        }),
      )
      .subscribe();
  }

  /**
   * Lifecycle hook called on component destruction.
   */
  public ngOnDestroy(): void {}

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
    return this.userConfigService.getData().pipe(
      tap(data => {
        this.data.userConfig = data;
        this.data.profiles = data.profiles;
        this.updateTreeData();
      }),
    );
  }

  /**
   * Gets Github access token.
   */
  private getGithubAccessTokenFromServer() {
    return this.githubService.getGithubAccessToken().pipe(
      tap((data: { token: string }) => {
        this.githubService.githubAccessToken = data.token;
      }),
      catchError((error: string, caught) => {
        this.githubService.githubAccessToken = error;
        return caught;
      }),
    );
  }

  /**
   * Gets user Github profile.
   */
  private getGithubProfile() {
    return this.githubService.getProfile(this.data.userConfig.username.github).pipe(
      tap((data: any) => {
        if (typeof data === 'object') {
          this.data.github = data;
          this.data.initialized = true;
        }
      }),
    );
  }

  /**
   * Gets user Github repos.
   */
  private getGithubRepos() {
    return this.githubService.getRepos(this.data.userConfig.username.github).pipe(
      concatMap((data: any) => {
        this.data.githubRepos = data;
        const languageObservables = [];
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
      tap((data: any) => {
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
}
