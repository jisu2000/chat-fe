import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterOutlet, RouterLink } from "@angular/router";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  imports: [RouterOutlet, RouterLink, MatSidenavModule, MatIconModule, MatListModule, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
  standalone: true
})
export class SidenavComponent {
  @Input() sidenavOpened = false;
  @Output() sidenavOpenedChange = new EventEmitter<boolean>();
}
