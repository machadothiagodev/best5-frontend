import { useState } from 'react';

import { getHost } from '../util/host';
import './RankingList.css'

const barColors = ['chart--red', 'chart--orange', 'chart--yellow', 'chart--green', 'chart--purple', 'chart--blue']

const barFillHeight = (totalVotes, votes) => totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

const best5RankingItems = (ranking) => {
    let rankingItems = ranking.items.slice(0, 5);

    if (ranking.items.length > 5) {
        let otherVotes = 0;
        const remainingItems = ranking.items.slice(5);

        remainingItems.forEach(element => {
            otherVotes += element.votes;
        });

        rankingItems.push({ id: -1, name: 'Outros', votes: otherVotes });
    }

    return rankingItems;
}

const allRankingItems = (ranking) => {
    let rankingItems = ranking.items.slice(0, 5);

    if (ranking.items.length > 5) {
        let otherVotes = 0;
        const remainingItems = ranking.items.slice(5);

        remainingItems.forEach(element => {
            otherVotes += element.votes;
        });

        rankingItems.push({ id: -1, name: 'Outros', votes: otherVotes });

        rankingItems.push(...remainingItems);
    }

    return rankingItems;
}

const RankingItemList = ({ ranking }) => {

    const [showExpandedRanking, setShowExpandedRanking] = useState(false);

    return (
        <div className='charts'>
            {showExpandedRanking && allRankingItems(ranking).map((rankingItem, index) => (
                <div key={rankingItem.id} className='chart-bar'>
                    { rankingItem.logo && 
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <a href={rankingItem.logo.redirectUrl} target='_blank'>
                                <img src={`${getHost()}/img/logo/${rankingItem.logo.fileName}`} style={{width: '2rem', height: 'auto'}} />
                            </a>
                            <span style={{fontSize: '0.9rem'}}>
                                <a href={rankingItem.logo.redirectUrl} target='_blank' style={{textDecoration: 'none', color: 'black'}}>
                                    {rankingItem.name} 
                                </a>
                                {rankingItem.id === -1 && <button type='button' onClick={event => setShowExpandedRanking(false)} style={{ border: 'none', color: '#48A7E6', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', padding: '0' }}>OCULTAR OUTROS ITENS</button>}
                            </span>
                        </div>
                    }
                    { !rankingItem.logo && 
                        <span style={{fontSize: '0.9rem'}}>{rankingItem.name} {rankingItem.id === -1 && <button type='button' onClick={event => setShowExpandedRanking(false)} style={{ border: 'none', color: '#48A7E6', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', padding: '0' }}>OCULTAR OUTROS ITENS</button>}</span>
                    }
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className={`charts__chart chart--p${barFillHeight(ranking.totalVotes, rankingItem.votes)} ${barColors[index]}`} style={{ fontWeight: 'bolder', display: 'flex', alignItems: 'center' }}>
                            &nbsp;&nbsp;&nbsp;{barFillHeight(ranking.totalVotes, rankingItem.votes)}%
                        </div>
                    </div>
                </div>
            ))}
            {!showExpandedRanking && best5RankingItems(ranking).map((rankingItem, index) => (
                <div key={rankingItem.id} className='chart-bar'>
                    { rankingItem.logo && 
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <a href={rankingItem.logo.redirectUrl} target='_blank'>
                                <img src={`${getHost()}/img/logo/${rankingItem.logo.fileName}`} style={{width: '2rem', height: 'auto'}} />
                            </a>
                            <span style={{fontSize: '0.9rem'}}>
                                <a href={rankingItem.logo.redirectUrl} target='_blank' style={{textDecoration: 'none', color: 'black'}}>
                                    {rankingItem.name} 
                                </a>
                                {rankingItem.id === -1 && <button type='button' onClick={event => setShowExpandedRanking(true)} style={{ border: 'none', color: '#48A7E6', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', padding: '0' }}>VEJA TODOS OS ITENS</button>}
                            </span>
                        </div>
                    }
                    { !rankingItem.logo && 
                        <span style={{fontSize: '0.9rem'}}>{rankingItem.name} {rankingItem.id === -1 && <button type='button' onClick={event => setShowExpandedRanking(true)} style={{ border: 'none', color: '#48A7E6', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', padding: '0' }}>VEJA TODOS OS ITENS</button>}</span>
                    }
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className={`charts__chart chart--p${barFillHeight(ranking.totalVotes, rankingItem.votes)} ${barColors[index]}`} style={{ fontWeight: 'bolder', display: 'flex', alignItems: 'center' }}>
                            &nbsp;&nbsp;&nbsp;{barFillHeight(ranking.totalVotes, rankingItem.votes)}%
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RankingItemList;