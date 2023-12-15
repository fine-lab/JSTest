viewModel.get("button28pe") &&
  viewModel.get("button28pe").on("click", function (data) {
    // 同步--单击
    cb.rest.invokeFunction("GT53685AT3.dept.syncDept", {}, function (err, res) {
      console.log(res);
      let ins = res.ins;
      let up = res.up;
      let table = "GT53685AT3.GT53685AT3.GxyDept";
      let billNum = "yb1fdecd86";
      let inslen = ins.length;
      let inssize = 100;
      let insshf = inslen % inssize;
      let inspage = (inslen - insshf) / inssize + (insshf == 0 ? 0 : 1);
      console.log(inspage);
      for (let i = 0; i < inspage; i++) {
        let list = i == inspage - 1 ? ins.slice(i * inssize) : ins.slice(i * inssize, (i + 1) * inssize);
        setTimeout(function () {
          cb.rest.invokeFunction("GT34544AT7.common.insertBatchSql", { table, list, billNum }, function (err, res) {
            console.log(res);
          });
        }, 300 * i);
      }
      let uplength = up.length;
      let upsize = 100;
      let upsshf = uplength % upsize;
      let uppage = (uplength - upsshf) / upsize + (upsshf == 0 ? 0 : 1);
      console.log(uppage);
      for (let i = 0; i < uppage; i++) {
        let list = i == uppage - 1 ? up.slice(i * upsize) : up.slice(i * upsize, (i + 1) * upsize);
        setTimeout(function () {
          cb.rest.invokeFunction("GT34544AT7.common.updateBatchSql", { table, list, billNum }, function (err, res) {
            console.log(res);
          });
        }, 300 * i);
      }
    });
  });
viewModel.get("button88ok") &&
  viewModel.get("button88ok").on("click", function (data) {
    // 刷新--单击
    viewModel.execute("refresh");
  });
viewModel.get("button121gg") &&
  viewModel.get("button121gg").on("click", function (data) {
    // 查询--单击
    cb.rest.invokeFunction("GT53685AT3.dept.syncDept", {}, function (err, res) {
      console.log(res);
      let ins = res.ins;
      let up = res.up;
      let table = "GT53685AT3.GT53685AT3.GxyDept";
      let billNum = "yb1fdecd86";
      let inslen = ins.length;
      let inssize = 100;
      let insshf = inslen % inssize;
      let inspage = (inslen - insshf) / inssize + (insshf == 0 ? 0 : 1);
      console.log(inspage);
      let uplength = up.length;
      let upsize = 100;
      let upsshf = uplength % upsize;
      let uppage = (uplength - upsshf) / upsize + (upsshf == 0 ? 0 : 1);
      console.log(uppage);
    });
  });
viewModel.get("button151sg") &&
  viewModel.get("button151sg").on("click", function (data) {
    // 同步部门负责人和法人等--单击
    let sql = "select * from GT53685AT3.GT53685AT3.GxyDept";
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
      let { recordList } = res;
      for (let i in recordList) {
        setTimeout(function () {
          let obj = recordList[i];
          cb.rest.invokeFunction("GT53685AT3.dept.syncDeptDeal", { app: obj }, function (err, res) {
            console.log(res);
          });
        }, i * 100);
      }
    });
  });
viewModel.get("button214qh") &&
  viewModel.get("button214qh").on("click", function (data) {
    // 选中行同步详情--单击
    let rows = viewModel.getGridModel().getSelectedRows();
    console.log(rows);
    for (let i in rows) {
      setTimeout(function () {
        let obj = rows[i];
        cb.rest.invokeFunction("GT53685AT3.dept.syncDeptDeal", { app: obj }, function (err, res) {
          console.log(res);
        });
      }, i * 100);
    }
  });