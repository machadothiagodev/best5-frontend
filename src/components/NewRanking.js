import { useState } from "react";

import RankingForm from './RankingForm'
import './NewRanking.css'

const NewRanking = (props) => {
    const [isAdding, setIsAdding] = useState(false);
  
    const startAddingHandler = () => {
        setIsAdding(true);
    };
  
    const stopAddingHandler = () => {
        setIsAdding(false);
    };

    const addHandler = (ranking) => {
        props.onAddRanking(ranking);
    }

    return (
        <div className='new-expense'>
            {!isAdding && (
                <button onClick={startAddingHandler}>Criar Novo Ranking</button>
            )}
            {isAdding && (
                <RankingForm onAdd={addHandler} onCancel={stopAddingHandler} />
            )}
        </div>
    );
}

export default NewRanking