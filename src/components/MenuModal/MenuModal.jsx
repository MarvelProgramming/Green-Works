import React from 'react';
import './styling.css';
import DialogContentContainer from 'monday-ui-react-core/dist/DialogContentContainer';
import Box from 'monday-ui-react-core/dist/Box';
import Flex from 'monday-ui-react-core/dist/Flex';
import Heading from 'monday-ui-react-core/dist/Heading';
import Button from 'monday-ui-react-core/dist/Button';
import Icon from 'monday-ui-react-core/dist/Icon';
import CloseIcon from '../../images/close.svg';

export default function MenuModal({
  className = '',
  children,
  title,
  overrideSubmitText = 'Submit',
  handleSubmit,
  handleClose,
  submitDisabled = false,
  extraHeadingIcons = []
}) {
  /**
   * A wrapper for the custom submit functionality that's passed down from components using the MenuModal.
   * @param {object} event - The event object belonging to the submit button which raised this event.
   */
  function handleSubmitClicked(event) {
    event.preventDefault();
    handleSubmit(event);
  }

  return (
    <DialogContentContainer className={`menu-modal ${className}`}>
      <Flex className="header" justify={Flex.justify.SPACE_BETWEEN}>
        <Heading className="heading header-04" value={title} />
        <Flex gap={Flex.gaps.SMALL}>
          {extraHeadingIcons}
          <Icon
            className="icon"
            iconType={Icon.type.SRC}
            icon={CloseIcon}
            onClick={handleClose}
          />
        </Flex>
      </Flex>
      <form onSubmit={handleSubmitClicked}>
        <Box
          className={`options-container ${
            children.length > 4 ? 'scroller' : ''
          }`}
        >
          <Flex
            className="options"
            direction={Flex.directions.COLUMN}
            align={Flex.align.START}
            gap={Flex.gaps.SMALL}
          >
            {children}
          </Flex>
        </Box>
        <Button
          className="submit"
          type={Button.inputTags.SUBMIT}
          disabled={submitDisabled}
        >
          {overrideSubmitText}
        </Button>
      </form>
    </DialogContentContainer>
  );
}
