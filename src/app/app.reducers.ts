import {AppState} from './app.state';
import {ActionReducerMap} from '@ngrx/store';
import * as orgReducers from './org/store/org.reducers';


export const AllReducers:ActionReducerMap<AppState>={
            organizations:orgReducers.orgReducer
}