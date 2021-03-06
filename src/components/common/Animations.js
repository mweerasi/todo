import React, { Component } from 'react'
import { View, Animated, Easing } from 'react-native'

import { colors } from '../styles'

export class ColorTransition extends Component {
	constructor(props) {
		super(props)
		this.state = {
			animValue: new Animated.Value(0),
			current: props.initialColor || props.color,
		}
	}
	componentDidMount() {
		this.transition(this.state.current, this.props.color, this.props.duration, this.props.value)
	}
	componentWillReceiveProps(props) {
		if (props.color !== this.props.color) {
			this.transition(this.props.color, props.color, props.duration, props.value)
		}
	}
	render() {
		return null
	}
	transition = (prev, next, duration, cb) => {
		// alert('' + prev + ' ' + next + ' ')
		// duration = duration + 10000
		this.state.animValue.stopAnimation(value => {
			// Find the current background color based on the values it was
			// animating between and how far it got into the animation
			let current = interpolate(this.state.current, prev, value)
			let animValue = new Animated.Value(0)

			// Call back with an AnimatedValue that can be used by an Animated component
			cb && cb(animValue.interpolate({
				inputRange: [0, 1],
				outputRange: [current, next],
			}))

			this.setState({ animValue, current }, () => {
				// Start a new animation between the current background color and
				Animated.timing(animValue, { duration, toValue: 1, easing: Easing.linear }).start()
			})

		})

		function interpolate(color1, color2, interpValue) {
			color1 = color1.replace('#', '')
			color2 = color2.replace('#', '')
			// interpolate each section of the hex color value (#rrggbbaa)
			return '#' + [[0, 2], [2, 4], [4, 6], [6, 8]]
				.map(section => interp(color1, color2, interpValue, section))
				.join('')

			function interp(hex1, hex2, interpValue, section) {
				let int1 = toInt(hex1.substring(...section))
				let int2 = toInt(hex2.substring(...section))
				return toHex(int1 + (int2 - int1) * interpValue)
			}
			function toInt(hex) {
				if (!hex) return 255 	// if alpha is omitted its value is 255
				return parseInt(hex, 16)
			}
			function toHex(int) {
				int = parseInt(int)
				let hex = int.toString(16)
				return hex.length > 1 ? hex : '0' + hex
			}
		}
	}
}
