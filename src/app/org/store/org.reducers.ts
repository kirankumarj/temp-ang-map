import * as OrgActions from './org.actions';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AppAction} from '../../app.action';

import {OrgMapInfo} from '../../models/organization/OrgMapInfo';


export interface State{
    data:OrgMapInfo[]
}

export const initialState={
    data:[
        // {
        //     id: '1',
        //     name:'Sample1',
        //     latitude: 12.12,
        //     longitude: 43.32,
        //     info: 'Sample1',
        //      type: 'Sample2'
        // }

    ]
}

export function orgReducer(state=initialState,action:AppAction):State{
    switch (action.type) {
        case OrgActions.GET_ALL_ORGANIZATION:
        return{
            ...state
        }
        case OrgActions.GET_ORGANIZATIONS_SUCCESS:
        return {
            ...state,
            data: action.payload
        }

              /*************************
     * CREATE game actions
     ************************/
    case OrgActions.CREATE_ORGANIZATION:
    return {
      ...state
    };
  case OrgActions.CREATE_ORGANIZATION_SUCCESS:
    {
      const neworganization = {
        ...state,
        id: action.payload
      };
      const data = [
        ...state.data,
        neworganization
      ];
      return {
        ...state,
        data
      };
    }
    //Delete Org
    case OrgActions.DELETE_ORGANIZATION:{
                return {
                    ...state
                }
    }
    case OrgActions.DELETE_ORGANIZATION_SUCCESS:{
        const data=state.data.filter((state)=>{
            console.log("From state....");
            console.log(state);
        });
    }
   
    }

     

//        return state;
}

export const getOrganizationsState = createFeatureSelector < State > ('organizations');
export const getAllOrganizations = createSelector(getOrganizationsState, (state: State) => state.data);