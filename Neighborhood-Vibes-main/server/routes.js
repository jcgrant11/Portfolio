const mysql = require('mysql');
const config = require('./config.json');

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  multipleStatements: true,
});
connection.connect((err) => err && console.log(err));

/********************************
 * Page 1 Routes *
 ********************************/

// Route 1: GET/page1
const page1 = async function (req, res) {

  // set parameters based on the query parameters or default values
  // assumption: assume that a user is allowed to select two options in each category
  const city = req.query.city;
  const ambience =
    req.query.ambience === 'N/A'
      ? '%%'
      : '%' + req.query.ambience + '\'\': True%';
  const dining =
    req.query.dining === 'N/A'
      ? '%%'
      : '%' + req.query.dining + '\'\': \'\'True%';
  const lifeStyle =
    req.query.lifeStyle === 'N/A'
      ? '%%'
      : '%' + req.query.lifeStyle + '\'\': \'\'True%';
  const storeHours =
    req.query.storeHours === 'N/A'
      ? '%%'
      : '%' + req.query.storeHours + '%';
  const min_income = req.query.min_income ?? 0;
  const max_income = req.query.max_income ?? 10000000; // check with front end to set the default value 
  const min_homeValues = req.query.min_homeValues ?? 0;
  const max_homeValues = req.query.max_homeValues ?? 50000000; // check with front end to set the default value 
  const percentOwned = req.query.percentOwned ?? 0;
  const maxVacancyRates = req.query.maxVacancyRates ?? 100; // most important (asc) which is diff from other attributes.. 
  const mostImportant = req.query.mostImportant;

  connection.query(
    `
      WITH yelpCity AS (SELECT Business.zip_code AS zip_code, attributes, hours, ID
      FROM ZipCode JOIN Business ON ZipCode.zip_code = Business.zip_code
      WHERE ZipCode.city = '${city}'),  

      ambience(zip_code, ambience) AS (SELECT zip_code, COUNT(ID) as ambience
      FROM yelpCity
      WHERE attributes LIKE '${ambience}'
      GROUP BY zip_code
      HAVING ambience > 3), 

      dining(zip_code, dining) AS (SELECT zip_code, COUNT(ID) as dining
      FROM yelpCity
      WHERE attributes LIKE '${dining}'
      GROUP BY zip_code
      HAVING dining > 3), 

      lifeStyle(zip_code, lifeStyle) AS (SELECT zip_code, COUNT(ID) as lifeStyle
      FROM yelpCity
      WHERE attributes LIKE '${lifeStyle}'
      GROUP BY zip_code 
      HAVING lifeStyle > 3 ), 

      storeHours(zip_code, storeHours) AS (SELECT zip_code, COUNT(ID) as storeHours
      FROM yelpCity
      WHERE hours LIKE '${storeHours}'
      GROUP BY zip_code 
      HAVING storeHours > 3 ), 

      usCensus AS (SELECT Census.zip_code AS zip_code, med_income, med_value, per_own, vac_rate
      FROM Census JOIN ZipCode ON Census.zip_code = ZipCode.zip_code
      WHERE med_income BETWEEN ${min_income} AND ${max_income} 
      AND per_own >= ${percentOwned}
      AND vac_rate <= ${maxVacancyRates}
      AND (med_value BETWEEN ${min_homeValues} AND ${max_homeValues})) 

      SELECT cen.zip_code 
      FROM usCensus AS cen INNER JOIN ambience ON cen.zip_code = ambience.zip_code 
      INNER JOIN dining ON cen.zip_code = dining.zip_code 
      INNER JOIN lifeStyle AS life ON cen.zip_code = life.zip_code
      INNER JOIN storeHours AS hrs ON cen.zip_code = hrs.zip_code
      ORDER BY ${mostImportant}
      LIMIT 5;
      
  `,
    (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
};

/********************************
 * Page 2 Routes *
 ********************************/

// Route 2: GET /p2zip/:zip_code
// returns all ZipCode data for given zip-code
// test: http://localhost:8080/p2zip?zip=19106

const p2zip = async function (req, res) {
  const zip_code = req.query.zip;
  connection.query(`SELECT city, state, county FROM ZipCode WHERE zip_code = '${zip_code}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 3: GET /p2census/:zip_code
// returns all Census data for given zip-code
// test: http://localhost:8080/p2census?zip=19106
const p2census = async function (req, res) {
  const zip_code = req.query.zip;
  connection.query(`SELECT total_units, med_income, med_value, per_occupied, per_vacant, vac_rate, per_own, per_rent FROM Census WHERE zip_code = '${zip_code}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}


//Route 4: GET /p2listings/:zip_code
// for given zip-code returns average price and sqrft and longitude and latitude (random one using Limit 1)
// test: http://localhost:8080/p2listing?zip=19106
const p2listings_avg = async function (req, res) {
  const zip_code = req.query.zip;
  connection.query(`SELECT AVG(Price) AS avg_price, AVG(SqrFt) AS avg_sqrft, Latitude, Longitude FROM PropertyListing WHERE ZipCode = '${zip_code} LIMIT 1'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

//Route 5: GET /p2census_avg/:zip_code
// returns average of census data for the city the given zip-code belongs to 
// test: http://localhost:8080/p2census_avg?zip=19106
const p2census_avg = async function (req, res) {
  const zip_code = req.query.zip;
  connection.query(`WITH citylookup as (SELECT city from ZipCode WHERE zip_code = '${zip_code}')
  SELECT AVG(total_units) as avg_total_units, AVG(med_income) as avg_med_income, AVG(med_value) as avg_med_value,
   AVG(per_occupied) as avg_per_occupied, AVG(per_vacant) as avg_per_vacant, AVG(vac_rate) as avg_vac_rate,
   AVG(per_own) as avg_per_own, AVG(per_rent) as avg_per_rent
  FROM Census WHERE zip_code IN
        (SELECT Z.zip_code FROM ZipCode Z, citylookup C WHERE Z.city = C.city)
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

//Route 6: GET /p2ambience/:zip_code
// for given zip-code, returns count of each ambience type
// test: http://localhost:8080/p2ambience?zip=19106
const p2ambience = async function (req, res) {
  const zip_code = req.query.zip;
  connection.query(`WITH
    hipster(hipster_count) as (SELECT Count(*) FROM Business
                WHERE attributes LIKE '%''hipster'': True,%' and zip_code = '${zip_code}'),
    divey(divey_count) as (SELECT Count(*) FROM Business
                WHERE attributes LIKE '%''divey'': True,%' and zip_code = '${zip_code}'),
    trendy(trendy_count) as (SELECT Count(*) FROM Business
                WHERE attributes LIKE '%''trendy'': True,%' and zip_code = '${zip_code}'),
    upscale(upscale_count) as (SELECT Count(*) FROM Business
                WHERE attributes LIKE '%''upscale'': True,%' and zip_code = '${zip_code}'),
    casual(casual_count) as (SELECT Count(*) FROM Business
                WHERE attributes LIKE '%''casual'': True,%' and zip_code = '${zip_code}')
    SELECT * FROM hipster, divey, trendy, upscale, casual;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

//Route 7: GET /p2attr/:zip_code
// returns selected attributes count for given zip-code
// test: http://localhost:8080/p2attr?zip=19106
const p2attr = async function (req, res) {
  const zip_code = req.query.zip;
  connection.query(`WITH takeout(takeout_count) as (SELECT Count(*) FROM Business
  WHERE attributes LIKE '%''RestaurantsTakeOut'': ''True''%' and zip_code = '${zip_code}'),
delivery(delivery_count) as (SELECT Count(*) FROM Business
  WHERE attributes LIKE '%''RestaurantsDelivery'': ''True''%' and zip_code = '${zip_code}'),
tv(tv_count) as (SELECT Count(*) FROM Business
WHERE attributes LIKE '%''HasTv'': ''True%''' and zip_code = '${zip_code}'),
hh(hh_count) as (SELECT Count(*) FROM Business
  WHERE attributes LIKE '%''HappyHour'': ''True''%' and zip_code = '${zip_code}'),
kids(kids_count) as (SELECT Count(*) FROM Business
  WHERE attributes LIKE '%''GoodForKids'': ''True''%' and zip_code = '${zip_code}'),
couples(couples_count) as (SELECT Count(*) FROM Business
WHERE attributes LIKE '%''romantic'': True,%' and zip_code = '${zip_code}'),
dogs(dogs_count) as (SELECT Count(*) FROM Business
  WHERE attributes LIKE '%''DogsAllowed'': ''True''%' and zip_code = '${zip_code}'),
businesses(business_count) as (SELECT Count(*) FROM Business WHERE zip_code = '${zip_code}')
SELECT * FROM takeout, delivery, tv, hh, kids, couples, dogs, businesses;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

//Route 8: GET /p2hours/:zip_code
// returns hours count for given zip-code
// test: http://localhost:8080/p2hours?zip=19106
const p2hours = async function (req, res) {
  const zip_code = req.query.zip;
  connection.query(`WITH
  opens_early(opens_early_count) AS  (SELECT Count(*) FROM Business
                WHERE hours LIKE '%opens_early%' and zip_code = '${zip_code}'),
  closes_late(closes_late_count) AS (SELECT Count(*) FROM Business
                WHERE hours LIKE '%closes_late%' and zip_code = '${zip_code}'),
  open_weekends(open_weekends_count) AS (SELECT Count(*) FROM Business
              WHERE hours LIKE '%open_weekends%' and zip_code = '${zip_code}')
SELECT * FROM opens_early, closes_late, open_weekends;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

/********************************
 * Page 3 Routes *
 ********************************/

// Route 9: GET/find
const find = async function (req, res) {

  // set parameters based on the query parameters or default values 
  // assumption: TBD
  const city = '%' + req.query.city + '%';
  const zip_code = req.query.zip_code ?? 0;
  const ambience = req.query.ambience === 'N/A'
    ? '%'
    : '%' + req.query.ambience + '\'\': True%';
  const lifestyle = req.query.lifestyle === 'N/A' ? '%' : '%' + req.query.lifestyle + '\'\': \'\'True%';
  const store_hrs = req.query.store_hrs === 'N/A' ? '%' : '%' + req.query.store_hrs + '%';
  const dining = req.query.dining === 'N/A' ? '%' : '%' + req.query.dining + '\'\': \'\'True%';
  const med_income_min = req.query.med_income_min ?? 0;
  const med_income_max = req.query.med_income_max ?? 100000000000;
  const vac_rate = req.query.vac_rate ?? 100;
  const per_owned = req.query.per_owned ?? 0;
  // const avg_val = req.query.avg_val ?? ''; Should this be added to query??
  const home_price_min = req.query.home_price_min ?? 0;
  const home_price_max = req.query.home_price_max ?? 100000000000;
  const num_beds_min = req.query.num_beds ?? 0;
  const num_beds_max = req.query.num_beds ?? 12;
  const sqrft_min = req.query.sqrft_min ?? 0;
  const sqrft_max = req.query.sqrft_max ?? 100000;
  const sort_choice = req.query.sort_choice ?? 'p.Price';


  // const city = 'Philadelphia'
  // const ambience = 'casual\': True';
  // const lifestyle =  'GoodForKids: \'True';
  // const store_hrs = req.query.store_hrs === 'open_early'
  // const dining = req.query.dining === 'HappyHour\': \'True';


  if (zip_code > 10000) {
    connection.query(

      `SELECT *
      FROM PropertyListing
      WHERE Price BETWEEN ${home_price_min} AND ${home_price_max} AND Beds BETWEEN ${num_beds_min} AND ${num_beds_max} AND SqrFt BETWEEN ${sqrft_min} AND ${sqrft_max} AND Zipcode =${zip_code}
      ORDER BY ${sort_choice}
      LIMIT 5;`,
      (err, rows) => {
        if (err || rows.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(rows);
        }
      })
  }

  else {
    connection.query(
//       `
//     WITH Ambience(zip_code, num_amb) AS (SELECT zip_code, COUNT(ID) as num_amb
//                FROM Business
//                WHERE attributes LIKE '${ambience}'
//                GROUP BY zip_code
//                HAVING num_amb > 3),
//     Dining(zip_code, num_din) AS (SELECT zip_code, COUNT(ID) as num_din
//                 FROM Business
//                 WHERE attributes LIKE '${dining}'
//                 GROUP BY zip_code
//                 HAVING num_din > 3),
//     Lifestyle(zip_code, num_lif) AS (SELECT zip_code, COUNT(ID) as num_lif
//                 FROM Business
//                 WHERE attributes LIKE '${lifestyle}'
//                 GROUP BY zip_code
//                 HAVING num_lif > 3),
//     StoreHrs(zip_code, num_hrs) AS (SELECT zip_code, COUNT(DISTINCT ID) as num_hrs
//                 FROM Business
//                 WHERE hours LIKE '${store_hrs}'
//                 GROUP BY zip_code
//                 HAVING num_hrs > 3),
//     City (zip_code) AS (SELECT zip_code
//       FROM ZipCode
//       WHERE city LIKE '${city}')

// SELECT *
// FROM PropertyListing
// WHERE Price BETWEEN ${home_price_min} AND ${home_price_max} AND Beds BETWEEN ${num_beds_min} AND ${num_beds_max} AND SqrFt BETWEEN ${sqrft_min} AND ${sqrft_max} AND Zipcode IN (SELECT zip_code
//     FROM Census
//     WHERE med_income BETWEEN ${med_income_min} AND ${med_income_max} AND vac_rate <= ${vac_rate} AND per_own >= ${per_owned}) AND Zipcode IN (
//       SELECT Ambience.zip_code FROM Ambience INNER JOIN Dining ON Ambience.zip_code = Dining.zip_code INNER JOIN Lifestyle ON Dining.zip_code = Lifestyle.zip_code INNER JOIN StoreHrs ON Lifestyle.zip_code = StoreHrs.zip_code INNER JOIN City ON StoreHrs.zip_code = City.zip_code)
// ORDER BY ${sort_choice}
// LIMIT 5;`

`WITH yelpCity AS (SELECT b.zip_code, b.attributes, b.hours, b.ID
  FROM ZipCode z JOIN Business b ON z.zip_code=b.zip_code
  WHERE city LIKE '${city}'),

Ambience(zip_code, num_amb) AS (SELECT zip_code, COUNT(ID) as num_amb
         FROM yelpCity
         WHERE attributes LIKE '${ambience}'
         GROUP BY zip_code
         HAVING num_amb > 3),

Dining(zip_code, num_din) AS (SELECT zip_code, COUNT(ID) as num_din
          FROM yelpCity
          WHERE attributes LIKE '${dining}'
          GROUP BY zip_code
          HAVING num_din > 3),

Lifestyle(zip_code, num_lif) AS (SELECT zip_code, COUNT(ID) as num_lif
          FROM yelpCity
          WHERE attributes LIKE '${lifestyle}'
          GROUP BY zip_code
          HAVING num_lif > 3),

StoreHrs(zip_code, num_hrs) AS (SELECT zip_code, COUNT(ID) as num_hrs
          FROM yelpCity
          WHERE hours LIKE '${store_hrs}'
          GROUP BY zip_code
          HAVING num_hrs > 3),

UScensus AS (SELECT Census.zip_code, med_income, vac_rate, per_own
           FROM Census JOIN ZipCode ON Census.zip_code = ZipCode.zip_code
           WHERE med_income BETWEEN ${med_income_min} AND ${med_income_max} AND vac_rate <= ${vac_rate} AND per_own >= ${per_owned}),

property AS (SELECT p.Address, p.Zipcode, p.SqrFt, p.Price, p.Url, p.Description, p.Beds
               FROM PropertyListing p JOIN ZipCode ON p.Zipcode = ZipCode.zip_code
               WHERE Price BETWEEN ${home_price_min} AND ${home_price_max} AND Beds BETWEEN ${num_beds_min} AND ${num_beds_max} AND SqrFt BETWEEN ${sqrft_min} AND ${sqrft_max})

          SELECT *
          FROM property p INNER JOIN Ambience a ON p.Zipcode=a.zip_code
          INNER JOIN UScensus ce ON p.Zipcode = ce.zip_code
          INNER JOIN Dining ON p.Zipcode = Dining.zip_code
          INNER JOIN Lifestyle ON p.Zipcode = Lifestyle.zip_code
          INNER JOIN StoreHrs ON p.Zipcode = StoreHrs.zip_code
          ORDER BY ${sort_choice}
          LIMIT 5;`,
      (err, rows) => {
        if (err || rows.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(rows);
        }
      })
  };
}


// Route 10: GET /nearby/:address
const nearby = async function (req, res) {

  const address = req.params.address;


  connection.query(
    // `
    // WITH NP (address1, address2, dist) AS (SELECT s.Address, p.Address, 111.111 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(s.Latitude))*COS(RADIANS(p.Latitude))*COS(RADIANS ( s.Longitude - p.Longitude ))+SIN(RADIANS(s.Latitude) )*SIN(RADIANS(p.Latitude))))) AS dist
    // FROM PropertyListing AS s JOIN PropertyListing AS p ON s.Zipcode <> p.Zipcode
    //     WHERE p.Beds = s.Beds AND p.SqrFt < s.SqrFt + 200 AND (p.SqrFt > s.SqrFt - 200 AND 111.111 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(s.Latitude))*COS(RADIANS(p.Latitude))*COS(RADIANS ( s.Longitude - p.Longitude ))+SIN(RADIANS(s.Latitude) )*SIN(RADIANS(p.Latitude))))) < 300)
    //     ORDER BY dist)
    // SELECT *
    // FROM PropertyListing PL JOIN NP ON PL.Address = NP.address2
    // WHERE address1 LIKE '%${address}%'
    // ORDER BY dist
    // LIMIT 5
    // ;`

    `SELECT address2, Price, SqrFt, dist, Description, Url, Zipcode
  FROM PropertyListing PL JOIN Nearby N ON PL.Address = N.address2
  WHERE address1 LIKE '%${address}%'
  ORDER BY dist
  LIMIT 5;`
    ,
    (err, rows) => {
      if (err || rows.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(rows);
      }
    }
  );
};


module.exports = {
  page1,
  p2zip,
  p2census,
  p2listings_avg,
  p2census_avg,
  p2ambience,
  p2attr,
  p2hours,
  nearby,
  find,
};


