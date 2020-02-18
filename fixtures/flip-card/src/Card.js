import React from '/node_modules/schedule/dist/React.js';

function Card(props) {
  let innerClassName = "card__inner";
  if (props.isBack) {
    innerClassName += " card__inner--isBack"
  }

  return (
    <div className="card">
      <div className={innerClassName}>
        <div className="card__front">

        </div>
        <div className="card__back">

        </div>
      </div>
    </div>
  );
}

export default Card;
