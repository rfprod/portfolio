import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AppContactComponent } from 'src/app/components/contact/contact.component';
import { WINDOW } from 'src/app/services/providers.config';

import { UserService } from '../../state/user/user.service';

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
   * Material dialog instance.
   */
  private dialogInstance?: MatDialogRef<AppContactComponent>;

  /**
   * Material dialog subscription.
   */
  private dialogSub?: Subscription;

  /**
   * Constructor.
   */
  constructor(
    private readonly dialog: MatDialog,
    private readonly user: UserService,
    @Inject(WINDOW) private readonly win: Window,
  ) {
    void this.user.getUserData().subscribe();
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
    this.dialogSub = this.dialogInstance.afterClosed().subscribe(() => {
      this.dialogSub?.unsubscribe();
      this.dialogInstance = void 0;
    });
  }
}
