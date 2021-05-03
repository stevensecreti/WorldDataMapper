import React, { useState }  from 'react';
import { WNavItem, WInput, WButton} from 'wt-frontend';

const MapEntry = (props) => {

    const handleMapDelete = () =>{
        props.deleteMap(props._id);
    }

    const handleMapRename = () =>{
        props.renameMap(props._id);
    }
    const handleSetActive = () =>{
        console.log("setting");
        props.setActiveMap(props._id);
    }

    return(
        <WNavItem>
            <WButton onClick = {handleSetActive} className = "map-button">
                {props.name}
            </WButton>
            <WButton onClick = {handleMapRename} className = "map-button-edit">
                <i className="material-icons">edit</i>
            </WButton>
            <WButton onClick = {handleMapDelete} className = "map-button-delete">
                <i className="material-icons">delete</i>
            </WButton>
        </WNavItem>
    );
};

export default MapEntry;