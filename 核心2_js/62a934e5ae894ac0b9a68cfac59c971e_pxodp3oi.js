viewModel.get("jibiecanzhao_jibie") &&
  viewModel.get("jibiecanzhao_jibie").on("afterValueChange", function (data) {
    //级别参照--值改变后
  });
viewModel.get("button17bb") &&
  viewModel.get("button17bb").on("click", function (data) {
    //绩效按钮--单击
    let jibie = viewModel.get("jibiecanzhao_jibie").getValue(); //级别
    let renwuleixing = viewModel.get("renwuleixingcanzhao_leixing").getValue(); //任务类型
    console.log("jibie:" + jibie + " renwuleixing：" + renwuleixing);
    if (jibie == undefined) {
      alert("级别没有设置值，请重新设置!");
    } else if (renwuleixing == undefined) {
      alert("任务类型没有设置值，请重新设置!");
    } else {
      let result = cb.rest.invokeFunction("AT18C8F66008700006.api.checkScoreData", { jibie: jibie, renwuleixing: renwuleixing }, function (err, res) {}, viewModel, { async: false });
      let res = result.result.res;
      console.log("result:" + res);
      if (res.length == 0) {
        alert("没有查到绩效，请重新设置!");
      } else {
        let id = res[0].id;
        let jixiao = res[0].jixiao;
        viewModel.get("jixiaobiaozhuncanzhao").setValue(id);
        viewModel.get("jixiaobiaozhuncanzhao_jixiao").setValue(jixiao);
      }
    }
  });