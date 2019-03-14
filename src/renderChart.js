function toString(obj) {
  let result = JSON.stringify(obj, (key, val) => {
    if (typeof val === 'function') {
      return `@-react-native-echarts-tool-@${val}@-react-native-echarts-tool-@`
    }
    return val
  })
  do {
    /* eslint no-useless-escape: 0 */
    /* eslint quotes:0 */
    result = result.replace('\"@-react-native-echarts-tool-@', '').replace('@-react-native-echarts-tool-@\"', '').replace(/\\n/g, '').replace(/\\\"/g, "\"") // 最后一个replace将release模式中莫名生成的\"转换成"
  } while (result.indexOf('@-react-native-echarts-tool-@') >= 0)
  return result
}
export default function renderChart(option, width, height) {
  const w = width ? `${width}px` : 'auto'
  return `
    document.getElementById('main').style.height = "${height}px";
    document.getElementById('main').style.width = "${w}";
    var myChart = echarts.init(document.getElementById('main'));
    myChart.setOption(${toString(option)});
    window.document.addEventListener('message', function(e) {
      var option = JSON.parse(e.data);
      myChart.setOption(option);
    });
    myChart.on('click', function(params) {
      var seen = [];
      var paramsString = JSON.stringify(params, function(key, val) {
        if (val != null && typeof val == "object") {
          if (seen.indexOf(val) >= 0) {
            return;
          }
          seen.push(val);
        }
        return val;
      });
      window.postMessage(paramsString);
    });
  `
}
