window.onresize = () => {
  changeElwid("add");
};
function changeElwid(type) {
  let controls = document.getElementsByClassName("meta-default-controls");
  setTimeout(() => {
    let arr = Array.prototype.slice.call(controls);
    let childElements = arr[1];
    let arr2 = Array.prototype.slice.call(childElements.childNodes);
    arr2.map((item) => {
      item.style.width = "20%";
      if (type == "add") {
        let inp = item.querySelector(".wui-input");
        inp.placeholder = "员工信息";
        inp.onfocus = function (res) {
          if (inp.placeholder != "员工信息") {
            inp.placeholder = "员工信息";
          }
        };
      }
      item.classList.remove("width-percent-25");
    });
    let childElements2 = arr[2];
    let arr3 = Array.prototype.slice.call(childElements2.childNodes);
    arr3.map((item) => {
      if (type == "add") {
        let inp = item.querySelector(".wui-input");
        inp.onfocus = function (res) {
          inp.placeholder = "专家信息";
        };
      }
    });
  });
}
viewModel.on("modeChange", function (data) {
  if (data != "add") {
    viewModel.get("button16re").setVisible(false);
    changeElwid("check");
  }
  changeElwid("add");
});
var isnorm = false; //是否配置服务指标
viewModel.get("button16re").on("click", function (event) {
  let date = new Date();
  let dateinfo = {
    firstDay: formatDate(date),
    lastDay: formatDate(date)
  };
  let data = {
    billtype: "Voucher", // 单据类型
    billno: "ybfea1b263", // 单据号
    domainKey: "yourKeyHere",
    params: {
      mode: "edit", // (编辑态edit、新增态add、浏览态browse)
      dateinfo
    }
  };
  //打开一个单据，并在当前页面显示
  cb.loader.runCommandLine("bill", data, viewModel, function (vm, viewMate, title) {
    vm.get("button32id").on("click", function () {
      // 获取参照中选中的数据
      let selectRownewData = vm.getGridModel().getSelectedRows();
      if (selectRownewData.length == 0) {
        cb.utils.alert("未选中数据", "error");
        return;
      }
      const curData = selectRownewData[0];
      closeinput();
      bring(curData.organization_id);
      if (!isnorm) {
        cb.utils.alert("该组织未配置,服务指标请检查", "error");
      } else {
        viewModel.get("retal_num").setValue(curData.retal_num); // 零售单号
        viewModel.get("date").setValue(curData.date); // 日期
        viewModel.get("store_num_name").setValue(curData.store_num);
        viewModel.get("store_num").setValue(curData.store_id);
        viewModel.get("amount").setValue(curData.amount);
        viewModel.get("organization_name").setValue(curData.organization_name);
        viewModel.get("organization").setValue(curData.organization_id);
        viewModel.get("dept_name").setValue(curData.dept_name);
        viewModel.get("dept").setValue(curData.dept);
      }
      viewModel.communication({
        type: "modal",
        payload: { data: false }
      });
    });
    return true;
  });
});
viewModel.on("beforeSave", function (args) {
  let model = viewModel.getParams().mode;
  console.log("model", model);
  if (!isnorm && model == "add") {
    cb.utils.alert("该组织未配置,服务指标请检查", "error");
    return false;
  }
});
function formatDate(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  return `${y}-${m}-${d}`;
}
function bring(organization) {
  close();
  let res = cb.rest.invokeFunction(
    "AT18FE5D761C880009.backend.getmetrics",
    {
      organization: organization
    },
    function (err, res) {},
    viewModel,
    {
      async: false
    }
  );
  let { code, dataInfo, msg } = res.result;
  isnorm = true;
  if (code != 200) {
    isnorm = false;
    cb.utils.alert(msg, "error");
  }
  console.log(dataInfo);
  dataInfo.map((item) => {
    viewModel.get(`score${item.num}`).setValue(item.score);
  });
  updataVisible(dataInfo); //设置服务环节显影
}
function close() {
  for (let i = 1; i <= 7; i++) {
    let key = "yourkeyHere" + i;
    viewModel.get(key).setValue(0);
  }
}
function closeinput() {
  viewModel.get("retal_num").setValue(""); // 零售单号
  viewModel.get("date").setValue(""); // 日期
  viewModel.get("store_num_name").setValue("");
  viewModel.get("store_num").setValue("");
  viewModel.get("amount").setValue("");
  viewModel.get("organization_name").setValue("");
  viewModel.get("organization").setValue("");
  viewModel.get("dept_name").setValue("");
  viewModel.get("dept").setValue("");
}
function updataVisible(dataInfo) {
}