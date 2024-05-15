import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { formatCurrency } from '../helpers/formatter';
import { useNavigate } from "react-router-dom";
import OtherResults from './OtherResults';
import * as React from 'react';


export default function NearbyResults(props) {

    if (Object.keys(props.nearbyData).length == 0) { // Loads no results found if query finds nothing
        return (
            <div className="home-no-results">
                <h2>NO RESULTS FOUND</h2>
            </div>
        )
    } else if (props.nearbyData[0] == 'LOAD') { // Loads nothing at the beginning
        return (
            <div style={{display: 'none'}}>
            </div>
        )
    } else if (props.nearbyData.length > 0) {
        return (
            <div>
                <Grid item xs={12}>
                    <h2>NEARBY PROPERTIES</h2>
                </Grid>
                <Grid item xs={12}>
                    <div className="best-result">
                        <h3>Closest Property to the Best Result</h3>
                        <h4>Address: {nearbyData.length > 1 && props.nearbyData[0].address2}</h4>
                        <ul>
                            <li>Price: {nearbyData.length > 1 && formatCurrency(props.nearbyData[0].Price)}</li>

                            <li>Square Footage: {nearbyData.length > 1 && props.nearbyData[0].SqrFt}</li>
                            <li>Distance: {nearbyData.length > 1 && (props.nearbyData[0].dist).toFixed(2)} km</li>
                            <li>Description: {nearbyData.length > 1 && (props.nearbyData[0].Description.slice(0, 150) + "...")}</li>

                        </ul>

                        <a href={props.nearbyData[0].Url} target="_blank" rel="noopener noreferrer">
                            <button><span className="front">See Listing</span></button>
                        </a>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <OtherResults data={props.nearbyData}></OtherResults>
                </Grid>
            </div>
        )
    }
};