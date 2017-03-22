import { Component, OnInit } from '@angular/core';
import { ApplicationInfo } from '../../interfaces/application-info';
import { ConfigHomeService } from '../../services/config-home.service';
import { MainInfo } from '../../interfaces/main-info';
import { EntityInfo } from '../../interfaces/entity-info';
@Component({
  selector: 'app-config-home',
  templateUrl: './config-home.component.html',
  styleUrls: ['./config-home.component.css']
})
export class ConfigHomeComponent implements OnInit {

  /**It stores application Info */
  applicationInfo: EntityInfo[];
  /**It stores topology Info */
  topologyInfo: EntityInfo[];
  /**It stores profile Info */
  profileInfo: EntityInfo[];

  constructor(private configHomeService: ConfigHomeService) { }

  ngOnInit() {
    this.loadHomeData();
  }

/**Getting topology list , application list and profile list. */
  loadHomeData(): void {
     this.configHomeService.getMainData()
      .subscribe(data => {

        this.applicationInfo = (data.homeData[0].value).slice(0, 5);
        this.profileInfo = (data.homeData[1].value).slice(0, 5);
        this.topologyInfo = (data.homeData[2].value).slice(0, 5);
     })
  }

}
