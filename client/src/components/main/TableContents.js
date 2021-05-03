import React from 'react';
import TableHeader from './TableHeader';
import TableEntry from './TableEntry';
import RegionViewer from './RegionViewer';
import {WLayout, WLHeader, WLMain, WRow, WCol, WButton, WGrid}  from 'wt-frontend';
import { PromiseProvider } from 'mongoose';

const TableContents = (props) =>{
    const regions = []
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

    const handleRegionViewer = () =>{
        props.toggleRegionViewer();
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

                    />
                }
            </WLHeader>
            <WLMain>
                {
                    regions && regions.map(region => <TableEntry
                        name={region.name} capital={region.capital}
                        leader={region.leader} flag={region.flag}
                        landmarks={region.landmarks} setActiveRegion = {props.setActiveRegion}
                        id = {region.id} handleRegionViewer ={handleRegionViewer}
                    />)
                } 
            </WLMain>
        </WLayout>
        </div>
        :
        <RegionViewer 
                activeMap = {props.activeMap} activeRegion = {props.activeRegion}
                toggleRegionViewer = {handleRegionViewer}
        />
        }
        </>
    );
}
export default TableContents;