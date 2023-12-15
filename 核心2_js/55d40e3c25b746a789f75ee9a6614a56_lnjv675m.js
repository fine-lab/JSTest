viewModel.get("button22lg") &&
  viewModel.get("button22lg").on("click", function (data) {
    function saveChild(org, orglist) {
      let { id, code, name, dr } = org;
      if (!orglist[id]) {
        orglist[id] = { OrgId: id, OrgCode: code, OrgName: name, dr };
      }
      if (!!org.children) {
        let children = org.children;
        for (let i in children) {
          let child = children[i];
          saveChild(child, orglist);
        }
      }
      return orglist;
    }
    function insertbatch(objs, table, billNum, cell, wait) {
      let size = objs.length;
      let last = size % cell;
      let tier = 0;
      if (last > 0) {
        tier = (size - last) / cell + 1;
      } else {
        tier = size / cell;
      }
      for (let i = 0; i < tier; i++) {
        setTimeout(function () {
          let max = (i + 1) * cell;
          let list = objs.slice(i * cell, max > size ? size : max);
          cb.rest.invokeFunction("GT34544AT7.common.insertBatchSql", { list, table, billNum }, function (err, res) {
            console.log(res);
          });
        }, wait * i);
      }
    }
    // 同步系统组织--单击
    let uri = "/yonbip/digitalModel/orgunit/querytree";
    let req = {
      uri,
      body: {}
    };
    cb.rest.invokeFunction("GT53685AT3.common.baseOpenApi", req, function (err, res) {
      let norg = {};
      let insert = [];
      let orgs = res.res.data;
      for (let i in orgs) {
        let org = orgs[i];
        norg = saveChild(org, norg);
      }
      for (let i in norg) {
        insert.push(norg[i]);
      }
      console.log(insert);
      if (insert.length > 0) {
        console.log("insert.length = ");
        console.log(insert.length);
        let change = [];
        for (let i in insert) {
          let insorg = insert[i];
          let sql = "select id from GT9912AT31.GT9912AT31.MyBaseOrg where OrgId='" + insorg.OrgId + "' ";
          setTimeout(function () {
            cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
              if (res.recordList.length == 0) {
                change.push(insorg);
              }
              if (i == insert.length - 1) {
                console.log(change);
                insertbatch(change, "GT9912AT31.GT9912AT31.MyBaseOrg", "yb8659c5a7", 100, 100);
              }
            });
          }, 10 * i);
        }
      }
    });
  });