import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ThemeService } from 'src/app/services/theme.service';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  constructor(private dialog:MatDialog, private router:Router,
    public themeService:ThemeService){}

    logout(){
      const dialogConfig= new MatDialogConfig();
      dialogConfig.data = {
        message:'Logout'
      };
      const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
      const response = dialogRef.componentInstance.onEmitStatusChange.subscribe((response:any)=>{
       dialogRef.close();
        localStorage.removeItem('token')
        this.router.navigate(['/']);
      })
    }

    changeTheme(color:any){
      this.themeService.setTheme(color);
    }

}
