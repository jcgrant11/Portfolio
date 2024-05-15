import { useEffect, useState, useRef } from 'react';
import { Grid } from '@mui/material';
import { formatCurrency } from '../helpers/formatter';
import { useNavigate } from "react-router-dom";
import * as React from 'react';

export default function OtherResults(props) {
    const ref = useRef();
    const [width, setWidth] = useState(0);

    useEffect(() => {
        // when the component gets mounted
        setWidth(ref.current.offsetWidth); 
        // to handle page resize
        const getwidth = ()=>{
          setWidth(ref.current.offsetWidth);
        }
        window.addEventListener("resize", getwidth);
        // remove the event listener before the component gets unmounted
        return ()=>window.removeEventListener("resize", getwidth)
      }, []);
    
      const scrollRight = () => {
        document.getElementById("slides-container").scrollLeft += width;
      };
    
      const scrollLeft = () => {
        document.getElementById("slides-container").scrollLeft -= width;
      };

    const RenderOtherResults = arr => {
        const other_homes = arr.data;
        return (
            other_homes.slice(1).map((result) => (
                <li className="slide other-results">
                    <div className="other-results-slides" ref={ref}>
                        <h3>Other Properties Matching Your Search</h3>
                        <ul>
                            <li><span>Address:</span> {result.Address}</li>
                            <li><span>Price:</span> {formatCurrency(result.Price)}</li>

                            <li><span>Square Footage:</span> {result.SqrFt}</li>
                            <li><span>Description:</span> {result.Description.slice(0, 150) + "..."}</li>
                        </ul>
                        <a href={result.Url} target="_blank" rel="noopener noreferrer">
                            <button><span className="front">See Listing</span></button>
                        </a>
                    </div>
                </li>
            ))
        );
    };

    if (props.data.length > 1) {
        return (
            <section className="other-results slider-wrapper">
                <button className="slide-arrow" id="slide-arrow-prev" onClick={() => scrollLeft()}>
                    &#8249;
                </button>

                <button className="slide-arrow" id="slide-arrow-next" onClick={() => scrollRight()}>
                    &#8250;
                </button>

                <ul className="slides-container" id="slides-container">
                    <RenderOtherResults data={props.data}></RenderOtherResults>
                </ul>
            </section>
        );
    } else {
        return (
            <section className="other-results slider-wrapper">
                <button className="slide-arrow" id="slide-arrow-prev">
                    &#8249;
                </button>

                <button className="slide-arrow" id="slide-arrow-next">
                    &#8250;
                </button>

                <ul className="slides-container" id="slides-container">
                    <li className="slide other-results">
                        <h3>No Other Results Found</h3>
                    </li>
                </ul>
            </section>
        );
    };
};