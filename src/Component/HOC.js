import React , {Component} from 'react';

class model extends React.Component {
	constructor(props) {
    super(props);
    
  }
	render () {
	   return <div>{this.props.value}</div>
	}
}
function Hocdemo(Demo) {
  return class HOC extends Component {
    render() {
      return <div>
               返回的新组件
               <Demo value="接受的组件"/>
             </div>
    }
  }

}
export default Hocdemo(model)