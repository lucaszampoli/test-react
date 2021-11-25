import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import ModalNotice from '../ModalNotice/ModalNotice';
import ModalConfirmDelete from '../ModalConfirmDelete/ModalConfirmDelete';

class TableNotice extends Component {

  render() {

    let notices = this.props.notices;

    notices = notices.map((notice) => 
      <Table.Row key={notice._id}>
        <Table.Cell>{notice.title}</Table.Cell>
        <Table.Cell>{notice.content}</Table.Cell>
        <Table.Cell>{notice.date}</Table.Cell>
        <Table.Cell>
          <ModalNotice
            headerTitle='Edit News'
            buttonTriggerTitle='Edit'
            buttonSubmitTitle='Save'
            buttonColor='blue'
            noticeID={notice._id}
            onNoticeUpdated={this.props.onNoticeUpdated}
            server={this.props.server}
            socket={this.props.socket}
          />
          <ModalConfirmDelete
            headerTitle='Delete News'
            buttonTriggerTitle='Delete'
            buttonColor='black'
            notice={notice}
            onNoticeDeleted={this.props.onNoticeDeleted}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Table.Cell>
      </Table.Row>
    );

    // Faz com que cada usuário novo apareça no topo da lista
    notices =  [...notices].reverse();

    return (
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Titulo</Table.HeaderCell>
            <Table.HeaderCell>Conteudo</Table.HeaderCell>
            <Table.HeaderCell>Data</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {notices}
        </Table.Body>
      </Table>
    );
  }
}

export default TableNotice;
