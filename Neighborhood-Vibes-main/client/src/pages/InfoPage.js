
import { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import BrunchDiningOutlinedIcon from '@mui/icons-material/BrunchDiningOutlined';
import CottageOutlinedIcon from '@mui/icons-material/CottageOutlined';
import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import { useLocation, useNavigate } from 'react-router-dom';

const config = require('../config.json');

//loading map on button click
function LoadMapHere(props) {
  if (props.clickForMap) {
    return (
      <MapContainer center={[props.lat, props.long]} zoom={16}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[props.lat, props.long]}>
          <Popup>
            Zipcode: {props.zip}
          </Popup>
        </Marker>
      </MapContainer>
    )
  } else {
    return (
      <span></span>
    )
  }
}

export default function InfoPage() {

  //data fetch
  const [zipInfo, setZipInfo] = useState([]);
  const [censusData, setCensusData] = useState([]);
  const [listingData, setListingData] = useState([]);
  const [censusAvgData, setCensusAvgData] = useState([]);
  const [ambienceData, setAmbienceData] = useState('');
  const [attrData, setAttrData] = useState([]);
  const [hoursData, setHoursData] = useState([]);
  const [lat, setLat] = useState(39.951701398811984);
  const [long, setLong] = useState(-75.19097420638585);


  const [zip, setZip] = useState(null);
  const [isPending, setIsPending] = useState(true);

  const [loadMap, setLoadMap] = useState(false);
  const [hideButton, setHideButton] = useState('inline');

  //data analysis
  const [ambienceReturn, setAmbienceReturn] = useState('');
  const [incomeReturn, setIncomeReturn] = useState('');
  const [valueReturn, setValueReturn] = useState('');
  const [unitsReturn, setUnitsReturn] = useState('');
  const [occupiedReturn, setOccupiedReturn] = useState('');
  const [ownerReturn, setOwnerReturn] = useState('');
  const [renterReturn, setRenterReturn] = useState('');
  const [vacantReturn, setVacantReturn] = useState('');
  const [vacancyReturn, setVacancyReturn] = useState('');
  const [diningReturn, setDiningReturn] = useState([]);
  const [lifestyleReturn, setLifestyleReturn] = useState([]);
  const [hoursReturn, setHoursReturn] = useState([]);

  //loading page with values from page 1
  const location = useLocation();

  function LearnMore(props) {

    let navigate = useNavigate();
    const routeChange = () => {
      let path = `/find`;
      navigate(path,
        {
          state: {
            zip: props.zip
          }
        }
      );
    }

    return (
      <button onClick={routeChange}><span className="front">Find Homes in This Neighborhood</span></button>
    );
  };

  useEffect(() => {
    Promise.all([
      fetch(`http://${config.server_host}:${config.server_port}/p2zip?zip=${zip}`),
      fetch(`http://${config.server_host}:${config.server_port}/p2census?zip=${zip}`),
      fetch(`http://${config.server_host}:${config.server_port}/p2listing?zip=${zip}`),
      fetch(`http://${config.server_host}:${config.server_port}/p2census_avg?zip=${zip}`),
      fetch(`http://${config.server_host}:${config.server_port}/p2ambience?zip=${zip}`),
      fetch(`http://${config.server_host}:${config.server_port}/p2attr?zip=${zip}`),
      fetch(`http://${config.server_host}:${config.server_port}/p2hours?zip=${zip}`),
    ])
      .then(([resZipInfo, resCensusData, resListingData, resCensusAvgData, resAmbienceData, resAttrData, resHoursData]) =>
        Promise.all([resZipInfo.json(), resCensusData.json(), resListingData.json(), resCensusAvgData.json(),
        resAmbienceData.json(), resAttrData.json(), resHoursData.json()])
      )
      .then(([dataZipInfo, dataCensusData, dataListingData, dataCensusAvgData, dataAmbienceData, dataAttrData, dataHoursData]) => {
        setZipInfo(dataZipInfo);
        setCensusData(dataCensusData);
        setListingData(dataListingData);
        setCensusAvgData(dataCensusAvgData);
        setAmbienceData(dataAmbienceData);
        setAttrData(dataAttrData);
        setHoursData(dataHoursData);
      });
  }, [zip]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setZip(e.target.zip.value);
    setTimeout(() => {
      setIsPending(false);
    }, 5000);
  }

  useEffect(() => {
    if (loadMap) {
      setHideButton('none');
    }
  }, [loadMap]);

  useEffect(() => {
    setIncomeReturn(avg(censusData.med_income, censusAvgData.avg_med_income));
    setValueReturn(avg(censusData.med_value, censusAvgData.avg_med_value));
    setUnitsReturn(avg(censusData.total_units, censusAvgData.avg_total_units));
    setOccupiedReturn(avg(censusData.per_occupied, censusAvgData.avg_per_occupied));
    setOwnerReturn(avg(censusData.per_own, censusAvgData.avg_per_own));
    setRenterReturn(avg(censusData.per_rent, censusAvgData.avg_per_rent));
    setVacantReturn(avg(censusData.per_vacant, censusAvgData.avg_per_vacant));
    setVacancyReturn(avg(censusData.vac_rate, censusAvgData.avg_vac_rate));
    setLat(listingData.Latitude);
    setLong(listingData.Longitude);
  }, [censusData.med_income, censusData.med_value, censusData.total_units, censusData.per_occupied,
  censusData.per_own, censusData.per_rent, censusData.per_vacant, censusData.vac_rate, censusAvgData.avg_med_income,
  censusAvgData.avg_med_value, censusAvgData.avg_total_units, censusAvgData.avg_per_occupied, censusAvgData.avg_per_own,
  censusAvgData.avg_per_rent, censusAvgData.avg_per_vacant, censusAvgData.avg_vac_rate, listingData]);

  //neighborhood Statistics % difference
  function avg(value, average) {
    let result;
    let percentage;

    let bool;
    percentage = (((value - average) / value) * 100).toFixed(1);
    if (percentage < 0) {
      bool = 'lower';
      percentage = percentage * -1;
    } else {
      bool = 'higher';
    }
    result = percentage + "% " + bool;
    return result;
  }

  //neighborhood vibe, returns the most frequent ambience
  useEffect(() => {
    let amb;
    const hipster = ambienceData.hipster_count;
    const divey = ambienceData.divey_count;
    const trendy = ambienceData.trendy_count;
    const upscale = ambienceData.upscale_count;
    const casual = ambienceData.casual_count;
    const max = Math.max(hipster, divey, trendy, upscale, casual);
    if (hipster === max) {
      amb = 'hipster';
    } else if (divey === max) {
      amb = 'divey';
    } else if (trendy === max) {
      amb = 'trendy';
    } else if (upscale === max) {
      amb = 'upscale';
    } else if (casual === max) {
      amb = 'casual';
    }
    setAmbienceReturn(amb);
  }, [ambienceData.hipster_count, ambienceData.divey_count, ambienceData.trendy_count, ambienceData.upscale_count,
  ambienceData.casual_count]);

  //dining, calculates the percentage of businesses with the attribute and adds to array if high enough
  useEffect(() => {
    setDiningReturn([]);
    if ((attrData.takeout_count / attrData.business_count) > 0.2) {
      setDiningReturn(current => [...current, 'Lots of Takeout Options ']);
    }
    if ((attrData.delivery_count / attrData.business_count) > 0.2) {
      setDiningReturn(current => [...current, 'Lots of Delivery Options']);
    }
    if ((attrData.tv_count / attrData.business_count) > 0.1) {
      setDiningReturn(current => [...current, 'Restaurants that have TVs']);
    }
    if ((attrData.hh_count / attrData.business_count) > 0.1) {
      setDiningReturn(current => [...current, 'Lots of Happy Hour Options ']);
    }
  }, [attrData.business_count, attrData.delivery_count, attrData.hh_count,
  attrData.takeout_count, attrData.tv_count]);


  //lifestyle, calculates the percentage of businesses with the attribute and adds to array if high enough
  useEffect(() => {
    setLifestyleReturn([]);
    if ((attrData.kids_count / attrData.business_count) > 0.1) {
      setLifestyleReturn(current => [...current, 'Good For Kids ']);
    }
    if ((attrData.couples_count / attrData.business_count) > 0.05) {
      setLifestyleReturn(current => [...current, 'Good For Couples ']);
    }
    if ((attrData.dogs_count / attrData.business_count) > 0.05) {
      setLifestyleReturn(current => [...current, 'Dogs Friendly ']);
    }
  }, [attrData.kids_count, attrData.business_count, attrData.couples_count, attrData.dogs_count]);

  //hours, calculates the percentage of businesses with the opening hours type and adds to array if high enough
  useEffect(() => {
    setHoursReturn([]);
    if ((hoursData.opens_early_count / attrData.business_count) > 0.2) {
      setHoursReturn(current => [...current, 'Open Early ']);
    }
    if ((hoursData.closes_late_count / attrData.business_count) > 0.2) {
      setHoursReturn(current => [...current, 'Close Late ']);
    }
    if ((hoursData.open_weekends_count / attrData.business_count) > 0.5) {
      setHoursReturn(current => [...current, 'Open Weekends ']);
    }
  }, [hoursData.opens_early_count, attrData.business_count, hoursData.closes_late_count, hoursData.open_weekends_count]);

  //initial display of the form
  return (
    <Container>
      <h2 className="page-title"><span>Explore Your Neighborhood!</span></h2>
      <div className="zip-form">
        <form onSubmit={(e) => { handleSubmit(e) }}>
          <label htmlFor="fname" className='enter'>Enter a ZIP Code</label><br></br>
          <input type="text" id="zip" name="zip" placeholder="00000" maxLength="5" value={location.state.zip}></input>
          <button type='submit'><span className="front">Go</span></button>
        </form>
      </div>
      <Info />
    </Container>
  )

  //displays info
  function Info() {

    if (zip === null || isPending) {
      return (
        <div></div>
      )
    } else if ((attrData.business_count <= 20) || (listingData.avg_price == null) || ((zipInfo.city !== 'Indianapolis' && zipInfo.state !== 'IN') &&
      (zipInfo.city !== 'Nashville' && zipInfo.state !== 'TN') &&
      (zipInfo.city !== 'New Orleans' && zipInfo.state !== 'LA') &&
      (zipInfo.city !== 'Philadelphia' && zipInfo.state !== 'PA') &&
      (zipInfo.city !== 'Tampa' && zipInfo.state !== 'FL') &
      (zipInfo.city !== 'Tucson' && zipInfo.state !== 'AZ'))) {
      return (
        <div className="home-no-results">
          <h2>NO RESULTS FOUND</h2>
        </div>
      )
    } else {
      return (
        <Container>
          <div className="info-page" id="info-page-styling-container">
            <Grid container spacing={0} sx={{ textAlign: "Center", width: "90%", margin: "auto", marginTop: "30px" }}>
              <Grid item={true} xs={12}>
                <div className="best-result" id="zip-heading">
                  <div>
                    <h1>
                      {zip} is located in {zipInfo.city}, {zipInfo.state} in {zipInfo.county}.
                    </h1>
                  </div>
                </div>
              </Grid>
              <Grid item={true} xs={12} md={12}>
                <div id="vibe-map">
                  <div className="best-result info vibe" id="vibe1">
                    <h4><CelebrationOutlinedIcon /> Neighborhood Vibe</h4>
                    <p id="ambience-return">{ambienceReturn}</p>
                  </div>
                  <span id="map">
                    <button id="submit2" onClick={() => setLoadMap(true)} style={{ display: hideButton }}><span className="front">LOAD MAP</span></button>
                    <LoadMapHere clickForMap={loadMap} lat={lat} long={long} zip={zip} />
                  </span>
                </div>
              </Grid>

              <Grid item={true} xs={6} md={12}>
                <div className="best-result stats">
                  <h4><QueryStatsOutlinedIcon /> Statistics</h4>
                  <ul>
                    <li>Median Income is ${censusData.med_income.toLocaleString()}: <div className="bold">{incomeReturn}</div> than average in {zipInfo.city}, {zipInfo.state}</li>
                    <li>Median Value Owner Occupied is ${censusData.med_value.toLocaleString()}: <div className="bold">{valueReturn}</div> than average in {zipInfo.city}, {zipInfo.state}</li>
                    <li>Total Number of Housing Units is {censusData.total_units.toLocaleString()}: <div className="bold">{unitsReturn}</div> than average in {zipInfo.city}, {zipInfo.state}</li>
                    <li>Percent of Units Occupied is {censusData.per_occupied}%: <div className="bold">{occupiedReturn} </div>  than average in {zipInfo.city}, {zipInfo.state}</li>
                    <li>Percent of Units Owner Occupied is {censusData.per_own}%: <div className="bold">{ownerReturn} </div> than average in {zipInfo.city}, {zipInfo.state}</li>
                    <li>Percent of Units Renter Occupied is {censusData.per_rent}%: <div className="bold">{renterReturn} </div> than average in {zipInfo.city}, {zipInfo.state}</li>
                    <li>Percent of Units Vacant is {censusData.per_vacant}%: <div className="bold">{vacantReturn} </div> than average in {zipInfo.city}, {zipInfo.state}</li>
                    <li>Rental Vacancy Rate is {censusData.vac_rate}: <div className="bold">{vacancyReturn} </div> than average in {zipInfo.city}, {zipInfo.state}</li>
                  </ul>
                </div>
                <Grid container spacing={0} sx={{ textAlign: "Center", width: "80%", margin: "auto", marginTop: "30px" }}>
                  <div className="best-result info">
                    <h4><CottageOutlinedIcon /> Real Estate</h4>
                    <div>Average Price of Homes: <span className="bold">${Math.round(listingData.avg_price).toLocaleString()}</span></div>
                    <div>Average Square Footage of Homes: <br></br><span className="bold">{Math.round(listingData.avg_sqrft).toLocaleString()} sq. ft</span></div>
                  </div>
                  <div className="best-result info">
                    <h4><BrunchDiningOutlinedIcon /> Dining</h4>
                    {diningReturn.map((element, index) => {
                      return (
                        <div key={index}>
                          {element}
                        </div>
                      );
                    })}
                  </div>
                  <div className="best-result info">
                    <h4><FamilyRestroomOutlinedIcon /> Lifestyle</h4>
                    {lifestyleReturn.map((element, index) => {
                      return (
                        <div key={index}>
                          {element}
                        </div>
                      );
                    })}
                  </div>
                  <div className="best-result info">
                    <h4><QueryBuilderOutlinedIcon /> Store Hours</h4>
                    {hoursReturn.map((element, index) => {
                      return (
                        <div key={index}>
                          {element}
                        </div>
                      );
                    })}
                  </div>
                </Grid>
                <Grid item={true} xs={6} md={12}>
                  <div id="button-page3">
                    <LearnMore zip={zip} />
                  </div>
                </Grid>
              </Grid >
            </Grid>
          </div >
        </Container >
      )
    }
  };
}