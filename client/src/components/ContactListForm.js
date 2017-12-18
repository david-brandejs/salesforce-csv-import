import React, { Component } from 'react';

class ContactListForm extends Component {
  handleNameChange(e) {
      this.setState({ name: e.target.value });

      this.loadSecuredProviders(0, e.target.value);
  }
  
  // render imported contacts
  render() {
    return (
      <div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              { 
                this.props.csvContacts.map((row, i) => {
                  return ( i === 0 ? 
                    <tr key={ row[0] + i }>
                      { row.map((col, j) => { return <th key={ col + i + j }>{ col }</th> }) }
                    </tr>
                    : null
                  )
                })
              }
            </thead>
            <tbody>
              { 
                this.props.csvContacts.map((row, i) => {
                  return ( i > 0 ? 
                    <tr key={ row[1] + i }>
                      { row.map((col, j) => { return <td key={ col + i + j }>{ col }</td> }) }
                    </tr>
                    : null
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ContactListForm;