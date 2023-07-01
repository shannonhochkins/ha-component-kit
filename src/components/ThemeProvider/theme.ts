

export interface ThemeParams {
  background: string;
  color: string;
  font: {
    family: string;
    size: string | number;
  },
  primary: {
    background: string;
    color: string;
  },
  secondary: {
    background: string;
    color: string;
  },
  device: {
    button: {
      maxWidth: string;
    }
  }
}

export const theme: ThemeParams = {
  background: '#212121',
  color: '#fefefe',
  font: {
    size: '1rem',
    family: '"Roboto","Helvetica","Arial",sans-serif'
  },
  primary: {
    background: '#313131',
    color: '#fefefe',
  },
  secondary: {
    background: '#464646',
    color: '#7c7c7c',
  },
  device: {
    button: {
      maxWidth: '100px',
    }
  }
};


