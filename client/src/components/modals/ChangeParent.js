import React, { useState } 	from 'react';
import { useMutation }    	from '@apollo/client';
import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput } from 'wt-frontend';

const ChangeParent = (props) => {
    const [input, setInput] = useState({ name: ''});
    const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
    const errorMsg = "Unable to Rename Map";

    const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	}

    const handleChangeParent = async (e) => {
        const { name } = input;
        props.changeParent(name);
        props.setShowCP(false);
    };

    return(
        <WModal className="login-modal" cover={true} visible={true}>
            <WMHeader className="modal-header" onClose={() => props.setShowCP(false)}>
				Enter the Name of the New Parent
                <h5>Note: This field is case sensitive.</h5>
			</WMHeader>
            {
                loading ? <div />
                : <WMMain className="modal-main">

                    <WInput className="modal-input" onBlur={updateInput} name='name' labelAnimation="up" barAnimation="solid" labelText="Region Name" wType="outlined" inputType='text' defaultValue="Enter Name Here"></WInput>
                    {
                        showErr ? <div className='modal-error'>
                            {errorMsg}
                        </div>
                            : <div className='modal-error'>&nbsp;</div>
                    }

                </WMMain>
            }
            <WMFooter className = "modal-footer">
				<WButton className="modal-button" onClick={handleChangeParent} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
					Confirm
				</WButton>
			</WMFooter>
        </WModal>
    );
}
export default ChangeParent;