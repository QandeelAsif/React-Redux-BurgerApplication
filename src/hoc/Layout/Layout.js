import React,{Component} from 'react';
import Aux from '../Auxiliiary/Auxiliary';
import classes from './Layout.css'
import Toolbar from '../../Components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../Components/Navigation/SideDrawer/SideDrawer'


class Layout extends Component{


    state={
        showSideDrawer:false
    }
    sideDrawerClosedHandler=(props)=>{
        this.setState({showSideDrawer:false})
    }

    sideDrawerToggleHandler=()=>{
        this.setState((prevState)=>{
            return {showSideDrawer: !prevState.showSideDrawer}
        })
    } 

    render(){

        return(
            <Aux>
            <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler}/> 

            <SideDrawer
             clicked={this.state.showSideDrawer}
             closed={this.sideDrawerClosedHandler}
             open={this.state.showSideDrawer}/>
                <main className={classes.Content}>
                {this.props.children}
                </main>
             </Aux>
        );
    }
   
}
export default Layout;