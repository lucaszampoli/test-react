import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import axios from 'axios';
import io from 'socket.io-client';

import TableNotice from '../TableNotice/TableNotice';
import ModalNotice from '../ModalNotice/ModalNotice';

//import logo from '../../mern-logo.png';
//import shirts from '../../shirts.png';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.server = process.env.REACT_APP_API_URL || '';
    this.socket = io.connect(this.server);

    this.state = {
      notices: [],
      online: 0
    }

    this.fetchNotices = this.fetchNotices.bind(this);
    this.handleNoticeAdded = this.handleNoticeAdded.bind(this);
    this.handleNoticeUpdated = this.handleNoticeUpdated.bind(this);
    this.handleNoticeDeleted = this.handleNoticeDeleted.bind(this);
  }

  componentDidMount() {
    this.fetchNotices();
    this.socket.on('visitor enters', data => this.setState({ online: data }));
    this.socket.on('visitor exits', data => this.setState({ online: data }));
    this.socket.on('add', data => this.handleNoticeAdded(data));
    this.socket.on('update', data => this.handleNoticeUpdated(data));
    this.socket.on('delete', data => this.handleNoticeDeleted(data));
  }

  // Buscar dados do back-end
  fetchNotices() {
    axios.get(`${this.server}/api/notices/`)
      .then((response) => {
        this.setState({ notices: response.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleNoticeAdded(notice) {
    let notices = this.state.notices.slice();
    notices.push(notice);
    this.setState({ notices: notices });
  }

  handleNoticeUpdated(notice) {
    let notices = this.state.notices.slice();
    
    let i = notices.findIndex(u => u._id === notice._id)

    if (notices.length > i) { notices[i] = notice }

    this.setState({ notices: notices });
  }

  handleNoticeDeleted(notice) {
    let notices = this.state.notices.slice();
    notices = notices.filter(u => { return u._id !== notice._id; });
    this.setState({ notices: notices });
  }

  render() {
    let online = this.state.online;
    let onlineText = ""
    
    if (online < 2) {
      onlineText = 'Ninguém está online';
    } else if (online - 1 < 2) {
      onlineText = `${online - 1} pessoa online`;
    } else {
      onlineText = `${online - 1} pessoas online`;
    }

    return (
      <div>
        <div className='App'>
          <div className='App-header'>
            <img src="" className='App-logo' alt='logo' />
            <h1 className='App-intro'> CRUD</h1>
            <p>
              Um sistema simples que usa MongoDB, Express.js, React.js, and Node.js. API REST implementada no back-end.
              <br/>
              CREATE, READ, UPDATE, e DELETE 
              <br/>
               
            </p>
          </div>
        </div>
        <Container>
          <ModalNotice
            headerTitle='Cadastro'
            buttonTriggerTitle='Cadastrar'
            buttonSubmitTitle='Add'
            buttonColor='green'
            onNoticeAdded={this.handleNoticeAdded}
            server={this.server}
            socket={this.socket}
          />
          <em id='online'>{onlineText}</em>
          <TableNotice
            onNoticeUpdated={this.handleNoticeUpdated}
            onNoticeDeleted={this.handleNoticeDeleted}
            notices={this.state.notices}
            server={this.server}
            socket={this.socket}
          />
        </Container>
        <br />
      </div>
    );
  }
}

export default App;
