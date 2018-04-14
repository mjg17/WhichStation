// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getDepartures } from '../actions';

type Props = {
  match: Object,
  getDepartures: (string, string, string) => void,
};

class WhichStation extends Component<Props> {
  componentDidMount() {
    const { choices, direction, target } = this.props.match.params;
    this.props.getDepartures(choices, direction, target);
  }

  render() {
    const { choices, direction, target } = this.props.match.params; // TMP
    return (
      <div>
        <h1>Which station</h1>
        <dl>
          <dt>Choices</dt>  <dd>{ choices }</dd>
          <dt>Direction</dt><dd>{ direction }</dd>
          <dt>Target</dt>   <dd>{ target }</dd>
        </dl>
      </div>
    );
  }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps, { getDepartures })(WhichStation);
