import React, { Component } from 'react';
import { API_URL } from '../constants';
import 'whatwg-fetch';

class CreateContactsButton extends Component {
  
  // prepare contacts and post them to SF
  createContacts(csvContacts, fieldNames) {
    if (csvContacts === []) {
      return;
    }
    
    // check if last name is mapped
    let lastNameMapped = false;
    for (const [key, value] of Object.entries(fieldNames)) {
      if (value === 'LastName') {
        lastNameMapped = true;
        break;
      }
    }
    if (!lastNameMapped) {
      return;
    }
    
    // map to objects
    let contactObjects = [];
    for (let i = 1; i < csvContacts.length; i++) {
      contactObjects[i-1] = {};
      
      for (let j = 0; j < csvContacts[0].length; j++) {
        if (fieldNames[csvContacts[0][j]].length > 0) {
          contactObjects[i-1][fieldNames[csvContacts[0][j]]] = csvContacts[i][j];
        }
      }
    }
    
    contactObjects = contactObjects.filter(item => item.LastName != null);
  
    fetch(`${API_URL}/api/createContacts`, {
        method: 'POST',
        body: JSON.stringify(contactObjects),
        headers:{ 'content-type': 'application/json' },
        credentials: 'include'
    });
  }
  
  // render create contacts button
  render() {
    return (
      <button 
        onClick={this.createContacts.bind(this, this.props.csvContacts, this.props.fieldNames)} 
        className="btn btn-info float-right col-2"
      >
        Create Contacts
      </button>
    );
  }
}

export default CreateContactsButton;