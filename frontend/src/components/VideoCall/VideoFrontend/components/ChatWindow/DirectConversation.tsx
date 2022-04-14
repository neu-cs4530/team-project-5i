import { makeStyles, createStyles, Theme } from "@material-ui/core";
import {Button, Checkbox, Heading, ListItem, OrderedList, Tooltip } from '@chakra-ui/react';
import TextConversation from "../../../../../classes/TextConversation";
import useChatContext from "../../hooks/useChatContext/useChatContext";
import ChatIcon from "../../icons/ChatIcon";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: '56px',
      background: '#F4F4F6',
      borderBottom: '1px solid #E4E7E9',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 1em',
    },
    text: {
      fontWeight: 'bold',
    },
    closeChatWindow: {
      cursor: 'pointer',
      display: 'flex',
      background: 'transparent',
      border: '0',
      padding: '0.4em',
    },
  })
);

interface DirectConversationProps {
  isChatWindowOpen: boolean;
  occupants: string[];
}

export default function DirectConversationProps({ isChatWindowOpen, occupants }: DirectConversationProps) {
  const classes = useStyles();
  const { setIsChatWindowOpen } = useChatContext();
  // <div className={classes.text}>{toString(occupants)}</div>
  return (
    <>
      <Button onClick={() => setIsChatWindowOpen(false)}>
        Button
      </Button>
    </>
  );
}