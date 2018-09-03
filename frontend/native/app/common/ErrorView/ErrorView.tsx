import React from 'react'
import { View, StyleSheet } from 'react-native'
import { ApolloError } from 'apollo-client'
import { Typography } from '../Typography/Typography'
import { Button } from '../Butttons/Buttons'
import { NetworkStatusListener } from './NetworkStatusListener'
import { OfflineErrorView } from './OfflineErrorView'
import { theme } from '../../../theme'
import { LoadingOverlay } from '../Widgets/Widgets'

export interface ErrorViewProps {
  isRetrying: boolean
  onRetry: (event: RetryErrorEvent) => void
  error: Partial<ApolloError>
}

interface ErrorViewState {
  online: boolean
  attempt: number
}

export interface RetryErrorEvent {
  attempt: number
  networkError: boolean
}

const style = StyleSheet.create({
  root: {
    height: '100%',
    alignItems: 'center',
    paddingTop: theme.spacing.level(6),
  },
  item: {
    textAlign: 'center',
    margin: theme.spacing.level(2),
    marginHorizontal: theme.spacing.level(3),
  },
})

export class ErrorView extends React.Component<ErrorViewProps, ErrorViewState> {
  state: ErrorViewState = {
    online: NetworkStatusListener.currentStatus,
    attempt: 0,
  }

  componentWillReceiveProps(newProps: ErrorViewProps) {
    if (newProps.error !== this.props.error) {
      this.setState({
        online: NetworkStatusListener.currentStatus,
      })
    }
  }

  handleRetry = () => {
    this.props.onRetry({
      attempt: this.state.attempt,
      networkError: false,
    })

    this.setState({
      attempt: this.state.attempt + 1,
    })
  }

  get helpText() {
    return 'It looks like a problem at our end. Wait a few minutes and try again.'
  }

  render() {
    if (!this.state.online) {
      return <OfflineErrorView {...this.props} />
    }

    if (this.props.isRetrying) {
      return <LoadingOverlay />
    }

    return (
      <View style={style.root}>
        <View>
          <Typography style={style.item} variant="display">
            Sorry, something went wrong
          </Typography>

          <Typography style={style.item} variant="caption">
            {this.helpText}
          </Typography>

          <Button variant="inline" onPress={this.handleRetry}>
            Try again
          </Button>
        </View>
      </View>
    )
  }
}