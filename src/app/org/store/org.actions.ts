import {AppAction} from '../../app.action';
import { OrgMapInfo } from '../../models/organization/OrgMapInfo';

export const GET_ALL_ORGANIZATION='[All Organizations]';


export class GetAllOrganization implements AppAction{
    readonly type=GET_ALL_ORGANIZATION;
}

export const GET_ORGANIZATIONS_SUCCESS = '[ALL] Organizations Success';

export class GetAllOrganizationsSuccess implements AppAction {
    readonly type = GET_ORGANIZATIONS_SUCCESS;
  
    constructor(public payload: OrgMapInfo[]) {
    }
  }


  export const CREATE_ORGANIZATION = '[CREATE] Organization';
export const CREATE_ORGANIZATION_SUCCESS = '[CREATE] Organization Success';
export const CREATE_ORGANIZATION_ERROR = '[CREATE] Organization Error';



export const DELETE_ORGANIZATION = '[DELETE] Organization';
export const DELETE_ORGANIZATION_SUCCESS = '[DELETE] Organization Success';
export const DELETE_ORGANIZATION_ERROR = '[DELETE] Organization Error';

/****************************************
 * ADD new Organization
 ****************************************/

export class AddOrganization implements AppAction {
    readonly type = CREATE_ORGANIZATION;
  
    constructor(public payload: OrgMapInfo) {
    }
  }
  
  export class AddOrganizationSuccess implements AppAction {
    readonly type = CREATE_ORGANIZATION_SUCCESS;
  
    constructor(public payload: number) {
    }
  }
  
  export class AddOrganizationError implements AppAction {
    readonly type = CREATE_ORGANIZATION_ERROR;
  
    constructor(public payload: Error) {
    }
  }

  /****************************************
 * REMOVE a Organization by id
 ****************************************/
export class RemoveOrganization implements AppAction {
  readonly type = DELETE_ORGANIZATION;

  constructor(public payload: number) {
  }
}

export class RemoveGameSuccess implements AppAction {
  readonly type = DELETE_ORGANIZATION_SUCCESS;

  constructor(public payload: OrgMapInfo) {
  }
}

export class RemoveGameError implements AppAction {
  readonly type = DELETE_ORGANIZATION_ERROR;

  constructor(public payload: Error) {
  }
}

