export const statusInfo = {
  draft: {
    color: "purple",
    actions: [
      {
        name: "Send Meeting",
        newStatus: "sent",
      },
    ],
  },
  sent: {
    color: "blue",
    actions: [
      {
        name: "Start Meeting",
        newStatus: "live",
      },
      {
        name: "Cancel Meeting",
        newStatus: "draft",
      },
    ],
  },
  live: {
    color: "green",
    actions: [
      {
        name: "Finish Meeting",
        newStatus: "completed",
      },
    ],
  },
  completed: {
    color: "primary",
    actions: [],
  },
};

export const getStatusNames = () => {
  return Object.keys(statusInfo);
};

export const getStatusInfo = ({ status }) => {
  return statusInfo[status];
};
