viewModel.get("button19ia") &&
  viewModel.get("button19ia").on("click", function (data) {
    // 资讯发布--单击
    var xhr = new XMLHttpRequest();
    xhr.timeout = 30000;
    xhr.ontimeout = function (event) {
      cb.utils.alert("请求超时！", "error");
    };
    const idTemp = viewModel.get("id").getValue();
    if (undefined === idTemp) {
      cb.utils.alert("请先进行保存，再发布。", "info");
      return;
    }
    xhr.open("GET", "https://www.example.com/" + idTemp);
    xhr.send(null);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          const result = xhr.responseText;
          const jsonResult = cb.utils.parseCStyle(result);
          if (200 == jsonResult.code) {
            cb.utils.alert(jsonResult.message, "success");
          } else {
            cb.utils.alert(jsonResult.message, "info");
          }
        } else {
          cb.utils.alert("网络原因，发布失败", "error");
        }
      }
    };
  });
//状态变更，设置按钮状态
viewModel.on("modeChange", function (data) {
  if (data == "add" || data == "edit") {
    viewModel.get("button19ia").setVisible(false);
  } else if ("browse" == data) {
    viewModel.get("button19ia").setVisible(true);
  }
});
//保存前校验
viewModel.on("beforeSave", function (args) {
  const value = viewModel.get("is_external_link").getValue();
  if ("1" == value) {
    const externalLink = viewModel.get("external_link").getValue();
    if (cb.utils.isEmpty(externalLink)) {
      cb.utils.alert("外挂链接地址不能为空");
      return false;
    } else {
      var externalLinkJsonObj = cb.utils.parseCStyle(externalLink);
      if (!externalLinkJsonObj.linkAddress || "https://" == externalLinkJsonObj.linkAddress || "http://" == externalLinkJsonObj.linkAddress) {
        cb.utils.alert("外挂链接地址不能为空");
        return false;
      }
    }
  } else if ("2" == value) {
    const content = viewModel.get("content").getValue();
    if (cb.utils.isEmpty(content)) {
      cb.utils.alert("内容不能为空");
      return false;
    }
  }
  if (args.data && args.data.data) {
    var obj = cb.utils.parseCStyle(args.data.data);
    if (obj.content) {
      const newBase = window.btoa(window.encodeURIComponent(obj.content));
      obj.content = newBase;
      args.data.data = JSON.stringify(obj);
    }
  }
});
//启用前去掉内容字段，防止平台校验
viewModel.on("beforeOpen", function (args) {
  if (args.data && args.data.data) {
    var obj = cb.utils.parseCStyle(args.data.data);
    if (obj.content) {
      delete obj.content;
      args.data.data = JSON.stringify(obj);
    }
  }
});
//停用前去掉内容字段，防止平台校验
viewModel.on("beforeClose", function (args) {
  if (args.data && args.data.data) {
    var obj = cb.utils.parseCStyle(args.data.data);
    if (obj.content) {
      delete obj.content;
      args.data.data = JSON.stringify(obj);
    }
  }
});