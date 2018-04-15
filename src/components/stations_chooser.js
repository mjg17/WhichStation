// @flow

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

type Props = {
};

export default class StationsChooser extends Component<Props> {
  render() {
    return (
      <Fragment>
        <h2>Station chooser</h2>
        <p>The station chooser form has not yet been implemented.</p>
        <p>
          Here are some example links to get you started:
        </p>
        <dl>
          <dt><Link to="/whichstation/BRI-60--MTP-15--BPW-45/to/LWH">/whichstation/BRI-60--MTP-15--BPW-45/to/LWH</Link></dt>
          <dd>From one of Bristol Temple Meads (60 mins away), Montpelier (15 mins away), or Bristol Parkway, to Lawrence Hill</dd>

          <dt><Link to="/whichstation/BRI-30--BPW-25/from/PAD">/whichstation/BRI-30--BPW-25/from/PAD</Link></dt>
          <dd>From London Paddington to either Bristol Temple Meads (30 mins away) or Bristol Parkway (25 mins away)</dd>
        </dl>
        <p>
          Some station codes are:
        </p>
        <table className="table">
          <tbody>
            <tr><td>BRI</td><td>Bristol Temple Meads</td></tr>
            <tr><td>BPW</td><td>Bristol Parkway</td></tr>
            <tr><td>PAD</td><td>London Paddington</td></tr>
            <tr><td>SWI</td><td>Swindon</td></tr>
            <tr><td>WSM</td><td>Weston-super-Mare</td></tr>
          </tbody>
        </table>
      </Fragment>
    );
  }
}
