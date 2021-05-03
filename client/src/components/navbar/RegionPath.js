import React                                from 'react';
import { WButton, WNavItem }                from 'wt-frontend';

const RegionPath = (props) =>{
    let regionList = [];
    if(Object.keys(props.activeMap).length === 0){
        regionList = [];
    }
    else if(Object.keys(props.activeRegion).length === 0){
        regionList.push(props.activeMap);
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

    const handleAncestorClick = (reg) => {
        props.handleAncestorClick(reg);
    }

    return(
        regionList && regionList.map(region =>
            <div>
                <i className="material-icons path-arrows">arrow_forward</i>
                <WButton className="path" onClick={() => handleAncestorClick(region)}>{region.name}</WButton>
            </div>
        )
    );

}
export default RegionPath;