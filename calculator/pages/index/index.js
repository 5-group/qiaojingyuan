//index.js

Page({
  data: {
    screen: '',
    optArr: [],
    optStatus: false,
    equalStatus: false,
    opts: {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      zero: 0,
      plus: '+',
      reduce: '-',
      ride: '*',
      spot: '.',
      divide: '/',
      surplus: '%',
      equal: '='
    }
  },
  calcTap(event) {
    var opt = event.currentTarget.dataset.opt;
    var optArr = this.data.optArr;
    var screen = this.data.screen;
    var str, result, scr;

    if (opt == 'clear') {
      this.setData({
        screen: '',
        equalStatus: false,
        optStatus: false,
        optArr: []
      })
      return;
    }
    if (opt == 'sign') {
      if (screen > 0) {
        if (this.data.optStatus) {
          optArr[optArr.length - 2] = -optArr[optArr.length - 2];
        }
        screen = -screen;
      } else if (screen < 0) {
        if (this.data.optStatus) {
          optArr[optArr.length - 2] = Math.abs(optArr[optArr.length - 2]);
        }
        screen = Math.abs(screen);
      }
      this.setData({
        screen
      })
      return;
    }
    if (opt == 'spot') {
      scr = '' + screen;
      if (scr === '' || this.data.optStatus || scr.indexOf('.') !== -1) {
        return;
      }
    }

    if (opt == 'plus' || opt == 'reduce' || opt == 'ride' || opt == 'divide' || opt == 'surplus') {
      if (screen === '' || this.data.optStatus) {
        return;
      }
      optArr.push(screen, this.data.opts[opt])
      this.setData({
        optArr,
        optStatus: true
      })
    } else {
      if (opt == 'equal') {
        if (this.data.screen == '错误') {
          this.setData({
            optArr: []
          })
          return;
        }
        str = optArr.join();
        if (!/[\+\-\*!/%]/.test(str)) {
          return;
        }
        if (this.data.optStatus) {
          if (optArr.length > 2) {
            optArr.pop();
            this.setData({
              optStatus: false
            })
          } else {
            return;
          }
        } else {
          optArr.push(this.data.screen);
        }
        optArr = this.calculator(optArr);
        result = optArr[0] * 1.0;
        for (var j = 1; j < optArr.length; j += 2) {
          if (optArr[j] != 'undefined' || optArr[j] != 'undefined') {
            result = this.accAdd(result, optArr[j + 1] * 1.0, optArr[j]);
          }
        }
        this.setData({
          screen: result,
          equalStatus: true,
          optArr: []
        })
      } else {
        if (this.data.optStatus) {
          this.setData({
            screen: '',
            optStatus: false
          })
        }
        if (this.data.equalStatus) {
          this.setData({
            screen: '',
            equalStatus: false
          })
        }
        if (this.data.opts[opt] == 0) {
          if (optArr.length > 0) {
            if (optArr[optArr.length - 1] == '/') {
              this.setData({
                screen: '错误'
              })
              return;
            }
          }
        }
        this.data.screen !== '' ? (this.data.screen == '错误' ? screen = this.data.opts[opt] : screen += '' + this.data.opts[opt]) : screen = this.data.opts[opt];

        // screen += this.data.opts[opt];

        this.setData({
          screen
        })
      }
    }
  },

  calculator(arr) {
    for (var i = 1; i < arr.length; i += 2) {
      var $result;
      if (arr[i] == this.data.opts['ride']) {
        $result = (arr[i - 1] * arr[i + 1]).toPrecision(10);
        arr.splice(i - 1, 3, $result);
      } else if (arr[i] == this.data.opts['divide']) {
        $result = (arr[i - 1] / arr[i + 1]).toPrecision(10);
        arr.splice(i - 1, 3, $result);
      } else if (arr[i] == this.data.opts['surplus']) {
        $result = (arr[i - 1] % arr[i + 1]).toPrecision(10);
        arr.splice(i - 1, 3, $result);
      }
    }
    if (arr.indexOf('*') !== -1 || arr.indexOf('/') !== -1 || arr.indexOf('%') !== -1) {
      this.calculator(arr);
    }
    return arr;
  },

  accAdd(arg1, arg2, opt) {
    var r1, r2, m, result;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2))
    if (opt == '+') {
      result = (parseInt(arg1 * m, 10) + parseInt(arg2 * m, 10)) / m;
    } else {
      result = (parseInt(arg1 * m, 10) - parseInt(arg2 * m, 10)) / m;
    }
    return result;
  }

})
