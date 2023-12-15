var frames = [
  {
    title: "第一周",
    // 甘特图任务，cid对应categories的id字段，start、end分别对应色块左右边界
    data: [
      { id: "bar1", cid: "c1", title: "型号1\n第二行", start: "2021-08-01 09:00:00", end: "2021-08-03 12:00:00" },
      { id: "bar3", cid: "c1", title: "型号3 名字比较长", start: "2021-08-04 09:00:00", end: "2021-08-05 19:00:00" },
      { id: "bar5", cid: "c2", title: "型号5", start: "2021-08-03", end: "2021-08-05" }
    ],
    // 纵轴分类
    categories: [
      { name: "计划量", id: "c1" },
      { name: "完成量", id: "c2" },
      { name: "other category", id: "c3" }
    ],
    option: {
      // 图x轴起始坐标
      start: "2021-08-01 00:00:00",
      end: "2021-08-08 00:00:00",
      xAxis: {
        interval: 6 * 60 * 60 * 1000,
        axisLabel: {
          formatter: function (value, index) {
            var moment = new Date(value);
            var hours = moment.getHours();
            var date = moment.getDate();
            var month = moment.getMonth() + 1;
            if (!hours) return month + "/" + date;
            if (!(hours % 12)) return "PM";
            return "";
          }
        }
      }
    }
  },
  {
    title: "第二周",
    data: [
      { id: "bar1", cid: "c1", title: "型号1", start: "2021-08-01 00:00", end: "2021-08-11 12:00" },
      { id: "bar2", cid: "c1", title: "型号2", start: "2021-08-14 12:00", end: "2021-09-20" },
      { id: "bar4", cid: "c2", title: "型号3", start: "2021-08-12", end: "2021-8-20" },
      { id: "bar5", cid: "c2", title: "型号4", start: "2021-08-21", end: "2021-8-25" }
    ],
    categories: [
      { name: "计划量", id: "c1" },
      { name: "完成量", id: "c2" }
    ],
    option: {
      // 图x轴起始坐标
      start: "2021-08-01 09:00",
      end: "2021-10-01 09:00"
    }
  }
];
var option = {
  // 整个甘特图高度
  containerHeight: "auto",
  // 单个图表高度
  frameHeight: "300px",
  onClick: function (barData) {
    window.open("https://www.example.com/");
  },
  tooltip: {
    formatter: function (params) {
      var barData = params.value[3] || {};
      try {
        barData = JSON.parse(barData);
      } catch (error) {}
      return (
        "\
        <ul>\
          <li>" +
        barData.title +
        "</li>\
          <li>" +
        barData.start +
        "</li>\
        </ul>\
      "
      );
    }
  },
  style(barData) {
    var colorMap = {
      bar1: "#383232",
      bar2: "#a57e7e",
      bar3: "#9a3f3f",
      bar4: "#35a0ca",
      bar5: "#adc9d4"
    };
    var style = {
      fill: colorMap[barData.id],
      fillOpacity: 1,
      text: barData.title,
      textFill: "rgba(255,255,255,1)",
      fontSize: 16,
      textLineHeight: 30,
      fontFamily: "microsoft yahei"
    };
    return style;
  }
};
viewModel.on("afterMount", function () {
  var ganttInstance = viewModel.get("ganttchart36mb");
  ganttInstance && ganttInstance.execute("paint", { frames: frames, option: option });
});