import React , {Component} from 'react';
import PropTypes from 'prop-types';

 const themes = {
  light: {
    foreground: '#000000',
    background: 'blue',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
};

 const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});

 function ThemeTogglerButton() {
  // The Theme Toggler Button receives not only the theme
  // but also a toggleTheme function from the context
  return (
    <ThemeContext.Consumer>
      {({theme, toggleTheme}) => (
        <button
          onClick={toggleTheme}
          style={{backgroundColor: theme.background}}>
          切换主题
        </button>
      )}
    </ThemeContext.Consumer>
  );
}
class ContextCase extends React.Component {
  constructor(props) {
    super(props);

    this.toggleTheme = () => {
      this.setState(state => ({
        theme:
          state.theme === themes.dark
            ? themes.light
            : themes.dark,
      }));
    };

    // State also contains the updater function so it will
    // be passed down into the context provider
    this.state = {
      theme: themes.light,
      toggleTheme: this.toggleTheme,
    };
  }

  render() {
    // The entire state is passed to the provider
    return (
      <ThemeContext.Provider value={this.state}>
        <Content />
      </ThemeContext.Provider>
    );
  }
}

function Content() {
  return (
    <div>
      <ThemeTogglerButton />
    </div>
  );
}

export default ContextCase
