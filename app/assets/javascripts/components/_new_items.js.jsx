var NewItem = React.createClass({
  render() {
    return (
      <div>
        <input ref='name' placeholder='Enter name' />
        <input ref='description' placeholder='Enter description' />
        <button>Submit</button>
      </div>
    )
  }
});
