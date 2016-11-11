import React, { Component } from 'react'
import { View, Text, ListView, StyleSheet } from 'react-native'

import { style, colors } from '../styles'
import { Icon } from '../components'

export default class TodoListSection extends Component {
	constructor(props) {
		super(props)
		let ds = new ListView.DataSource({
			rowHasChanged: (a, b) => a !== b,
			sectionHeaderHasChanged: (a, b) => a !== b
		}).cloneWithRowsAndSections(this.sortData(props.data))

		this.state = { ds }
	}

	componentWillReceiveProps(props) {
		this.setState({ ds: this.state.ds.cloneWithRowsAndSections(this.sortData(props.data)) })
	}

	render() {
		return (
			<View style={ styles.card } >
				<View style={ [styles.header, { backgroundColor: this.props.color }] }>
					<Icon
						name={ this.props.icon }
						color={ colors.alpha(colors.white, 0.87) }
						size={ 36 }
						iconSize={ this.props.iconSize }
					/>
					<Text style={ styles.headerText }>{ this.props.title }</Text>
				</View>
				<ListView
					dataSource={ this.state.ds }
					renderRow={ this.props.renderRow.bind(null, this.props.color) }
					enableEmptySections={ true }
				/>
			</View>
		)
	}

	sortData = (_data) => {
		let data = {
			unchecked: {},
			checked: {}
		}
		for (id in _data) {
			if (!_data[id].checked) {
				data.unchecked[id] = _data[id]
			} else {
				data.checked[id] = _data[id]
			}
		}

		// LayoutAnimation doesn't play nice with multiple sections, so merge everything into one
		// TODO: clean this up if we're sticking with LayoutAnimation
		data.all = {}
		for (id in data.unchecked) {
			data.all[id] = data.unchecked[id]
			delete data.unchecked[id]
		}
		for (id in data.checked) {
			data.all[id] = data.checked[id]
			delete data.checked[id]
		}
		delete data.unchecked
		delete data.checked

		return data
	}

}

const styles = StyleSheet.create({
	header: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	headerText: {
		...style.text,
		fontSize: 15,
		color: colors.alpha(colors.white, 0.87),
		fontFamily: 'sans-serif-medium',
		marginLeft: 5,
		marginBottom: 1,
	},
	card: {
		marginTop: 16,
		marginHorizontal: 16,
		backgroundColor: colors.white,
		elevation: 2,
	},
})