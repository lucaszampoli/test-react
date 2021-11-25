import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';

import FormNotice from '../FormNotice/FormNotice';

class ModalNotice extends Component {

  render() {
    return (
      <Modal
        trigger={<Button color={this.props.buttonColor}>{this.props.buttonTriggerTitle}</Button>}
        dimmer='inverted'
        size='tiny'
        closeIcon='close'
      >
        <Modal.Header>{this.props.headerTitle}</Modal.Header>
        <Modal.Content>
          <FormNotice
            buttonSubmitTitle={this.props.buttonSubmitTitle}
            buttonColor={this.props.buttonColor}
            noticeID={this.props.noticeID}
            onNoticeAdded={this.props.onNoticeAdded}
            onNoticeUpdated={this.props.onNoticeUpdated}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

export default ModalNotice;
