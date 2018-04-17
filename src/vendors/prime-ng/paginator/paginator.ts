import { NgModule, Component, ElementRef, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'dashboard-paginator',
    template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="'ui-paginator ui-widget ui-widget-header ui-unselectable-text'"
            *ngIf="alwaysShow ? true : (pageLinks && pageLinks.length > 1)">
            <a href="#" class="ui-paginator-first ui-paginator-element ui-state-default ui-corner-all" title = "First Page"
                    (click)="changePageToFirst($event)" [ngClass]="{'ui-state-disabled':isFirstPage()}"
                    [tabindex]="isFirstPage() ? -1 : null">
                <span class="fa fa-step-backward"></span>
            </a>
            <a href="#" class="ui-paginator-prev ui-paginator-element ui-state-default ui-corner-all" title = "Previous Page"
                    (click)="changePageToPrev($event)" [ngClass]="{'ui-state-disabled':isFirstPage()}"
                    [tabindex]="isFirstPage() ? -1 : null">
                <span class="fa fa-backward"></span>
            </a>
            <span class="ui-paginator-pages">
                <a href="#" *ngFor="let pageLink of pageLinks" class="ui-paginator-page ui-paginator-element ui-state-default ui-corner-all"
                    (click)="changePage(pageLink - 1, $event, 1)"
                    [ngClass]="{'ui-state-active': (pageLink-1 == getPage())}">{{pageLink}}</a>
            </span>
            <a href="#" class="ui-paginator-next ui-paginator-element ui-state-default ui-corner-all" title = "Next Page"
                    (click)="changePageToNext($event)" [ngClass]="{'ui-state-disabled':isLastPage()}" [tabindex]="isLastPage() ? -1 : null">
                <span class="fa fa-forward"></span>
            </a>
            <a href="#" class="ui-paginator-last ui-paginator-element ui-state-default ui-corner-all"
            title = "Last Page({{this.getPageCount()}})"
                    (click)="changePageToLast($event)" [ngClass]="{'ui-state-disabled':isLastPage()}" [tabindex]="isLastPage() ? -1 : null">
                <span class="fa fa-step-forward"></span>
            </a>
            <select class="ui-paginator-rpp-options ui-widget ui-state-default" *ngIf="rowsPerPageOptions" (change)="onRppChange($event)">
                <option *ngFor="let opt of rowsPerPageOptions" [value]="opt" [selected]="rows == opt">{{opt}}</option>
            </select>
        </div>
    `
})
export class Paginator {

    @Input() pageLinkSize = 5;

    @Output() onPageChange: EventEmitter<any> = new EventEmitter();

    @Input() style: any;

    @Input() styleClass: string;

    @Input() rowsPerPageOptions: number[];

    @Input() alwaysShow = false;

    public pageLinks: number[];

    public _totalRecords = 0;

    public _first = 0;

    public _rows = 0;

    @Input() get totalRecords(): number {
        return this._totalRecords;
    }

    set totalRecords(val: number) {
        this._totalRecords = val;
        this.updatePageLinks();
    }

    @Input() get first(): number {
        return this._first;
    }

    set first(val: number) {
        this._first = val;
        this.updatePageLinks();
    }

    @Input() get rows(): number {
        return this._rows;
    }

    set rows(val: number) {
        this._rows = val;
        this.updatePageLinks();
    }

    @Input() set setpageNum(val) {
       try { 
           if(!event){
           event =   event || window.event;
            }
            if (event != undefined) {
                this.changePage(val.activePage, event, 0);
            }
        } catch (e) {
            console.log('Event not Found');
        }
    }

    isFirstPage() {
        return this.getPage() === 0;
    }

    isLastPage() {
        return this.getPage() === this.getPageCount() - 1;
    }

    getPageCount() {
        return Math.ceil(this.totalRecords / this.rows) || 1;
    }

    calculatePageLinkBoundaries() {
        let numberOfPages = this.getPageCount(),
            visiblePages = Math.min(this.pageLinkSize, numberOfPages);

        // calculate range, keep current in middle if necessary
        let start = Math.max(0, Math.ceil(this.getPage() - ((visiblePages) / 2))),
            end = Math.min(numberOfPages - 1, start + visiblePages - 1);

        // check when approaching to last page
        let delta = this.pageLinkSize - (end - start + 1);
        start = Math.max(0, start - delta);

        return [start, end];
    }

    updatePageLinks() {
        this.pageLinks = [];
        let boundaries = this.calculatePageLinkBoundaries(),
            start = boundaries[0],
            end = boundaries[1];

        for (let i = start; i <= end; i++) {
            this.pageLinks.push(i + 1);
        }
    }

    changePage(p: number, event, actionType) {
        let pc = this.getPageCount();

        if (p >= 0 && p < pc) {
            this.first = this.rows * p;
            let state = {
                first: this.first,
                page: p,
                rows: this.rows,
                pageCount: pc,
                action: actionType
            };
            this.updatePageLinks();
            this.onPageChange.emit(state);
        }

        if (event) {
            event.preventDefault();
        }
    }

    getPage(): number {
        return Math.floor(this.first / this.rows);
    }

    changePageToFirst(event) {
        this.changePage(0, event, 1);
    }

    changePageToPrev(event) {
        this.changePage(this.getPage() - 1, event, 1);
    }

    changePageToNext(event) {
        this.changePage(this.getPage() + 1, event, 1);
    }

    changePageToLast(event) {
        this.changePage(this.getPageCount() - 1, event, 1);
    }

    onRppChange(event) {
        this.rows = this.rowsPerPageOptions[event.target.selectedIndex];
        this.changePageToFirst(event);
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [Paginator],
    declarations: [Paginator]
})
export class DashboardPaginatorModule { }
