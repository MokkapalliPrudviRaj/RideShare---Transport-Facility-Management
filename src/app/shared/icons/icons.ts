import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icons.html',
  styleUrl: './icons.css',
})
export class Icons {
  @Input() name: string = '';
}
