class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movimiento: '',
      estados: [],
      xfolio: []


    };

    this.change = this.change.bind(this);
  }

  handleFormSubmit(event) {
    event.preventDefault();

    let ban='0';

    var selected = document.getElementById('opcXFolio').value;
    
    var selectedCausa = document.getElementById("busqueda2");

    var selectedE = document.getElementById('opcEstado').value;

    
    
    this.state.xfolio.map(function (e) {
      if(e.XFolio == selected){
        ban='1';
      }

    });


    if(ban == '1'){

          //EXTRAE EL ID DE CADA OPCION PARA REALIZAR EL CAMBIO


      var selectedOption = document.getElementsByName(selected)[0].getAttribute("id");




    if (typeof (selectedCausa) != 'undefined' && selectedCausa != null) {
      var selectedOptionC = document.getElementsByName(selectedCausa.value)[0].getAttribute("id");

    } else {
      var selectedOptionC = "";
    }

    axios({
      method: 'post',
      url: 'controlador.php',
      data: {
        Opcion_Movimiento: this.state.movimiento,
        subID: selectedOption,
        Opcion_Estado: selectedE,
        subCausa: selectedOptionC
      }
    })
      .then(function (response) {
        alert("Movimiento realizado con exito");
        document.getElementById('opcXFolio').value="";
      })
      .catch(function (response) {
        //handle error
        console.log(response)
      });
    }else{
      alert("XFolio incorrecto");
      document.getElementById('opcXFolio').value="";
    }




  }


  change(e) {
    var mov = e.target.value;
    this.setState({ movimiento: mov });

    if (mov == 'solicitudescompras' || mov == 'ordencompra' || mov == 'requisicion') {
      this.setState({ estados: ['Abrir', 'Autorizar', 'Cerrar', 'Cancelar'] });
    } else if (mov == 'liquidaciones') {
      this.setState({ estados: ['Abrir', 'Autorizar', 'Cerrar', 'Sellar'] });
    } else {
      this.setState({ estados: ['Abrir', 'Cerrar', 'Cancelar'] });
    }

    let currentComponent = this;

    axios({
      method: 'post',
      url: 'controlador.php',
      data: { movimientoX: mov }
    })
      .then(function (response) {
        //handle success
        currentComponent.setState({ xfolio: response.data })
      })
      .catch(function (response) {
        //handle error
        console.log(response)
      });

  }


  render() {
    return (
      <React.Fragment>
        <div id="encabezadoform">
          <h3>
            Estatus
      </h3>
        </div>
        <div align="center">
          <form autocomplete="off" onSubmit={e => this.handleFormSubmit(e)}>
            <fieldset>
              <legend align="left">
                Cambio de estatus
          </legend>
              <div className="form-group">
                <br />
                <label>
                  Movimiento:
            </label>
                <br />
                <select
                  className="form-control custom-select"
                  id="opc2"
                  name="Opcion_Movimiento"
                  required
                  onChange={this.change}
                >
                  <option disabled="" selected="" value="">
                    Selecciona una opción
              </option>
                  <option value="gastosviajes">
                    Gastos Viajes
              </option>
                  <option value="remisiones">
                    Remisiones
              </option>
                  <option value="liquidaciones">
                    Liquidaciones
              </option>
                  <option value="compras">
                    Compras
              </option>
                  <option value="requisicion">
                    Requisiciones
              </option>
                  <option value="ordencompra">
                    Orden de Compras
              </option>
                  <option value="solicitudescompras">
                    Solicitud de Compras
              </option>
                  <option value="abonos">
                    Abonos
              </option>
                  <option value="pagos">
                    Pagos
              </option>
                  <option value="movimientobancario">
                    Movimiento Bancario
              </option>
                </select>
                {this.state.movimiento ? <DivMovimiento options={this.state.estados} /> : null}
                {this.state.movimiento ? <DivFolio options={this.state.xfolio} /> : null}


                <input className="btn btn-info btn-primary btn-sm" id="btn" type="submit" value="Enviar" />

              </div>



            </fieldset>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

class DivMovimiento extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      movimiento: '',
      motivo: ''
    }

    this.change = this.change.bind(this);

  }

  change(e) {

    var mot = document.getElementById('opc2').value;
    this.setState({ movimiento: e.target.value, motivo: mot });

  }

  render() {

    var here = this;

    return (
      <div >
        <label>Estado:</label><br />
        <select required className="form-control custom-select" onChange={this.change} id="opcEstado">
          <option disabled selected value="">Selecciona una opción</option>
          {this.props.options.map(function (e) {
            return (
              <option value={e}>{e}</option>
            );

          })}
        </select>

        {here.state.movimiento == 'Cancelar' && here.state.motivo == 'remisiones' ? <DivCausas /> : null}
      </div>
    );


  }
}

class DivFolio extends React.Component {


  constructor(props) {
    super(props);


  }


  render() {
    var here = this;
    return (
      <div>
        <label>XFolio</label>
        <input list="busqueda" className="form-control custom-select" required autocomplete="off" placeholder="Ingresa XFolio" id="opcXFolio" onChange={this.change} />
        <datalist id="busqueda">
          <option disabled selected value="">Selecciona una opción</option>
          {this.props.options.map(function (e) {
            return (
              <option id={e.ID} name={e.XFolio}>{e.XFolio}</option>
            );

          })}
        </datalist>


      </div>


    );
  }
}

class DivCausas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      causas: []
    }
  }
  componentDidMount() {
    let currentComponent = this;

    axios({
      method: 'post',
      url: 'controlador.php',
      data: { causas: 'true' }
    })
      .then(function (response) {
        //handle success
        currentComponent.setState({ causas: response.data })
      })
      .catch(function (response) {
        //handle error
        console.log(response)
      });
  }
  render() {
    var here = this;
    return (
      <div id="resp2">
        <br></br><label>Motivo Cancelacion</label><br />
        <select required className="form-control custom-select" id="busqueda2" name="busqueda2">
          <option disabled selected value="">Selecciona una opción</option>
          {here.state.causas.map(function (e) {
            return (
              <option id={e.ID} name={e.Causa}>{e.Causa}</option>
            );

          })}
        </select>
      </div>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('root'));