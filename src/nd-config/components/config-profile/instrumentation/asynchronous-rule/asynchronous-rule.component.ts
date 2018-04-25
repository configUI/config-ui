import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { AsynchronousRuleType } from '../../../../containers/instrumentation-data';
import { ConfigKeywordsService } from '../../../../services/config-keywords.service';
import { ConfirmationService, SelectItem } from 'primeng/primeng'
import { ConfigUtilityService } from '../../../../services/config-utility.service';

import { ImmutableArray } from '../../../../utils/immutable-array';
import { deleteMany } from '../../../../utils/config-utility';

import { KeywordData, KeywordList } from '../../../../containers/keyword-data';
import { Keywords } from '../../../../interfaces/keywords';
import { Messages, descMsg } from '../../../../constants/config-constant'

@Component({
    selector: 'app-asynchronous-rule',
    templateUrl: './asynchronous-rule.component.html',
    styleUrls: ['./asynchronous-rule.component.css']
})
export class AsynchronousRuleComponent implements OnInit {
    @Input()
    profileId: number;
    @Input()
    saveDisable: boolean;
    @Output()
    keywordData = new EventEmitter();
    /**It stores asynchronous rule data */
    asynchronousRuleData: AsynchronousRuleType[];

    subscription: Subscription;
    keywordList: string[] = ['NDAsyncRuleConfig'];
    asynchronousRule: Object;
    selectedValues: boolean;
    keywordValue: Object;
    subscriptionEG: Subscription;
    enableGroupKeyword: boolean = false;
    isProfilePerm: boolean;


    constructor(private configKeywordsService: ConfigKeywordsService, private confirmationService: ConfirmationService, private configUtilityService: ConfigUtilityService, private store: Store<KeywordList>) {
        this.configKeywordsService.toggleKeywordData();
    }

    ngOnInit() {
        this.isProfilePerm = +sessionStorage.getItem("ProfileAccess") == 4 ? true : false;
        this.loadAsynchronousRuleList();
        if (this.profileId == 1 || this.profileId == 777777 || this.profileId == 888888)
            this.saveDisable = true;
        if (this.configKeywordsService.keywordData != undefined) {
            this.keywordValue = this.configKeywordsService.keywordData;
        }
        else {
            this.subscription = this.store.select("keywordData").subscribe(data => {
                var keywordDataVal = {}
                this.keywordList.map(function (key) {
                    keywordDataVal[key] = data[key];
                })
                this.keywordValue = keywordDataVal;
            });
        }
        this.asynchronousRule = {};
        this.keywordList.forEach((key) => {
            if (this.keywordValue.hasOwnProperty(key)) {
                this.asynchronousRule[key] = this.keywordValue[key];
                if (this.asynchronousRule[key].value == "true")
                    this.selectedValues = true;
                else
                    this.selectedValues = false;
            }
        });
    }

    saveKeywordData() {
        if (this.saveDisable == true) {
            return;
        }
        let filePath = '';
        for (let key in this.asynchronousRule) {
            if (key == 'NDAsyncRuleConfig') {
                if (this.selectedValues == true) {
                    this.asynchronousRule[key]["value"] = "true";
                }
                else {
                    this.asynchronousRule[key]["value"] = "false";
                }
            }

            this.configKeywordsService.keywordData[key] = this.asynchronousRule[key];
        }
        // this.configKeywordsService.saveProfileKeywords(this.profileId);
        this.configKeywordsService.getFilePath(this.profileId).subscribe(data => {
            if (this.selectedValues == false) {
                filePath = "NA";
            }
            else {
                filePath = data["_body"];
                filePath = filePath + "/asyncRule.txt";
            }
            this.asynchronousRule['NDAsyncRuleConfig'].path = filePath;
            this.keywordData.emit(this.asynchronousRule);
        });
    }

    /**This method is called to load data */
    loadAsynchronousRuleList() {
        this.configKeywordsService.getAsynchronousRuleList(this.profileId).subscribe(data => {
            this.asynchronousRuleData = data;
        });
    }

    /**Used to enabled/Disabled Asychronous Rule type */
    enableToggle(rowData: AsynchronousRuleType) {
      if (this.saveDisable == true) {
        return;
      }

      this.configKeywordsService.enableAsyncRuleTypeList(rowData.assocId, !rowData.enabled).subscribe(
        data => {
          if (rowData.enabled == true) {
            this.configUtilityService.infoMessage("Asychronous Rule is enabled.");
          }
          else {
            this.configUtilityService.infoMessage("Asychronous Rule is disabled.");
          }
        }
      );
    }

    saveAsynchronousRuleToFile() {
        this.saveKeywordData();
        this.configKeywordsService.saveAsynchronousRule(this.profileId)
            .subscribe(data => {
                console.log("return type", data)
            })
    }
}
