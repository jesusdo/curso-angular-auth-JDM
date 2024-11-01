import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@guards/auth.guard';
import { redirecGuard } from '@guards/redirec.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ redirecGuard ],
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'app',
    canActivate: [ authGuard ],
    loadChildren: () => import('./modules/layout/layout.module').then((m) => m.LayoutModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
