// import React, { useEffect } from "react";

// const CheckTimestamp = () => {
//   const [draftMessages, setDraftMessages] = useState([]);
//   useEffect(() => {}, []);

//   const sendDueDrafts = async () => {
//     const chatIds = 30; // get all chat ids
//     for (const chatId of chatIds) {
//       const draftsJson = await AsyncStorage.getItem(chatId);
//       const drafts = JSON.parse(draftsJson) || [];

//       drafts.forEach(async (draft) => {
//         const timestamp = new Date(draft.timestamp);
//         const now = new Date();
//         if (now >= timestamp) {
//           // Send the message
//           await sendMessage(draft.message, chatId);

//           // Remove the draft
//           const newDrafts = drafts.filter(
//             (d) => d.timestamp !== draft.timestamp
//           );
//           await AsyncStorage.setItem(
//             `drafts_${chatId}`,
//             JSON.stringify(newDrafts)
//           );
//         }
//       });
//     }
//   };

//   return null;
// };

// export default CheckTimestamp;

import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sendMessage from "../../../../services/api/chatManagment/sendMessage";

const DraftSender = (chatIds) => {
  console.log("chatIds", chatIds);

  const sendDueDrafts = async () => {
    //const chatIds = 30; // get all chat ids
    for (const chatId of chatIds) {
      const draftsJson = await AsyncStorage.getItem(chatId);
      const drafts = JSON.parse(draftsJson) || [];
      drafts.forEach(async (draft) => {
        const timestamp = new Date(draft.timestamp);
        const now = new Date();
        if (now >= timestamp) {
          console.log("got one");
          // Send the message
          await sendMessage(draft.message, chatId);

          // Remove the draft
          const newDrafts = drafts.filter(
            (d) => d.timestamp !== draft.timestamp
          );
          await AsyncStorage.setItem(
            `drafts_${chatId}`,
            JSON.stringify(newDrafts)
          );
        }
      });
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      sendDueDrafts();
      console.log("checking");
    }, 10000); // check every minute

    return () => clearInterval(intervalId);
  }, []);

  return null;
};

export default DraftSender;
