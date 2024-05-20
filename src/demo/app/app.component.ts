import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/api";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  items: MenuItem[] | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
      this.items = [
          { label: 'JSON', icon: 'pi pi-link', url: '/demo/json' },
          { label: 'MVEL', icon: 'pi pi-link', url: '/demo/java' },
          { label: 'PYTHON', icon: 'pi pi-link', url: '/demo/python' }
      ];
  }
}
