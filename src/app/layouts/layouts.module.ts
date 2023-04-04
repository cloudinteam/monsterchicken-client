import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';



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
    FormsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ]
})
export class LayoutsModule { }
