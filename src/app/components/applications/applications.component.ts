import { FlatTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { IFlatNode, ITreeNode, IUserConfig } from 'src/app/interfaces';

import { uiActions } from '../../modules/state/ui/ui.store';
import { UserService } from '../../modules/state/user/user.service';

/**
 * Tree transformer.
 */
function transformer(node: ITreeNode, level: number) {
  return {
    expandable: (node?.children?.length ?? 0) > 0,
    name: node.name,
    link: node.link ?? '',
    imgRef: node.imgRef ?? '',
    urls: node.urls ?? {
      repo: '',
      web: '',
      android: '',
    },
    tag: node.tag ?? '',
    level,
  };
}

/**
 * Applications tree component.
 */
@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppApplicationsComponent {
  /**
   * User data.
   */
  public data$ = this.user.userData$.pipe(
    tap(data => {
      this.updateTreeData(data.userConfig);
    }),
  );

  /**
   * Tree flattener.
   */
  private readonly treeFlattener = new MatTreeFlattener<ITreeNode, IFlatNode>(
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
   *
   */
  constructor(private readonly store: Store, private readonly user: UserService) {}

  /**
   * Resolves if tree node has a child.
   */
  public hasChild(index: number, node: IFlatNode): boolean {
    return node.expandable;
  }

  /**
   * Updates tree data with new values.
   */
  private updateTreeData(config?: IUserConfig): void {
    if (typeof config !== 'undefined') {
      const TREE_DATA: ITreeNode[] = [
        {
          name: 'Applications',
          children: [
            {
              name: 'AngularJS',
              children:
                'apps' in config ? config.apps.filter(item => item.tag === 'angularjs') : [],
            },
            {
              name: 'Angular',
              children: 'apps' in config ? config.apps.filter(item => item.tag === 'angular') : [],
            },
            {
              name: 'Other',
              children: 'apps' in config ? config.apps.filter(item => item.tag === 'other') : [],
            },
          ],
        },
      ];
      this.treeDataSource.data = TREE_DATA;
      this.treeControl.expandAll();
    }
  }

  /**
   * Closes sidebar.
   */
  public sidebarCloseHandler(): void {
    void this.store.dispatch(new uiActions.patchState({ sidenavOpened: false }));
  }
}
