import React, { useState } 	from 'react';
import { RENAME_MAP }       from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';
import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput } from 'wt-frontend';

const NameMap = (props) => {
    const [input, setInput] = useState({_id: props.renameId, name: ''});
    const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
    const errorMsg = "Unable to Rename Map";
    const [RenameMap] = useMutation(RENAME_MAP);

    const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	}

    const handleName = async (e) => {
        if(props.renameId === "new"){
            const{id, name} = input
            props.createNewMap(name);
            props.refetch();
            props.setActiveMap({});
            props.setShowRename(false);
            return
        }
        else{
            const updated = await RenameMap({ variables: { ...input } });
             if(updated){
                props.refetch();
                props.setActiveMap({});
                props.setShowRename(false);
            }
        } 
    };

    return(
        <WModal className="login-modal" cover={true} visible={true}>
            <WMHeader className="modal-header" onClose={() => props.setShowRename(false)}>
				Name Map
			</WMHeader>
            {
                loading ? <div />
                : <WMMain className="main-login-modal">

                    <WInput className="modal-input" onBlur={updateInput} name='name' labelAnimation="up" barAnimation="solid" labelText="Map Name" wType="outlined" inputType='text' />
                    {
                        showErr ? <div className='modal-error'>
                            {errorMsg}
                        </div>
                            : <div className='modal-error'>&nbsp;</div>
                    }

                </WMMain>
            }
            <WMFooter>
				<WButton className="modal-button" onClick={handleName} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Confirm
				</WButton>
			</WMFooter>
        </WModal>
    );
}
export default NameMap