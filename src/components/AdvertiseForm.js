import { ReactTags } from "react-tag-autocomplete"
import { useState, useCallback, json } from "react"

import './AdvertiseForm.css'
import { useForm } from "react-hook-form";
import { getHost } from "../util/host";
import { getJwtToken } from "../util/auth";
import { useNavigation } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const AdvertiseForm = ({ rankings }) => {

    // const navigation = useNavigation();
    // const isSubmitting = navigation.state === 'submitting';
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
        formState: { errors }
    } = useForm();

    const [selected, setSelected] = useState([]);
    const [publicityType, setPublicityType] = useState();
    const [reactTagInvalid, setReactTagInvalid] = useState(false);
    const [price, setPrice] = useState(0);

    const onAdd = useCallback(
        (newTag) => {
            setSelected([...selected, newTag])
            setReactTagInvalid(false);
        },
        [selected]
    )

    const onDelete = useCallback(
        (tagIndex) => {
            setSelected(selected.filter((_, i) => i !== tagIndex))
        },
        [selected]
    )

    const submitHandler = async (data) => {
        if (selected.length === 0) {
            setReactTagInvalid(true);
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();

        formData.append('banner', new Blob([
            JSON.stringify({
                hiredClicks: data.hiredClicks,
                redirectUrl: data.redirectUrl,
                rankingsId: selected.map(i => i.value)
            })
        ], { type: 'application/json' }));

        formData.append('image', data.file[0]);

        const response = await fetch(getHost() + '/api/banners', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getJwtToken()
            },
            body: formData
        }).catch(error => { 
            setResponseMessage(error.message); 
            setIsSubmitting(false);
            return 
        });

        if (!response.ok) {
            setResponseMessage('Could not save banner');
        } else {
            setResponseMessage('Operação executada com sucesso');
        }

        setIsSubmitting(false);
    }

    const publicityTypeHandler = (event) => {
        setPublicityType(event.target.value);
    }

    const hiredClicksHandler = async (event) => {
        const clicks = event.target.value;

        if (clicks) {
            setIsLoading(true);

            const response = await fetch(getHost() + '/api/banners/price?clicks=' + clicks, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).catch(error => { 
                console.log(error);
                setIsLoading(false);
                return
            });
    
            if (!response.ok) {
                console.log(response);
            } else {
                const responseData = await response.json();
                setPrice(responseData.value);
            }
    
            setIsLoading(false);
        } else {
            setPrice(0);
        }
    }

    return (
        <div>
            <p style={{fontSize: '1.4rem', fontWeight: 'bold'}}>Escolha o tipo de publicidade</p>
            <div className='mb3'>
                <div className='form-check-inline'>
                    <input type='radio' id='bannerPublicity' name='publicityType' value='banner' onChange={publicityTypeHandler} />
                    <label htmlFor='bannerPublicity'>Adicionar Banner</label>
                </div>
                <div className='form-check-inline'>
                    <input type='radio' id='logoPublicity' name='publicityType' value='logo' onChange={publicityTypeHandler} disabled={true} />
                    <label htmlFor='logoPublicity'>Adicionar Logo</label>
                </div>
                <div className='form-check-inline'>
                    <input type='radio' id='best5CertPublicity' name='publicityType' value='best5Cert' onChange={publicityTypeHandler} disabled={true} />
                    <label htmlFor='best5CertPublicity'>Certificado Best5</label>
                </div>
            </div>
            {publicityType === 'banner' &&
                <form onSubmit={handleSubmit(submitHandler)}>
                    <div className='mb3'>
                        <label htmlFor='rankingsId' className='form-label'>Informe os Rankings</label>
                        <ReactTags id='rankingsId' labelText='Selecione' selected={selected} suggestions={rankings.map(r => { return { value: r.id, label: r.name } })} onAdd={onAdd} onDelete={onDelete} noOptionsText='Nenhum registro encontrado' placeholderText='' isInvalid={reactTagInvalid} />
                    </div>
                    <div className='mb3'>
                        <label htmlFor='hiredClicks' className='form-label'>Informe a quantidade de cliques que deseja contratar</label>
                        <input type='number' id='hiredClicks' min='1' step='1' {...register('hiredClicks', { required: true })} className={`form-control ${errors.hiredClicks && 'invalid'}`} onBlur={hiredClicksHandler} />
                    </div>
                    <div className='mb3'>
                        <label htmlFor='price' className='form-label'>Valor a pagar {isLoading && <FontAwesomeIcon icon={faSpinner} spin size="sm" />}</label>
                        <input type='text' id='price' value={`R$ ${price}`} className='form-control' disabled={true} />
                    </div>
                    <div className='mb3'>
                        <label htmlFor='redirectUrl' className='form-label'>Informe o link do Banner</label>
                        <input type='text' id='redirectUrl' placeholder='http://' {...register('redirectUrl', { required: true })} className={`form-control ${errors.redirectUrl && 'invalid'}`} />
                    </div>
                    <div className='mb3'>
                        <label htmlFor='file' className='form-label'>Informe a imagem do Banner</label>
                        <input type='file' id='file' {...register('file', { required: true })} className={`form-control ${errors.file && 'invalid'}`} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <button type='submit' className='btn' disabled={isSubmitting}>{isSubmitting ? 'PROCESSANDO...' : 'CONTRATAR'}</button>
                        <p>{responseMessage}</p>
                    </div>
                </form>
            }
        </div>
    );
}

export default AdvertiseForm;