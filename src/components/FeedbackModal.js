import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import Modal from 'react-modal';

import './FeedbackModal.css'
import { getHost } from '../util/host';

const FeedbackModal = (props) => {

    const {
        register,
        handleSubmit,
        reset
    } = useForm();

    // const [isOpen, setIsOpen] = useState(open);
    const [isButtonDisable, setIsButtonDisable] = useState(true);

    // useEffect(() => {
    //     console.log(open);
    //     setIsOpen(open);
    //     console.log(isOpen);
    // }, [open]);

    const closeModal = () => {
        // setIsOpen(false);
        reset();
        props.onClose();
    }

    const ratingChangeHandler = () => {
        setIsButtonDisable(false);
    }

    const submitHandler = async (data) => {
        // setIsOpen(false);
        closeModal();

        fetch(getHost() + '/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    return (
        <Modal isOpen={props.open} className='modal-dialog'>
            <button onClick={closeModal} className='btn-close'>x</button>
            <h2 style={{ marginTop: '5px' }}>OBRIGADO PELA SUA PARTICIPAÇÃO</h2>
            <form onSubmit={handleSubmit(submitHandler)}>
                <div className='mb3'>Como você avalia este serviço?</div>
                <div className='rate'>
                    <input type="radio" id="star5" {...register('rating')} value="5" onChange={ratingChangeHandler} />
                    <label htmlFor="star5" title="text">5 stars</label>
                    <input type="radio" id="star4" {...register('rating')} value="4" onChange={ratingChangeHandler} />
                    <label htmlFor="star4" title="text">4 stars</label>
                    <input type="radio" id="star3" {...register('rating')} value="3" onChange={ratingChangeHandler} />
                    <label htmlFor="star3" title="text">3 stars</label>
                    <input type="radio" id="star2" {...register('rating')} value="2" onChange={ratingChangeHandler} />
                    <label htmlFor="star2" title="text">2 stars</label>
                    <input type="radio" id="star1" {...register('rating')} value="1" onChange={ratingChangeHandler} />
                    <label htmlFor="star1" title="text">1 star</label>
                </div>
                <div className='mb3'>
                    <textarea id='comment' rows={3} placeholder='Deixe um comentário' {...register('comment')} className='form-control' />
                </div>
                <div className='mb3' style={{ textAlign: 'center' }}>
                    <button type='submit' className='btn' disabled={isButtonDisable}>ENVIAR</button>
                </div>
            </form>
        </Modal>
    );
}

export default FeedbackModal;