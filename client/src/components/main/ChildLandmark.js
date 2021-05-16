import React, { useState }  from 'react';
import { WNavItem, WInput, WButton} from 'wt-frontend';

const ChildLandmark = (props) => {

    return(
        <WNavItem className="landmark-buttons">
            <WButton className = "landmark-button" onClick = {props.test}>
                {props.name}
            </WButton>
        </WNavItem>
    );
};

export default ChildLandmark;