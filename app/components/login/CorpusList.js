
import '../../css/login/corpus-list'

import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { routerActions } from 'react-router-redux'
import { FormattedMessage as T, FormattedRelative as D, intlShape } from 'react-intl'

class CorpusListItem extends React.Component {
  constructor (props) {
    super(props)
    this.selectCorpus = this.selectCorpus.bind(this)
  }

  selectCorpus () {
    const { actions, server, corpus, dispatch } = this.props
    const path = corpus.password ? '/login/corpus-login-form' : 'browser'
    actions.selectCorpus(server, corpus)
    dispatch(routerActions.push(path))
  }

  render () {
    const { password, name, status, webentities_in, created_at,
      last_activity } = this.props.corpus

    return (
      <div onClick={ this.selectCorpus }>
        <h5 className="corpus-list-item-name">
          { password && <span className="icon icon-lock"></span> }
          { name }
          { status === 'ready' && <span className="icon icon-play"></span> }
        </h5>
        <div className="corpus-list-item-webentities"><T id="webentities" values={ { count: webentities_in } } /></div>
        <div className="corpus-list-item-dates">
          <span><T id="created-ago" values={ { relative: <D value={ created_at } /> } } /></span>
          <span> - </span>
          <span><T id="used-ago" values={ { relative: <D value={ last_activity } /> } } /></span>
        </div>
      </div>
    )
  }
}

CorpusListItem.propTypes = {
  actions: PropTypes.object.isRequired,
  corpus: PropTypes.object.isRequired,
  server: PropTypes.object.isRequired,
  dispatch: PropTypes.func
}

class CorpusList extends React.Component {
  constructor (props) {
    super(props)
    this.state = { filter: '' }
  }

  render () {
    const { actions, dispatch, server, status } = this.props
    let corpora = Object.keys(this.props.corpora)
      .sort()
      .map((k) => this.props.corpora[k])

    if (!corpora.length) return null

    corpora = corpora.filter(it => it.name.includes(this.state.filter))

    const formatMessage = this.context.intl.formatMessage
    const hypheStatus = status && Boolean(status.corpus_running) &&
      (
        <span>
          <span>, </span>
          <T id="running-corpora" values={ { count: status.corpus_running } } />
        </span>
      )

    return (
      <div className="corpus-list">
        <h3>
          <T id="available-corpora" values={ { count: corpora.length } } />
          { hypheStatus }
        </h3>
        <div className="corpus-list-filter">
          <input  value={ this.state.filter } placeholder={ formatMessage({ id: 'corpus-list-placeholder' }) }
            onChange={ ({ target }) => this.setState({ filter: target.value }) } />
          <span className="ti-search"></span>
        </div>
        <div className="form-group corpus-list-slider">
          <ul className="list-group corpus-list">
            { corpora.map((corpus) =>
              <li className="list-group-item corpus-list-item" key={ corpus.corpus_id }>
                <CorpusListItem actions={ actions } server={ server } corpus={ corpus } dispatch={ dispatch } />
              </li>
            ) }
          </ul>
        </div>
        <div className="form-actions">
          <Link className="btn btn-primary" to="/login/corpus-form"><T id="create-corpus" /></Link>
        </div>
      </div>
    )
  }
}

CorpusList.contextTypes = {
  intl: intlShape
}

CorpusList.propTypes = {
  actions: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  corpora: PropTypes.object.isRequired,
  server: PropTypes.object.isRequired,
  status: PropTypes.object
}

export default CorpusList
