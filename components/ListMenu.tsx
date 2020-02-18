import React from 'react';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function listMenu(config) {
    return class extends React.Component {
        render() {
          return <React.Fragment>
            <Button
            type='clear'
            icon={
              <Icon
                name="arrow-right"
                size={15}
                color="green"
              />    
              }
            />
            <Button
            style={ {
              paddingLeft: 10
            }}
            type='clear'
            icon={
              <Icon
                name="trash"
                size={15}
                color="red"
              />    
            }
            />
          </React.Fragment>
        }
    }
}