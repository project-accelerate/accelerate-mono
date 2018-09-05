import React from 'react'
import PropTypes from 'prop-types'
import { StatusBar } from 'react-native'
import { createStackNavigator } from 'react-navigation'

import StateRestore from './components/state-restore'
import StateSync from './components/state-sync'
import ComponentList from './components/component-list'
import { loadFonts } from '../config/loadFonts'

export const ROUTE_NAME_KEY = 'ROUTE_NAME'

const NEED_SAVE_STATE = __DEV__

export class App extends React.Component {
  Navigator = createStackNavigator({
    Home: {
      screen: screenProps => {
        if (NEED_SAVE_STATE) {
          return (
            <StateRestore
              navigate={screenProps.navigation.navigate}
              currentRouteName={screenProps.navigation.state.routeName}
            >
              <StateSync addListener={screenProps.navigation.addListener}>
                <ComponentList
                  navigate={screenProps.navigation.navigate}
                  {...this.props}
                />
              </StateSync>
            </StateRestore>
          )
        }

        return (
          <ComponentList
            navigate={screenProps.navigation.navigate}
            {...this.props}
          />
        )
      },
      navigationOptions: () => ({
        title: '📚',
      }),
    },
    ...Object.keys(this.props.components).reduce(
      (cur, next) => ({
        ...cur,
        [`Component:${next}`]: {
          screen: NEED_SAVE_STATE
            ? screenProps => (
                <StateSync addListener={screenProps.navigation.addListener}>
                  {React.createElement(this.props.components[next])}
                </StateSync>
              )
            : this.props.components[next],

          navigationOptions: () => ({
            title: `${next}`,
          }),
        },
      }),
      {},
    ),
  })

  state = { loaded: false }

  async componentDidMount() {
    StatusBar.setBarStyle('dark-content')
    await loadFonts()

    this.setState({ loaded: true })
  }

  render() {
    if (!this.state.loaded) {
      return null
    }

    return <this.Navigator />
  }
}

App.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  components: PropTypes.object.isRequired,
}

export default components => () => <App components={components} />
