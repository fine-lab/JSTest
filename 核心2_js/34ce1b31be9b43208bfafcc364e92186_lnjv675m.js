viewModel.get("button89xe") &&
  viewModel.get("button89xe").on("click", function (data) {
    cb.rest.invokeFunction("GT34544AT7.org.seleceAllOrg", {}, function (err, res) {
      console.log(res);
    });
  });
function searchAll() {
  let promise = new cb.promise();
  let search = "*";
  let table = "GT34544AT7.GT34544AT7.GxsOrg";
  let conditions = "userdel!='1' and userdel!='0'";
  cb.rest.invokeFunction("GT34544AT7.common.selectSqlApi", { search, table, conditions }, function (err, res) {
    if (!!res) {
      promise.resolve(res);
    }
  });
  return promise;
}
function step1() {
  let promise = new cb.promise();
  // 获取IndustryOwnOrg所有数据
  searchAll().then((res, err) => {
    if (!!res) {
      console.log(res);
      promise.resolve(res);
    } else {
      promise.reject(err);
    }
  });
  return promise;
}
function update(table, list) {
  let promise = new cb.promise();
  cb.rest.invokeFunction("GT34544AT7.common.updateBatchSql", { table, list }, function (err, res) {
    if (!!res) {
      promise.resolve(res);
    } else {
      promise.reject(err);
    }
  });
  return promise;
}
function updateBatch(list, size, wait) {
  let max = list.length;
  let pages = parseInt(max / size);
  let lastnum = max % size;
  for (let i = 0; i < pages; i++) {
    let clist = [];
    for (let j = i * size; j < (i + 1) * size; j++) {
      clist.push(list[j]);
    }
    setTimeout(function () {
      let nlist = [];
      for (let i = 0; i < clist.length; i++) {
        let norg = change(clist[i]);
        nlist.push(norg);
      }
      console.log(nlist);
      update("GT34544AT7.GT34544AT7.GxsOrg", nlist);
    }, wait * i);
  }
  if (lastnum > 0) {
    let clist = [];
    for (let j = pages * size; j < max; j++) {
      clist.push(list[j]);
    }
    setTimeout(function () {
      let nlist = [];
      for (let i = 0; i < clist.length; i++) {
        let norg = change(clist[i]);
        nlist.push(norg);
      }
      console.log(nlist);
      update("GT34544AT7.GT34544AT7.GxsOrg", nlist);
    }, wait * pages);
  }
}
function change(obj) {
  let nobj = { id: obj.id, userdel: "0" };
  return nobj;
}
viewModel.get("button94ag") && viewModel.get("button94ag").on("click", function (data) {});
viewModel.get("button99xj") &&
  viewModel.get("button99xj").on("click", function (data) {
    // 按钮--单击
    step1().then((res, err) => {
      console.log(res);
      console.log(err);
      updateBatch(res.res, 100, 2000);
    });
  });