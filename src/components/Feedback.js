import './Feedback.css'

const Feedback = () => {
    return (
        <>
            <form>
                <span>Como você avalia este serviço?</span>
                <div className='rate'>
                    <input type="radio" id="star5" name="rate" value="5" />
                    <label htmlFor="star5" title="text">5 stars</label>
                    <input type="radio" id="star4" name="rate" value="4" />
                    <label htmlFor="star4" title="text">4 stars</label>
                    <input type="radio" id="star3" name="rate" value="3" />
                    <label htmlFor="star3" title="text">3 stars</label>
                    <input type="radio" id="star2" name="rate" value="2" />
                    <label htmlFor="star2" title="text">2 stars</label>
                    <input type="radio" id="star1" name="rate" value="1" />
                    <label htmlFor="star1" title="text">1 star</label>
                </div>
                <div className='mb3'>
                    <textarea rows={3} placeholder='Deixe um comentário' className='form-control' />
                </div>
                <div className='mb3' style={{textAlign: 'center'}}>
                    <button type='submit' className='btn'>ENVIAR</button>
                </div>
            </form>
        </>
    );
}

export default Feedback;