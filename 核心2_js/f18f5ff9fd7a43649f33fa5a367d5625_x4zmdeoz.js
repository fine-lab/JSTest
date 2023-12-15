var userInfo = null;
viewModel.on("afterInit", () => {
  cb.rest.invokeFunction("AT1740146209180009.frontDesignerFunction.getUserInfo", {}, function (err, res) {
    if (err) {
      return false;
    }
    if (res) {
      console.log(res);
      userInfo = res;
      getSysUser();
    }
  });
});
const getSysUser = () => {
  // 手动获取卡片页数据
  const url = `https://c2.yonyoucloud.com/mdf-node/uniform/bill/detail?terminalType=1&serviceCode=GZTBDM010_1&billnum=bd_staff_card&tplid=5876679&id=${userInfo.id}&spanTrace=undefined&domainKey=developplatform`; // 添加domainKey防止跨域
  var proxy = viewModel.setProxy({
    ensure: {
      url: url,
      method: "GET",
      options: {
        // 选填，系统会自动添加
        domainKey: "yourKeyHere"
      }
    }
  });
  //调用接口后执行的操作
  proxy.ensure({}, function (err, result) {
    if (err) {
      cb.utils.alert(err, "error");
      return;
    } else {
      userInfo.mainJobList = result.mainJobList;
    }
  });
};
var wglxModel = viewModel.get("wglx1_lxname");
wglxModel.on("beforeBrowse", (data) => {
  if (!userInfo.mainJobList || !userInfo.mainJobList[0].post_id) {
    cb.utils.alert("当前用户无岗位信息", "warning");
    return false;
  }
  //获取供应商使用范围
  var condition = {
    isExtend: true,
    simpleVOs: []
  };
  condition.simpleVOs.push({
    field: "gw", // 取自参照getRefData数据中字段key
    op: "eq",
    value1: userInfo.mainJobList[0].post_id
  });
  wglxModel.setFilter(condition);
});
wglxModel.on("afterValueChange", (data) => {
  if (data.value) {
    wglxModel.setValue(data.value.ygwglxpz_wglxList[0].ygwglxpz_wglxList);
    viewModel.get("wglx").setValue(data.value.id);
  }
});
viewModel.get("wgbz") &&
  viewModel.get("wgbz").on("beforeValueChange", function (data) {
    // 违规标准--值改变前
  });