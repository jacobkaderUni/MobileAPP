import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Chats from '../views/authorised/chats/Chats';
import OpenedChat from '../views/authorised/chats/OpenedChat';

const ChatStack = createStackNavigator();

const ChatStackScreen = React.memo(() => {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen name="Chats" component={Chats} />
      <ChatStack.Screen name="OpenedChat" component={OpenedChat} />
    </ChatStack.Navigator>
  );
});

export default ChatStackScreen;
