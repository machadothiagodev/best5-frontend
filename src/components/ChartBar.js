import './Chart.css';

const ChartBar = (props) => {
  let barFillHeight = props.totalVotes > 0 ?  Math.round((props.votes / props.totalVotes) * 100) : 0;

  return (
    <div className='chart-bar'>
        <span>{props.name}</span>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <input type='radio' name='radio' />
          <div className={`charts__chart chart--p${barFillHeight} ${props.barColor}`} style={{fontWeight: 'bolder', display: 'flex', alignItems: 'center'}}>&nbsp;&nbsp;&nbsp;{barFillHeight}%</div>
        </div>
    </div>
  );
};

export default ChartBar;