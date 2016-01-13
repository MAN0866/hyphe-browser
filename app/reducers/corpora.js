import createReducer from '../utils/create-reducer'
import { SELECT_CORPUS } from '../actions/corpora'
import {
  FETCH_CORPORA_REQUEST,
  FETCH_CORPORA_SUCCESS
} from '../actions/servers'
import { FETCH_CORPUS_STATUS_SUCCESS } from '../actions/corpora'

const initialState = {
  // TODO: transform it in a array here?
  list: {},
  selected: null,
  status: null // status of selected corpus
}

export default createReducer(initialState, {
  [FETCH_CORPORA_REQUEST]: (state) => ({
    ...state,
    list: {},
    selected: null
  }),
  [FETCH_CORPORA_SUCCESS]: (state, { corpora }) => ({
    ...state,
    list: {...corpora},
    selected: null
  }),

  [FETCH_CORPUS_STATUS_SUCCESS]: (state, { corpus, status }) => ({
    ...state,
    selected: corpus,
    status
  }),

  [SELECT_CORPUS]: (state, { corpus }) => ({
    ...state,
    selected: corpus
  })
})
