viewModel.get("button4jd") &&
  viewModel.get("button4jd").on("click", function (data) {
    // 按钮--单击
    var viewModel = this;
    //动态加载js文件函数
    function addScript(jsfile, callback) {
      //动态加载js文件
      var secScript = document.createElement("script");
      secScript.setAttribute("src", jsfile);
      document.body.insertBefore(secScript, document.body.lastChild);
      //判断动态js文件加载完成
      secScript.onload = secScript.onreadystatechange = function () {
        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
          secScript.onload = secScript.onreadystatechange = null;
          if (callback && typeof callback == "function") {
            callback(echarts);
          }
        }
      };
    }
    var myChart;
    var option;
    addScript("https://www.example.com/", function (echarts) {
      // 加载json
      var jsonstr =
        '{    "rooms": [   {  "id": "00001",  "beigin": "2009/6/10 0:30",  "end": "2009/6/10 23:30",  "name": "会议室二二"   },   {  "id": "00002",  "beigin": "2009/6/10 1:00",  "end": "2009/6/10 22:00",  "name": "会议室三三"   },   {  "id": "00003",  "beigin": "2009/6/10 2:00",  "end": "2009/6/10 21:00",  "name": "会议室四四"   }    ],    "datas": [   {  "id": "00001",  "begin": "2009/6/10 20:00",  "end": "2009/6/10 21:00"   },   {  "id": "00001",  "begin": "2009/6/10 10:00",  "end": "2009/6/10 20:00"   },   {  "id": "00002",  "begin": "2009/6/10 20:00",  "end": "2009/6/10 21:00"   },   {  "id": "00001",  "begin": "2009/6/10 3:00",  "end": "2009/6/10 10:00"   }    ]}';
      var jsonobj = JSON.parse(jsonstr);
      let echersDom = document.getElementById("86d6bd0d|item1ke");
      echersDom.innerHTML = "";
      echersDom.style.height = jsonobj.rooms.length * 80 + "px";
      //初始化echarts实例
      myChart = echarts.init(echersDom);
      //图表需要展示的数据和配置，此处我用的假数据，具体配置查看echarts官网
      var colors = ["#CCCCCC", "#D6737A"]; //两种状态的颜色
      var state = ["不可用", "占用"]; //两种状态
      option = {
        color: colors,
        tooltip: {
          //提示框
          formatter: function (params) {
            return params.name + ":" + params.value[1] + "~" + params.value[2];
          } //数据的值
        },
        legend: {
          //图例
          data: state,
          bottom: "1%",
          selectedMode: false, // 图例设为不可点击
          textStyle: {
            color: "#000"
          }
        },
        grid: {
          //绘图网格
          left: "3%",
          right: "3%",
          top: "1%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          type: "time",
          interval: 3600 * 1 * 1000,
          maxInterval: 3600 * 1 * 1000,
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed"
            }
          },
          axisLabel: {
            formatter: function (value) {
              var date = new Date(value);
              return getzf(date.getHours()) + ":00 ";
              function getzf(num) {
                if (parseInt(num) < 10) {
                  num = "0" + num;
                }
                return num;
              }
            }
          }
        },
        yAxis: {
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed"
            }
          },
          data: ["会议室一", "会议室二", "会议室三"]
        },
        series: [
          // 用空bar来显示四个图例
          { name: state[0], type: "bar", data: [] },
          { name: state[1], type: "bar", data: [] },
          {
            type: "custom",
            renderItem: function (params, api) {
              //开发者自定义的图形元素渲染逻辑，是通过书写 renderItem 函数实现的
              var categoryIndex = api.value(0); //这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。
              var start = api.coord([api.value(1), categoryIndex]); // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。
              var end = api.coord([api.value(2), categoryIndex]);
              var height = 24; //柱体宽度
              return {
                type: "rect", // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
                shape: echarts.graphic.clipRectByRect(
                  {
                    // 矩形的位置和大小。
                    x: start[0],
                    y: start[1] - height / 2,
                    width: end[0] - start[0],
                    height: height
                  },
                  {
                    // 当前坐标系的包围盒。
                    x: params.coordSys.x,
                    y: params.coordSys.y,
                    width: params.coordSys.width,
                    height: params.coordSys.height
                  }
                ),
                style: api.style()
              };
            },
            encode: {
              x: [1, 2], // data 中『维度1』和『维度2』对应到 X 轴
              y: 0 // data 中『维度0』对应到 Y 轴
            },
            data: [
              // 维度0 维度1 维度2
            ]
          }
        ]
      };
      // 调用json更新图表
      changeOption(jsonobj);
      // 数据示例 {"rooms":[{"id":"00001","starttime":"2009/6/10 8:00","endtime":"2009/6/10 22:00","name":"会议室二二"}],"datas":[{"id":"00001","begin":"2009/6/10 20:00","begin":"2009/6/10 21:00","end"}]}
      function changeOption(jsondata) {
        // 声明y轴
        var yaxdata = [];
        //声明x轴
        var series2data = [];
        for (var i = 0; i < jsondata.rooms.length; i++) {
          // 将每个会议室放入y轴
          var room = jsondata.rooms[i];
          yaxdata.push(room.name);
          var datetmp = new Date(room.beigin);
          var datetmpstr = datetmp.getFullYear() + "/" + (datetmp.getMonth() + 1) + "/" + datetmp.getDate();
          //存放会议室的开始到结束时间
          var tmpb = {
            itemStyle: { normal: { color: colors[0] } },
            name: "不可用",
            value: [i, datetmpstr + " 00:00", room.beigin]
          };
          var tmpe = {
            itemStyle: { normal: { color: colors[0] } },
            name: "不可用",
            value: [i, room.end, datetmpstr + " 23:59"]
          };
          for (var j = 0; j < jsondata.datas.length; j++) {
            var datatmp = jsondata.datas[j];
            // 判断是否等于当前会议室等于的话将数据存入
            if (room.id == datatmp.id) {
              var tmp = {
                itemStyle: { normal: { color: colors[1] } },
                name: "占用",
                value: [i, datatmp.begin, datatmp.end]
              };
              series2data.push(tmp);
            }
          }
          //放入开始和结束
          series2data.push(tmpb);
          series2data.push(tmpe);
        }
        option.yAxis.data = yaxdata;
        option.series[2].data = series2data;
        option && myChart.setOption(option);
      }
    });
  });