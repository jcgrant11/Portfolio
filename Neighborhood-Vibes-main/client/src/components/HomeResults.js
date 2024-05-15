import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { formatCurrency } from '../helpers/formatter';
import { useNavigate } from "react-router-dom";
import OtherResults from './OtherResults';
import * as React from 'react';
const config = require('../config.json');


export default function Results(props) {

    if (Object.keys(props.data).length == 0) { // Loads no results found if query finds nothing
      return (
        <div className="home-no-results">
          <h2>NO RESULTS FOUND</h2>
        </div>
      )
    } else if (props.data[0] == 'LOAD') { // Loads nothing at the beginning
      return (
        <div style={{display: 'none'}}>
        </div>
      )
    } else if (props.data.length > 0) {
      return (
        <div className='home-results-container'>
            <Grid item xs={12}>
            <div className="best-result home-best">
                <h2>TOP PROPERTY</h2>
                <h3><span>Address:</span> {props.data.length > 0 && (props.data[0].Address)}</h3>
                <ul>
                <li><span>Price:</span> {formatCurrency(props.data[0].Price)}</li>

                <li><span>Square Footage:</span> {props.data[0].SqrFt} Square Feet</li>

                <li><span>Description:</span> {props.data[0].Description.slice(0, 150) + "..."}</li>

                </ul>
                <a href={props.data.length > 0 && (props.data[0].Url)} target="_blank" rel="noopener noreferrer">
                    <button><span className="front">See Listing</span></button>
                </a>
            </div>
            </Grid>
            <Grid item xs={12}>
                <OtherResults data={props.data}></OtherResults>
            </Grid>
        </div>
      )
    }
  };