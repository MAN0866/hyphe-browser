import createReducer from '../utils/create-reducer'
import {
  FETCH_CORPORA_REQUEST,
  FETCH_CORPORA_SUCCESS,
  FETCH_CORPORA_FAILURE,
  FETCH_CORPUS_STATUS_REQUEST,
  FETCH_CORPUS_STATUS_SUCCESS,
  FETCH_CORPUS_STATUS_FAILURE
} from '../actions/corpora'
import {
  SHOW_ERROR,
  HIDE_ERROR
} from '../actions/browser'
import {
  DECLARE_PAGE_REQUEST,
  DECLARE_PAGE_SUCCESS,
  DECLARE_PAGE_FAILURE
} from '../actions/webentities'

const getEmptyError = () => ({
  id: null,
  message: null,
  fatal: false,
  icon: ''
})

const initialState = {
  // error message
  error: getEmptyError(),
  // to display loaders in different places
  loaders: {
    // when fetching the list of corpora
    corpora: false,
    corpus_status: false,
    webentity: false
  }
}

export default createReducer(initialState, {
  // display loader
  [FETCH_CORPORA_REQUEST]: (state) => ({
    ...state,
    loaders: { ...state.loaders, corpora: true }
  }),
  [FETCH_CORPORA_SUCCESS]: (state) => ({
    ...state,
    loaders: { ...state.loaders, corpora: false }
  }),
  [FETCH_CORPORA_FAILURE]: (state) => ({
    ...state,
    loaders: { ...state.loaders, corpora: false }
  }),

  [SHOW_ERROR]: (state, error) => ({ ...state, error }),
  [HIDE_ERROR]: (state) => ({ ...state, error: getEmptyError() }),

  // display loader
  [FETCH_CORPUS_STATUS_REQUEST]: (state) => ({ ...state, loaders: { ...state.loaders, corpus_status: true } }),
  [FETCH_CORPUS_STATUS_SUCCESS]: (state) => ({ ...state, loaders: { ...state.loaders, corpus_status: false } }),
  [FETCH_CORPUS_STATUS_FAILURE]: (state) => ({ ...state, loaders: { ...state.loaders, corpus_status: false } }),

  // display loader
  [DECLARE_PAGE_REQUEST]: (state) => ({ ...state, loaders: { ...state.loaders, webentity: true } }),
  [DECLARE_PAGE_SUCCESS]: (state) => ({ ...state, loaders: { ...state.loaders, webentity: false } }),
  [DECLARE_PAGE_FAILURE]: (state) => ({ ...state, loaders: { ...state.loaders, webentity: false } })
})
