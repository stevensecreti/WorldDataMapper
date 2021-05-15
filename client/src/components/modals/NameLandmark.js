import React, { useState } 	from 'react';
import { ADD_LANDMARK, RENAME_LANDMARK }       from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';
import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput } from 'wt-frontend';

const NameLandmark = (props) => {
    const [input, setInput] = useState({_id: props._id, name: ''});
    const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
    const errorMsg = "Unable to Rename Map";
    const [AddLandmark] = useMutation(ADD_LANDMARK);
    const [RenameLandmark] = useMutation(RENAME_LANDMARK);

    const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	}

    const handleName = async (e) => {
        if(props.index == -1){
            const{_id, name} = input
            AddLandmark({ variables: {_id: _id, landmark: name}});
            props.handleRefetch();
            props.setShowLM();
        }
        else{
            const{_id, name} = input   
            RenameLandmark({ variables: {_id: _id, landmark: props.index, name: name}});
            props.handleRefetch();
            props.setShowLM();
        }
    };

    return(
        <WModal className="login-modal" cover={true} visible={true}>
            <WMHeader className="modal-header" onClose={() => props.setShowLM(false)}>
				Name Landmark
			</WMHeader>
            {
                loading ? <div />
                : <WMMain className="modal-main">

                    <WInput className="modal-input" onBlur={updateInput} name='name' labelAnimation="up" barAnimation="solid" labelText="Landmark Name" wType="outlined" inputType='text' defaultValue="Enter Name Here"></WInput>
                    {
                        showErr ? <div className='modal-error'>
                            {errorMsg}
                        </div>
                            : <div className='modal-error'>&nbsp;</div>
                    }

                </WMMain>
            }
            <WMFooter className = "modal-footer">
				<WButton className="modal-button" onClick={handleName} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
					Confirm
				</WButton>
			</WMFooter>
        </WModal>
    );
}
export default NameLandmark