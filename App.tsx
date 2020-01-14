import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class EntityList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      error: ''
    };
  }
  componentDidMount() {
    fetch('http://192.168.100.28:3031/users').then(res => res.json(), err => {
      this.setState({error: err.message});
    })
    .then(data => {
      this.setState({data})
    })
  }
  render() {
    const {data} = this.state;
    return (
      <View>
        {data.map((d,i) => (<Text key={i}>{d.email}</Text>))}
        <Text>Nested Component</Text>
      </View>
    );
  }
}

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <EntityList></EntityList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
