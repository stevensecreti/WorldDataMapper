import React, {useState, useEffect} from 'react';
import TableHeader from './TableHeader';
import TableEntry from './TableEntry';
import RegionViewer from './RegionViewer';
import {WLayout, WLHeader, WLMain, WRow, WCol, WButton, WGrid}  from 'wt-frontend';
import { PromiseProvider } from 'mongoose';

const TableContents = (props) =>{
    const regions = []
    const[indexEditing, toggleIndexEditing]     = useState(-1);
    const[field, toggleField]                   = useState(-1);
    const[currentEditing, toggleCurrentEditing] = useState(false);

    let activeRegion = "";
    if(Object.keys(props.activeRegion).length === 0){
        activeRegion = props.activeMap.name;
        for(let i = 0; i < props.activeMap.regions.length; i++){
            for(let j = 0; j < props.regions.length; j++){
                if(props.activeMap.regions[i] == props.regions[j].id){
                    regions.push(props.regions[j]);
                }
            }
        }
    }
    else{
        activeRegion = props.activeRegion.name;
        for(let i = 0; i < props.activeRegion.subregions.length; i++){
            for(let j = 0; j < props.regions.length; j++){
                if(props.activeRegion.subregions[i] == props.regions[j].id){
                    regions.push(props.regions[j]);
                }
            }
        }
    }

    useEffect(() => {
		document.addEventListener("keydown", keyCheck, false);
		return () => {
			document.removeEventListener("keydown", keyCheck, false);
		}
	});
    const keyCheck = async (event) => {
		if(event.keyCode == 38){
			handleUp();
		}
		if(event.keyCode == 40){
			handleDown();
		}
		if(event.keyCode == 37){
			handleLeft();
		}
		if(event.keyCode == 39){
			handleRight();
		}
	}

    const handleRegionViewer = () =>{
        props.toggleRegionViewer();
    }

    const describeEditing = (index, col) =>{
        toggleCurrentEditing(true);
        toggleIndexEditing(index);
        toggleField(col);

    }
    const editingOff = () =>{
        toggleCurrentEditing(false);
    }

    const handleUp = () =>{
        if(currentEditing){
            if(indexEditing != 0){
                toggleIndexEditing(indexEditing - 1);
            }
        }
    }
    const handleDown = () =>{
        if(currentEditing){
            if(indexEditing != regions.length - 1){
                toggleIndexEditing(indexEditing + 1);
            }     
        }
    }
    const handleLeft = () =>{
        if(currentEditing){
            if(field != 1){
                toggleField(field - 1);
            }
        }
    }
    const handleRight = () =>{
        if(currentEditing){
            if(field != 3){
                toggleField(field + 1);
            }
        }
    }

    const spreadsheet = props.spreadSheet ? true:false;

    return(
        <>
        {
        spreadsheet ? 
        <div>
        <WRow className="table-buttons">
            <WCol size="5">
                <WButton onClick={props.createNewRegion} className="add-subregion">
                    <i className="material-icons">add</i>
                </WButton>
                <WButton className="undo">
                    <i className="material-icons">arrow_back</i> 
                </WButton>
                <WButton className="redo">
                    <i className="material-icons">arrow_forward</i>
                </WButton>
            </WCol>
            <WCol size="5" className="region-title">
                Region Name: 
                <WButton className="region-title-button" onClick={handleRegionViewer}>{activeRegion}</WButton>
            </WCol>
        </WRow>
        <WLayout type="header">
            <WLHeader>
                {
                    <TableHeader
                        regions = {regions} handleSort = {props.handleSort}
                    />
                }
            </WLHeader>
            <WLMain>
                {
                    regions && regions.map((region, index) => <TableEntry
                        name={region.name} capital={region.capital}
                        leader={region.leader} flag={region.flag}
                        landmarks={region.landmarks} setActiveRegion = {props.setActiveRegion}
                        id = {region.id} handleRegionViewer ={handleRegionViewer} editRegion={props.editRegion}
                        _id = {region._id} deleteRegion = {props.deleteRegion} currentEditing = {describeEditing}
                        toggleEditing = {editingOff} index={index} indexEditing={indexEditing} fieldEditing={field}
                        currentEdit = {currentEditing} nameEditing = {currentEditing && indexEditing == index && field == 1 ? currentEditing : false}
                        capEditing = {currentEditing && indexEditing == index && field == 2 ? currentEditing : false}
                        leaderEditing = {currentEditing && indexEditing == index && field == 3 ? currentEditing : false}
                    />)
                } 
            </WLMain>
        </WLayout>
        </div>
        :
        <RegionViewer 
                activeMap = {props.activeMap} activeRegion = {props.activeRegion}
                toggleRegionViewer = {handleRegionViewer} handleAddLandmark = {props.handleAddLandmark}
                deleteLM = {props.deleteLM} renameLM = {props.renameLM}
        />
        }
        </>
    );
}
export default TableContents;