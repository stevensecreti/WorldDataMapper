import React                    from 'react';
import { WButton, WRow, WCol }  from 'wt-frontend';

const TableHeader = (props) =>{
    return(
        <WRow className='table-header'>
            <WCol size="2">Name</WCol>
            <WCol size="2">Capital</WCol>
            <WCol size="2">Leader</WCol>
            <WCol size="1">Flag</WCol>
            <WCol size="3">Landmarks</WCol>
        </WRow>
    );
}

export default TableHeader;