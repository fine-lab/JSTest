viewModel.get("button13di") &&
  viewModel.get("button13di").on("click", function (data) {
    //批量执行--单击
    let rows = viewModel.getGridModel().getSelectedRows();
    console.log("row", rows);
    let actionrows = [];
    let rowwait = 300;
    let rowrunsize = 100;
    let runrowindex = 0;
    let container = {};
    let wait = 300;
    let runsize = 100;
    let runindex = 0;
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      let obj = JSON.parse(row.object);
      if (Object.keys(obj).length > 2) {
        let { table, billnum, status } = row;
        let key = table + "_" + billnum + "_" + status;
        if (!!container[key]) {
          if (!idInclude(container[key].list, obj.id)) {
            container[key].list.push(obj);
          }
        } else {
          container[key] = {
            table,
            billnum,
            status,
            list: [obj]
          };
        }
        if (container[key].list.length === runsize) {
          switch (container[key].status) {
            case "Insert":
              break;
            case "Update":
              let { table, billnum, list } = JSON.parse(JSON.stringify(container[key]));
              waitrunUpdate(key, table, billnum, list, runindex, wait);
              break;
          }
          runindex++;
        }
      }
      actionrows.push(row);
      if (actionrows.length === rowrunsize) {
        waitRunEnd(actionrows, runrowindex, rowwait);
        runrowindex++;
      }
    }
    // 对象处理 begin
    let allkeys = Object.keys(container);
    for (let i in allkeys) {
      let allkey = allkeys[i];
      if (container[allkey].list.length > 0) {
        let { table, billnum, list } = JSON.parse(JSON.stringify(container[allkey]));
        waitrunUpdate(allkey, table, billnum, list, runindex, wait);
      }
    }
    function idInclude(objs, id) {
      for (let i in objs) {
        let obj = objs[i];
        if (obj.id === id) {
          return true;
        }
      }
      return false;
    }
    function runUpdate(table, billNum, list) {
      return cb.rest.invokeFunction("GT34544AT7.common.updateBatchSql", { table, list, billNum }, function (err, res) {}, viewModel, { async: false }).result;
    }
    function waitrunUpdate(key, table, billNum, list, runindex, wait) {
      setTimeout(() => {
        container[key].list = [];
        let result = runUpdate(table, billNum, list);
        console.log("result => ", result);
      }, runindex * wait);
    }
    // 对象处理 end
    function runEnd(rows) {
      let list = [];
      for (let i in rows) {
        let { id } = rows[i];
        list.push({ id, runed: true, _status: "Update" });
      }
      let table = "GT53685AT3.GT53685AT3.Write_back_object";
      let billNum = "Write_back_object_run";
      return cb.rest.invokeFunction("GT34544AT7.common.updateBatchSql", { table, list, billNum }, function (err, res) {}, viewModel, { async: false }).result;
    }
    function waitRunEnd(rows, runindex, wait) {
      setTimeout(() => {
        let result = runEnd(rows);
        console.log("row result => ", result);
      }, runindex * wait);
    }
  });