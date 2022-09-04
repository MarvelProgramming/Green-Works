import React from 'react';
import './styling.css';
import LegendItem from '../LegendItem/LegendItem';
import Flex from 'monday-ui-react-core/dist/Flex';

export default function LegendList() {
  return (
    <Flex
      className="legend"
      justify={Flex.justify.SPACE_BETWEEN}
      align={Flex.align.CENTER}
      direction={Flex.directions.ROW}
      gap={Flex.gaps.SMALL}
    >
      <LegendItem text="75%-100%" color="green" />
      <LegendItem text="50%-75%" color="yellow" />
      <LegendItem text="25%-50%" color="red" />
      <LegendItem text="0%-25%" color="grey" />
    </Flex>
  );
}
