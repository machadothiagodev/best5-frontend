import { useState } from "react";

const useInput = () => {

    const [enteredValue, setEnteredValue] = useState('');
    const [isTouched, setIsTouched] = useState(false);

    const valueIsValid = enteredValue.trim() !== '';
    const hasError = !valueIsValid && isTouched;

    const valueChangeHandler = (event, index) => {
        setEnteredValue(event.target.value);
    }

    const inputBlurHandler = () => {
        setIsTouched(true);
    }

    const reset = () => {
        setEnteredValue('');
        setIsTouched(false);
    }

    return {
        value: enteredValue,
        hasError,
        valueChangeHandler,
        inputBlurHandler,
        reset
    }

}

export default useInput;