import jsonrpc from '../utils/jsonrpc'
import { createAction } from 'redux-actions'

export const FETCH_STACK_REQUEST = '§_FETCH_STACK_REQUEST'
export const FETCH_STACK_SUCCESS = '§_FETCH_STACK_SUCCESS'
export const FETCH_STACK_FAILURE = '§_FETCH_STACK_FAILURE'

export const requestStack = createAction(FETCH_STACK_REQUEST, (serverUrl, stack) => ({ serverUrl, stack }))
export const receiveStack = createAction(FETCH_STACK_SUCCESS, (serverUrl, stack, webentities) => ({ serverUrl, stack, webentities }))
export const fetchStack = (serverUrl, corpus, stack) => (dispatch) => {
  dispatch(requestStack(serverUrl, stack))

  return jsonrpc(serverUrl)(stack.method, stack.args.concat(corpus.corpus_id))
    .then((res) => dispatch(receiveStack(serverUrl, stack, res)))
    .catch((error) => dispatch({
      type: FETCH_STACK_FAILURE,
      payload: { error, serverUrl, stack }
    }))
}