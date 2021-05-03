import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';

const TableEntry = (props) =>{
    const { data } = props;


    const handleSetActiveRegion = () =>{
        props.setActiveRegion(props.id);
    }
    const handleRegionViewer = () =>{
        props.handleRegionViewer();
    }

    return(
        <WRow className = 'table-entry'>
            <WCol size="2" onClick={handleSetActiveRegion}>{props.name}</WCol>
            <WCol size="2">{props.capital}</WCol>
            <WCol size="2">{props.leader}</WCol>
            <WCol size="1">{props.flag}</WCol>
            <WCol size="3" onClick={handleRegionViewer}>{props.landmarks}</WCol>
        </WRow>
    );
}

export default TableEntry;