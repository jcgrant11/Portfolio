import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom';

// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
const NavText = ({ href, text, isMain, zip }) => {
  return (
    <Typography
      variant={isMain ? 'h4' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'open sans',
        fontWeight: 700,
      }}
    >
      <NavLink
        to={href}
        state={zip}
        style={{
          color: 'black',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
export default function NavBar() {
  return (
    <AppBar position='static' sx={{ height: "100px", backgroundColor: "rgba(236, 236, 236, 0.8)" }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={{ height: "100px", justifyContent: "space-around", alignItems: "center" }}>
          <NavText href='/' text='Neighborhood Vibe' isMain />
          <NavText href='/info' zip='null' text='Detailed Neighborhood Information' />
          <NavText href='/find' zip='0' text='Find My Home' />
        </Toolbar>
      </Container>
    </AppBar>
  );
}