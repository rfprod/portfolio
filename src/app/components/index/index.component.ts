/* eslint-disable no-labels */
import { FlatTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppContactComponent } from 'src/app/components/contact/contact.component';
import { IFlatNode, ITreeNode, IUserConfig } from 'src/app/interfaces';
import { WINDOW } from 'src/app/services/providers.config';

import { UserService } from '../../modules/state/user/user.service';

/**
 * Tree transformer.
 */
function transformer(node: ITreeNode, level: number) {
  return {
    expandable: Boolean(node.children) && node.children.length > 0,
    name: node.name,
    link: node.link,
    imgRef: node.imgRef,
    urls: node.urls,
    tag: node.tag,
    level,
  };
}

/**
 * Application index component.
 */
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppIndexComponent {
  /**
   * User data.
   */
  public data$ = this.user.userData$;

  /**
   * Github orgs..
   */
  public githubOrgs$ = this.user.githubOrgs$;

  /**
   * Public events.
   */
  public publicEvents$ = this.user.publicEvents$;

  /**
   * Images 'show' state.
   */
  public imgShow: {
    github: boolean;
    codepen: boolean;
    codewars: boolean;
    hackerrank: boolean;
    languageIcons: {
      [key: string]: boolean;
    };
  } = {
    github: true,
    codepen: true,
    codewars: true,
    hackerrank: true,
    languageIcons: {},
  };

  /**
   * Material dialog instance.
   */
  private dialogInstance: MatDialogRef<AppContactComponent>;

  /**
   * Material dialog subscription.
   */
  private dialogSub: Subscription;

  /**
   * Tree flattener.
   */
  private readonly treeFlattener = new MatTreeFlattener(
    transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  /**
   * Tree control.
   */
  public treeControl = new FlatTreeControl<IFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  /**
   * Tree data source.
   */
  public treeDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  /**
   * Constructor.
   */
  constructor(
    private readonly dialog: MatDialog,
    private readonly domSanitizer: DomSanitizer,
    private readonly user: UserService,
    @Inject(WINDOW) private readonly win: Window,
  ) {
    void this.user
      .getUserData()
      .pipe(
        tap(data => {
          this.updateTreeData(data.userConfig);
        }),
      )
      .subscribe();
  }

  /**
   * Resolves if tree node has a child.
   */
  public hasChild(index: number, node: IFlatNode): boolean {
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
    this.dialogSub = this.dialogInstance.afterClosed().subscribe(
      () => {
        this.dialogSub.unsubscribe();
        this.dialogInstance = null;
      },
      () => null,
    );
  }

  /**
   * Image show event handler.
   */
  public showImage(imageKey: string, languageIcon = false): boolean {
    return languageIcon ? this.imgShow.languageIcons[imageKey] : this.imgShow[imageKey];
  }

  /**
   * Image loaded event handler.
   */
  public imgLoaded(imageKey: string, languageIcon = false): void {
    if (languageIcon) {
      this.imgShow.languageIcons[imageKey] = true;
    } else {
      this.imgShow[imageKey] = true;
    }
  }

  /**
   * Image error event handler.
   */
  public imgError(imageKey: string, languageIcon = false): void {
    if (languageIcon) {
      this.imgShow.languageIcons[imageKey] = false;
    } else {
      this.imgShow[imageKey] = false;
    }
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
          const icon = languageIcons?.find(item => item.name === key)?.icon;
          const imageUrl = Boolean(icon) ? icon : '';
          const url = this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
          const obj = { key, url };
          result.push(obj);
        }
        return result;
      }),
    );
  }

  /**
   * Updates tree data with new values.
   */
  private updateTreeData(userConfig: IUserConfig): void {
    const TREE_DATA: ITreeNode[] = [
      {
        name: 'Applications',
        children: [
          {
            name: 'AngularJS',
            children:
              'apps' in userConfig ? userConfig.apps.filter(item => item.tag === 'angularjs') : [],
          },
          {
            name: 'Angular',
            children:
              'apps' in userConfig ? userConfig.apps.filter(item => item.tag === 'angular') : [],
          },
          {
            name: 'Other',
            children:
              'apps' in userConfig ? userConfig.apps.filter(item => item.tag === 'other') : [],
          },
        ],
      },
    ];
    this.treeDataSource.data = TREE_DATA;
  }
}
