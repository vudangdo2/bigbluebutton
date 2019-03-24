import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import injectWbResizeEvent from '/imports/ui/components/presentation/resize-wrapper/component';
import Button from '/imports/ui/components/button/component';
import { Session } from 'meteor/session';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import { styles } from './styles';
import MessageForm from './message-form/component';
import MessageList from './message-list/component';
import ChatDropdown from './chat-dropdown/component';

const ELEMENT_ID = 'chat-messages';

const intlMessages = defineMessages({
  closeChatLabel: {
    id: 'app.chat.closeChatLabel',
    description: 'aria-label for closing chat button',
  },
  hideChatLabel: {
    id: 'app.chat.hideChatLabel',
    description: 'aria-label for hiding chat button',
  },
});

const Chat = (props) => {
  const {
    chatID,
    chatName,
    title,
    messages,
    scrollPosition,
    hasUnreadMessages,
    lastReadMessageTime,
    partnerIsLoggedOut,
    isChatLocked,
    minMessageLength,
    maxMessageLength,
    actions,
    intl,
    shortcuts,
    UnsentMessagesCollection,
  } = props;

  const HIDE_CHAT_AK = shortcuts.hidePrivateChat;
  const CLOSE_CHAT_AK = shortcuts.closePrivateChat;

  return (
    <div
      data-test="publicChat"
      className={styles.chat}
    >
      <header className={styles.header}>
        <div
          data-test="chatTitle"
          className={styles.title}
        >
          <Button
            onClick={() => {
              Session.set('idChatOpen', '');
              Session.set('openPanel', 'userlist');
            }}
            aria-label={intl.formatMessage(intlMessages.hideChatLabel, { 0: title })}
            accessKey={HIDE_CHAT_AK}
            label={title}
            icon="left_arrow"
            className={styles.hideBtn}
          />
        </div>
        {
          chatID !== 'public'
            ? (
              <Button
                icon="close"
                size="sm"
                ghost
                color="dark"
                hideLabel
                onClick={() => {
                  actions.handleClosePrivateChat(chatID);
                  Session.set('idChatOpen', '');
                  Session.set('openPanel', 'userlist');
                }}
                aria-label={intl.formatMessage(intlMessages.closeChatLabel, { 0: title })}
                label={intl.formatMessage(intlMessages.closeChatLabel, { 0: title })}
                accessKey={CLOSE_CHAT_AK}
              />
            )
            : <ChatDropdown />
        }
      </header>
      <MessageList
        chatId={chatID}
        messages={messages}
        id={ELEMENT_ID}
        scrollPosition={scrollPosition}
        hasUnreadMessages={hasUnreadMessages}
        handleScrollUpdate={actions.handleScrollUpdate}
        handleReadMessage={actions.handleReadMessage}
        lastReadMessageTime={lastReadMessageTime}
        partnerIsLoggedOut={partnerIsLoggedOut}
      />
      <MessageForm
        UnsentMessagesCollection={UnsentMessagesCollection}
        chatId={chatID}
        disabled={isChatLocked}
        chatAreaId={ELEMENT_ID}
        chatTitle={title}
        chatName={chatName}
        minMessageLength={minMessageLength}
        maxMessageLength={maxMessageLength}
        handleSendMessage={actions.handleSendMessage}
      />
    </div>
  );
};

export default withShortcutHelper(injectWbResizeEvent(injectIntl(memo(Chat))), ['hidePrivateChat', 'closePrivateChat']);

const propTypes = {
  chatID: PropTypes.string.isRequired,
  chatName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ])).isRequired).isRequired,
  scrollPosition: PropTypes.number,
  shortcuts: PropTypes.objectOf(PropTypes.string),
  hasUnreadMessages: PropTypes.bool.isRequired,
  lastReadMessageTime: PropTypes.number.isRequired,
  partnerIsLoggedOut: PropTypes.bool.isRequired,
  isChatLocked: PropTypes.bool.isRequired,
  minMessageLength: PropTypes.number.isRequired,
  maxMessageLength: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    handleClosePrivateChat: PropTypes.func.isRequired,
    handleReadMessage: PropTypes.func.isRequired,
    handleScrollUpdate: PropTypes.func.isRequired,
    handleSendMessage: PropTypes.func.isRequired,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

const defaultProps = {
  scrollPosition: 0,
};

Chat.propTypes = propTypes;
Chat.defaultProps = defaultProps;
