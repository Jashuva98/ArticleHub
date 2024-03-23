import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { sanitizeIdentifier } from '@angular/compiler';
import { SanitizeHtmlPipe } from '../pipe/sanitize-html.pipe';



@NgModule({
  declarations: [SanitizeHtmlPipe],
  imports: [
    CommonModule
  ],
  exports:[SanitizeHtmlPipe]
})
export class SharedModule { }
