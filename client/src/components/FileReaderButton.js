import React, { Component } from 'react';

import ReactFileReader from 'react-file-reader';

class FileReaderButton extends Component {
  
  // split values in csv files and save them in state
  resolveReader(result) {
    result = result.split('\n');
    
    for (let i = 0; i < result.length; i++) {
      result[i] = result[i].split(this.props.delimiter);
    }
    
    let fieldNames = [];
    for (let i = 0; i < result[0].length; i++) {
      fieldNames[result[0][i]] = '';
    }
    
    this.props.handleContactsChange(fieldNames, result);
  }
  
  // read from csv files
  handleFiles = files => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = () => { 
        resolve(this.resolveReader(reader.result));
      }
      reader.readAsText(files[0], 'ISO-8859-1');
    })
  }
    
  // render file reader
  render() {
    return (
      <ReactFileReader handleFiles={this.handleFiles} fileTypes={'.csv'}>
        <button className="btn btn-info float-left col-2">Import from .csv</button>
      </ReactFileReader>
    );
  }
}

export default FileReaderButton;