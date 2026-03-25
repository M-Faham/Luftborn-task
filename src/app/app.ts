import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SplashScreenComponent } from './layout/loaders/splash-screen/splash-screen.component';

@Component({
  selector: 'lb-root',
  imports: [RouterOutlet, ToastModule, SplashScreenComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
