import { ToastService } from './toast.service';
import { Component, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone: false
})
export class ToastComponent implements OnInit {

  constructor(public toastService: ToastService) { }

  ngOnInit() {}

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }
}