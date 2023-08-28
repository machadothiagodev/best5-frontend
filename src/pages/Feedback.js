import { useEffect, useState } from 'react';
import Modal from 'react-modal';

import FeedbackForm from '../components/FeedbackForm'

import './Feedback.css'

const FeedbackModal = ({ open }) => {
    const [isOpen, setIsOpen] = useState(open);

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

	const closeModal = () => {
		setIsOpen(false);
	}

    return (
        <Modal isOpen={isOpen} className='modal-dialog'>
            <button onClick={closeModal} className='btn-close'>x</button>
            <h2 style={{marginTop: '5px'}}>OBRIGADO PELA SUA PARTICIPAÇÃO</h2>
            <FeedbackForm></FeedbackForm>
        </Modal>
    );
}

export default FeedbackModal;