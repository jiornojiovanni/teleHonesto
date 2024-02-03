import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { saveAs } from "file-saver";
@Component({
  selector: 'app-data-takeout',
  templateUrl: './data-takeout.component.html',
  styleUrls: ['./data-takeout.component.scss']
})
export class DataTakeoutComponent {

  constructor(public dialog: MatDialog, public userService: UserService, private authService: AuthService) {}

  onDelete() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {
        content: "Stai per procedere con l'eliminazione dei tuoi dati."
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.userService.deleteAllData().subscribe(result => {
        if (result.status == 200) {
          this.authService.logout();
          window.location.reload();
        }
      });
    });
  }

  onDownload() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {
        content: "Stai per procedere con il download dei dati."
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.userService.downloadAllData().subscribe((buffer: any) => {

        const data: Blob = new Blob([buffer.body], {
          type: "text/csv"
        });

        saveAs(data, "products.csv");
      });
    });
  }

}
