import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../web-pages/shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WebPagesModule } from '../web-pages/web-pages.module';
import { AuthModule } from '../auth/auth.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    TooltipModule,
    InputTextModule,
    NgbTooltip,
    FormsModule,
    SharedModule,
    FlexLayoutModule,
    WebPagesModule,
    AuthModule,
    OverlayPanelModule,
    MenuModule,
    DialogModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ]
})
export class LayoutsModule { }
