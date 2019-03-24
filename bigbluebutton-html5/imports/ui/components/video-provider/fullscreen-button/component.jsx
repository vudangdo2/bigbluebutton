import React from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Button from '/imports/ui/components/button/component';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { styles } from './styles';

const intlMessages = defineMessages({
  fullscreenButton: {
    id: 'app.fullscreenButton.label',
    description: 'Fullscreen label',
  },
});

const propTypes = {
  intl: intlShape.isRequired,
  handleFullscreen: PropTypes.func.isRequired,
  dark: PropTypes.bool,
  elementName: PropTypes.string,
};

const defaultProps = {
  dark: false,
  elementName: '',
};

const FullscreenButtonComponent = ({
  intl,
  handleFullscreen,
  dark,
  elementName,
  tooltipDistance,
}) => {
  const formattedLabel = intl.formatMessage(
    intlMessages.fullscreenButton,
    ({ 0: elementName || '' }),
  );

  const wrapperClassName = cx({
    [styles.wrapper]: true,
    [styles.dark]: dark,
    [styles.light]: !dark,
  });

  return (
    <div className={wrapperClassName}>
      <Button
        color="default"
        icon="fullscreen"
        size="sm"
        onClick={handleFullscreen}
        label={formattedLabel}
        hideLabel
        className={cx(styles.button, styles.fullScreenButton)}
        tooltipDistance={tooltipDistance}
      />
    </div>
  );
};

FullscreenButtonComponent.propTypes = propTypes;
FullscreenButtonComponent.defaultProps = defaultProps;

export default injectIntl(FullscreenButtonComponent);
