import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io(),
      // YOUR CODE HERE (1)
    };
  }

  componentDidMount() {
    // WebSockets Receiving Event Handlers
    this.state.socket.on('connect', () => {
      console.log('connected');
      // YOUR CODE HERE (2)
    });

    this.state.socket.on('errorMessage', message => {
      // YOUR CODE HERE (3)
    });
  }

  join(room) {
    // room is called with "Party Place"
    console.log(room);
  }

  render() {
    return (
      <div>
        <h1>React Chat</h1>
        <button className="btn btn-default" onClick={() => this.join("Party Place")}>
          Join the Party Place
        </button>
      </div>
    );
  }
}

export default App;
