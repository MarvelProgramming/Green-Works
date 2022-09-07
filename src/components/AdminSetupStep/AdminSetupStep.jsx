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
  targetPropertyName,
  validation
}) {
  /**
   * Invokes the handleChange callback, passing in the TextField's most up-to-date value.
   * @param {string} inputValue - The TextField's most up-to-date value.
   */
  function handleInputChange(inputValue) {
    handleChange(targetPropertyName, inputValue.toString());
  }

  /**
   * Validates the last key pressed and ignores it if it fails.
   * @param {object} event - The onKeyDown event belonging to the TextField.
   */
  function validateInput(event) {
    const isValidInput = validation(event.key);

    // Checking if length is 1, since otherwise it's likely a control key (e.g. ctrl, delete, backspace, etc) and those
    // shouldn't be ignored.
    if (!isValidInput && event.key.length === 1) event.preventDefault();
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
        <Flex className="input-area" gap={Flex.gaps.LARGE}>
          <TextField
            placeholder={textFieldPlaceholder}
            autoFocus={autoFocus}
            value={value}
            onKeyDown={validateInput}
            onChange={handleInputChange}
            required
          />
          {textFieldAfterIcon}
        </Flex>
      </Flex>
    </Box>
  );
}
