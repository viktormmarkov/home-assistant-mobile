import React from 'react';
interface State {};

export default class BaseScreen extends React.Component<{navigation: any}, State> {
    getScreenParams = () => {
        return this.props.navigation.state.params;
    }
}