var className = "全部";
var selectClassId = "";
var selectTableList = "";
var inputClassName = "";
var inputSubjectName = "";
var allsubjectsList = "";
var initFlag = true;
var selectSet = new Set();
viewModel.on("customInit", function (args) {
  //跳转过来获取跳转的参数数据（1. 科目类别， 2.科目信息列表）
  selectClassId = viewModel.getParams().perData.treeList.id;
  selectTableList = viewModel.getParams().perData.tableList;
});
viewModel.on("afterMount", function (args) {
  var classNameList = ["资产", "负债", "共同", "所有者权益", "成本", "收入", "费用"];
  var options = [];
  classNameList.forEach((item) => {
    let option = {};
    option["value"] = item;
    option["text"] = item;
    option["nameType"] = "string";
    options.push(option);
  });
  viewModel.get("item105oi").setDataSource(options);
  document.getElementsByClassName("close dnd-cancel")[0].style.display = "none";
  document.getElementsByClassName("close dnd-cancel")[1].style.display = "none";
  var height = document.getElementsByClassName("wui-modal-content react-draggable");
  height[1].setAttribute("style", "transform: translate(492px, 100px); min-height: 150px; min-width: 200px; width: 950px; height: 600px;");
});
viewModel.get("allsubjectsList") &&
  viewModel.get("allsubjectsList").on("afterSetDataSource", function (data) {
    // 表格-科目总表--设置数据源后
    //进行总表与选择项的对应，然后进行数据勾选
    var allData = viewModel.get("allsubjectsList").getData();
    var rowList = [];
    if (selectTableList != "") {
      selectTableList.subjectdetails_1741449173823651848.forEach((item) => {
        let rowno = allData.findIndex((x) => x.id === item.selectId);
        rowList.push(rowno);
      });
    }
    console.log("勾选项：" + rowList);
    viewModel.get("allsubjectsList").select(rowList);
    if (initFlag) {
      allsubjectsList = viewModel.get("allsubjectsList").getData();
    }
  });
viewModel.get("allsubjectsList") &&
  viewModel.get("allsubjectsList").on("beforeSelect", function (data) {
    // 表格-科目总表--选择前
  });
viewModel.get("allsubjectsList") &&
  viewModel.get("allsubjectsList").on("afterSelect", function (data) {
    // 表格-科目总表--选择后
  });
viewModel.get("item82xe") &&
  viewModel.get("item82xe").on("afterValueChange", function (data) {
    //科目名称--值改变后
    if (data.value != null && data.value != "" && data.value != undefined) {
      inputSubjectName = data.value;
      initFlag = false;
      clickSearch();
    } else {
      inputSubjectName = "";
    }
  });
viewModel.get("button39ui") &&
  viewModel.get("button39ui").on("click", function (data) {
    // 查询--单击
    clickSearch();
  });
function clickSearch() {
  let diworkCode = viewModel.getParams().diworkCode;
  cb.utils.loadingControl.start({ diworkCode });
  var newArr = [];
  if (inputClassName != "" && inputSubjectName == "") {
    allsubjectsList.map((item) => {
      if (item.className == inputClassName) {
        newArr.push(item);
      }
      viewModel.get("allsubjectsList").setDataSource(newArr);
    });
    var rowList = [];
    if (selectTableList != "") {
      selectTableList.subjectdetails_1741449173823651848.forEach((item) => {
        let rowno = viewModel
          .get("allsubjectsList")
          .getData()
          .findIndex((x) => x.id === item.selectId);
        rowList.push(rowno);
      });
    }
    console.log("勾选项：" + rowList);
    viewModel.get("allsubjectsList").select(rowList);
  } else if (inputClassName == "" && inputSubjectName != "") {
    allsubjectsList.map((item) => {
      if (like(inputSubjectName, item.name)) {
        newArr.push(item);
      }
      viewModel.get("allsubjectsList").setDataSource(newArr);
    });
    var rowList = [];
    if (selectTableList != "") {
      selectTableList.subjectdetails_1741449173823651848.forEach((item) => {
        let rowno = viewModel
          .get("allsubjectsList")
          .getData()
          .findIndex((x) => x.id === item.selectId);
        rowList.push(rowno);
      });
    }
    console.log("勾选项：" + rowList);
    viewModel.get("allsubjectsList").select(rowList);
  } else if (inputClassName != "" && inputSubjectName != "") {
    allsubjectsList.map((item) => {
      if (item.className == inputClassName) {
        if (like(inputSubjectName, item.name)) {
          newArr.push(item);
        }
      }
      viewModel.get("allsubjectsList").setDataSource(newArr);
    });
    var rowList = [];
    if (selectTableList != "") {
      selectTableList.subjectdetails_1741449173823651848.forEach((item) => {
        let rowno = viewModel
          .get("allsubjectsList")
          .getData()
          .findIndex((x) => x.id === item.selectId);
        rowList.push(rowno);
      });
    }
    console.log("勾选项：" + rowList);
    viewModel.get("allsubjectsList").select(rowList);
  } else {
    viewModel.get("allsubjectsList").setDataSource(allsubjectsList);
  }
  setTimeout(function () {
    cb.utils.loadingControl.end({ diworkCode }); //关闭一次loading
  }, 500);
}
viewModel.get("button52kf") &&
  viewModel.get("button52kf").on("click", function (data) {
    for (let x of selectSet) {
      console.log("获取grid中已选中行的数据:" + x);
    }
    //添加之前删除编辑区数据
    if (selectClassId != "") {
      let deleteUrl = "AT17AF88F609C00004.commonII.clearSelectData";
      let deleteParam = {
        id: selectClassId
      };
      let deleteResult = cb.rest.invokeFunction(deleteUrl, deleteParam, function (err, res) {}, viewModel, { async: false });
    }
    // 选择项总表数据汇总
    var insertList = [];
    if (selectSet != null && selectSet != "" && selectSet != undefined) {
      for (let item of selectSet) {
        if (item != "" && item != "undefined") {
          let selectUrl = "AT17AF88F609C00004.commonII.getSubInfoById";
          let selectParam = {
            id: item
          };
          let selectResult = cb.rest.invokeFunction(selectUrl, selectParam, function (err, res) {}, viewModel, { async: false });
          let param = {
            name: selectResult.result.res[0].name,
            code: selectResult.result.res[0].code,
            direct: selectResult.result.res[0].direct,
            selectId: selectResult.result.res[0].id,
            subjects_id: selectClassId
          };
          insertList.push(param);
        }
      }
    }
    //编辑表更新数据
    if (selectClassId != "") {
      let insertUrl = "AT17AF88F609C00004.commonII.saveSelectedToDb";
      let insertParam = {
        data: insertList
      };
      let insertResult = cb.rest.invokeFunction(insertUrl, insertParam, function (err, res) {}, viewModel, { async: false });
    }
    var parentViewModel = viewModel.getCache("parentViewModel"); //模态框中获取父页面
    viewModel.communication({ type: "modal", payload: { data: false } }); //关闭模态框
    parentViewModel.execute("refresh"); //刷新父页面
  });
viewModel.get("button53wf") &&
  viewModel.get("button53wf").on("click", function (data) {
    //重置--单击
    viewModel.get("item82xe").setValue("");
    viewModel.get("item105oi").setValue("");
  });
viewModel.get("allsubjectsList") &&
  viewModel.get("allsubjectsList").on("afterSelect", function (data) {
    //表格-科目总表--选择后
    let ids = String(data).split(",");
    ids.forEach((item) => {
      if (viewModel.get("allsubjectsList").getRow(item).id != "" && viewModel.get("allsubjectsList").getRow(item).id != undefined) {
        selectSet.add(viewModel.get("allsubjectsList").getRow(item).id);
      }
    });
  });
viewModel.get("allsubjectsList") &&
  viewModel.get("allsubjectsList").on("afterUnselect", function (data) {
    //表格-科目总表--取消选中后
    selectSet.delete(viewModel.get("allsubjectsList").getRow(String(data)).id);
  });
viewModel.get("item105oi") &&
  viewModel.get("item105oi").on("afterSelect", function (data) {
    //科目类别--选择后
    if (data != null && data != undefined) {
      inputClassName = data.value;
      initFlag = false;
      clickSearch();
    } else {
      inputClassName = "";
    }
  });
//其实就是类似contain()方法，找到str2里面是否包含有str1，不存在返回-1，存在返回0
function like(str1, str2) {
  var result = str2.indexOf(str1);
  if (result < 0) {
    return false;
  } else {
    return true;
  }
}
viewModel.get("button63vk") && viewModel.get("button63vk").on("click", function (data) {});