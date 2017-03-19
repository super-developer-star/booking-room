require('font-awesome/css/font-awesome.css');
require('./_loadingOverlay.css');
import React, {Component, PropTypes} from 'react';

class LoadingOverlay extends Component {
  render() {
    if (!this.props) {
      return null;
    }else{
      return (
        <div className={this.props.overlayClass}>
          <i className="fa fa-spinner fa-spin-custom" aria-hidden="true"></i>
          <h6>{this.props.message}</h6>
        </div>
      );
    }
  }
}

LoadingOverlay.propTypes = {
  overlayClass: PropTypes.string.isRequired,
  message: PropTypes.string
};

export default LoadingOverlay;
