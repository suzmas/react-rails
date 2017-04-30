import React from 'react';

export class Container extends React.Component {
  render() {
    const style = {
          width: '100vw',
          height: '100vh'
    }
    return (
      <div>
        <Map google={this.props.google} />
      </div>
    )
  }
}

export default GoogleApiComponent({
  apiKey: "AIzaSyClvd4-2tMUixA8GD-qSH_OGZI3X2mFiKY"
})(Container)
