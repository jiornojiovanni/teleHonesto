import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  content = "";

  constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { content: string }) {
    this.content = data.content;
  }

  refuseDialog(): void {
    this.dialogRef.close(false);
  }

  acceptDialog(): void {
    this.dialogRef.close(true);
  }
}
