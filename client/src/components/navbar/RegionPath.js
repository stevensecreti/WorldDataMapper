import { valueToObjectRepresentation } from '@apollo/client/utilities';
import React                                from 'react';
import { WButton, WNavItem }                from 'wt-frontend';

const RegionPath = (props) =>{
    let regionList = [];
    let sibling = false;
    let parentRegion = "";
    let siblings = [];
    let regParent = "";
    let sister = false;
    let brother = false;
    if(Object.keys(props.activeMap).length === 0){
        regionList = [];
        sibling = false;
    }
    else if(Object.keys(props.activeRegion).length === 0){
        regionList.push(props.activeMap);
        sibling = false;
    }
    else{
        regionList.push(props.activeRegion);
        let regionTemp = props.activeRegion;
        while(regionTemp.parentRegion != props.activeMap._id){
            regionTemp = props.regions.find(region => region._id == regionTemp.parentRegion);
            regionList.unshift(regionTemp);
        }
        regionList.unshift(props.activeMap);
    }
    if(!props.regionView && (Object.keys(props.activeRegion).length !== 0)){
        sibling = true;
        parentRegion = props.activeRegion.parentRegion;
        regParent = props.regions.find(region => region._id === parentRegion);
        if(regParent === undefined){
            regParent = props.maps.find(map => map._id === parentRegion);
            console.log(regParent);
            siblings = regParent.regions;
        }
        else{
            siblings = regParent.subregions;
        }
        sister = (siblings[0] == props.activeRegion.id);
        brother = (siblings[siblings.length-1] == props.activeRegion.id);
    }

    





    const handleAncestorClick = (reg) => {
        props.handleAncestorClick(reg);
    }

    const handleSisterClick = () =>{
        if(!sister){
            props.handleSibling(-1);
        }
    }
    const handleBrotherClick = () =>{
        if(!brother){
            props.handleSibling(1);
        }
    }


    return(
        <>
        {
            regionList && regionList.map(region =>
                <div>
                    <i className="material-icons path-arrows">arrow_forward</i>
                    <WButton className="path" onClick={() => handleAncestorClick(region)}>{region.name}</WButton>
                </div>
            )
        }
        {
            sibling ? 
            <div>
                <WButton className="sister" onClick={handleSisterClick}>
                    <i className="material-icons">arrow_back</i>
                </WButton>
                <WButton className="brother">
                    <i className="material-icons" onClick={handleBrotherClick}>arrow_forward</i>
                </WButton>
            </div>
            :
            <div/>
        }
        </>
    );

}
export default RegionPath;