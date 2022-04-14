import React, {useState } from 'react';
import {Button, Checkbox, Heading, ListItem, OrderedList, Tooltip } from '@chakra-ui/react';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import Player from '../../classes/Player';
import PlayerName from './PlayerName';
import useChatContext from '../VideoCall/VideoFrontend/hooks/useChatContext/useChatContext';



/**
 * Lists the current players in the town, along with the current town's name and ID
 * 
 * Town name is shown in an H2 heading with a ToolTip that shows the label `Town ID: ${theCurrentTownID}`
 * 
 * Players are listed in an OrderedList below that heading, sorted alphabetically by userName (using a numeric sort with base precision)
 * 
 * Each player is rendered in a list item, rendered as a <PlayerName> component
 * 
 * See `usePlayersInTown` and `useCoveyAppState` hooks to find the relevant state.
 * 
 */
export default function PlayersInTownList(): JSX.Element {
  const toCreateConveresationBtn = document.getElementById('createConveresationBtn');
  const players = usePlayersInTown();
  const currentPlayerName = players[players.length - 1].userName;
  const {currentTownID, currentTownFriendlyName} = useCoveyAppState();
  const sortPlayer = (player1: Player, player2: Player) => 
  player1.userName.localeCompare(player2.userName, 'en', { numeric: true })

  
  // The ids of players who have been selected from the list
  const [recipientNames, setrecipientNames] = useState<Array<string>>([]);


  // If one or more players have been selected
  // Show option to "create conversation" button
  if(toCreateConveresationBtn !== null && recipientNames.length > 0){
    toCreateConveresationBtn.style.visibility = 'visible';
  }

  // If no players have been selected
  // Hide option to "create conversation" button
  if(toCreateConveresationBtn !== null && recipientNames.length === 0){
    toCreateConveresationBtn.style.visibility = 'hidden';
  }

  // This function will be triggered when a checkbox changes its state
  const selectRecipient = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedRecipient = event.target.value;
  
    // Check if "recipientNames" contains "selectedRecipient"
    // If true, this checkbox is already checked
    // Otherwise, it is not selected yet
    if (recipientNames.includes(selectedRecipient)) {
      const newRecipientNames = recipientNames.filter((id) => id !== selectedRecipient);
      setrecipientNames(newRecipientNames);
    } else {
      const newRecipientNames = [...recipientNames];
      newRecipientNames.push(selectedRecipient);
      setrecipientNames(newRecipientNames);
    }
  };

  const { isChatWindowOpen, setIsChatWindowOpen, conversation, hasUnreadMessages } = useChatContext();

  const toggleChatWindow = () => {
    // Create direct message
    if(recipientNames.length === 1){
      isChatWindowOpen.forEach(win => !win)
    }
    // Create group message
    if(recipientNames.length > 1){
      isChatWindowOpen.forEach(win => !win)
    }
  };


  return (
  <>
  <Tooltip label={`Town ID: ${currentTownID}`}>
    <Heading fontSize='15px' as='h2'>
      Current town: {currentTownFriendlyName}
      <br />
      Current user: {currentPlayerName}
      </Heading>
    </Tooltip>
    <br />
    <OrderedList>
      {[...players].filter(player => player.userName !== currentPlayerName).sort(sortPlayer).map((player) => 
      <ListItem key={player.userName}>
        <Checkbox 
        name='playerCheckbox'
        value={player.userName}
        onChange={selectRecipient}
        checked={recipientNames.includes(player.userName)}
        ><PlayerName player={player}/></Checkbox>
        </ListItem>
        )}
        </OrderedList>
        <Button 
        id='createConveresationBtn' 
        onClick={toggleChatWindow}
        visibility='hidden'
        marginTop='15px'
        >Create Conversation</Button>
        </>
        )
      }


