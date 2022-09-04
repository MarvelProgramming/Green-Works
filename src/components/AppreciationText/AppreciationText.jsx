import React from 'react';
import './styling.css';
import Icon from 'monday-ui-react-core/dist/Icon';
import EarthSVG from '../../images/earth.svg';

export default function AppreciationText() {
  return (
    <p className="appreciation-text body-text-03">
      Thank you for doing your part to address climate change!{' '}
      <span>
        <Icon
          className="earth-svg"
          iconType={Icon.type.SRC}
          icon={EarthSVG}
          iconLabel="an earth svg icon"
          iconSize={16}
        />
      </span>
    </p>
  );
}
