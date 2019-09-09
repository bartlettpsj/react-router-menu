import React, { Fragment, useRef, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/core';
import history from "./history";
import _ from 'lodash';

const MENU_WIDTH = '350px';

const Backdrop = styled('div')`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  z-index: 1;
`;

const spin = keyframes`
  100% {
    transform: rotate(90deg);
  }
`;

const X = styled.svg`
  height: 1.4rem;
  width: 1.4rem;
  stroke: black;
  stroke-width: 1.0rem;
  opacity: 0.23;
  animation: ${spin} 0.5s; 
  
  &:hover {
    opacity: 0.6;
  }    
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding-bottom: 0.5rem;  
`;

const Close = ({ onClick }) => (
  <CloseButton onClick={onClick}>
    <X viewBox="0 0 100 100">
      <path d="M0,0 100,100 M100,0 0,100"/>
    </X>
  </CloseButton>
);

const StyledHeaderWrapper = styled.div`
  padding-left: 34px;
  padding-right: 34px;
  margin-top: 10px;
  margin-bottom: 50px;
`;

const Title = styled.span`
  font-size: 1.3em;
  float: left;
  line-height: 1.4em; 
`;

const CloseContainer = styled.span`
  float: right;
`;

const MenuHeader = ({ onClose }) => (
  <StyledHeaderWrapper>
    <Title>Departments</Title>
    <CloseContainer>
      <Close onClick={onClose}/>
    </CloseContainer>
  </StyledHeaderWrapper>
)

const slideIn = keyframes`
 from { left: -${MENU_WIDTH}; }
 to { left: 0px;}
`;

const BigContainer = styled.div`
  position: relative;
  left: ${props => { console.log('left is', props.left); return props.left; }};  
  animation: ${slideIn} 0.3s ease-in;
  transition: left 0.3s;  
  *, *::before, *::after {
    box-sizing: border-box;
  }  
  pointer-events: ${props => { console.log('Visibility:',props); return props.hover}}  
`;

const Container = styled('div')`
  position: static;
  height: 100%;
  width: ${MENU_WIDTH};
  background: white;
  padding-top: 1.5em;
  padding-bottom: 1.5em;  
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 2;
  
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.07),0 3px 13px 0 rgba(0,0,0,.16);    
  box-shadow-amz: 4px 0 10px 0 rgba(0,0,0,.4);
  
  -ms-overflow-style: none; // IE 10+
  scrollbar-width: none; // Firefox
  &::-webkit-scrollbar {
    display: none; // Safari and Chrome
  }    
`;

// const AddHover = css`
//     visibility: visible;
// `
//
// const RemHover = css`
//     visibility: hidden;
// `


// will change to use divs to avoid nested <A> tags but need to add click link
const StyledItem = css`
  cursor: pointer;
  line-height: 3.2em;
  width: 100%;
  display: block;
  position: static;    
  text-decoration: none;  
  color: black;
  padding-left: 34px;
  padding-right: 34px;

  &:hover {
    text-decoration: none;
    background-color: #81CDF2;
    color: black;        
  }
  
  &:hover > div { 
    visibility: visible;  
  }  
`;

// visibility: ${props => { console.log('Visibility:',props); return props.hover}};

const Item2 = ({onClick, id, to, ...props}) => {
  return <div key={id} {...props} onClick={ (e)=>{ e.stopPropagation(); console.log('Click', to); history.push(`${to.pathname}?${to.search}`)}}/>
}

const Item = styled(Item2)`
  cursor: pointer;
  line-height: 3.2em;
  width: 100%;
  display: block;
  position: static;    
  text-decoration: none;  
  color: black;
  padding-left: 34px;
  padding-right: 34px;

  &:hover {
    text-decoration: none;
    background-color: #81CDF2;
    color: black;        
  }
  
  &:hover > div { 
    visibility: visible;  
    
`
// Only local as link needs react router
const Link = ({to}, {...props}) => {
  console.log(props);
  return (
    <div>
      {/*<a {...props} href={`${to.pathname}?${to.search}`}>*/}

      {/*</a>*/}
    </div>
  )
};

// const SubItem = styled(Link)`
//   ${StyledItem}
// `;

const StyledSubCategory = styled.div`
  padding-left: 34px;
  padding-right: 34px;
  font-size: 1.2em;
  font-weight: bold;
`;

const Wrapper = styled.div`
    position: absolute;
    visibility: hidden;
    background-color: white;        
    left: ${props => props.left};
    top: ${props => props.top};
    padding-top: 20px;
    padding-bottom: 34px;
    min-width: 300px;
  `;

const Menu = ({ categories, onClose }) => {
  const [myRect, setMyRect] = useState({ left: 0, top: 0 });
  const containerRef = useRef(null);
  const [myClassName, setMyClassName] = useState("");
  const [bigLeft, setBigLeft] = useState('0px');
  const [enableHover, setEnableHover] = useState('none');

  setTimeout(()=>setEnableHover('auto'), 500)            ;

  // const [animating, setAnimating] = useState(false);

  let key = 0;

  const EnterHover = (e) => {
    logEvent(e);
    const itemRect = e.target.getBoundingClientRect();

    // Get the menu group that will popup
    const wrapper = e.target.children[0];
    const wrapperRect = wrapper.getBoundingClientRect();
    const height = wrapperRect.height;
    const bottom = itemRect.top + height;

    // will this fit from top+height
    console.log('New Bottom', bottom);
    console.log('Wrapper', wrapperRect);

    const node = ReactDOM.findDOMNode(containerRef.current);

    // const rect = node.getBoundingClientRect();
    const maxheight = node.offsetHeight;
    console.log('container height', maxheight);

    const newtop = (bottom < maxheight) ? itemRect.top : Math.max(0, maxheight - height - 10) ;

    return {
      left: itemRect.left + e.target.offsetWidth + 'px',
      top: newtop + 'px'
    };
  }

  const callHover = useCallback((e) => setMyRect(EnterHover(e)), [EnterHover]);


  const logEvent = (e) => {
    console.log(`${e.type} Event client [${e.clientX},${e.clientY}] screen [${e.screenX}, ${e.screenY}]`);
  }

  // const setAnimationStart = () => {
  //   console.log('Animation Start');
  //   setAnimating(true);
  // }
  //
  // const setAnimationDone = () => {
  //   console.log('Animation Done')
  //   setAnimating(false);
  // }

  // onAnimationStart={setAnimationStart}  onAnimationEnd={setAnimationDone}

  const animClose = () => {
    setBigLeft('-' + MENU_WIDTH);
    setTimeout( () => onClose(), 500);
  };

  return (

    <Backdrop onClick={e => {
      if (e.target === e.currentTarget) {
        animClose();
      }
    }}>
      <BigContainer className={myClassName} left={bigLeft} hover={enableHover}>
        <Container  ref={containerRef}>
          <MenuHeader onClose={animClose}/>
          {_.times(15 , () => categories.map(category => (
            <Item key={++key} id={++key} onMouseEnter={callHover}
                  to={{ pathname: "/products", search: `cat_id=${category.id}` }}>
              {category.name}
              <Wrapper key={++key} left={myRect.left} top={myRect.top}>
                <StyledSubCategory>{category.name}</StyledSubCategory>
                {category.children.map(({ id, name }) => (
                  <Item key={++key} to={{ pathname: "/products", search: `cat_id=${id}` }}>
                    {name}
                  </Item>
                ))}
              </Wrapper>
            </Item>
          )))}
        </Container>
      </BigContainer>
    </Backdrop>
  )
}

export default Menu;
