import React, { Component } from 'react';

class ContactFormGroup extends Component {
  handleFieldChange = col => ev => {
    this.props.handleFieldChange(col, ev.target.value);
  }
  
  // render form groups with field mappings
  render() {
    const fields = [ 
      { value: 'FirstName', name: 'First Name' }, 
      { value: 'LastName', name: 'Last Name' }, 
      { value: 'AccountName', name: 'Account Name' }, 
      { value: 'MailingStreet', name: 'Mailing Street' }, 
      { value: 'MailingPostalCode', name: 'Mailing Postal Code' }, 
      { value: 'MailingCity', name: 'Mailing City' }, 
      { value: 'Phone', name: 'Phone' }
    ]
      
    return (
      <form>
        {
          this.props.csvContacts.map((col, i) => {
            return (
              <div className="form-group row" key={ col }>
                <div className="col-3">{ col }</div>
                <select className="form-control col" onChange={ this.handleFieldChange(col) } defaultValue="" >
                  <option value="">-</option>
                  { fields.map(field => { return <option key={ field.value } value={ field.value }>{ field.name }</option> }) }
                </select>
              </div>
            )
          })
        }
      </form>    
    );
  }
}

export default ContactFormGroup;