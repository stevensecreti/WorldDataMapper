import React                    from 'react';
import { WButton, WRow, WCol }  from 'wt-frontend';

const TableHeader = (props) =>{
    return(
        <WRow className='table-header'>
            <WCol size="2">Name 
                <i className="material-icons">arrow_downward</i>
            </WCol>
            <WCol size="2">Capital
                <i className="material-icons">arrow_downward</i>
            </WCol>
            <WCol size="2">Leader
                <i className="material-icons">arrow_downward</i>
            </WCol>
            <WCol size="1">Flag
                <i className="material-icons">arrow_downward</i>
            </WCol>
            <WCol size="3">Landmarks
                <i className="material-icons">arrow_downward</i>
            </WCol>
        </WRow>
    );
}

export default TableHeader;