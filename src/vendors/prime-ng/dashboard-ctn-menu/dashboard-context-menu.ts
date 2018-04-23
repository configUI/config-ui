import { forEach } from '@angular/router/src/utils/collection';
import {
    NgModule, Component, ElementRef, AfterViewInit, OnDestroy, Input, Output,
    Renderer2, Inject, forwardRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler, MenuItem } from 'primeng/primeng';
import { Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as jQuery from 'jquery';

@Component({
    selector: 'dashboard-context-menu-sub',
    template: `
        <ul [ngClass]="{'ui-helper-reset':root, 'ui-widget-content ui-corner-all
        ui-helper-clearfix ui-menu-child ui-shadow':!root}" class="ui-menu-list"
            (click)="listClick($event)">
            <ng-template ngFor let-child [ngForOf]="(root ? item : item.items)">
                <li *ngIf="child.separator" class="ui-menu-separator ui-widget-content">
                <li *ngIf="!child.separator" #item [ngClass]="{'ui-menuitem ui-widget ui-corner-all':true,
                'ui-menu-parent':child.items,'ui-menuitem-active':item==activeItem}"
                    (mouseenter)="onItemMouseEnter($event,item,child)" (mouseleave)=
                    "onItemMouseLeave($event,item)" [style.display]="child.visible === false ? 'none' : 'block'">
                    <a *ngIf="!child.routerLink" [href]="child.url||'#'" [attr.target]="child.target"
                    [attr.title]="child.title" [attr.id]="child.id" (click)="itemClick($event, child)"
                        [ngClass]="{'ui-menuitem-link ui-corner-all':true,'ui-state-disabled':child.disabled}"
                         [ngStyle]="child.style" [class]="child.styleClass">
                        <span class="ui-submenu-icon fa fa-fw fa-caret-right" *ngIf="child.items"></span>
                        <span class="ui-menuitem-icon fa fa-fw" *ngIf="child.icon" [ngClass]="child.icon"></span>
                        <span class="ui-menuitem-text">{{child.label}}</span>
                    </a>
                    <a *ngIf="child.routerLink" [routerLink]="child.routerLink"
                    [queryParams]="child.queryParams" [routerLinkActive]="'ui-state-active'"
                        [routerLinkActiveOptions]="child.routerLinkActiveOptions||{exact:false}"
                        [attr.target]="child.target" [attr.title]="child.title" [attr.id]="child.id"
                        (click)="itemClick($event, child)" [ngClass]=
                        "{'ui-menuitem-link ui-corner-all':true,'ui-state-disabled':child.disabled}"
                        [ngStyle]="child.style" [class]="child.styleClass">
                        <span class="ui-submenu-icon fa fa-fw fa-caret-right" *ngIf="child.items"></span>
                        <span class="ui-menuitem-icon fa fa-fw" *ngIf="child.icon" [ngClass]="child.icon"></span>
                        <span class="ui-menuitem-text">{{child.label}}</span>
                    </a>
                    <dashboard-context-menu-sub class="ui-submenu" [item]="child" *ngIf="child.items"></dashboard-context-menu-sub>
                </li>
            </ng-template>
        </ul>
    `,
    providers: [DomHandler]
})
export class DashboardContextMenuSubComponent {

    @Input() item: MenuItem;
    @Input() root: boolean;
    activeItem: any;
    containerLeft: any;

    constructor(public domHandler: DomHandler, @Inject(forwardRef(() => DashboardContextMenuComponent))
    public contextMenu: DashboardContextMenuComponent) { }

    onItemMouseEnter(event, item, menuitem) {
        if (menuitem.disabled) {
            return;
        }

        this.activeItem = item;
        let nextElement = item.children[0].nextElementSibling;
        if (nextElement) {
            let sublist = nextElement.children[0];
            sublist.style.zIndex = ++DomHandler.zindex;
            this.position(sublist, item);
        }
    }

    onItemMouseLeave(event, link) {
        this.activeItem = null;
    }

    itemClick(event, item: MenuItem) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        if (!item.url) {
            event.preventDefault();
        }

        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
    }

    listClick(event) {
        this.activeItem = null;
    }

    position(sublist, item) {
        this.containerLeft = this.domHandler.getOffset(item.parentElement)
        let viewport = this.domHandler.getViewport();
        let sublistWidth = sublist.offsetParent ? sublist.offsetWidth : this.domHandler.getHiddenElementOuterWidth(sublist);
        let itemOuterWidth = this.domHandler.getOuterWidth(item.children[0]);

        sublist.style.top = '0px';

        if ((parseInt(this.containerLeft.left, 10) + itemOuterWidth + sublistWidth) > (viewport.width - this.calculateScrollbarWidth())) {
            sublist.style.left = -sublistWidth + 'px';
        } else {
            sublist.style.left = itemOuterWidth + 'px';
        }
    }

    calculateScrollbarWidth(): number {
        let scrollDiv = document.createElement('div');
        scrollDiv.className = 'ui-scrollbar-measure';
        document.body.appendChild(scrollDiv);

        let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);

        return scrollbarWidth;
    }
}

@Component({
    selector: 'dashboard-contextMenu',
    template: `
        <div #container id='currentContainer' [ngClass]="'ui-contextmenu ui-menu ui-widget ui-widget-content ui-corner-all
        ui-helper-clearfix ui-menu-dynamic ui-shadow'"
            [class]="styleClass" [ngStyle]="style" [style.display]="visible ? 'block' : 'none'">
            <dashboard-context-menu-sub [item]="model" root="root"></dashboard-context-menu-sub>
        </div>
    `,
    providers: [DomHandler]
})
export class DashboardContextMenuComponent implements AfterViewInit, OnDestroy {

    @Input() model: MenuItem[];

    @Input() global: boolean;

    @Input() target: any;

    @Input() style: any;

    @Input() styleClass: string;

    @Input() appendTo: any;

    @ViewChild('container') containerViewChild: ElementRef;

    container: HTMLDivElement;

    visible: boolean;

    documentClickListener: any;

    rightClickListener: any;

    count = 0;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer2) { }


    hideAllContextMenu() {
        let data = jQuery('[id="currentContainer"]');
        for (let k = 0; k < data.length; k++) {
            jQuery('[id="currentContainer"]').css('display', 'none');
        }
    }
    ngAfterViewInit() {
        this.container = <HTMLDivElement>this.containerViewChild.nativeElement;
        if (this.global) {
            this.rightClickListener = this.renderer.listen('document', 'contextmenu', (event) => {
                this.show(event);
                event.preventDefault();
            });
        } else if (this.target) {

            this.rightClickListener = this.renderer.listen(this.target, 'contextmenu', (event) => {
                this.show(event);
                event.preventDefault();
                event.stopPropagation();
            });
        } 

        if (this.appendTo) {
            if (this.appendTo === 'body') {
                document.body.appendChild(this.container);
            } else {
                this.domHandler.appendChild(this.container, this.appendTo);
            }
        }
    }

    show(event?: MouseEvent) {
        this.hideAllContextMenu();
        this.container.style.display = 'block';
        this.position(event);
        this.visible = true;
        this.domHandler.fadeIn(this.container, 250);
        this.bindDocumentClickListener();

        if (event) {
            event.preventDefault();
        }
    }

    hide() {
        this.visible = false;
        this.container = <HTMLDivElement>this.containerViewChild.nativeElement;
        this.unbindDocumentClickListener();
    }


    toggle(event?: MouseEvent) {
        if (this.visible) {
            this.hide();
        } else {
            this.show(event);
        }
    }

    position(event?: MouseEvent) {
        if (event) {
            let left = event.pageX + 1;
            let top = event.pageY + 1;
            let width = this.container.offsetParent ? this.container.offsetWidth :
                this.domHandler.getHiddenElementOuterWidth(this.container);
            let height = this.container.offsetParent ? this.container.offsetHeight :
                this.domHandler.getHiddenElementOuterHeight(this.container);
            let viewport = this.domHandler.getViewport();

            // flip
            if (left + width - document.body.scrollLeft > viewport.width) {
                left -= width;
            }

            // flip
            if (top + height - document.body.scrollTop > viewport.height) {
                top -= height;
            }

            // fit
            if (left < document.body.scrollLeft) {
                left = document.body.scrollLeft;
            }

            // fit
            if (top < document.body.scrollTop) {
                top = document.body.scrollTop;
            }

            this.container.style.left = left + 'px';
            this.container.style.top = top + 'px';
        }
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', (event) => {
                if (this.visible && event.button !== 2) {
                    this.hide();
                }
            });
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener === undefined) {
            this.documentClickListener = null;
        }
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }

    ngOnDestroy() {
        this.unbindDocumentClickListener();
        if (this.rightClickListener) {
            this.rightClickListener();
        }

        if (this.appendTo) {
            this.el.nativeElement.appendChild(this.container);
        }
    }
}

@NgModule({
    imports: [CommonModule, RouterModule],
    exports: [DashboardContextMenuComponent, RouterModule],
    declarations: [DashboardContextMenuComponent, DashboardContextMenuSubComponent]
})
export class DashboardContextMenuModule { }
