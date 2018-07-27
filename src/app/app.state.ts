import * as fromOrganization from './org/store/org.reducers';

export interface AppState{
    organizations:fromOrganization.State;
}