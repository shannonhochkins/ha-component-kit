export interface ThemeParams {
  font: {
    family: string;
    size: string | number;
  };
  alert: {
    errorColor: string;
    warningColor: string;
    successColor: string;
    infoColor: string;
  };
  device: {
    buttonCard: {
      width: string;
    };
    sceneCard: {
      width: string;
    };
    climateCard: {
      width: string;
    };
    weatherCard: {
      width: string;
    };
    timeCard: {
      width: string;
    };
    pictureCard: {
      width: string;
    };
    roomCard: {
      width: string;
      zIndex: number;
    };
    entitiesCard: {
      width: string;
    };
    mediaCard: {
      width: string;
    };
    sidebarCard: {
      width: {
        collapsed: string;
        expanded: string;
      };
    };
    garbageCollectionCard: {
      width: string;
    };
  };
  modal: {
    width: string;
    zIndex: number;
  };
}

export const theme: ThemeParams = {
  font: {
    size: "1rem",
    family: '"Roboto","Helvetica","Arial",sans-serif',
  },
  alert: {
    errorColor: "#db4437",
    warningColor: "#ffa600",
    successColor: "#43a047",
    infoColor: "#039be5",
  },
  device: {
    buttonCard: {
      width: "9.375rem", // 150px
    },
    sceneCard: {
      width: "18.75rem", // 300px
    },
    climateCard: {
      width: "18.75rem", // 300px
    },
    weatherCard: {
      width: "18.75rem", // 300px
    },
    timeCard: {
      width: "18.75rem", // 300px
    },
    pictureCard: {
      width: "18.75rem", // 300px
    },
    roomCard: {
      width: "18.75rem", // 300px
      zIndex: 20,
    },
    entitiesCard: {
      width: "18.75rem", // 300px
    },
    sidebarCard: {
      width: {
        collapsed: "5rem",
        expanded: "19rem",
      },
    },
    mediaCard: {
      width: "18.75rem",
    },
    garbageCollectionCard: {
      width: "18.75rem",
    },
  },
  modal: {
    width: "40rem",
    zIndex: 21, // this should be higher than the room card
  },
};
