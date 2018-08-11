import React from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import { Checkbox } from 'react-native-paper'
import { Button } from '../../common/Butttons/Buttons'
import { Typography } from '../../common/Typography/Typography'
import { Background } from '../../common/Layouts/Layouts'
import { theme } from '../../../theme'

const styles = StyleSheet.create({
  bg: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flex: 1,
  },
  container: {
    paddingHorizontal: theme.spacing.level(1),
    paddingVertical: theme.spacing.level(2),
    backgroundColor: theme.pallete.white,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prompt: {
    marginBottom: theme.spacing.level(3),
    color: theme.pallete.accent,
  },
  button: {
    flex: 1,
  },
  field: {
    width: '100%',
    fontSize: 18,
    padding: theme.spacing.level(1),
    marginBottom: theme.spacing.level(2),
    borderColor: theme.pallete.control,
    borderWidth: 1,
  },
  helpText: {
    marginTop: theme.spacing.level(2),
  },
})

interface RegistrationQuestionProps<T> {
  onSubmit: (response: T) => void
}

export function RegistrationIsDelegateQuestion(
  props: RegistrationQuestionProps<boolean>,
) {
  return (
    <RegistrationPanel>
      <RegistrationPrompt>
        Are you a Labour conference delegate?
      </RegistrationPrompt>

      <RegistrationActions>
        <Button
          size="small"
          style={styles.button}
          onPress={submitHandler(props, true)}
        >
          Yes
        </Button>
        <Button
          size="small"
          style={styles.button}
          onPress={submitHandler(props, false)}
        >
          No
        </Button>
      </RegistrationActions>

      <RegistrationHelpText>
        We will use this information to notify you about relevant updates.
      </RegistrationHelpText>
    </RegistrationPanel>
  )
}

export function AcceptNotificationsPanel(
  props: RegistrationQuestionProps<boolean>,
) {
  return (
    <RegistrationPanel>
      <RegistrationPrompt>
        Do you want to receive mobile notifications about changes to events,
        updates and conference news?
      </RegistrationPrompt>

      <RegistrationActions>
        <Button
          size="small"
          style={styles.button}
          onPress={submitHandler(props, true)}
        >
          Yes
        </Button>
        <Button
          size="small"
          style={styles.button}
          onPress={submitHandler(props, false)}
        >
          No
        </Button>
      </RegistrationActions>

      <RegistrationHelpText>
        You can change your notification settings later if you want.
      </RegistrationHelpText>
    </RegistrationPanel>
  )
}

export function RegistrationAskEmailPanel(
  props: RegistrationQuestionProps<string>,
) {
  return (
    <RegistrationPanel>
      <RegistrationPrompt>Give us your email please?</RegistrationPrompt>

      <RegistrationActions>
        <TextInput
          style={styles.field}
          underlineColorAndroid="transparent"
          value="me@example.com"
        />
      </RegistrationActions>

      <RegistrationActions>
        <Button
          size="small"
          style={styles.button}
          onPress={submitHandler(props, true)}
        >
          Skip
        </Button>
        <Button
          size="small"
          style={styles.button}
          onPress={submitHandler(props, false)}
        >
          Ok
        </Button>
      </RegistrationActions>

      <RegistrationHelpText>
        This is useful because blah blah. Some explanatory text here.
      </RegistrationHelpText>
    </RegistrationPanel>
  )
}

export function RegistrationBg({ children }: React.Props<{}>) {
  return (
    <Background>
      <View style={styles.bg}>{children}</View>
    </Background>
  )
}

function RegistrationPanel({ children }: React.Props<{}>) {
  return <View style={styles.container}>{children}</View>
}

function RegistrationPrompt({ children }: React.Props<{}>) {
  return (
    <Typography style={styles.prompt} variant="display">
      {children}
    </Typography>
  )
}

function RegistrationHelpText({ children }: React.Props<{}>) {
  return (
    <Typography style={styles.helpText} variant="caption">
      {children}
    </Typography>
  )
}

function RegistrationActions({ children }: React.Props<{}>) {
  return <View style={styles.actions}>{children}</View>
}

function submitHandler<T>(props: RegistrationQuestionProps<T>, value: T) {
  return () => props.onSubmit(value)
}