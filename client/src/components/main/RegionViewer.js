import React, { useEffect, useState } from 'react';
import { PromiseProvider } from 'mongoose';
import {WLayout, WLHeader, WLSide, WLMain, WSidebar, WRow, WCol, WButton} from 'wt-frontend';
import LandmarkEntry from './LandmarkEntry';
import ChildLandmark from './ChildLandmark';

const RegionViewer = (props) =>{
    let viewing = []
    let subregions = 0;
    let landmarks = props.landmarks;
    let childLandmarks = props.childLandmarks;
    let parentRegion = "";
    let imagePath = props.imagePath;
    const[imageP, changeImage]               = useState("");
    let image = "";

    if(Object.keys(props.activeRegion).length === 0){
        viewing = props.activeMap;
        subregions = viewing.regions.length;
        parentRegion = "This is a Map!"
    }
    else{
        viewing = props.activeRegion;
        subregions = viewing.subregions.length
        let parentReg = props.regions.find(region => region._id === viewing.parentRegion);
        if(parentReg == undefined){
            parentRegion = props.activeMap.name;
        }
        else{
            parentRegion = parentReg.name;
        }
    }

    useEffect(() => { 
        loadImage();
    });

    const loadImage = async () =>{
        try{
            //image = require('../The World' + imagePath + '.png');
            console.log(imagePath);
            image = require('../../assets/The World' + imagePath + ' Flag.png');
            changeImage(image);
            //image = requestImageFile;
        }
        catch(e){
            console.log(imagePath);
            console.log(e);
        }
    }

    const handleSpreadsheetView = () =>{
        props.toggleRegionViewer();
    }

    const handleSpreadsheetViewParent = () =>{
        props.toggleRegionViewer();
        props.setActiveFromSpread(viewing.parentRegion);
    }

    const handleAddLandmark = () =>{
        props.handleAddLandmark();
    }

    const undo = () =>{
        props.undo();
    }
    const redo = () =>{
        props.redo();
    }

    let undoStyle = props.tps.hasTransactionToUndo() ? "undo" : "undo-disabled";
    let redoStyle = props.tps.hasTransactionToRedo() ? "redo" : "redo-disabled";

    return(
        <WLayout wLayout="header-lside" className="region-viewer">
            <WLHeader className="region-viewer-header">
                <WButton className={undoStyle} onClick={undo}>
                    <i className="material-icons">arrow_back</i>
                </WButton>
                <WButton className={redoStyle} onClick={redo}>
                    <i className="material-icons">arrow_forward</i>
                </WButton>
                <WButton onClick={handleSpreadsheetView} className = "region-title-button">
                    Spreadsheet
                </WButton>
            </WLHeader>
            <WLSide className="region-viewer-side">
                <img src = {imageP} alt={viewing.name} className = 'regionFlags'/>
                <ul/>
                <div className="region-viewer-attribute">Region Name: {viewing.name}</div>
                <ul/>
                <div className="region-viewer-attribute"><div>Parent Region:</div> 
                <div className = "parentRegion"><WButton onClick = {handleSpreadsheetViewParent} className ="parentRegionName">{parentRegion}</WButton> <WButton className = "parentRegIcon" onClick={props.changeParent}><i className="material-icons">create</i></WButton> 
                </div> </div>
                <ul/>
                <div className="region-viewer-attribute">Region Capital: {viewing.capital}</div>
                <ul/>
                <div className="region-viewer-attribute">Region Leader: {viewing.leader}</div>
                <ul/>
                <div className="region-viewer-attribute"># of Sub Regions: {subregions}</div>
            </WLSide>
            <WLMain className="region-viewer-main">
                <div className="region-viewer-landmarks">Region Landmarks:</div>
                <br/>
                <div className="region-viewer-landmarks-section">
                    {
                        props.landmarks && props.landmarks.map((landmark, index) =>
                                <LandmarkEntry  name = {landmark} index = {index} deleteLM = {props.deleteLM}
                                                renameLM = {props.renameLM} test = {props.test}
                                />
                            )
                    }
                    {
                        props.childLandmarks && props.childLandmarks.map(landmark => 
                                <ChildLandmark
                                    name = {landmark}
                                />
                            )
                    }
                </div>
                <br/>
                <div className="landmarks-footer">
                    <WButton className="add-landmark" onClick= {handleAddLandmark}>Add New Landmark</WButton> 
                </div>
            </WLMain>
        </WLayout>
    );

}
export default RegionViewer;