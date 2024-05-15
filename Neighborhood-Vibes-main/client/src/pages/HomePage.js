import { useState } from 'react';
import { Container, Slider, Grid, InputLabel, MenuItem } from '@mui/material';
import '../App.css';
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect } from 'react';
import { formatCurrency } from '../helpers/formatter';
import { CustomizedTooltips } from '../helpers/tooltips';
import { useNavigate } from "react-router-dom";

const config = require('../config.json');

function LearnMore(props) {

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/info`;
    navigate(path,
      {
        state: {
          zip: props.zip
        }
      }
    );
  }

  return (
    <button onClick={routeChange}><span className="front">Learn More</span></button>
  );
};


function ResultsInfo(props) {
  const [zipInfo, setZipInfo] = useState([]);
  const [listingData, setListingData] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/p2zip?zip=${props.zip}`)
      .then(res => res.json())
      .then(resJson => setZipInfo(resJson));
    fetch(`http://${config.server_host}:${config.server_port}/p2listing?zip=${props.zip}`)
      .then(res => res.json())
      .then(resJson => setListingData(resJson));
  });

  return (
    <div className='results-info'>
      <p>
        {props.zip} is located in {zipInfo.city}, {zipInfo.state} in {zipInfo.county}.
      </p>
      <ul>
        <li>Average Listing Price: <b>{formatCurrency(Math.round(listingData.avg_price))}</b></li>
        <li>Average Listing Square Footage: <b>{Math.round(listingData.avg_sqrft)} sq. ft</b></li>
      </ul>
    </div>
  );
};

function OtherResults(parameters) {
  const ref = React.useRef(null);
  const [width, setWidth] = React.useState(0);

  useEffect(() => {
    // when the component gets mounted
    setWidth(ref.current.offsetWidth);
    // to handle page resize
    const getwidth = () => {
      setWidth(ref.current.offsetWidth);
    }
    window.addEventListener("resize", getwidth);
    // remove the event listener before the component gets unmounted
    return () => window.removeEventListener("resize", getwidth)
  }, []);

  const scrollRight = () => {
    document.getElementById("slides-container").scrollLeft += width;
  };

  const scrollLeft = () => {
    document.getElementById("slides-container").scrollLeft -= width;
  };

  const RenderOtherResults = arr => {
    const other_zip_codes = arr.results;
    return (
      other_zip_codes.slice(1).map((zip) => (
        <li className="slide other-results" ref={ref}>
          <h3>Other Results </h3>
          <h4>Zipcode: {zip.zip_code}</h4>
          <ResultsInfo zip={zip.zip_code}></ResultsInfo>
          <LearnMore zip={zip.zip_code}></LearnMore>
        </li>
      ))
    );
  };

  if (parameters.resultArray.length > 1) {
    return (
      <section className="other-results slider-wrapper">
        <button className="slide-arrow" id="slide-arrow-prev" onClick={() => scrollLeft()}>
          &#8249;
        </button>

        <button className="slide-arrow" id="slide-arrow-next" onClick={() => scrollRight()}>
          &#8250;
        </button>

        <ul className="slides-container" id="slides-container">
          <RenderOtherResults results={parameters.resultArray}></RenderOtherResults>
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

function Results(parameters) {
  if (Object.keys(parameters.resultArray).length == 0) { // Loads no results found if query finds nothing
    return (
      <div className="home-no-results">
        <h2>NO RESULTS FOUND</h2>
      </div>
    )
  } else if (parameters.resultArray[0] == 'LOAD') { // Loads nothing at the beginning
    return (
      <div>
      </div>
    )
  } else if (parameters.resultArray.length > 0) {
    return (
      <div className="home-results">
        <Grid container spacing={0} sx={{ textAlign: "Center", width: "80%", margin: "auto", marginTop: "30px" }}>
          <Grid item xs={12}>
            <div className="best-result">
              <h3>Best Match</h3>
              <h4>Zipcode: <u>{parameters.resultArray[0].zip_code}</u></h4>
              <ResultsInfo zip={parameters.resultArray[0].zip_code}></ResultsInfo>
              <LearnMore zip={parameters.resultArray[0].zip_code}></LearnMore>
            </div>
          </Grid>
          <Grid item xs={12}>
            <OtherResults resultArray={parameters.resultArray}></OtherResults>
          </Grid>
        </Grid>
      </div>
    )
  }
};

export default function HomePage() {
  const [city, setCity] = useState('Indianapolis');
  const [ambience, setAmbience] = useState('N/A');
  const [dining, setDining] = useState('N/A');
  const [lifeStyle, setLifeStyle] = useState('N/A');
  const [storeHours, setStoreHours] = useState('N/A');
  const [medianIncome, setMedianIncome] = useState([5000, 250000]);
  const [avgHomePrice, setAvgHomePrice] = useState([10000, 2000000]);
  const [percentOwned, setPercentOwned] = useState(0);
  const [percentVacant, setPercentVacant] = useState(100);
  const [sortOrder, setSortOrder] = useState('ambience DESC');
  const [result, setResult] = useState(['LOAD']);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/page1?city=${city}` +
      `&ambience=${ambience}` +
      `&dining=${dining}` +
      `&lifeStyle=${lifeStyle}` +
      `&storeHours=${storeHours}` +
      `&min_income=${medianIncome[0]}&max_income=${medianIncome[1]}` +
      `&min_homeValues=${avgHomePrice[0]}&max_homeValues=${avgHomePrice[1]}` +
      `&percentOwned=${percentOwned}` +
      `&maxVacancyRates=${percentVacant}` +
      `&mostImportant=${sortOrder}`
    )
      .then(res => res.json())
      .then(resJson => {
        setResult(resJson);
      });
  };

  return (
    <Container>
      <h2 className="page-title"><span>Find Your Neighborhood Vibe!</span></h2>
      <div className='home-form'>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            expanded
          >
            <Typography>Step 1: Select Your City</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className='city-selector'>
              <h2>Step 1: Select Your City</h2>
              <Grid container spacing={0} sx={{ textAlign: "Center", width: "80%", margin: "auto" }}>
                <Grid item xs={4}>
                  <div>
                    <input type="radio" id="indianapolis" name="city" onClick={() => setCity('Indianapolis')} defaultChecked></input>
                    <label htmlFor="indianapolis">Indianapolis, IN</label>
                  </div>

                </Grid>
                <Grid item xs={4}>
                  <div>
                    <input type="radio" id="nashville" name="city" onClick={() => setCity('Nashville')}></input>
                    <label htmlFor="nashville">Nashville, TN</label>
                  </div>

                </Grid>
                <Grid item xs={4}>
                  <div>
                    <input type="radio" id="newOrleans" name="city" onClick={() => setCity('New Orleans')}></input>
                    <label htmlFor="newOrleans">New Orleans, LA</label>
                  </div>

                </Grid>
                <Grid item xs={4}>
                  <div>
                    <input type="radio" id="philly" name="city" onClick={() => setCity('Philadelphia')}></input>
                    <label htmlFor="philly">Philadelphia, PA</label>
                  </div>

                </Grid>
                <Grid item xs={4}>
                  <div>
                    <input type="radio" id="tampa" name="city" onClick={() => setCity('Tampa')}></input>
                    <label htmlFor="tampa">Tampa, FL</label>
                  </div>

                </Grid>
                <Grid item xs={4}>
                  <div>
                    <input type="radio" id="tuscon" name="city" onClick={() => setCity('Tucson')}></input>
                    <label htmlFor="tuscon">Tucson, AZ</label>
                  </div>

                </Grid>
              </Grid>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Step 2: What are you looking for in your neighborhood?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <h2>Step 2: What are you looking for in your neighborhood?</h2>
              <Grid container spacing={0} sx={{ textAlign: "Center", width: "80%", margin: "auto" }}>
                <Grid item xs={6}>
                  <h3 className='help'>Ambience <CustomizedTooltips desc={["Ambience", "Preference for atmosphere of restaurants and bars in the neighborhood"]}></CustomizedTooltips></h3>

                  <select onChange={(e) => setAmbience(e.target.value)}>
                    <option value="N/A">Not Applicable</option>
                    <option value="casual">Casual</option>
                    <option value="hipster">Hipster</option>
                    <option value="trendy">Trendy</option>
                    <option value="divey">Divey</option>
                    <option value="upscale">Upscale</option>
                    <option value="romantic">Good for Couples</option>
                  </select>
                </Grid>
                <Grid item xs={6}>
                  <h3>Median Income</h3>
                  <Slider
                    size="small"
                    value={medianIncome}
                    min={5000}
                    max={250000}
                    step={5000}
                    onChange={(e, newValue) => setMedianIncome(newValue)}
                    valueLabelDisplay='on'
                    disableSwap
                    valueLabelFormat={value => <div>{formatCurrency(value)}</div>}
                  />
                </Grid>
                <Grid item xs={6}>
                  <h3 className='help'>Dining <CustomizedTooltips desc={["Dining", "Preference for features of restaurants and bars in the neighborhood"]}></CustomizedTooltips></h3>
                  <select onChange={(e) => setDining(e.target.value)}>
                    <option value="N/A">Not Applicable</option>
                    <option value="RestaurantsTakeOut">Takeout Options</option>
                    <option value="RestaurantsDelivery">Delivery Options</option>
                    <option value="HasTV">Restaurants have TVs</option>
                    <option value="HappyHour">Happy Hour Heaven</option>
                  </select>
                </Grid>
                <Grid item xs={6}>
                  <h3>Average Home Value</h3>
                  <Slider
                    size="small"
                    value={avgHomePrice}
                    min={10000}
                    max={2000000}
                    step={10000}
                    onChange={(e, newValue) => setAvgHomePrice(newValue)}
                    valueLabelDisplay='on'
                    disableSwap
                    valueLabelFormat={value => <div>{formatCurrency(value)}</div>}
                  />
                </Grid>
                <Grid item xs={6}>
                  <h3 className='help'>Lifestyle <CustomizedTooltips desc={["Lifestyle", "Preference for kid-friendly or dog-friendly places"]}></CustomizedTooltips></h3>
                  <select onChange={(e) => setLifeStyle(e.target.value)}>
                    <option value="N/A">Not Applicable</option>
                    <option value="GoodForKids">Good for Kids</option>
                    <option value="DogsAllowed">Dog Friendly</option>
                  </select>
                </Grid>
                <Grid item xs={6}>
                  <h3 className='help'>Min Percent Owned <CustomizedTooltips desc={["Min Percent Owned", "In case you want a neighborhood with homes occupied by owners, set the minimum percentage of homes that are occupied by home owners. If you do not care, leave it at 0%."]}></CustomizedTooltips></h3>
                  <Slider
                    size="small"
                    min={0}
                    max={100}
                    step={5}
                    defaultValue={0}
                    onChange={(e, newValue) => setPercentOwned(newValue)}
                    valueLabelDisplay='on'
                    valueLabelFormat={value => <div>{value}%</div>}
                  />
                </Grid>
                <Grid item xs={6}>
                  <h3 className='help'>Store Hours <CustomizedTooltips desc={["Store Hours", "Preference for stores opening early, closing late, or opening on the weekend"]}></CustomizedTooltips></h3>
                  <select onChange={(e) => setStoreHours(e.target.value)}>
                    <option value="N/A">Not Applicable</option>
                    <option value="opens_early">Open Early</option>
                    <option value="closes_late">Close Late</option>
                    <option value="open_weekends">Open Weekends</option>
                  </select>
                </Grid>
                <Grid item xs={6}>
                  <h3 className='help'>Max Vacancy Rate <CustomizedTooltips desc={["Max Vacancy Rate", "In case you want to avoid a neighborhood with too many vacant rental properties, set the maximum vacancy rate for rental properties in the neighborhood. If you do not care, leave it at 100%."]}></CustomizedTooltips></h3>
                  <Slider
                    size="small"
                    min={0}
                    max={100}
                    step={5}
                    defaultValue={100}
                    onChange={(e, newValue) => setPercentVacant(newValue)}
                    valueLabelDisplay='on'
                    valueLabelFormat={value => <div>{value}%</div>}
                  />
                </Grid>
              </Grid>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography>Step 3: What is most important to you?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <Grid container spacing={0} sx={{ textAlign: "Center", width: "80%", margin: "auto", marginTop: "30px" }}>
                <Grid item xs={12}>
                  <h3 className='help' id='sort'>Step 3: What is most important to you? <CustomizedTooltips desc={["Important Factor", "Top 5 result is provided(sorted) based on the selected factor"]}></CustomizedTooltips></h3>
                  <select id="sort-home" onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="ambience DESC">Ambience</option>
                    <option value="dining DESC">Dining</option>
                    <option value="lifeStyle DESC">Lifestyle</option>
                    <option value="storeHours DESC">Store Hours</option>
                    <option value="med_income DESC">Maximum Median Income</option>
                    <option value="med_income ASC">Minimum Median Income</option>
                    <option value="med_value DESC">Maximum Average Home Value</option>
                    <option value="med_value ASC">Minimum Average Home Value</option>
                    <option value="per_own ASC">Lowest Percent Owned</option>
                    <option value="per_own DESC">Highest Percent Owned</option>
                    <option value="vac_rate ASC">Lowest Vacancy Rate</option>
                    <option value="vac_rate DESC">Highest Vacancy Rate</option>
                  </select>
                </Grid>
                <Grid item xs={12}>
                  <button id="submit" onClick={() => search()}><span className="front">GO</span></button>
                </Grid>
              </Grid>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      <Results resultArray={result}></Results>
    </Container>
  );
};