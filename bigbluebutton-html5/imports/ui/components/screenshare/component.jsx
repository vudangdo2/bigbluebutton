import React from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import FullscreenButton from '../video-provider/fullscreen-button/component';
import { styles } from './styles';

const intlMessages = defineMessages({
  screenShareLabel: {
    id: 'app.screenshare.screenShareLabel',
    description: 'screen share area element label',
  },
});

class ScreenshareComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
    };

    this.onVideoLoad = this.onVideoLoad.bind(this);
  }

  componentDidMount() {
    const { presenterScreenshareHasStarted } = this.props;
    presenterScreenshareHasStarted();
  }

  componentWillReceiveProps(nextProps) {
    const { isPresenter, unshareScreen } = this.props;
    if (isPresenter && !nextProps.isPresenter) {
      unshareScreen();
    }
  }

  componentWillUnmount() {
    const { presenterScreenshareHasEnded, unshareScreen } = this.props;
    presenterScreenshareHasEnded();
    unshareScreen();
  }

  onVideoLoad() {
    this.setState({ loaded: true });
  }

  renderFullscreenButton() {
    const { intl } = this.props;
    const full = () => {
      if (!this.videoTag) return;
      this.videoTag.requestFullscreen();
    };

    return (
      <FullscreenButton
        handleFullscreen={full}
        elementName={intl.formatMessage(intlMessages.screenShareLabel)}
      />
    );
  }

  render() {
    const { loaded } = this.state;
    const style = {
      right: 0,
      bottom: 0,
    };

    return (
      [!loaded ? (<div key="screenshareArea" innerStyle={style} className={styles.connecting} />) : null,
        this.renderFullscreenButton(),
        (
          <video
            key="screenshareVideo"
            id="screenshareVideo"
            style={{ maxHeight: '100%', width: '100%' }}
            autoPlay
            playsInline
            onLoadedData={this.onVideoLoad}
            ref={(ref) => { this.videoTag = ref; }}
          />
        )]
    );
  }
}

export default injectIntl(ScreenshareComponent);

ScreenshareComponent.propTypes = {
  intl: intlShape.isRequired,
  isPresenter: PropTypes.bool.isRequired,
  unshareScreen: PropTypes.func.isRequired,
  presenterScreenshareHasEnded: PropTypes.func.isRequired,
  presenterScreenshareHasStarted: PropTypes.func.isRequired,
};
