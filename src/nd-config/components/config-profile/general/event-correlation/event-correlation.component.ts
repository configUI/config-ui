import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { ConfigUiUtility } from '../../../../utils/config-utility';

import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfigUtilityService } from '../../../../services/config-utility.service';
import { cloneObject } from '../../../../utils/config-utility';

@Component({
    selector: 'app-event-correlation',
    templateUrl: './event-correlation.component.html',
    //   styleUrls: ['./event-corelation.component.css']
})
export class EventCorrelationComponent implements OnInit, OnDestroy {
    @Input()
    saveDisable: boolean;

    @Input()
    profileId: number;

    /**This is to send data to parent component(General Screen Component) for save keyword data */
    @Output()
    keywordData = new EventEmitter();

    className: string = "EventCorrelationComponent";

    /**These are those keyword which are used in current screen. */
    keywordList: string[] = ['correlateEventCallback'];

    /**It stores keyword data for showing in GUI */
    eventCorelation: any;
    subscription: Subscription;
    // subscriptionEG: Subscription;
    agentType: string = "";
    isProfilePerm: boolean;

    enableCorelation: boolean;
    eventCallBack: boolean;

    constructor(private configKeywordsService: ConfigKeywordsService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {
        this.agentType = sessionStorage.getItem("agentType");
        this.subscription = this.store.select("keywordData")
            .subscribe(data => {
                var keywordDataVal = {}
                this.keywordList.map(function (key) {
                    keywordDataVal[key] = data[key];
                })
                this.eventCorelation = keywordDataVal;
                this.methodToSetValue(this.eventCorelation);
            });
        this.configKeywordsService.toggleKeywordData();
    }

    ngOnInit() {
        this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
        this.getKeywordData();
    }

    /* This method is used to get the existing keyword data from the backend */
    getKeywordData() {
        let keywordData = this.configKeywordsService.keywordData;
        this.subscription = this.store.select("keywordData").subscribe(data => {
            var keywordDataVal = {}
            this.keywordList.map(function (key) {
                keywordDataVal[key] = data[key];
            })
            this.eventCorelation = keywordDataVal;
            this.methodToSetValue(this.eventCorelation)
        });
    }

    //This method is used to set value of data depending on data received in its argument
    methodToSetValue(data) {
        this.eventCorelation = data;
        for (let key in this.eventCorelation) {
            if (key == 'correlateEventCallback') {
                let correlationValue = this.eventCorelation[key]["value"];
                if (correlationValue.includes("%")) {
                    let arrValue = correlationValue.split("%");
                    if (arrValue[0] == "1" && arrValue[1] == "0") {
                        this.enableCorelation = true;
                        this.eventCallBack = false
                    }
                    if (arrValue[0] == "1" && arrValue[1] == "1") {
                        this.enableCorelation = true;
                        this.eventCallBack = true;
                    }
                }
                else {
                    this.enableCorelation = false;
                    this.eventCallBack = false;
                }
            }
        }
    }
    //Purpose : To save the settings 
    saveKeywordData() {
        if (this.enableCorelation) {
            if (this.eventCallBack) {
                this.eventCorelation["correlateEventCallback"].value = "1" + "%" + "1";
            }
            else {
                this.eventCorelation["correlateEventCallback"].value = "1" + "%" + "0";
            }
        }
        else {
            this.eventCorelation["correlateEventCallback"].value = "0";
        }
        this.keywordData.emit(this.eventCorelation);
    }
    //Reset the data of field to the previous saved data of server
    resetKeywordData() {
        this.getKeywordData();
    }
    //To reset the Keywords to its Default value
    resetKeywordsDataToDefault() {
        this.enableCorelation = false;
        this.eventCallBack = false;
    }
    /**
     * Purpose : To invoke the service responsible to open Help Notification Dialog 
     * related to the current component.
     */
    //   sendHelpNotification() {
    //     this.configKeywordsService.getHelpContent("General", "Event Correlation", this.agentType);
    //   }

    ngOnDestroy() {
        if (this.subscription)
            this.subscription.unsubscribe();
    }
}
