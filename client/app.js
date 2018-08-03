import React from 'react';

class ChatRoomSelector extends React.Component {
  render() {
    return(
      <div style={{margin: 10, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        {this.props.room.map((item)=> (<button style={{margin: 5, padding: 8, borderRadius: '5px', backgroundColor: '#191970', color: 'white', fontFamily: 'Helvetica'}} onClick={()=>this.props.onSwitch(item)}>Join {item}</button>))}
      </div>
    );
  }
}

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: [],
      typingUsers: []
    }
  }

  componentDidMount() {
    this.props.socket.on('message', (message) => {
      var messages = this.state.messages.slice();
      messages.push(`${message.username}: ${message.content}`)
      console.log(messages);
      this.setState({
        messages: messages
      })
    });

    this.props.socket.on('typing', (user) => {
      if (this.state.typingUsers.indexOf(user) === -1) {
        var typeUsers = this.state.typingUsers.splice();
        typeUsers.push(user);
        this.setState({
          typingUsers: typeUsers
        })
      }
    });

    this.props.socket.on('stop-typing', (user) => {
      var index = this.state.typingUsers.indexOf(user);
      console.log(user + " stopped typing")
      if (index !== -1) {
        var typeUsers = this.state.typingUsers.splice();
        typeUsers.splice(index, 1);
        this.setState({
          typingUsers: typeUsers
        })
      }
    });

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.roomName !== this.props.roomName) {
      this.setState({
        messages: []
      })
    }
  }

  handleMessage(e) {
    this.setState({
      message: e.target.value
    })
    if (e.target.value) {
      this.props.socket.emit('typing');
    } else {
      this.props.socket.emit('stop-typing');
      console.log("i stopped typing");
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.socket.emit('message', this.state.message);
    var messages = this.state.messages.slice();
    messages.push(`${this.props.username}: ${this.state.message}`);
    this.setState({
      messages: messages,
      message: ''
    })
    this.props.socket.emit('stop-typing');


  }

  render() {
    return(
      <div>
        <div style={{marginBottom: 10, position: 'relative', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
          <div style={{padding: 5, borderRadius: '20px', backgroundColor: 'white', marginTop: 10, width: 500}}>
            {this.state.messages.map((item) => (<p style={{fontFamily: 'Verdana', marginLeft: 5}}>{item}</p>))}
          </div>
        </div>
        {this.state.typingUsers.map((item) => (<p>{item} is typing</p>))}
        <div style={{marginTop: 10, marginBottom: 10, display: 'flex', justifyContent: 'center'}}>
          <form  onSubmit={(e)=>{this.handleSubmit(e)}}>
            <input onChange={(e)=>{this.handleMessage(e)}} type="text" value={this.state.message}></input>
            <input type="submit" value="Submit"></input>
          </form>
        </div>
      </div>
    );
  }

}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io(),
      roomname: 'Party Place',
      username: '',
      rooms: ["Party Place", "Josh's Fun Time", "Sandwich Connoisseurs", "CdT"]
      // YOUR CODE HERE (1)
    };
  }

  componentDidMount() {
    // WebSockets Receiving Event Handlers
    this.state.socket.on('connect', () => {
      console.log('connected on connect');
      var username = prompt("Enter a username");
      this.setState({
        username: username
      })
      this.state.socket.emit('username', username);
      this.state.socket.emit('room', this.state.roomname)
      // YOUR CODE HERE (2)
    });

    // this.state.socket.on('room', room => {
    //   console.log(room);
    //   if (!room) {
    //     this.state.socket.emit('errorMessage', 'No room!');
    //   }
    //   console.log("username");
    //   console.log(this.state.username);
    //   if (this.state.username === '') {
    //     this.state.socket.emit('errorMessage', 'Username not set!')
    //   }
    // });

    this.state.socket.on('errorMessage', message => {
      alert(message);
      // YOUR CODE HERE (3)
    });
  }

  join(room) {
    // room is called with "Party Place"
    // console.log(room);
    this.setState({
      roomname: room
    });
    this.state.socket.emit('room', room)
  }

  render() {
    return (
      <div style={{height: '100%', padding: 10, borderRadius: '20px', backgroundColor: '#DCDCDC', margin: 13, marginBottom: 100, flex: 1, justifyContent: 'center', alignCenter: 'center'}}>
        <h1 style={{marginBottom: 15, fontWeight: 'bold', fontFamily: 'Chalkduster', textAlign: 'center'}}>React Chat</h1>
        <hr></hr>
        <h2 style={{fontFamily: 'fantasy', margin: 5, textAlign: 'center'}}>Current room: {this.state.roomname}</h2>
        <ChatRoomSelector style={{justifyContent: 'center', alignCenter: 'center'}} room={this.state.rooms} onSwitch={this.join.bind(this)} roomName={this.state.roomname}/>
        <hr></hr>
        <div>
          <ChatRoom style={{justifyContent: 'center'}} socket={this.state.socket} username={this.state.username} roomName={this.props.roomname}/>
        </div>
      </div>
    );
  }
}

export default App;
