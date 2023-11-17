export const notify = (messageList) => {
  Notification.requestPermission().then((result) => {
    console.log(result);
    if (Notification.permission === "granted") {
      document.onvisibilitychange = function () {
        if (document.visibilityState === "hidden") {
          const notification = new Notification(messageList.username, {
            body: `${
              messageList.message != "" ? messageList.message : "Sent a photo"
            }`,
            icon: "/HG-2.svg",
          });
          return notification;
        }
      };
    }
  });
};
