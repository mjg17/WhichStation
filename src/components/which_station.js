// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import type { State } from '../types';
import { getDepartures } from '../actions';
import JourneyChoice from './journey_choice';

type Props = {
  match: Object,
  stations: State,
  getDepartures: (string, string, string) => void,
};

class WhichStation extends Component<Props> {
  componentDidMount() {
    const { choices, direction, target } = this.props.match.params;
    this.props.getDepartures(choices, direction, target);
  }

  renderChoices() {
    const { choices, direction, target } = this.props.stations;
    return (
      <ul className="list-group">
        {
          choices.map( (c, i) =>
            <li key={c.crsCode}>
              <JourneyChoice
                choice={c}
                direction={direction}
                target={target}
                highlight={i === 0}
              />
            </li>
          )
        }
      </ul>
    );
  }

  render() {
    const { direction, target, loading } = this.props.stations;
    if (!target)
      return (<div><em>...loading...</em></div>);
    return (
      <Fragment>
        <h2>Your fastest journies { direction } { target.stationName || target.crsCode } are:</h2>
        { loading
          ? <div><em>...consulting National Rail Enquiries...</em></div>
          : this.renderChoices()
        }
        <p><Link to="/stationchooser">Station chooser</Link></p>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
    return { stations: state.stations };
}

export default connect(mapStateToProps, { getDepartures })(WhichStation);
