import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'professional-connect', loadChildren: () => import('./professional-connect/professional-connect.module').then(m => m.ProfessionalConnectModule) }
];
