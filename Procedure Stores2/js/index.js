class App extends React.Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
        this.state = {  
            msg:[],
            ban: ''
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {

        let currentComponent = this;

        axios({
            method: 'post',
            url: 'controlador.php',
            data: { causas: e.target.value }
          })
            .then(function (response) {
              //handle success
              if(response.data.length >0){
                currentComponent.setState({ msg: response.data,ban: '1' })
              }else{
                currentComponent.setState({ ban: '' })
              }
              

            })
            .catch(function (response) {
              //handle error
              console.log(response)
            });   
    }

    render() {
        let here = this; 
        return ( 
            <div className="row">
                <div className="col s4 offset-s4">
                    <input type="text" placeholder="Put your text" ref={this.textInput} onChange={this.handleChange}></input>
                    {this.state.ban ? <Fetch options={here.state.msg} /> : null}
                   

                </div>
            </div>
         );
    }
}
 


class Fetch extends React.Component {
    constructor(props) {
        super(props);
    }
    render() { 
        return (  
            <div>
                {this.props.options.map(function (e) {
                return (
                <p>{e.Causa}</p>
                );

            })}
            </div>

        );
    }
}
 
ReactDOM.render(<App />, document.getElementById('root'));