import React, { Component } from 'react';

export default class WhichStation extends Component {
  render() {
    const { choices, direction, target } = this.props.match.params;
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
