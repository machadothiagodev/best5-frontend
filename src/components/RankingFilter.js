import Card from './UI/Card';
import './RankingFilter.css'
import { useRef } from 'react';

const RankingFilter = (props) => {
    const input = useRef();

    return (
        <Card className='filter'>
            <form>
                <div className='filter__controls'>
                    <div className='filter__control'>
                        <input type='text' ref={input} />
                        <button type='button' onClick={() => props.onFilter(input.current.value)}>Filtrar</button>
                    </div>
                </div>
            </form>
        </Card>
    );
}

export default RankingFilter;