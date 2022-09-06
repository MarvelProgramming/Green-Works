import React from 'react';
import './styling.css';
import Heading from 'monday-ui-react-core/dist/Heading';
import TextField from 'monday-ui-react-core/dist/TextField';
import Box from 'monday-ui-react-core/dist/Box';
import Flex from 'monday-ui-react-core/dist/Flex';

export default function AdminSetupStep({
  title,
  subTitle,
  hintText,
  textFieldPlaceholder,
  textFieldAfterIcon,
  autoFocus,
  value,
  handleChange,
  targetPropertyName
}) {
  /**
   * Invokes the handleChange callback, passing in the TextField's most up-to-date value.
   * @param {string} inputValue - The TextField's most up-to-date value.
   */
  function handleInputChange(inputValue) {
    handleChange(targetPropertyName, inputValue.toString());
  }

  return (
    <Box className="admin-setup-step">
      <Heading value={title} ellipsis={false} type={Heading.types.h2} />
      <Flex
        className="sub-group"
        direction={Flex.directions.COLUMN}
        align={Flex.align.START}
      >
        <Heading
          value={subTitle}
          ellipsis={false}
          type={Heading.types.h3}
          size={Heading.sizes.MEDIUM}
        />
        <p className="hint-text">{hintText}</p>
        <Flex gap={Flex.gaps.LARGE}>
          <TextField
            placeholder={textFieldPlaceholder}
            autoFocus={autoFocus}
            value={value}
            onChange={handleInputChange}
          />
          {textFieldAfterIcon}
        </Flex>
      </Flex>
    </Box>
  );
}
