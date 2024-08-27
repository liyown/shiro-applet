import { Component, PropsWithChildren } from 'react'
import 'event-target-polyfill';
import 'yet-another-abortcontroller-polyfill';
import '@tarojs/taro/html5.css';
import 'whatwg-fetch';
import './app.scss'


if (typeof queueMicrotask !== 'function') {
  global.queueMicrotask = function(callback) {
    Promise.resolve().then(callback);
  };
}



class App extends Component<PropsWithChildren>  {


  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
