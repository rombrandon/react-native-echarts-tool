import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import {View, Platform} from 'react-native'
import {WebView} from 'react-native-webview'
import renderChart from './renderChart'

const config = Platform.OS === 'ios' ? {
  source: require('./tpl.html')
} : {
  source: {uri: 'file:///android_asset/charts/tpl.html'},
  scalesPageToFit: true
}

export default class index extends Component {
  static propTypes = {
    option: PropTypes.any,
    width: PropTypes.number,
    height: PropTypes.number,
    backgroundColor: PropTypes.string,
    onPress: PropTypes.func
  }

  static defaultProps = {
    option: null,
    width: 0,
    height: 400,
    backgroundColor: 'transparent',
    onPress: () => {}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.option !== this.props.option && this.chart) {
      this.chart.reload()
    }
  }

  setOption = (option) => {
    this.chart.postMessage(JSON.stringify(option))
  }

  render() {
    const {
      option, width, height, backgroundColor, onPress
    } = this.props
    if (!option) return null
    const style = {flexDirection: 'row'}
    if (width) style.width = width
    return (
      <View style={style}>
        <View style={{flex: 1, height}}>
          <WebView
            {...config}
            originWhitelist={['*']}
            ref={(ref) => { this.chart = ref }}
            scrollEnabled={false}
            style={{height, backgroundColor}}
            injectedJavaScript={renderChart(option, width, height)}
            onMessage={event => onPress(JSON.parse(event.nativeEvent.data))}
          />
        </View>
      </View>
    )
  }
}
