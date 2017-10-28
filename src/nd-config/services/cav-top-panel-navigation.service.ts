import { Injectable } from '@angular/core';
import { NAV_LINKS } from '../constants/cav-navigation-links';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';

import {CavConfigService} from './cav-config.service'; 
@Injectable()
export class CavTopPanelNavigationService {

  /*Array of navigation menu. */
  private arrNavMenu: Array<any> = [];

   tabBroadcaster =  new Subject<String>();
  tabServiceProvider$ =   this.tabBroadcaster.asObservable();


  constructor(private _route: Router, private _config: CavConfigService) { 
    /* Adding default navigation. */
    this.arrNavMenu.push(this.getNavLinkByName('home'));
  }

  /* Getting Navigation Links. */
  getNavigationLinks() {
    return this.arrNavMenu;
  }
/*Removng all navigation on log out*/
  setNavigationLinksonLogOut(arrNavMenu) {
    this.arrNavMenu = arrNavMenu;
    this.arrNavMenu.push(this.getNavLinkByName('home'));
  }

  /**
   * Getting navigation link by name.
   */
  getNavLinkByName (name) {
    try {
      for (let i = 0; i < NAV_LINKS.length; i++) {
        if (NAV_LINKS[i] !== undefined && NAV_LINKS[i].name === name) {
          return NAV_LINKS[i];
        }
      }
    } catch (e) {
      console.error('Error while getting navigation link information for = ' + name, e);
    }
    return null;
  }

  /**Method is used to get active navigation link. */
  getActiveNavLinkName() {
    try {
      for (let i = 0; i < NAV_LINKS.length; i++) {
        if (NAV_LINKS[i] !== undefined && NAV_LINKS[i].isActive) {
          return NAV_LINKS[i].name;
        }
      }
      return 'home';
    } catch (e) {
      console.error(e);
      return 'home';
    }
  }

  /**
   * Adding navigation link by name.
   */
  addNewNaviationLink (name) {
    try {
        this.tabBroadcaster.next(name);

      /* Checking if Nav link already added. */
      if (this.isNavMenuExist(name)) {
        console.info('Navigation Menu already added in list. Activating navigation menu = ' + name);

        /* Activate Navigation link. */
        this.activateNavigationLink(name);

        return true;
      }

      let navLink = this.getNavLinkByName(name);

      if (navLink === null) {
         console.error('Navigation information not available for = ' + name);
         return false;
      }

      /* Adding navigation links. */
      this.arrNavMenu.push(navLink);

      /* Activate Navigation link. */
      this.activateNavigationLink(name);

      return true;
      
    } catch (e) {
      console.error('Error while adding navigation link information for = ' + name, e);
      return false;
    }
  }

  /*Checking if navigation menu exist.*/
  isNavMenuExist (name) {
    try {
      for (let i = 0; i < this.arrNavMenu.length; i++) {
        if (this.arrNavMenu[i] !== undefined && this.arrNavMenu[i].name === name) {
          return true;
        }
      }
    } catch (e) {
      console.error('Error while checking navigation link availability information for = ' + name, e);
    }
    return false;      
  }

  /** Activating Navigation Links. */
  activateNavigationLink (name) {
    try {
      for (let i = 0; i < this.arrNavMenu.length; i++) {
        if (this.arrNavMenu[i] !== undefined && this.arrNavMenu[i].name === name) {
          this.arrNavMenu[i].isActive = true;
        } else {
          this.arrNavMenu[i].isActive = false;
        }
      } 
    } catch (e) {
      console.error('Error while activating navigation link for = ' + name, e);
    }
  }

  /** Removing navigation links. */
  removeNavigationLink (name) {
    try {

       /*Checking if navigation length is greater than 1. */
       if (this.arrNavMenu.length <= 1) {
         console.warn('Only one Tab Left which cannot be closed.');
         return;
       }

       for (let i = 0; i < this.arrNavMenu.length; i++) {
        if (this.arrNavMenu[i] !== undefined && this.arrNavMenu[i].name === name) {
          if (this.arrNavMenu[i].isActive) {
            this.activateNavigationLink('home');
            this._route.navigate(['/home']);
            this.arrNavMenu.splice(i, 1);
            break;
          } else {
            let activeNavTab = this.getActiveNavLinkName();
            this.arrNavMenu.splice(i, 1);
            this.activateNavigationLink(activeNavTab);
            break;
          }
        }
      }
    } catch (e) {
      console.error('Error while removing navigation link for = ' + name, e);
    }
  }

  /** Add DC Name Corresponsding to screen*/
  addDCNameForScreen (name, dcName){
    try {

       if(sessionStorage.getItem('isMultiDCMode') == undefined)
 	 return;

       for (let i = 0; i < this.arrNavMenu.length; i++) {
        if (this.arrNavMenu[i] !== undefined && this.arrNavMenu[i].name === name) {
   	  this.arrNavMenu[i]['dcName'] = dcName;
        }
      }
      sessionStorage.setItem('navMenu', JSON.stringify(this.arrNavMenu));
    } catch (e) {
      console.error('Error while adding DC Name for = ' + name, e);
    }
  }
 
  /** Get DC Name for current screen*/
  getDCNameForScreen(name) {
    try {

       let dcName = '';

       for (let i = 0; i < this.arrNavMenu.length; i++) {
        if (this.arrNavMenu[i] !== undefined && this.arrNavMenu[i].name === name) {
            if (this.arrNavMenu[i]['dcName'] !== undefined) {
              dcName = this.arrNavMenu[i]['dcName'];
	      this._config.setActiveDC(dcName);
	      sessionStorage.setItem('activeDC', dcName);
              break;
            }
        }
      }
      if(sessionStorage.getItem('isMultiDCMode')){
	if(dcName == undefined || dcName == '') {
	  let navObj = JSON.parse(sessionStorage.getItem('navMenu'));
	  for(let i = 0 ; i < navObj.length ; i++) {
	    if(navObj[i] !== undefined && navObj[i]['name'] === name){
	      if(navObj[i]['dcName'] !== undefined)
	  	return navObj[i]['dcName'];	
 	    }
	    else
		return sessionStorage.getItem('activeDC');
	  }
	}
	else 
 	  return dcName;
      }
      else
        return dcName;
    } catch (e) {
      console.error('Error while getting DC Name for = ' + name, e);
      return '';
    }
  }

  /** Close rest DC Tabs  */
  closeDCTabsOtherThanActive(name) {
    try {	
       var count = 0;
       for (let i = 0; i < this.arrNavMenu.length; i++) {
        if (this.arrNavMenu[i] !== undefined && this.arrNavMenu[i]['dcName'] !== undefined) {
	  if(this.arrNavMenu[i]['dcName'] != name) {
	    //this.arrNavMenu[i].isActive = false;
	    this.removeNavigationLink (this.arrNavMenu[i].name);
	    count++;
	  }
        }
      }
      if(count < 1)
        return false;
      else
        return true;
    } catch (e) {
      console.error('Error while closing other DC Tabs for = ' + name, e);
    }
  }
}
