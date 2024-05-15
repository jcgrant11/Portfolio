import { useEffect, useState } from 'react';
import { CustomizedTooltips } from '../helpers/tooltips';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatCurrency } from '../helpers/formatter';
import Results from '../components/HomeResults';
import { useLocation } from 'react-router-dom';
const config = require('../config.json');

export default function FindHomePage() {
  const [city, setCity] = useState('Indianapolis');
  const [zipCode, setZipCode] = useState(0);
  const [homePrice, setHomePrice] = useState([0, 8500000]);
  const [vacRate, setVacRate] = useState(100);
  const [percentOwned, setPercentOwned] = useState(0);
  const [sqrFeet, setSqrFeet] = useState([200, 16000]);
  const [numBed, setNumBed] = useState([0, 9]);
  const [sortOrder, setSortOrder] = useState('Price');
  const [ambience, setAmbience] = useState('N/A');
  const [dining, setDining] = useState('N/A');
  const [lifeStyle, setLifeStyle] = useState('N/A');
  const [storeHours, setStoreHours] = useState('N/A');
  const [medianIncome, setMedianIncome] = useState([5000, 250000]);

  const [searchType, setSearchType] = useState('zip');
  const [hideZipSearch, setHideZipSearch] = useState('block');
  const [hideCharSearch, setHideCharSearch] = useState('none');
  const [showButton, setShowButton] = useState('none');
  const [showNearby, setShowNearby] = useState('none');


  const [nearbyData, setNearbyData] = useState([]);
  const [data, setData] = useState(['LOAD']);

  //loading page with values from page 1
  const location = useLocation();


  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/find?` +
      `city=${city}` +
      `&home_price_min=${homePrice[0]}&home_price_max=${homePrice[1]}` +
      `&med_income_min=${medianIncome[0]}&med_income_max=${medianIncome[1]}` +
      `&sqrft_min=${sqrFeet[0]}&sqrft_max=${sqrFeet[1]}` +
      `&num_beds_min=${numBed[0]}&num_beds_max=${numBed[1]}` +
      `&vac_rate=${vacRate}` +
      `&per_owned=${percentOwned}` +
      `&zip_code=${zipCode}` +
      `&ambience=${ambience}` +
      `&dining=${dining}` +
      `&lifestyle=${lifeStyle}` +
      `&store_hrs=${storeHours}` +
      `&sort_choice=${sortOrder}`
    ).then(res => res.json())
      .then(resJson => {
        const data = resJson.map((property) => ({ id: property.Address, ...property }));
        setData(data);
        console.log(data);
      });
    setTimeout(() => {
      setShowButton('block');
    }, 1000);
  }

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/nearby`)
      .then(res => res.json())
      .then(resJson => {
        const nearbyData = resJson.map((property) => ({ id: property.Address, ...property }));
        setNearbyData(nearbyData);
      });
  }, [data]);

  const search2 = (address) => {
    fetch(`http://${config.server_host}:${config.server_port}/nearby/${address}`)
      .then(res => res.json())
      .then(resJson => {
        const nearbyData = resJson.map((property) => ({ id: property.Address, ...property }));
        setNearbyData(nearbyData);
      });
  };

  const onClick2 = (address) => {
    search2(address);
    setShowNearby('block');
  }

  useEffect(() => {
    if (searchType == 'zip') {
      setHideZipSearch('block');
      setHideCharSearch('none');
    } else {
      setHideZipSearch('none');
      setHideCharSearch('block');
    };
  }, [searchType]);

  return (
    <Container>
      <h2 className="page-title"><span>Find My Dream Home!</span></h2>
      <div className='home-form'>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            expanded
          >
            <Typography>Step 1: Select your search type</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className='search-selector'>
              <h2>Step 1: How would you like to select your neighborhood?</h2>
              <Grid container spacing={0} sx={{ textAlign: "Center", width: "80%", margin: "auto" }}>
                <Grid item xs={6}>
                  <div>
                    <input type="radio" id="selectZipSearch" name="radioForSearchType" onClick={() => setSearchType('zip')} defaultChecked></input>
                    <label htmlFor="selectZipSearch">ZIP CODE SEARCH</label>
                  </div>

                </Grid>
                <Grid item xs={6}>
                  <div>
                    <input type="radio" id="selectCharSearch" name="radioForSearchType" onClick={() => setSearchType('char')}></input>
                    <label htmlFor="selectCharSearch">NEIGHBORHOOD SEARCH</label>
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
            <Typography>Step 2: Select your neighborhood</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className='city-selector' style={{ display: hideZipSearch, textAlign: 'center' }}>
              <h2>Step 2: Search by Zip Code</h2>
              <input type="text" id="zip" name="zip" placeholder="00000" maxLength="5" value={location.state.zip} onChange={(e) => setZipCode(e.target.value)}></input>
            </div>
            <div className='city-selector' style={{ display: hideCharSearch }}>
              <h2>Step 2: Search Neighborhoods by Characteristics</h2>
              <Grid container spacing={0} sx={{ textAlign: "Center", width: "80%", margin: "auto" }}>
                <Grid item xs={12}><h3>Select Your City</h3></Grid>
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
                <Grid item xs={12}>
                  <h2>Select Neighborhood Characteristics</h2>
                </Grid>
                <Grid item xs={3}>
                  <p>Ambience<CustomizedTooltips desc={["Ambience", "Preference for atmosphere of restaurants and bars in the neighborhood"]}></CustomizedTooltips></p>
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
                <Grid item xs={3}>
                  <p>Dining<CustomizedTooltips desc={["Dining", "Preference for features of restaurants and bars in the neighborhood"]}></CustomizedTooltips></p>
                  <select onChange={(e) => setDining(e.target.value)}>
                    <option value="N/A">Not Applicable</option>
                    <option value="RestaurantsTakeOut">Takeout Options</option>
                    <option value="RestaurantsDelivery">Delivery Options</option>
                    <option value="HasTV">Restaurants have TVs</option>
                    <option value="HappyHour">Happy Hour Heaven</option>
                  </select>
                </Grid>
                <Grid item xs={3}>
                  <p>Lifestyle<CustomizedTooltips desc={["Lifestyle", "Preference for kid-friendly or dog-friendly places"]}></CustomizedTooltips></p>
                  <select onChange={(e) => setLifeStyle(e.target.value)}>
                    <option value="N/A">Not Applicable</option>
                    <option value="GoodForKids">Good for Kids</option>
                    <option value="DogsAllowed">Dog Friendly</option>
                  </select>
                </Grid>
                <Grid item xs={3}>
                  <p>Store Hours<CustomizedTooltips desc={["Store Hours", "Preference for stores opening early, closing late, or opening on the weekend"]}></CustomizedTooltips></p>
                  <select onChange={(e) => setStoreHours(e.target.value)}>
                    <option value="N/A">Not Applicable</option>
                    <option value="opens_early">Open Early</option>
                    <option value="closes_late">Close Late</option>
                    <option value="open_weekends">Open Weekends</option>
                  </select>
                </Grid>
                <Grid item xs={4} className='home-sliders'>
                  <p>Median Income</p>
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

                <Grid item xs={4} className='home-sliders'>
                  <p>Min Percent Owned<CustomizedTooltips desc={["Min Percent Owned", "In case you want a neighborhood with homes occupied by owners, set the minimum percentage of homes that are occupied by home owners. If you do not care, leave it at 0%."]}></CustomizedTooltips></p>
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

                <Grid item xs={4} className='home-sliders'>
                  <p>Max Vacancy Rate<CustomizedTooltips desc={["Max Vacancy Rate", "In case you want to avoid a neighborhood with too many vacant rental properties, set the maximum vacancy rate for rental properties in the neighborhood. If you do not care, leave it at 100%."]}></CustomizedTooltips></p>
                  <Slider
                    size="small"
                    min={0}
                    max={100}
                    step={5}
                    defaultValue={100}
                    onChange={(e, newValue) => setVacRate(newValue)}
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
            aria-controls="panel1a-content"
            id="panel1a-header"
            expanded
          >
            <Typography>Step 3: Select your house characteristics</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className='search-selector'>
              <h2>Step 3: Select House Characteristics</h2>
              <Grid container spacing={0} sx={{ textAlign: "Center", width: "80%", margin: "auto" }}>
                <Grid item xs={4} className='home-sliders'>
                  <p>Bedrooms</p>
                  <Slider
                    size="small"
                    value={numBed}
                    min={0}
                    max={9}
                    step={1}
                    onChange={(e, newValue) => setNumBed(newValue)}
                    valueLabelDisplay='on'
                    disableSwap
                    valueLabelFormat={value => <div>{value}</div>}
                  />
                </Grid>
                <Grid item xs={4} className='home-sliders'>
                  <p>Square Footage</p>
                  <Slider
                    size="small"
                    value={sqrFeet}
                    min={0}
                    max={16000}
                    step={100}
                    onChange={(e, newValue) => setSqrFeet(newValue)}
                    valueLabelDisplay='on'
                    disableSwap
                    valueLabelFormat={value => <div>{value}</div>}
                  />
                </Grid>
                <Grid item xs={4} className='home-sliders'>
                  <p>Home Price</p>
                  <Slider
                    size="small"
                    value={homePrice}
                    min={0}
                    max={8500000}
                    step={10000}
                    onChange={(e, newValue) => setHomePrice(newValue)}
                    valueLabelDisplay='on'
                    disableSwap
                    valueLabelFormat={value => <div>{formatCurrency(value)}</div>}
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
            <Typography>Step 4: Select your sort order<CustomizedTooltips desc={["Important Factor", "Top 5 result is provided(sorted) based on the selected factor"]}></CustomizedTooltips></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <h2>Step 4: What's most important to you?</h2>
              <Grid container spacing={0} sx={{ textAlign: "Center", width: "80%", margin: "auto", marginTop: "30px" }}>
                <Grid xs={12}>
                  <select onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="Price">Low Price</option>
                    <option value="Price DESC">High Price</option>
                    <option value="Beds DESC">More Bedrooms</option>
                    <option value="Beds">Fewer Bedrooms</option>
                    <option value="SqrFt DESC">More Square Footage</option>
                    <option value="SqrFt">Less Square Footage</option>

                  </select>
                </Grid>
                <Grid xs={12}>
                  <button id="submit" onClick={() => search()}><span className="front">GO</span></button>
                </Grid>
              </Grid>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>

      <div className='results-container' style={{ display: showButton }}>
        <Grid container spacing={0} sx={{ textAlign: "Center", margin: "auto", marginTop: "30px", padding: "20px" }}>
          <Results data={data}></Results>
          <div className='nearbyButton' style={{ justifyItems: "center" }}>
            <button onClick={() => { onClick2(data[0].Address) }}>
              <span className="front">See Other Properties Near Your Top Property</span>
            </button>
          </div>
        </Grid>
      </div>

      <div className='results-container2' style={{ display: showNearby }}>
        <Grid container spacing={0} sx={{ textAlign: "Center", margin: "auto", marginTop: "30px", padding: "20px" }}>
          <div>
            <Grid item xs={12}>
              <h2>NEARBY PROPERTIES</h2>
            </Grid>
            <Grid item xs={12}>
              <div className="best-result">
                <h3>Closest Property to the Best Result</h3>
                <h4>Address: {nearbyData.length > 0 && (nearbyData[0].address2)}</h4>
                <ul>
                  <li><span>Price:</span> {nearbyData.length > 0 && (formatCurrency(nearbyData[0].Price))}</li>

                  <li><span>Square Footage:</span> {nearbyData.length > 0 && (nearbyData[0].SqrFt)}</li>
                  <li><span>Distance:</span> {nearbyData.length > 0 && (nearbyData[0].dist).toFixed(2)} km</li>
                  <li><span>Description:</span> {nearbyData.length > 0 && (nearbyData[0].Description.slice(0, 150) + "...")}</li>

                </ul>

                <a href={nearbyData.length > 0 && (nearbyData[0].Url)} target="_blank" rel="noopener noreferrer">
                  <button><span className="front">See Listing</span></button>
                </a>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="best-result">
                <h3>Other Nearby Properties</h3>
                <h4>Address: {nearbyData.length > 1 && (nearbyData[1].address2)}</h4>
                <ul>
                  <li><span>Price:</span> {nearbyData.length > 1 && (formatCurrency(nearbyData[1].Price))}</li>

                  <li><span>Square Footage:</span> {nearbyData.length > 1 && (nearbyData[1].SqrFt)}</li>
                  <li><span>Distance:</span> {nearbyData.length > 1 && (nearbyData[1].dist).toFixed(2)} km</li>
                  <li><span>Description:</span> {nearbyData.length > 1 && (nearbyData[1].Description.slice(0, 150) + "...")}</li>

                </ul>

                <a href={nearbyData.length > 1 && (nearbyData[1].Url)} target="_blank" rel="noopener noreferrer">
                  <button><span className="front">See Listing</span></button>
                </a>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="best-result">
                <h3>Other Nearby Properties</h3>
                <h4>Address: {nearbyData.length > 0 && (nearbyData[2].address2)}</h4>
                <ul>
                  <li><span>Price:</span> {nearbyData.length > 2 && (formatCurrency(nearbyData[2].Price))}</li>

                  <li><span>Square Footage:</span> {nearbyData.length > 2 && (nearbyData[2].SqrFt)}</li>
                  <li><span>Distance:</span> {nearbyData.length > 2 && (nearbyData[2].dist).toFixed(2)} km</li>
                  <li><span>Description:</span> {nearbyData.length > 2 && (nearbyData[2].Description.slice(0, 150) + "...")}</li>

                </ul>

                <a href={nearbyData.length > 2 && (nearbyData[2].Url)} target="_blank" rel="noopener noreferrer">
                  <button><span className="front">See Listing</span></button>
                </a>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="best-result">
                <h3>Other Nearby Properties</h3>
                <h4>Address: {nearbyData.length > 0 && (nearbyData[3].address2)}</h4>
                <ul>
                  <li><span>Price:</span> {nearbyData.length > 3 && (formatCurrency(nearbyData[3].Price))}</li>

                  <li><span>Square Footage:</span> {nearbyData.length > 3 && (nearbyData[3].SqrFt)}</li>
                  <li><span>Distance:</span> {nearbyData.length > 3 && (nearbyData[3].dist).toFixed(2)} km</li>
                  <li><span>Description:</span> {nearbyData.length > 3 && (nearbyData[3].Description.slice(0, 150) + "...")}</li>

                </ul>

                <a href={nearbyData.length > 3 && (nearbyData[3].Url)} target="_blank" rel="noopener noreferrer">
                  <button><span className="front">See Listing</span></button>
                </a>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="best-result">
                <h3>Other Nearby Properties</h3>
                <h4>Address: {nearbyData.length > 4 && (nearbyData[4].address2)}</h4>
                <ul>
                  <li><span>Price:</span> {nearbyData.length > 4 && (formatCurrency(nearbyData[4].Price))}</li>

                  <li><span>Square Footage:</span> {nearbyData.length > 4 && (nearbyData[4].SqrFt)}</li>
                  <li><span>Distance:</span> {nearbyData.length > 4 && (nearbyData[4].dist).toFixed(2)} km</li>
                  <li><span>Description:</span> {nearbyData.length > 4 && (nearbyData[4].Description.slice(0, 150) + "...")}</li>

                </ul>

                <a href={nearbyData.length > 4 && (nearbyData[4].Url)} target="_blank" rel="noopener noreferrer">
                  <button><span className="front">See Listing</span></button>
                </a>
              </div>
            </Grid>
          </div>
        </Grid>
      </div>


    </Container >
  );
}