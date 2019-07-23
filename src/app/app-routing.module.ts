import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { DisplayNodesComponent } from './display-nodes/display-nodes.component';
const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'nodes',
    component: DisplayNodesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
