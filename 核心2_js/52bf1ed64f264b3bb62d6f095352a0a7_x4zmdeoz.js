var userList = [],
  newUser = [], // user with gw (postId)
  orgId = "yourIdHere",
  deptId = "yourIdHere",
  tenantId = cb.rest.AppContext.tenant.tenantId,
  wgurl = `https://c2.yonyoucloud.com/mdf-node/uniform/bill/list?designPreview=true&serviceCode=1675390188825083909&terminalType=1&domainKey=developplatform`,
  userlisturl = `https://c2.yonyoucloud.com/mdf-node/uniform/bill/list?locale=zh_CN&serviceCode=GZTBDM010_1&refimestamp=1678268252534&terminalType=1&domainKey=developplatform`;
viewModel.on("afterInit", () => {
  getUserList();
  getSysUserList();
});
// 核验班组长
viewModel.get("button24xc").on("click", () => {
  getWgList(true);
});
// 核验员工
viewModel.get("button70ni").on("click", () => {
  getWgList(false);
});
const getSysUserList = async () => {
  cb.rest.invokeFunction(
    "AT1740146209180009.frontDesignerFunction.getSysUser",
    {
      tenantId: tenantId,
      orgId,
      deptId
    },
    function (err, res) {
      if (res && res.data) {
        userList.forEach((item) => {
          res.data.forEach((job) => {
            if (item.id == job.staffId) {
              newUser.push(Object.assign(item, { postId: job.postId }));
            }
          });
        });
      }
    }
  );
};
const getWgList = async (isBzz) => {
  var proxy = viewModel.setProxy({
    ensure: {
      url: wgurl,
      method: "POST",
      options: {
        domainKey: "yourKeyHere" // 如果不传，则系统自动添加
      }
    }
  });
  const date = new Date();
  const dateStr = date.format("yyyy-MM-dd");
  const startDate = new Date(date.valueOf() - 7 * 24 * 60 * 60 * 1000).format("yyyy-MM-dd");
  //拼接接口入参
  var params = {
    page: {
      pageSize: 1500,
      pageIndex: 1,
      totalCount: 1
    },
    billnum: "yb630109daList",
    condition: {
      commonVOs: [
        {
          itemName: "schemeName",
          value1: "默认方案"
        },
        {
          itemName: "isDefault",
          value1: true
        },
        {
          value1: (isBzz ? startDate : dateStr) + " 00:00:00",
          value2: dateStr + " 23:59:59",
          itemName: "createTime"
        }
      ],
      filtersId: "yourIdHere",
      solutionId: 250079701
    },
    bClick: true,
    bEmptyWithoutFilterTree: false,
    designPreview: "true",
    serviceCode: "1675390188825083909",
    ownDomain: "developplatform",
    tplid: 111018170,
    queryId: 1678278141806
  };
  //调用接口后执行的操作
  proxy.ensure(params, function (err, result) {
    if (err) {
      cb.utils.alert(err, "error");
      return;
    } else {
      checkValid(result.recordList, isBzz);
    }
  });
};
const checkValid = (list, isBzz) => {
  let bzzlist = [],
    yglist = [];
  newUser.forEach((user) => {
    let count = 0;
    list.forEach((record) => {
      if (record.tidanren == user.id) {
        count += 1;
      }
    });
    if (user.postId == "1675395969834811399") {
      bzzlist.push(Object.assign(user, { recordCount: count }));
    } else if (user.postId == "1675396072914550786") {
      yglist.push(Object.assign(user, { recordCount: count }));
    }
  });
  let user_0 = [],
    user_1 = [],
    user_2 = [];
  let nameList = isBzz ? bzzlist : yglist;
  nameList.forEach((user) => {
    if (user.recordCount == 0) {
      user_0.push(user.name);
    } else if (user.recordCount == 1) {
      user_1.push(user.name);
    } else {
      user_2.push(user.name);
    }
  });
  const _gw = `${isBzz ? "班组长" : "员工"}`;
  const msg = `
    上报数量不足${_gw}:
      ${user_1.length > 0 ? user_1.toString() : "无"}
    未上报${_gw}:
      ${user_0.length > 0 ? user_0.toString() : "无"}
  `;
  cb.utils.alert(msg, "info");
  sendMsg(msg);
};
const sendMsg = (msg) => {
  cb.rest.invokeFunction(
    "AT1740146209180009.frontDesignerFunction.sendmsg",
    {
      userId: cb.rest.AppContext.user.userId,
      title: "上报违规核验通知",
      msg
    },
    function (err, res) {
      if (res.data) {
        cb.utils.alert("核验通知已发送", "success");
      }
    }
  );
};
const getUserList = () => {
  var proxy = viewModel.setProxy({
    ensure: {
      url: userlisturl,
      method: "POST",
      options: {
        domainKey: "yourKeyHere" // 如果不传，则系统自动添加
      }
    }
  });
  //拼接接口入参
  var params = {
    page: {
      pageSize: 500,
      pageIndex: 1,
      totalCount: 1
    },
    billnum: "bd_staff_list",
    condition: {
      commonVOs: [
        {
          itemName: "schemeName",
          value1: "默认方案"
        },
        {
          itemName: "isDefault",
          value1: true
        },
        {
          value1: orgId,
          itemName: "mainJobList.org_id"
        },
        {
          value1: deptId,
          itemName: "mainJobList.dept_id"
        }
      ],
      filtersId: "yourIdHere",
      solutionId: 712293205
    },
    bClick: true,
    bEmptyWithoutFilterTree: false,
    locale: "zh_CN",
    serviceCode: "GZTBDM010_1",
    refimestamp: "1678268252534",
    externalData: {
      serviceCode: "GZTBDM010_1"
    },
    ownDomain: "ucf-staff-center",
    tplid: 5587288,
    queryId: 1678270722229
  };
  //调用接口后执行的操作
  proxy.ensure(params, function (err, result) {
    if (err) {
      cb.utils.alert(err, "error");
      return;
    } else {
      userList = result.recordList;
    }
  });
};