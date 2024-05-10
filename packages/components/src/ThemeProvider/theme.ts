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
    areaCard: {
      zIndex: number;
    };
    sidebarCard: {
      width: {
        collapsed: string;
        expanded: string;
      };
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
    areaCard: {
      zIndex: 20,
    },
    sidebarCard: {
      width: {
        collapsed: "5rem",
        expanded: "19rem",
      },
    },
  },
  modal: {
    width: "40rem",
    zIndex: 21, // this should be higher than the area card
  },
};
