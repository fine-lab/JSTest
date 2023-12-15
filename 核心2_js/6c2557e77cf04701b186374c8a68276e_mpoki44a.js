viewModel.get("huibaoshijian") &&
  viewModel.get("huibaoshijian").on("afterValueChange", function (data) {
    // 汇报时间--值改变后
    initWeekReport(viewModel);
  });
function initWeekReport(viewModel) {
  let gridModelgs = viewModel.getGridModel("bwrw_01List");
  let gridModelrw = viewModel.getGridModel("zhoubaorenwuhuizongList");
  let gridModelaqfy = viewModel.getGridModel("aqfz_01List");
  let gridModelsg = viewModel.getGridModel("sgjz_01List");
  let huibaoshijian = viewModel.get("huibaoshijian").getValue();
  let shigongdanweigongyingshang = viewModel.get("vendor").getValue();
  let xiangmu = viewModel.get("xiangmu").getValue();
  let suoshuzuzhi = viewModel.get("suoshuzuzhi").getValue();
  if (huibaoshijian === null || typeof shigongdanweigongyingshang == "undefined" || typeof xiangmu == "undefined" || typeof suoshuzuzhi == "undefined") {
    return;
  }
  let monday = getMonday(huibaoshijian);
  let sunday = getSunday(monday);
  let monstr = monday.format("yyyy-MM-dd");
  let sunstr = sunday.format("yyyy-MM-dd");
  cb.rest.invokeFunction(
    "75ea899bf8fc495e808b3a51a7b595aa",
    {
      huibaoshijianS: monstr,
      huibaoshijianE: sunstr,
      shigongdanweigongyingshang: shigongdanweigongyingshang,
      xiangmu: xiangmu,
      suoshuzuzhi: suoshuzuzhi
    },
    function (err, res) {
      debugger;
      if (typeof res != "undefined") {
        if (gridModelgs.getRowsCount() > 0) {
          gridModelgs.deleteAllRows();
        }
        let rows = res.data;
        for (let i = 0; i < rows.length; i++) {
          gridModelgs.appendRow(rows[i]);
        }
        if (gridModelrw.getRowsCount() > 0) {
          gridModelrw.deleteAllRows();
        }
        let rwrows = res.renwu;
        for (let i = 0; i < rwrows.length; i++) {
          gridModelrw.appendRow(rwrows[i]);
        }
        if (gridModelaqfy.getRowsCount() > 0) {
          gridModelaqfy.deleteAllRows();
        }
        let aqfyrows = res.aqfy;
        for (let i = 0; i < aqfyrows.length; i++) {
          gridModelaqfy.appendRow(aqfyrows[i]);
        }
        if (gridModelsg.getRowsCount() > 0) {
          gridModelsg.deleteAllRows();
        }
        let sgjzrows = res.sgjz;
        for (let i = 0; i < sgjzrows.length; i++) {
          gridModelsg.appendRow(sgjzrows[i]);
        }
      }
    }
  );
}
function getMonday(datestr) {
  let date = new Date(datestr);
  let day = date.getDay();
  let deltaDay;
  if (day == 0) {
    deltaDay = 6;
  } else {
    deltaDay = day - 1;
  }
  let monday = new Date(date.getTime() - deltaDay * 24 * 60 * 60 * 1000);
  monday.setHours(0);
  monday.setMinutes(0);
  monday.setSeconds(0);
  return monday; //返回本周的周一的0时0分0秒
}
function getSunday(date) {
  let sunday = new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000);
  sunday.setHours(23);
  sunday.setMinutes(59);
  sunday.setSeconds(59);
  return sunday; //返回本周的周日的23时59分59秒
}