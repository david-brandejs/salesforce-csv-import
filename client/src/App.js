import React, { Component } from 'react';
import { API_URL } from './constants';
import CreateContactsButton from './components/CreateContactsButton.js';
import ContactListForm from './components/ContactListForm.js';
import FileReaderButton from './components/FileReaderButton.js';
import ContactFormGroup from './components/ContactFormGroup.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      csvContacts: [],
      fieldNames: [],
      delimiter: ';'
    };
  }
    
  login = () => {
    window.location = `${API_URL}/auth/login`;
  }
    
  handleFieldChange = (key, value) => {
    let newFieldNames = this.state.fieldNames;
    newFieldNames[key] = value;
    this.setState({ fieldNames: newFieldNames });
  }
  
  handleContactsChange = (newFieldNames, newCsvContacts) => {
    this.setState({ fieldNames: newFieldNames });
    this.setState({ csvContacts: newCsvContacts });
  }
  
  handleDelimiterChange = ev => {
    this.setState({ delimiter: ev.target.value });
  }
    
  render() {
    return (
      <div className="container">
        <div className="center">
          <br/><br/>
          <h1 className="text-info">Salesforce CSV Import</h1>
          <br/><br/>
          {
            this.props.location.search === '?valid=true' 
              ?
              <div>
                <form>
                  <label>Values separated by:</label>
                  <select className="form-control col-2" onChange={ this.handleDelimiterChange } defaultValue=";" >
                    <option value=";">Semicolon</option>
                    <option value=",">Comma</option>
                  </select>
                </form>
                <br/>
                
                <FileReaderButton delimiter={this.state.delimiter} handleContactsChange={this.handleContactsChange}/>
                
                { this.state.csvContacts.length > 0 
                  && <CreateContactsButton csvContacts={this.state.csvContacts} fieldNames={this.state.fieldNames}/>
                }
                
                <br/><br/><br/>
                
                { this.state.csvContacts.length === 0 && <p>No contacts have been loaded yet.</p> }
                
                { this.state.csvContacts.length > 0 && 
                  <div>
                    <h2 className="text-info">Edit Field Mapping</h2>
                    <p><b className="text-danger">Note</b>: Last Name must be mapped.</p>
                    <ContactFormGroup csvContacts={this.state.csvContacts[0]} handleFieldChange={this.handleFieldChange}/>
                    <br/>
                    <h2 className="text-info">Imported Contacts</h2>
                  </div>
                }
                
                <ContactListForm csvContacts={this.state.csvContacts} fieldNames={this.state.fieldNames} 
                  handleFieldChange={this.handleFieldChange}/>
              </div> 
              :
              <div>
                <button onClick={this.login} className="btn btn-info">
                  Log in
                </button>
              </div>
          }
        </div>
      </div>
    );
  }
}

export default App;