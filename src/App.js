import React, {Fragment, useState} from 'react';
import {Switch, Route, Link} from 'react-router-dom'
import './App.css';
import Menu from './Menu';
import cats from './cats'

const Header = () => (
  <div>
    <h1>The Page Header</h1>
    <Link to={'/c1'}>Component one</Link> - &nbsp;
    <Link to={'/c2'}>Component two</Link> - &nbsp;
    <Link to={'/menu'} onClick={() => console.log('link clicked')}>Menu</Link>
  </div>
)

// const ShowMenu = () => (
//   <Menu categories={cats} onClose={doClose()}/>
// );

const Main = () => {
  const [active, setActive] = useState(true);

  const doClose = () => {
    console.log('closing');
    setActive(false);
  }

  return (
  <div>
    <Switch>
      <Route path={'/c1'} component={Comp1} />
      <Route path={'/c2'} component={Comp2} />
      <Route path={'/menu'} component={() => {
        if (active)
          return (<Menu categories={cats} onClose={doClose}/>)
        else
          return <button onClick={() => setActive(true)}>Hello</button>;
      }} />
    </Switch>
  </div>
)}

const Comp1 = () => (
  <Fragment>
    component1
  </Fragment>
)

const Comp2 = () => (
  <Fragment>
    component2
  </Fragment>
)


const App = () => {
  return (
    <div>
      <Header/>
      <hr/>
      <Main/>
    </div>
  );
}

export default App;
