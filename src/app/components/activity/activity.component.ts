import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { arc, pie, PieArcDatum } from 'd3-shape';
import { ARC_CHART_CONFIG, IChartDataNode, IGithubUserPublicEvent } from 'src/app/interfaces';

import { getRandomColor, ITypedSimpleChange } from '../../utils/index';

interface IInputChanges extends SimpleChanges {
  publicEvents: ITypedSimpleChange<IGithubUserPublicEvent<unknown>[]>;
}

/**
 * Application activity component.
 */
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppActivityComponent implements OnChanges, AfterViewInit {
  /**
   * Public events.
   */
  @Input() public publicEvents: IGithubUserPublicEvent<unknown>[] | null = null;

  /**
   * D3 chart view child reference.
   */
  @ViewChild('canvas') private readonly canvas?: ElementRef<HTMLCanvasElement>;

  /**
   * Creates chart data array.
   */
  private getChartData() {
    return (this.publicEvents ?? []).reduce((accumulator: IChartDataNode[], event) => {
      const eventTypeName = event.type.replace('Event', '').replace(/(?<!^)([A-Z])/, ' $1');
      const dataNodeIndex = accumulator.findIndex(node => node.key === eventTypeName);
      if (dataNodeIndex !== -1) {
        accumulator[dataNodeIndex].y += 1;
      } else {
        const newNode = { key: eventTypeName, y: 1 };
        accumulator.push(newNode);
      }
      return accumulator;
    }, []);
  }

  /**
   * Draws chart.
   */
  public drawChart(): void {
    const context = this.canvas?.nativeElement.getContext('2d');
    if (context !== null && typeof context !== 'undefined' && typeof this.canvas !== 'undefined') {
      const width = this.canvas.nativeElement.width;
      const height = this.canvas.nativeElement.height;
      const divisor = 2;
      const radius = Math.min(width, height) / divisor;

      const createArc = arc<PieArcDatum<IChartDataNode>>()
        .outerRadius(radius - ARC_CHART_CONFIG.ARC_INNER_RADIUS)
        .innerRadius(ARC_CHART_CONFIG.ARC_OUTER_RADIUS)
        .context(context);

      const createLabel = arc<PieArcDatum<IChartDataNode>>()
        .outerRadius(radius - ARC_CHART_CONFIG.LABEL_INNER_RADIUS)
        .innerRadius(radius - ARC_CHART_CONFIG.LABEL_OUTER_RADIUS)
        .context(context);

      const createPieChart = pie<IChartDataNode>().value(datum => datum.y);

      const scale = 1.25;
      context.translate(
        (width / divisor - radius) / scale,
        (height / divisor - radius / divisor) / scale,
      );

      context.transform(scale, 0, 0, scale, 0, 0);

      const chartData = this.getChartData();

      const arcs = createPieChart(chartData);

      arcs.forEach(datum => {
        context.fillStyle = getRandomColor();
        context.beginPath();
        createArc(datum);
        context.closePath();
        context.fill();
      });

      arcs.forEach(datum => {
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#000';
        const c = createLabel.centroid(datum);
        context.fillText(datum.data.key, c[0], c[1]);
      });
    }
  }

  /**
   * Draws chart after view is initialized.
   */
  public ngAfterViewInit(): void {
    this.drawChart();
  }

  /**
   * Redraws chart on changes.
   * @param changes
   */
  public ngOnChanges(changes: IInputChanges): void {
    if (changes.publicEvents.currentValue !== null) {
      this.drawChart();
    }
  }
}
