import React from 'react'
import {
  ActivityIndicator,
  View,
  StyleSheet,
  ImageStyle,
  StyleProp,
  ImageBackground,
  Dimensions,
  ViewStyle,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { theme } from '../../../theme'
import {
  withNavigation,
  NavigationInjectedProps,
  NavigationRoute,
} from 'react-navigation'
import { topLevelRoutes, nonTopLevelRoutes, allRoutes } from '../../../routes'
import { Typography } from '../Typography/Typography'

const LoadingOverlayStyle = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export function LoadingOverlay() {
  return (
    <View style={LoadingOverlayStyle.container}>
      <ActivityIndicator size="large" color={theme.pallete.accent} />
    </View>
  )
}

const ProfileImageStyle = StyleSheet.create({
  small: {
    width: 96,
    height: 96,
  },
  fullWidth: {
    width: '100%',
  },
  halfSquare: {
    width: Dimensions.get('screen').width * 0.5,
    height: Dimensions.get('screen').width * 0.5,
  },
  halfScreen: {
    width: '100%',
    height: Dimensions.get('screen').height * 0.4,
  },
  fullScreen: {
    width: '100%',
    height: Dimensions.get('screen').height,
  },
})

interface ProfileImageProps {
  style?: StyleProp<ImageStyle>
  size?: keyof typeof ProfileImageStyle
  image: { sourceUrl: string } | number | null
  children?: React.ReactNode
}

export function ProfileImage({
  children,
  style,
  image,
  size = 'small',
}: ProfileImageProps) {
  if (!image) {
    return null
  }

  return (
    <ImageBackground
      style={[style, ProfileImageStyle[size]]}
      source={
        typeof image === 'number'
          ? image
          : { cache: 'force-cache', uri: image.sourceUrl }
      }
    >
      {children}
    </ImageBackground>
  )
}

const BannerStyles = StyleSheet.create({
  banner: {
    backgroundColor: theme.pallete.imageOverlay,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: theme.spacing.level(1),
  },
})

export function Banner({ children }: React.Props<{}>) {
  return <View style={BannerStyles.banner}>{children}</View>
}

const GridStyles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  item: {
    padding: theme.spacing.level(1),
  },
})

export function Grid({
  children,
  style,
}: {
  children: React.ReactElement<{}>[]
  style?: StyleProp<ViewStyle>
}) {
  return (
    <View style={[GridStyles.grid, style]}>
      {children.map((child, i) => (
        <View key={child.key || i} style={GridStyles.item}>
          {child}
        </View>
      ))}
    </View>
  )
}

interface MenuBarProps
  extends Partial<NavigationInjectedProps>,
    React.Props<{}> {
  floatMenu?: boolean
}

const ScreenStyles = StyleSheet.create({
  screen: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  floating: {
    position: 'absolute',
    zIndex: theme.zIndex.menu,
  },
  notFloating: {
    backgroundColor: theme.pallete.accent,
  },
  menu: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    padding: theme.spacing.level(1),
  },
  buttonIcon: {
    textShadowColor: theme.pallete.black,
    textShadowRadius: 10,
  },
  content: {
    flexGrow: 1,
    position: 'relative',
  },
})

export const Screen = withNavigation(function MenuBar({
  navigation,
  children,
  floatMenu,
}: MenuBarProps): React.ReactElement<{}> {
  const openDrawer = () => navigation!.openDrawer()
  const goBack = () => navigation!.goBack()
  const state = navigation!.state as NavigationRoute
  const route = allRoutes[state.routeName]
  const getOptions = route && route.navigationOptions
  const navigationOptions =
    typeof getOptions === 'function'
      ? getOptions({ navigation } as any)
      : getOptions
  const title = navigationOptions && navigationOptions.headerTitle
  const isTopLevel = state.routeName in topLevelRoutes
  const floatStyle = floatMenu
    ? [{ top: StatusBar.currentHeight }, ScreenStyles.floating]
    : [{ paddingTop: StatusBar.currentHeight }, ScreenStyles.notFloating]

  return (
    <View style={ScreenStyles.screen}>
      <SafeAreaView style={[ScreenStyles.menu, floatStyle]}>
        <TouchableOpacity style={ScreenStyles.button} onPress={goBack}>
          {!isTopLevel && (
            <FontAwesome
              style={ScreenStyles.buttonIcon}
              name="chevron-left"
              color="white"
              size={24}
            />
          )}
        </TouchableOpacity>
        <View>
          {(title && (
            <Typography variant="cardTitle" darkBg>
              {title}
            </Typography>
          )) ||
            undefined}
        </View>
        <TouchableOpacity style={ScreenStyles.button} onPress={openDrawer}>
          <FontAwesome
            style={ScreenStyles.buttonIcon}
            name="bars"
            color="white"
            size={24}
          />
        </TouchableOpacity>
      </SafeAreaView>
      {children}
    </View>
  )
})
