import React, { useState }  from 'react';
import { WNavItem, WInput, WButton} from 'wt-frontend';

const LandmarkEntry = (props) => {

    const handleLMDelete = () =>{
        props.deleteLM(props.index);
    }

    const handleLMRename = () =>{
        props.renameLM(props.index);
    }

    return(
        <WNavItem className="landmark-buttons">
            <WButton className = "landmark-button" onClick = {props.test}>
                {props.name}
            </WButton>
            <WButton onClick = {handleLMRename} className = "landmark-button-edit">
                <i className="material-icons">edit</i>
            </WButton>
            <WButton onClick = {handleLMDelete} className = "landmark-button-delete">
                <i className="material-icons">delete</i>
            </WButton>
        </WNavItem>
    );
};

export default LandmarkEntry;