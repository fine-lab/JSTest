var Step; //当前步骤條卡片
var projectStatus; //当前步骤条卡片名稱
var groups = [
  { code: "group7wd", name: "开案" },
  { code: "group12xd", name: "问题明确" },
  { code: "group22gh", name: "现状把握" },
  { code: "group34pi", name: "目标设定" },
  { code: "group47rc", name: "要因分析" },
  { code: "group60ff", name: "对策与实施说明" },
  { code: "group74qi", name: "对策签核" },
  { code: "group89ok", name: "进度追踪" },
  { code: "group105hb", name: "改善签核" },
  { code: "group122ti", name: "效果确认" },
  { code: "group140gi", name: "标准化" },
  { code: "group168tj", name: "结案签核" }
];
var Step_T; //数据库读取当前步骤条卡片
var SHStatus; //对策签核审批状态
var GSStatus; //改善签核审批状态
var mode; //页面状态
var sp; //审批状态
//页面模型加载完成
viewModel.on("afterMount", function (event) {
  //步骤条按钮位置调整
  document.getElementsByClassName("progress-content")[0].style.order = 3;
  //步骤条默认按钮
  viewModel.get("processPageCancel").setVisible(false); //取消按钮隐藏
  viewModel.get("processPageSuccess").setVisible(false); //保存按钮隐藏
});
//数据加载完成后
viewModel.on("afterLoadData", function (args) {
  Step = viewModel.get("Step").getValue();
  projectStatus = viewModel.get("projectStatus").getValue();
  DCStatus = viewModel.get("DCStatus").getValue();
  GSStatus = viewModel.get("GSStatus").getValue();
  mode = viewModel.originalParams.mode; //页面状态
  sp = viewModel.getAllData().verifystate; //审批状态
  //打开时默认显示的步骤条所在卡片
  viewModel.execute("updateViewMeta", {
    code: "9e0b76efc3a149e2a822247f9f24a4cd", // 容器的编码（从UI设计器属性栏查看）
    activeKey: Step //对策签核
  });
  //获取数据库后台数据
  cb.rest.invokeFunction("AT1639DE8C09880005.HT.getStatusInfo", {}, function (err, res) {
    if (res.res.length > 0) {
      Step_T = res.res[0].Step;
    } else {
      Step_T = Step;
    }
    setButtonStatus(Step_T, DCStatus, GSStatus, mode, sp);
  });
  //步骤条下一步事件
  viewModel.on("processPageNext", function (event) {
    Step = getNextGroup(event.activeKey).Step;
    viewModel.get("Step").setValue(Step);
    viewModel.get("projectStatus").setValue(getCurrentGroup(Step).projectStatus);
    setButtonStatus(Step, DCStatus, GSStatus, mode, sp);
  });
  //步骤条上一步事件
  viewModel.on("processPagePrevious", function (event) {
    Step = getPreviouGroup(event.activeKey).Step;
    viewModel.get("Step").setValue(Step);
    viewModel.get("projectStatus").setValue(getCurrentGroup(Step).projectStatus);
    setButtonStatus(Step, DCStatus, GSStatus, mode, sp);
  });
  //点击标题触发事件
  viewModel.on("processPageHandleClick", function (event) {
    Step = getCurrentGroup(event.item.cGroupCode).Step;
    viewModel.get("Step").setValue(Step);
    viewModel.get("projectStatus").setValue(getCurrentGroup(Step).projectStatus);
    setButtonStatus(Step, DCStatus, GSStatus, mode, sp);
  });
});
viewModel.on("modeChange", function (data) {
  mode = data;
  setButtonStatus(Step, DCStatus, GSStatus, mode, sp);
});
//通知
viewModel.get("button87yc") &&
  viewModel.get("button87yc").on("click", function (data) {
    // 通知所有--单击
    var parm = new Object();
    parm.id = viewModel.get("id").getValue();
    cb.rest.invokeFunction("AT1639DE8C09880005.HT.noticemessage", parm, function (err, res) {
      if (err != null) throw new Error(err);
    });
  });
//代办
viewModel.get("button43se") &&
  viewModel.get("button43se").on("click", function (data) {
    // 催辦--单击
    var parm = new Object();
    parm.id = viewModel.get("id").getValue();
    cb.rest.invokeFunction("AT1639DE8C09880005.HT.todomessage", parm, function (err, res) {
      if (err != null) throw new Error(err);
      else console.log(res);
    });
  });
//自定义方法，獲取下一步的步驟卡片
function getNextGroup(activeKey) {
  var NextInfo = {};
  for (i = 0; i < groups.length; i++) {
    if (groups[i].code == activeKey) {
      NextInfo.Step = groups[i + 1].code;
      NextInfo.projectStatus = groups[i + 1].name;
    }
  }
  return NextInfo;
}
function getPreviouGroup(activeKey) {
  var PreviouInfo = {};
  for (i = 0; i < groups.length; i++) {
    if (groups[i].code == activeKey) {
      PreviouInfo.Step = groups[i - 1].code;
      PreviouInfo.projectStatus = groups[i - 1].name;
    }
  }
  return PreviouInfo;
}
function getCurrentGroup(activeKey) {
  var Info = {};
  for (i = 0; i < groups.length; i++) {
    if (groups[i].code == activeKey) {
      Info.Step = groups[i].code;
      Info.projectStatus = groups[i].name;
    }
  }
  return Info;
}
function setButtonStatus(Step, DCStatus, GSStatus, mode, sp) {
  //默认状态
  viewModel.get("flowbutton40dj").setVisible(false); //对策签核隐藏
  viewModel.get("flowbutton81ei").setVisible(false); //改善签核隐藏
  viewModel.get("btnSubmit").setVisible(false); //结束签核隐藏
  viewModel.get("btnUnsubmit").setVisible(false); //审批隐藏
  viewModel.get("btnWorkflow").setVisible(false); //撤回隐藏
  viewModel.get("button43se").setVisible(false); //待辦
  viewModel.get("button87yc").setVisible(false); //通知所有
  viewModel.get("processPageNext").setVisible(true); //下一步按钮显示
  if ((Step == "group74qi" && DCStatus != "对策签核审批结束") || (Step == "group105hb" && DCStatus == "对策签核审批结束" && GSStatus != "改善签核审批结束")) {
    viewModel.get("processPageNext").setVisible(false); //下一步按钮
  }
  if (Step == "group74qi" && DCStatus != "对策签核审批结束" && mode == "browse") {
    viewModel.get("flowbutton40dj").setVisible(true); //对策签核
  }
  if (Step == "group105hb" && DCStatus == "对策签核审批结束" && GSStatus != "改善签核审批结束" && mode == "browse") {
    viewModel.get("flowbutton81ei").setVisible(true); //改善签核
  }
  if (Step == "group168tj" && GSStatus == "改善签核审批结束" && mode == "browse") {
    viewModel.get("btnSubmit").setVisible(true); //结束签核
    viewModel.get("btnUnsubmit").setVisible(true); //审批
    viewModel.get("btnWorkflow").setVisible(true); //撤回
  }
  if (sp == "1" || sp == "2") {
    //结束签核开始后不允许编辑和删除
    viewModel.get("btnEdit").setVisible(false); //编辑
    viewModel.get("btnDelete").setVisible(false); //删除
  }
  if (mode == "browse") {
    viewModel.get("button43se").setVisible(true); //待辦
    viewModel.get("button87yc").setVisible(true); //通知所有
  }
}