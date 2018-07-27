import { Injectable } from '@angular/core';
import {RestService} from './rest.service';
import {AppConstants} from '../app.constants';
import { OrgMapInfo } from '../models/organization/OrgMapInfo';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private restService: RestService) { }

  public getAllOrganizations(): Observable<any> {
    console.log("From the getAllOrganizations....");
    return this.restService.findAll(AppConstants.ORGANIZATION_URL);
  }

  public getOrganization(id): Observable<any> {
    return this.restService.findOne(id, AppConstants.ORGANIZATION_URL);
  }

  public createOrganization(createRequest: any): Observable<any> {
    console.log("From the createOrganization.....");
    return this.restService.post(createRequest, AppConstants.ORGANIZATION_URL);
  }

  public updateOrganization(req: any): Observable<any> {
    console.log(req);
    return this.restService.update(req, AppConstants.ORGANIZATION_URL);
  }

  public deleteOrganization(orgId): Observable<any> {
    return this.restService.delete(AppConstants.DELETE_ORGANIZATION(orgId));
  }

}

