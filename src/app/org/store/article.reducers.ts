// import {Action, createFeatureSelector, createSelector} from '@ngrx/store';
// import {Article} from './article.model';
// import {ArticleState} from '../../app.state';
// import * as allActions from './atricle.actions';
// import * as ArticlesData from './article.model';


// const initialSate:ArticleState={
//     articles:[{
//         id:1,
//         title:'Dummy1',
//         category:'Dummy'
//     }]
// }

// export function reducer(state=initialSate,action:Action):ArticleState{
//     switch(action.type){
//         case allActions.JAVA:
//         return {articles:ArticlesData.JAVA_ARTICLES};

//         case allActions.ANGULAR:
//         return {articles:ArticlesData.ANGULAR_ARTICLES};
//     }
//         return state;    
// }

// export const getArticlesState=createFeatureSelector<ArticleState>('article state');

// export const getArticles=createSelector(getArticlesState,(((state:ArticleState)=>state.articles)));

