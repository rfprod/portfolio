import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IUserConfigProfile } from 'src/app/interfaces';

/**
 * Application profiles component.
 */
@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppProfilesComponent {
  @Input() public profiles: IUserConfigProfile[] = [];

  /**
   * Images 'show' state.
   */
  public imgShow: {
    github: boolean;
    codepen: boolean;
    codewars: boolean;
    hackerrank: boolean;
  } = {
    github: true,
    codepen: true,
    codewars: true,
    hackerrank: true,
  };

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
}
