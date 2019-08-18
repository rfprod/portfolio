import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  MatDialog,
  MatDialogRef
} from '@angular/material';

import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from '@angular/material/tree';

import {
  TreeNode,
  FlatNode
} from 'src/app/interfaces';

import { AppContactComponent } from 'src/app/components/contact/app-contact.component';

import { EventEmitterService } from 'src/app/services/emitter/event-emitter.service';
import { CustomDeferredService } from 'src/app/services/deferred/custom-deferred.service';
import { UserConfigService } from 'src/app/services/user-config/user-config.service';
import { GithubService } from 'src/app/services/github/github.service';

/**
 * Application index component.
 */
@Component({
  selector: 'app-index',
  templateUrl: './app-index.component.html',
  host: {
    class: 'mat-body-1'
  },
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppIndexComponent implements OnInit, OnDestroy {

  /**
   * Tree transformer.
   */
  private transformer = (node: TreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      link: node.link,
      imgRef: node.imgRef,
      urls: node.urls,
      tag: node.tag,
      level: level,
    };
  }

  /**
   * Updates tree data with new values.
   */
  private updateTreeData(): void {
    const TREE_DATA: TreeNode[] = [
      {
        name: 'Profiles',
        children: this.data.profiles
      }, {
        name: 'Applications',
        children: [
          {
            name: 'AngularJS',
            children: ('apps' in this.data.userConfig) ? this.data.userConfig.apps.filter((item: any) => item.tag === 'angularjs') : []
          },
          {
            name: 'Angular',
            children: ('apps' in this.data.userConfig) ? this.data.userConfig.apps.filter((item: any) => item.tag === 'angular') : []
          },
          {
            name: 'Other',
            children: ('apps' in this.data.userConfig) ? this.data.userConfig.apps.filter((item: any) => item.tag === 'other') : []
          },
        ]
      },
    ];
    this.treeDataSource.data = TREE_DATA;
  }

  /**
   * Constructor.
   * @param dialog Material dialog
   * @param emitter Event emitter
   * @param userConfigService User configuration service
   * @param githubService Github service
   * @param window Window reference
   */
  constructor(
    private dialog: MatDialog,
    private emitter: EventEmitterService,
    private userConfigService: UserConfigService,
    private githubService: GithubService,
    @Inject('Window') private window: Window
  ) {
    this.updateTreeData();
  }

  /**
   * Tree control.
   */
  public treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);

  /**
   * Tree flattener.
   */
  public treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);

  /**
   * Tree data source.
   */
  public treeDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  /**
   * Resolves if tree node has a child.
   * @param _ node index
   * @param node node data
   */
  public hasChild(_: number, node: FlatNode): boolean {
    return node.expandable;
  };

  /**
   * Component data.
   */
  public data: {
    profiles: { name: string, link: string, imgRef: string }[],
    userConfig: {
      username: {
        github: string,
        hackerrank: string,
        codewars: string,
        codepen: string
      },
      apps: {
        name: string,
        imgRef: string,
        urls: { repo: string, web: string, android: string },
        tag: string
      }[]
    },
    github: any,
    githubRepos: any[],
    githubLanguages: any,
    githubLanguagesKeys: string[],
    initialized: boolean
  } = {
    profiles: [],
    userConfig: {} as any,
    github: {} as any,
    githubRepos: [] as string[],
    githubLanguages: {} as any,
    githubLanguagesKeys: [] as string[],
    initialized: false
  };

  /**
   * Gets user config.
   */
  private getUserConfig(): Promise<any> {
    const def = new CustomDeferredService<any>();
    this.userConfigService.getData().subscribe(
      (data: any) => {
        this.data.userConfig = data;
        this.data.profiles = data.profiles;
        this.updateTreeData();
        def.resolve();
      },
      (error: any) => {
        def.reject(error);
      }
    );
    return def.promise;
  }

  /**
   * Gets Github access token.
   */
  private getGithubAccessTokenFromServer(): Promise<any> {
    const def = new CustomDeferredService<any>();
    if (!this.githubService.githubAccessToken || this.githubService.githubAccessToken === 'GITHUB_ACCESS_TOKEN') {
      this.githubService.getGithubAccessToken().subscribe(
        (data: { token: string }) => {
          this.githubService.githubAccessToken = data.token;
          def.resolve();
        },
        (error: string) => {
          this.githubService.githubAccessToken = error;
          def.reject();
        }
      );
    } else {
      def.resolve();
    }
    return def.promise;
  }

  /**
   * Gets user Github profile.
   */
  private getGithubProfile(): Promise<any> {
    const def = new CustomDeferredService<any>();
    this.githubService.getProfile(this.data.userConfig.username.github).subscribe(
      (data: any) => {
        if (typeof data === 'object') {
          this.data.github = data;
          this.data.initialized = true;
        }
        def.resolve();
      },
      (error: any) => {
        return def.reject(error);
      }
    );
    return def.promise;
  }

  /**
   * Gets user Github repos.
   */
  private getGithubRepos(): Promise<any> {
    const def = new CustomDeferredService<any>();
    this.githubService.getRepos(this.data.userConfig.username.github).subscribe(
      (data: any) => {
        this.data.githubRepos = data;
        for (let i = 0, max = this.data.githubRepos.length; i < max; i++) {
          this.getGithubRepoLanguages(this.data.githubRepos[i].name);
        }
        def.resolve();
      },
      (error: any) => {
        return def.reject(error);
      }
    );
    return def.promise;
  }

  /**
   * Gets user Github repo languages.
   * @param repoName repository name
   */
  private getGithubRepoLanguages(repoName: string): Promise<any> {
    const def = new CustomDeferredService<any>();
    this.githubService.getRepoLanguages(this.data.userConfig.username.github, repoName).subscribe(
      (data: any) => {
        loop:
        for (const [lang, value] of Object.entries(data)) {
          if (lang.indexOf('$') !== -1) {
            console.log('don\'t copy object properties other than languages');
            break loop;
          }
          if (this.data.githubLanguages.hasOwnProperty(lang)) {
            this.data.githubLanguages[lang] += data[lang];
          } else {
            this.data.githubLanguages[lang] = data[lang];
          }
          this.data.githubLanguagesKeys = Object.keys(this.data.githubLanguages);
        }
        def.resolve();
      },
      (error: any) => {
        return def.reject(error);
      }
    );
    return def.promise;
  }

  /**
   * Material dialog instance.
   */
  private dialogInstance: MatDialogRef<AppContactComponent>;
  /**
   * Material dialog subscription.
   */
  private dialogSub: any;

  /**
   * Shows contact dialog.
   */
  public showContactDialog(): void {
    console.log('TODO: show contact dialog');
    this.dialogInstance = this.dialog.open(AppContactComponent, {
      height: '80vh',
      width: '90vw',
      maxWidth: '1204px',
      maxHeight: '768px',
      disableClose: false,
      data: {
        domain: this.window.location.origin
      }
    });
    this.dialogSub = this.dialogInstance.afterClosed().subscribe((result: any) => {
      console.log('app contact dialog closed with result', result);
      this.dialogSub.unsubscribe();
      this.dialogInstance = undefined;
    });
  }

  /**
   * Images 'show' state.
   */
  public imgShow: any = {
    github: true as boolean,
    codepen: true as boolean,
    codewars: true as boolean,
    hackerrank: true as boolean
  };

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
      .then(() => this.getUserConfig())
      .then(() => this.getGithubProfile())
      .then(() => this.getGithubRepos())
      .then(() => {
        console.log('AppIndex init done, data', this.data);
        this.emitter.emitSpinnerStopEvent();
      })
      .catch((error: any) => {
        console.log('AppIndex init error', error);
        this.emitter.emitSpinnerStopEvent();
      });
  }

  /**
   * Lifecycle hook called on component destruction.
   */
  public ngOnDestroy(): void {}
}
