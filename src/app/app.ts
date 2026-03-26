import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { SplashScreenComponent } from './layout/loaders/splash-screen/splash-screen.component';
import { TaskCardComponent } from './shared/components/task-card/task-card.component';
import { TasksResponse } from './shared/models';

@Component({
  selector: 'lb-root',
  imports: [RouterOutlet, ToastModule, SplashScreenComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
