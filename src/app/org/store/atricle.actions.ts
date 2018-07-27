import {Action} from '@ngrx/store';

export const JAVA='Java';
export const ANGULAR='Anngular';

export class JavaArticleAction implements Action{
    readonly type=JAVA;
}

export class AngularArticleAction implements Action{
    readonly type=ANGULAR;
}

export type All=JavaArticleAction | AngularArticleAction;