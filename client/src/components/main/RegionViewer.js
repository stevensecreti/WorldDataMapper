import React from 'react';
import { PromiseProvider } from 'mongoose';
import {WLayout, WLHeader, WLSide, WLMain, WSidebar, WRow, WCol, WButton} from 'wt-frontend';

const RegionViewer = (props) =>{
    let viewing = []
    let subregions = 0;
    if(Object.keys(props.activeRegion).length === 0){
        viewing = props.activeMap;
        subregions = viewing.regions.length;
    }
    else{
        viewing = props.activeRegion;
        subregions = viewing.subregions.length
    }

    const handleSpreadsheetView = () =>{
        props.toggleRegionViewer();
    }

    return(
        <WLayout wLayout="header-lside" className="region-viewer">
            <WLHeader className="region-viewer-header">
                <WButton className="undo">
                    <i className="material-icons">arrow_back</i>
                </WButton>
                <WButton className="redo">
                    <i className="material-icons">arrow_forward</i>
                </WButton>
                <WButton onClick={handleSpreadsheetView} className = "region-title-button">
                    Spreadsheet
                </WButton>
            </WLHeader>
            <WLSide className="region-viewer-side">
                <div className="region-viewer-attribute">Region Name: {viewing.name}</div>
                <div className="region-viewer-attribute">Region Capital: {viewing.capital}</div>
                <div className="region-viewer-attribute">Region Leader: {viewing.leader}</div>
                <div className="region-viewer-attribute"># of Sub Regions: {subregions}</div>
            </WLSide>
            <WLMain className="region-viewer-main">
                <div className="region-viewer-landmarks">Region Landmarks:</div>
                <div className="region-viewer-landmarks"></div>
                <div className="region-viewer-footer">
                    
                </div>
            </WLMain>
        </WLayout>
    );

}
export default RegionViewer;