import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTooltip, ApexYAxis, ApexPlotOptions, ApexStroke, ApexLegend, ApexFill, ApexMarkers, ApexGrid, ApexTitleSubtitle, ApexResponsive, NgApexchartsModule } from 'ng-apexcharts';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
  labels: string[];
  markers: ApexMarkers;
  grid: ApexGrid;
  title: ApexTitleSubtitle;
};
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterLink } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { FeatherIconsComponent } from '../../shared/components/feather-icons/feather-icons.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import Swal from 'sweetalert2';
import { HasRolesDirective } from 'app/layout/has-roles.directive';
import { MatDialog } from '@angular/material/dialog';
import { WebMaterialModule } from 'app/webmaterial.module';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'environments/environment';
@Component({
    selector: 'app-dashboard1',
    templateUrl: './dashboard1.component.html',
    styleUrls: ['./dashboard1.component.scss'],
    standalone: true,
    imports: [
        BreadcrumbComponent,
        WebMaterialModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        FeatherIconsComponent,
        NgApexchartsModule,
        NgScrollbar,
        RouterLink,
        MatProgressBarModule,
        MatCheckboxModule,
        MatTooltipModule,
        NgClass,
        CommonModule,
        HasRolesDirective,
    ],
})
export class Dashboard1Component implements OnInit {
  public areaChartOptions!: Partial<ChartOptions>;
  public barChartOptions!: Partial<ChartOptions>;
  public earningOptions!: Partial<ChartOptions>;
  public performanceRateChartOptions!: Partial<ChartOptions>;
dato: any;
  url=environment.imgUrl
  constructor(
    private router: Router,
    private dialog: MatDialog,
  
  ) {
    //constructor
  }
  ngOnInit() {
  }


}
