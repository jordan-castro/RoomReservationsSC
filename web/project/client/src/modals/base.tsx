
import React, { ReactNode } from 'react';

interface BaseModalProps {
    title: string;
    body: ReactNode;
    onPos: () => void;
    posButtonTitle?: string;
    modalId: string;
}

const BaseModal: React.FC<BaseModalProps> = ({ title, body, onPos, modalId, posButtonTitle }) => {
    return (
        <div id={modalId} className="modal" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {body}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={onPos}>{posButtonTitle !== null ? posButtonTitle : "Save Changes"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BaseModal;
