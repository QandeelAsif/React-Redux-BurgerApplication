import React from 'react';
import classes from './Input.css';


const input = ( props ) => {

    let inputElement= null;
    const inputClasses = [classes.InputElement]

    ///checking for validity represnetaion
            //--should validate is just for dropdown
    if (props.invalid && props.shouldValidate &&props.touched){
        inputClasses.push(classes.Invalid)
    }

    //to create generic input types
    switch( props.elementType ){
        case ('input'):
            inputElement=<input
             className={inputClasses.join(' ')} 
             {...props.elementConfig} 
             value={props.value}
             onChange={props.changed}/>
            break;
        case ('textarea'):
            inputElement=<textarea
             className={inputClasses.join(' ')} 
             {...props.elementConfig} 
             value={props.value}
             onChange={props.changed}/>
            break;
        case ('select'):
            inputElement=<select
                className={inputClasses.join(' ')}    
                value={props.value}
                onChange={props.changed}>
                {props.elementConfig.options.map( option =>(
                    <option
                        key={option.value}
                        value={option.value}>
                            {option.displayValue}
                    </option>
                ))} 
            </select>
            break;    
        default:
            inputElement=<input
             className={inputClasses.join(' ')} 
             {...props.elementConfig} 
             value={props.value}/>
            
    }

    
    ////////////for error popups
    let validationError = null;
    if (props.invalid && props.touched) {
        validationError = <p>Please enter a valid value!</p>;
    }
    
    return (
         <div className={classes.Input}>
             <label className={classes.Label}>{props.label}</label>
             {inputElement}
             {validationError}
         </div>
     );

    return(
        <div className={classes.Input}>
            <label className={classes.Label}> {props.label} </label>
            {inputElement}
        </div>
    );


    
}

export default input;