import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const Delete = (props) => {
    const delType = props.type == 0 ? "Map" : "Region";
    const handleDelete = async () => {
        if(props.type == 0){
            props.deleteMap(props.deleteId);
            props.setShowDelete(false);
        }
        else{
            props.deleteRegion(props.deleteId);
            props.setShowDelete(false);
        }
    }

    return (
        // Replace div with WModal
        <WModal className="delete-modal" cover={true} visible={true}>
            <WMHeader className="modal-header" onClose={() => props.setShowDelete(false)}>
                Delete {delType}?
			</WMHeader>

            <WMMain>
                <WButton className="modal-button cancel-button" onClick={() => props.setShowDelete(false)} wType="texted">
                    Cancel
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={handleDelete} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger">
                    Delete
				</WButton>
            </WMMain>

        </WModal>
    );
}

export default Delete;