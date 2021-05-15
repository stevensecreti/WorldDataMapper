import React from 'react';
import { PromiseProvider } from 'mongoose';
import {WLayout, WLHeader, WLSide, WLMain, WSidebar, WRow, WCol, WButton} from 'wt-frontend';
import LandmarkEntry from './LandmarkEntry';

const RegionViewer = (props) =>{
    let viewing = []
    let subregions = 0;
    let landmarks = [];
    if(Object.keys(props.activeRegion).length === 0){
        viewing = props.activeMap;
        subregions = viewing.regions.length;
    }
    else{
        viewing = props.activeRegion;
        subregions = viewing.subregions.length
        landmarks = viewing.landmarks;
    }

    const handleSpreadsheetView = () =>{
        props.toggleRegionViewer();
    }

    const handleAddLandmark = () =>{
        props.handleAddLandmark();
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
                <div className="region-viewer-landmarks">
                    {
                        landmarks && landmarks.map((landmark, index) =>
                                <LandmarkEntry  name = {landmark} index = {index} deleteLM = {props.deleteLM}
                                                renameLM = {props.renameLM}
                                />
                            )
                    }
                </div>
                <div className="landmarks-footer">
                    <WButton className="add-landmark" onClick= {handleAddLandmark}>Add New Landmark</WButton> 
                </div>
            </WLMain>
        </WLayout>
    );

}
export default RegionViewer;