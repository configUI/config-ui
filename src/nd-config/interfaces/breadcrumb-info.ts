import { Params } from '@angular/router';

export interface BreadcrumbInfo {
    label: string;
    params?: Params;
    url: string;
}