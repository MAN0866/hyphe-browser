import jsonrpc from '../utils/jsonrpc'

export const SELECT_CORPUS = '§_SELECT_CORPUS'

export const FETCH_CORPUS_STATUS_REQUEST = '§_FETCH_CORPUS_STATUS_REQUEST'
export const FETCH_CORPUS_STATUS_SUCCESS = '§_FETCH_CORPUS_STATUS_SUCCESS'
export const FETCH_CORPUS_STATUS_FAILURE = '§_FETCH_CORPUS_STATUS_FAILURE'

export const START_CORPUS_REQUEST = '§_START_CORPUS_REQUEST'
export const START_CORPUS_SUCCESS = '§_START_CORPUS_SUCCESS'
export const START_CORPUS_FAILURE = '§_START_CORPUS_FAILURE'

export const CREATE_CORPUS_REQUEST = '§_CREATE_CORPUS_REQUEST'
export const CREATE_CORPUS_SUCCESS = '§_CREATE_CORPUS_SUCCESS'
export const CREATE_CORPUS_FAILURE = '§_CREATE_CORPUS_FAILURE'

export const selectCorpus = (corpus) => ({
  type: SELECT_CORPUS,
  payload: { corpus }
})


export const requestCorpusStatus = (corpus) => ({
  type: FETCH_CORPUS_STATUS_REQUEST,
  payload: { corpus }
})

export const receiveCorpusStatus = (corpus, status) => ({
  type: FETCH_CORPUS_STATUS_SUCCESS,
  payload: {
    corpus,
    status
  }
})

export const fetchCorpusStatus = (serverUrl, corpus) => (dispatch) => {
  dispatch(requestCorpusStatus(corpus))

  return jsonrpc(serverUrl)('get_status', [corpus.corpus_id])
    .then((status) => dispatch(receiveCorpusStatus(corpus, status)))
    .catch((error) => dispatch({
      type: FETCH_CORPUS_STATUS_FAILURE,
      payload: { error, serverUrl, corpus }
    }))
}

export const startCorpus = (serverUrl, corpus, password) => (dispatch) => {
  dispatch({ type: START_CORPUS_REQUEST, payload: { corpus } })

  return jsonrpc(serverUrl)('start_corpus', [corpus.corpus_id, password])
    .then(() => dispatch({ type: START_CORPUS_SUCCESS, payload: { corpus } }))
    .catch((error) => dispatch({
      type: START_CORPUS_FAILURE,
      payload: { error, corpus }
    }))
}

export const receiveCorpus = (serverUrl, corpus) => ({
  type: CREATE_CORPUS_SUCCESS,
  payload: {
    serverUrl,
    corpus
  }
})

export const createCorpus = (serverUrl, corpus) => (dispatch) => {
  dispatch({
    type: CREATE_CORPUS_REQUEST,
    payload: {
      serverUrl,
      corpus
    }
  })

  return jsonrpc(serverUrl)('create_corpus', [corpus.name, corpus.password])
    .then((res) => dispatch(receiveCorpus(serverUrl, res)))
    .catch((error) => dispatch({
      type: CREATE_CORPUS_FAILURE,
      payload: { error, corpus }
    }))
}
