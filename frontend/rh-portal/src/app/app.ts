import {Component, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  // 🔹 Un titre professionnel et neutre
  title = signal('Human Resources & Employee Portal');

}
