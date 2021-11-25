import React, { Component } from 'react';
import { Message, Button, Form } from 'semantic-ui-react';
import axios from 'axios';


class FormNotice extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      Titulo: '',
      Content: '',
      date: '',
      
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // Preenche o formulário com os dados apropriados se o ID do usuário for fornecido
    if (this.props.noticeID) {
      axios.get(`${this.props.server}/api/notices/${this.props.noticeID}`)
      .then((response) => {
        this.setState({
          title: response.data.title,
          content: response.data.content,
          date: response.data.date,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  handleInputChange(e) {
    const target = e.target;
    const title = target.title;
    const content = target.content;
    const date = target.date;

    this.setState({ [title]: [content] [date] });
  }


  handleSubmit(e) {
    // Impedir atualização do navegador
    e.preventDefault();

    const notice = {
      title: this.state.title,
      content: this.state.content,
      date: this.state.date
    }

    // Confirmar, se o ID do usuário for fornecido se sim é uma atualização e faz um PUT
    // caso contratio é um usuario novo e fazemos um POST
    const method = this.props.noticeID ? 'put' : 'post';
    const params = this.props.noticeID ? this.props.noticeID : '';

    axios({
      method: method,
      responseType: 'json',
      url: `${this.props.server}/api/notices/${params}`,
      data: notice
    })
    .then((response) => {
      this.setState({
        formClassName: 'success',
        formSuccessMessage: response.data.msg
      });

      if (!this.props.noticeID) {
        this.setState({
          title: '',
          content: '',
          data: ''
        });
        this.props.onNoticeAdded(response.data.result);
        this.props.socket.emit('add', response.data.result);
      }
      else {
        this.props.onNoticeUpdated(response.data.result);
        this.props.socket.emit('update', response.data.result);
      }
      
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.data) {
          this.setState({
            formClassName: 'warning',
            formErrorMessage: err.response.data.msg
          });
        }
      }
      else {
        this.setState({
          formClassName: 'warning',
          formErrorMessage: 'Something went wrong. ' + err
        });
      }
    });
  }

  render() {

    const formClassName = this.state.formClassName;
    const formSuccessMessage = this.state.formSuccessMessage;
    const formErrorMessage = this.state.formErrorMessage;

    return (
      <Form className={formClassName} onSubmit={this.handleSubmit}>
        <Form.Input
          label='Title'
          type='text'
          placeholder='Titulo'
          name='title'
          maxLength='40'
          required
          value={this.state.title}
          onChange={this.handleInputChange}
        />
        <Form.Input
          label='Content'
          type='text'
          placeholder='Descrição'
          name='content'
          maxLength='100'
          required
          value={this.state.content}
          onChange={this.handleInputChange}
        />
        <Form.Input
          type='date'
          name='content'
          value={this.state.date}
          onChange={this.handleInputChange}
        />
        <Message
          success
          color='green'
          header='Nice one!'
          content={formSuccessMessage}
        />
        <Message
          warning
          color='yellow'
          header='Woah!'
          content={formErrorMessage}
        />
        <Button color={this.props.buttonColor} floated='right'>{this.props.buttonSubmitTitle}</Button>
        <br /><br />
      </Form>
    );
  }
}

export default FormNotice;
