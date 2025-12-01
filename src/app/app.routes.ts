import { Routes } from '@angular/router';
import { NotFoundComponent } from '../component/not-found/not-found.component';
import { BaseComponent } from '../component/base/base.component';
import { BroadcastComponent } from '../component/broadcast/broadcast.component';
import { authGuard } from '../guard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: BaseComponent,
        children: [
            { path: 'broadcast', component: BroadcastComponent, canActivate: [authGuard] },
        ]
    },
    { path: '**', component: NotFoundComponent },
];
