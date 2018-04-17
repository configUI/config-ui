import {NgModule,Component,ElementRef,AfterViewInit,OnDestroy,Input,Output,Renderer2,Inject,forwardRef,ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import { DomHandler, MenuItem } from 'primeng/primeng';
import {Location} from '@angular/common';
import {RouterModule} from '@angular/router';
/* Import Pipes. */

import { TruncateFavNamePipe } from './truncateFavname.pipe';
import * as jQuery from 'jquery';

@Component({
    selector: 'wd-favoriteSlideSubMenu',
    template: `
        <ul [ngClass]="{'ui-helper-reset ui-menu-rootlist':root, 'ui-widget-content ui-corner-all ui-helper-clearfix ui-menu-child':!root}" class="ui-menu-list"
            [style.width.px]="menuWidth" [style.left.px]="root ? slideMenu.left : slideMenu.menuWidth" 
            [style.transitionProperty]="root ? 'left' : 'none'" [style.transitionDuration]="effectDuration + 'ms'" [style.transitionTimingFunction]="easing">
            <ng-template ngFor let-child [ngForOf]="(root ? item : item.items)">
                <li *ngIf="child.separator" class="ui-menu-separator ui-menuitem ui-widget ui-corner-all">
                 <a class="ui-menuitem-link ui-corner-all" [href]="child.url||'#'" (click)="itemClick($event, child, listitem)" title="{{child.label}}" style="line-height: 10px;font-size: 12px;cursor:pointer;" title="{{child.label}}">
                  <span class="ui-menuitem-text">{{child.label}}</span>
                 </a><hr>
                </li>
                <li *ngIf="!child.separator" #listitem [ngClass]="{'ui-menuitem ui-widget ui-corner-all':true,'ui-menu-parent':child.items,'ui-slidemenuitem-active':listitem==activeItem}">
                    <a *ngIf="!child.routerLink" [href]="child.url||'#'" class="ui-menuitem-link ui-corner-all" [attr.target]="child.target"
                        [ngClass]="{'ui-menuitem-link-parent':child.items,'ui-state-disabled':child.disabled}" 
                        (click)="itemClick($event, child, listitem)" title="{{child.label}}">
                        <span class="ui-submenu-icon fa fa-fw fa-caret-right" id="favMozSupport" *ngIf="child.items"></span>
                        <span class="ui-menuitem-icon fa fa-fw" *ngIf="child.icon" [ngClass]="child.icon"></span>
                        <span class="ui-menuitem-text">{{child.label  | truncateFavName: 24: '..'}}</span>
                    </a>
                    <wd-favoriteSlideSubMenu class="ui-submenu" [item]="child" [menuWidth]="menuWidth" *ngIf="child.items"></wd-favoriteSlideSubMenu>
                </li>
            </ng-template>
        </ul>
    `
})
export class FavSlideMenuSub implements OnDestroy {

    @Input() item: MenuItem;
    
    @Input() root: boolean;
    
    @Input() backLabel: string = 'Back';
    
    @Input() menuWidth: string;
    
    @Input() effectDuration: any;
        
    @Input() easing: string = 'ease-out';
        
    constructor(@Inject(forwardRef(() => FavoriteSlideMenu)) public slideMenu: FavoriteSlideMenu) {}
        
    activeItem: any;
                            
    itemClick(event, item: MenuItem, listitem: any) {
        jQuery('#favoriteSlideMenu').scrollTop(0);
        if(item.disabled) {
            event.preventDefault();
            return;
        }
        
        if(!item.url) {
            event.preventDefault();
        }
                
        if(item.command) {            
            item.command({
                originalEvent: event,
                item: item
            });
        }
        
        if(item.items && !this.slideMenu.animating) {
            this.slideMenu.left -= this.slideMenu.menuWidth;
            this.activeItem = listitem;
            this.slideMenu.animating = true;
            setTimeout(() => this.slideMenu.animating = false, this.effectDuration);
        }
    }
        
    ngOnDestroy() {
        this.activeItem = null;
    }
}

@Component({
    selector: 'wd-favoriteSlideMenu',
    template: `
        <div #container [ngClass]="{'ui-menu ui-slidemenu ui-widget ui-widget-content ui-corner-all':true,'ui-menu-dynamic ui-shadow':popup}" 
            [class]="styleClass" [ngStyle]="style" (click)="onClick($event)">
            <div class="ui-slidemenu-wrapper" [style.height.px]="viewportHeight">
                <div #slideMenuContent class="ui-slidemenu-content" id="favoriteSlideMenu">
                    <wd-favoriteSlideSubMenu  [item]="model" root="root" [menuWidth]="menuWidth" [effectDuration]="effectDuration" [easing]="easing"></wd-favoriteSlideSubMenu >
                </div>
                <div #backward class="ui-slidemenu-backward ui-widget-header ui-corner-all" [style.display]="left ? 'block' : 'none'" (click)="goBack()">
                    <span class="fa fa-fw fa-caret-left"></span><span>{{backLabel}}</span>
                </div>
            </div>
        </div>
    `,
    providers: [DomHandler]
})
export class FavoriteSlideMenu implements AfterViewInit,OnDestroy {

    @Input() model: MenuItem[];

    @Input() popup: boolean;

    @Input() style: any;

    @Input() styleClass: string;
    
    @Input() menuWidth: number = 190;
    
    @Input() viewportHeight: number = 175;
    
    @Input() effectDuration: any = 250;
        
    @Input() easing: string = 'ease-out';
    
    @Input() backLabel: string = 'Back';
    
    @ViewChild('container') containerViewChild: ElementRef;
    
    @ViewChild('backward') backwardViewChild: ElementRef;
    
    @ViewChild('slideMenuContent') slideMenuContentViewChild: ElementRef;
    
    public container: HTMLDivElement;
    
    public backwardElement: HTMLDivElement;
    
    public slideMenuContentElement: HTMLDivElement;
    
    public documentClickListener: any;
    
    public preventDocumentDefault: any;
        
    public left: number = 0;
    
    public animating: boolean = false;
        
    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer2) {}

    ngAfterViewInit() {
        this.container = <HTMLDivElement> this.containerViewChild.nativeElement;
        this.backwardElement = <HTMLDivElement> this.backwardViewChild.nativeElement;
        this.slideMenuContentElement = <HTMLDivElement> this.slideMenuContentViewChild.nativeElement;
        this.slideMenuContentElement.style.height = this.viewportHeight - this.domHandler.getHiddenElementOuterHeight(this.backwardElement) + 'px';
        
        if(this.popup) {
            this.documentClickListener = this.renderer.listen('document', 'click', () => {
                if(!this.preventDocumentDefault) {
                    this.hide();
                }
                this.preventDocumentDefault = false;
            });
        }
    }
    
    toggle(event) {
        if(this.container.offsetParent)
            this.hide();
        else
            this.show(event);
    }
    
    show(event) {
        this.preventDocumentDefault = true;
        this.container.style.display = 'block';
        this.domHandler.absolutePosition(this.container, event.target);
        this.domHandler.fadeIn(this.container, 250);
    }
    
    hide() {
        this.container.style.display = 'none';
    }
    
    onClick(event) {
        this.preventDocumentDefault = true;
    }
    
    goBack() {
        this.left += this.menuWidth;
    }
        
    ngOnDestroy() {
        if(this.documentClickListener) {
            this.documentClickListener();
        }
    }

}

@NgModule({
    imports: [CommonModule,RouterModule],
    exports: [FavoriteSlideMenu,RouterModule],
    declarations: [FavoriteSlideMenu,FavSlideMenuSub,TruncateFavNamePipe]
})
export class DashboardFavoriteSlideMenuModule { }
