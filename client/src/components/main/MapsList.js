import { PromiseProvider } from 'mongoose';
import React        from 'react';
import MapEntry from './MapEntry';

const MapsList = (props) =>{
    const maps = props.maps;
    return(
        <>
        {
            maps && maps.map(map => (
                <MapEntry
                    map ={map} setActiveMap = {props.setActiveMap}
                    id = {map.id} key = {map.id} name = {map.name} _id = {map._id}
                    deleteMap = {props.deleteMap} renameMap={props.renameMap}
                />

            ))
            
        }
        </>
    )
};
export default MapsList;