import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';

import * as orgActions from './org.actions';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';

import {GetAllOrganization} from './org.actions';
import {OrganizationService} from '../../services/organization.service';
import * as OrgActions from './org.actions';
import { switchMap, map } from 'rxjs/operators';
import { OrgMapInfo } from '../../models/organization/OrgMapInfo';


@Injectable()
export class OrgnizationEffects{
    constructor(
        private actions$: Actions,
        private svc: OrganizationService
    ){}
    @Effect()
    getAllOrganizations$:Observable<Action>=this.actions$
    .ofType(OrgActions.GET_ALL_ORGANIZATION)
    .pipe(
        switchMap((()=>this.svc.getAllOrganizations())),
        map(orgnanizations =>new orgActions.GetAllOrganizationsSuccess(orgnanizations))
    )

    @Effect()
    createOrganization$ = this.actions$
      .ofType(orgActions.CREATE_ORGANIZATION)
      .pipe(
        map((action: orgActions.AddOrganization) => action.payload),
        switchMap(newOrganization => this.svc.createOrganization(newOrganization)),
        map((response) => new orgActions.AddOrganizationSuccess(response.id))
        
      )

        @Effect()
        removeOrganization$ = this.actions$
         .ofType(orgActions.DELETE_ORGANIZATION)
         .pipe(
            map((action: orgActions.RemoveOrganization) => action.payload),
            switchMap(id => this.svc.deleteOrganization(id)),
            map((organization: OrgMapInfo) => new orgActions.RemoveGameSuccess(organization))
         )
}

