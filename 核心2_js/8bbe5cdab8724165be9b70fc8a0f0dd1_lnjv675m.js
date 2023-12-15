viewModel.get("button22zj") &&
  viewModel.get("button22zj").on("click", function (data) {
    // 自定义同步--单击
    var sql =
      "select id,UserName,RoleCode,SysyhtUserId,SysUser,SysUserCode,SysUserRole,thur.id,thur.SysUserRole,thur.SysyhtUserId,thur.SysUser,thur.SysUserCode from GT3AT33.GT3AT33.test_Org_UserRole " +
      "left join GT3AT33.GT3AT33.test_HistoryUserRole thur on thur.id=HistoryUserRole " +
      "where id is not null and SysUserRole is null";
    cb.rest.invokeFunction("GT34544AT7.common.selectAuthRole", { sql }, function (err, res) {
      console.log("button22zj => ");
      console.log(res);
      var { recordList } = res;
      var list = [];
      for (let i in recordList) {
        let obj = recordList[i];
        let { id, thur_SysUser, thur_SysUserCode, thur_SysUserRole, thur_SysyhtUserId } = obj;
        if (!!thur_SysUser && !!thur_SysUserCode && !!thur_SysUserRole) {
          let nobj = {
            id,
            SysyhtUserId: thur_SysyhtUserId,
            SysUser: thur_SysUser,
            SysUserCode: thur_SysUserCode,
            SysUserRole: thur_SysUserRole,
            _status: "Update"
          };
          list.push(nobj);
        }
      }
      var all = [];
      var child = [];
      var size = 100;
      for (let j = 0; j < list.length; j++) {
        var obj = list[j];
        child.push(obj);
        if ((j + 1) % size == 0) {
          all.push(JSON.parse(JSON.stringify(child)));
          child.splice(0, child.length);
        }
        if (list.length - 1 == j) {
          if ((j + 1) % size > 0) {
            all.push(JSON.parse(JSON.stringify(child)));
            child.splice(0, child.length);
          }
        }
      }
      console.log("all => ");
      console.log(all);
      for (let i = 0; i < all.length; all++) {
        let c = all[i];
        setTimeout(function () {
          if (c.length > 0) {
            cb.rest.invokeFunction("GT34544AT7.common.updateBatchSql", { list: c, table: "GT3AT33.GT3AT33.test_Org_UserRole", billNum: "ybd39d7e72" }, function (err, res) {
              console.log("成功");
              console.log(res);
            });
          } else {
            console.log("没有找到");
          }
        }, 500 * i);
      }
    });
  });