var self = {};

// Class for single input
self.upcInput = React.createClass({
  getInitialState: function(){
    return({
      errors: null
    });
  },

  handleChange: function(evnt){
    var inputText = evnt.target.value;
    var errors = this.errorCheck(inputText);
    this.setState({errors: errors});
  },

  errorCheck: function(inputText){
    var errors = {};
    for (var i = 0; i < inputText.length; i++) {
      var num = inputText[i];
      if(isNaN(num)){
        errors["UPC codes are numbers only"] = true;
      }
    }
    if(inputText.length != 12){
      errors["Please make sure UPC code is 12 digits"] = true;
    }
    return Object.keys(errors);
  },

  renderErrors: function(){
    if(this.state.errors === null) {
      return null;
    } else {
      var formattedErrors = _.map(this.state.errors, function(error){
        return(
          <li key={error}>{error}</li>
        );
      });

      return(
        <ul className='list-unstyled'>
        {formattedErrors}
        </ul>
      );
    }
  },

  render: function(){
    var errorClass = "form-group";
    var errors = this.state.errors;

    if (errors !== null && errors.length === 0) {
      errorClass += " has-success";
    } else if (errors !== null) {
      errorClass += " has-error";
    }

    var formattedErrors = this.renderErrors();
    return(
      <div className={errorClass} >
        <input onChange={this.handleChange} type="text" className="form-control" name={this.props.name}></input>
        <span className="help-block">{formattedErrors}</span>
      </div>
    );
  }
});

// Class for form of inputs
self.upcInputs = React.createClass({
  getInitialState: function(){
    return({
      inputs: this.getInitialInputs(),
      errorMessage: null
    });
  },

  getInitialInputs: function(){
    var initialInputs = [];
    for (var i = 0; i < 10; i++) {
      initialInputs.push(<self.upcInput key={"input-" + i} name={"input-" + i}/>);
    }
    return initialInputs;
  },

  handleSubmit: function(evnt){
    evnt.preventDefault();
    var errorsPresent = $(".has-error").length > 0;
    if(errorsPresent){
      this.setState({
        errorMessage: "Please fix errors before submitting"
      });
    } else {
      var upcHash = {};
      _.each($('form').serializeArray(), function(el) {
        var value = el.value;
        if(value !== ""){
          upcHash[value] = true;
        }
      });
      this.sendData(Object.keys(upcHash));
    }
  },

  sendData: function(upcList){
    var request = $.ajax({
        method: 'POST',
        url: 'https://iwo3uesa6c.execute-api.us-east-1.amazonaws.com/prod/products',
        data: {"list": [
          "082184090466",
          "083085300265",
          "889714000045"
        ]},
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", "Basic " + btoa("username:password"));
        },
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        success: function(a,b,c){
          console.log(a);
        },
        error: function(a,b,c){
          console.log(a);
        },
    });
  },

  handleFormClick: function(){
    this.setState({
      errorMessage: null
    });
  },

  addInput: function(){
    var inputs = this.state.inputs;
    var newKey = parseInt(inputs[inputs.length-1].key.slice(6)) + 1;
    inputs.push(<self.upcInput key={"input-" + newKey}/>);
    this.setState({inputs: inputs});
  },

  removeInput: function(){
    var inputs = this.state.inputs;
    inputs.pop();
    this.setState({inputs: inputs});
  },

  render: function(){
    var inputs = this.state.inputs;
    var errorMessageClass = this.state.errorMessage === null ? "" : "alert alert-danger";
    return(
      <div className="row">
        <form id="upc-inputs" className="col-sm-offset-4 col-sm-4" onClick={this.handleFormClick}>
          {inputs}
        </form>
        <div id="form-footer" className="col-sm-offset-4 col-sm-4">
          <button className='btn btn-success change-num-inputs' onClick={this.addInput}>+</button>
          <button className='btn btn-danger change-num-inputs' onClick={this.removeInput}>-</button>
          <button className='btn btn-primary pull-right' onClick={this.handleSubmit}>Submit</button>
          <div className={errorMessageClass}>{this.state.errorMessage}</div>
        </div>
      </div>
    );
  }
});

// Class for page
self.upcEntryPage = React.createClass({
  render: function(){
    return(
      <div>
        <h3 id='upc-entry-header'>UPC Entry</h3>
        <self.upcInputs/>
      </div>
    );
  }
});

//Place react component on page
$(document).ready(function(){
  ReactDOM.render(
    React.createElement( self.upcEntryPage, {}, ""),
    document.getElementById('main')
  );
});
