import React , {Component,ReactDOM} from 'react';
const appRoot = document.getElementById('root');

class Portals extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    appRoot.appendChild(this.el);
  }

  render() {
    const Dom = <div>穿越到其它Dom</div>
    // return ReactDOM.createPortal(
    //   Dom,
    //   this.el,
    // );
    return Dom
  }
  
}
export default  Portals
