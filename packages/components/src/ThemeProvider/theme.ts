export interface ThemeParams {
  background: string;
  backgroundDark: string;
  backgroundOpaque: string;
  color: string;
  font: {
    family: string;
    size: string | number;
  };
  primary: {
    background: string;
    backgroundHover: string;
    color: string;
    active: string;
    inactive: string;
  };
  secondary: {
    background: string;
    backgroundHover: string;
    color: string;
    active: string;
    inactive: string;
  };
  device: {
    buttonCard: {
      width: string;
    };
    sceneCard: {
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
    };
    sidebarCard: {
      width: {
        collapsed: string;
        expanded: string;
      };
    };
  };
}

export const theme: ThemeParams = {
  background: "#212121",
  backgroundDark: "#1a1a1a",
  backgroundOpaque: "rgba(33, 33, 33, 0.85)",
  color: "#fefefe",
  font: {
    size: "1rem",
    family: '"Roboto","Helvetica","Arial",sans-serif',
  },
  primary: {
    background: "#313131",
    backgroundHover: "#363636",
    color: "#fefefe",
    active: "#f0c039",
    inactive: "#464646",
  },
  secondary: {
    background: "#464646",
    backgroundHover: "#414141",
    color: "#7c7c7c",
    active: "#887a50",
    inactive: "#464646",
  },
  device: {
    buttonCard: {
      width: "9.375rem", // 150px
    },
    sceneCard: {
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
    },
    sidebarCard: {
      width: {
        collapsed: "5rem",
        expanded: "19rem",
      },
    },
  },
};
