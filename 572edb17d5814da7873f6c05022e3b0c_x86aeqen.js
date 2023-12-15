//获取浏览器参数
function getParams(key) {
  let search = window.location.search.replace(/^\?/, "");
  let pairs = search.split("&");
  let paramsMap = pairs
    .map((pair) => {
      let [key, value] = pair.split("=");
      return [decodeURIComponent(key), decodeURIComponent(value)];
    })
    .reduce((res, [key, value]) => Object.assign(res, { [key]: value }), {});
  return paramsMap[key] || "";
}
let xmid = getParams("xmid");
var treeModel = viewModel.getTreeModel(); //方法一、适用于页面中只有一个树表
treeModel.on("afterSelect", function (data) {
  var djid = xmid;
  cb.rest.invokeFunction("AT17C2308216C00006.back.getData", { billNo: data[0].billNo, xmid: xmid }, function (err, res) {
    let djid = "";
    if (res != undefined) {
      djid = res.djid;
    }
    debugger;
    if (data[0].level == 2) {
      viewModel.execute("updateViewMeta", {
        code: "page9mf",
        billtype: data[0].billtype,
        billnum: data[0].billNo,
        visible: true,
        params: {
          id: djid,
          domainKey: "yourKeyHere",
          mode: "browse"
        }
      });
    }
  });
});
viewModel.on("beforeSubPageRender", function (data) {
  const { vm, viewmeta } = data;
  vm.execute("refresh");
});
const subViewModels = viewModel.getSubPageViewModels();
viewModel.on("afterSave", function (args) {
  debugger;
  viewModel.execute("refresh");
});
viewModel.get("button10bd") &&
  viewModel.get("button10bd").on("click", function (data) {
    // 按钮--单击
    debugger;
    viewModel.execute("updateViewMeta", {
      code: "page9mf",
      billtype: "voucher",
      billnum: "ym1",
      force: true,
      visible: true,
      params: {
        id: "youridHere",
        domainKey: "yourKeyHere",
        mode: "browse",
        force: true
      }
    });
  });
viewModel.get("button21hb") &&
  viewModel.get("button21hb").on("click", function (data) {
    // 编辑--单击
    debugger;
    cb.rest.invokeFunction("AT17C2308216C00006.back.getData", { billNo: viewModel.getAllData().billNo, xmid: xmid }, function (err, res) {
      let djid = "";
      //编辑态
      if (res != undefined) {
        djid = res.djid;
        cb.loader.runCommandLine(
          "bill",
          {
            billtype: viewModel.getAllData().billtype,
            params: {
              id: djid,
              mode: "edit",
              domainKey: "yourKeyHere"
            },
            billno: viewModel.getAllData().billNo
          },
          viewModel
        );
      }
      //新增态
      else {
        cb.loader.runCommandLine(
          "bill",
          {
            billtype: viewModel.getAllData().billtype,
            params: {
              mode: "add",
              domainKey: "yourKeyHere"
            },
            billno: viewModel.getAllData().billNo
          },
          viewModel
        );
      }
    });
  });