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
  apiKey: ENV['GOOGLE_API_KEY']
})(Container)
