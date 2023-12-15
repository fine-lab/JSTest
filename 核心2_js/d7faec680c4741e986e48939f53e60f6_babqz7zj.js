var suffix = "";
viewModel.on("customInit", function (data) {
  viewModel.get("courseware").on("afterFileUploadSuccess", function (aa) {
    var file = aa.file;
    console.log(file);
    var fileExtension = file.fileExtension;
    suffix = fileExtension.substring(1);
    console.log(suffix);
  });
  // 课程_1详情--页面初始化
  viewModel.on("beforeSave", function () {
    console.log("=====保存前判断文件类型======");
    var view_data = viewModel.getData();
    var type_data = view_data.type;
    console.log(type_data);
    //视频类型不做判断
    if (type_data == 2 || type_data == 3) {
      var returnPromise = new cb.promise();
      //获取附件信息
      console.log("====获取附件信息（打印后缀）===");
      console.log(suffix);
      var pic = [];
      pic.push("jpg");
      pic.push("jpeg");
      pic.push("png");
      if (type_data == 2) {
        if (suffix != "pdf") {
          cb.utils.alert("上传PDF文件类型错误");
          returnPromise.reject();
        } else {
          return returnPromise.resolve();
        }
      } else if (type_data == 3) {
        if (!in_array(suffix, pic)) {
          cb.utils.alert("上传图片文件类型错误");
          returnPromise.reject();
        } else {
          return returnPromise.resolve();
        }
      }
      return returnPromise;
    } else if (type_data == 1) {
      if (isEmpty(view_data.courseware2)) {
        cb.utils.alert("请上传至少一个视频");
        return false;
      } else {
        const res = view_data.courseware2.includes("<video");
        if (res) {
          return true;
        } else {
          cb.utils.alert("请上传至少一个视频");
          return false;
        }
      }
    }
  });
  viewModel.on("afterLoadData", function () {
    //用于卡片页面，页面初始化赋值等操作
    var view_data = viewModel.getData();
    var type_data = view_data.type;
    if (type_data == 1) {
      viewModel.get("courseware2").setVisible(true);
      viewModel.get("courseware").setVisible(false);
    } else {
      viewModel.get("courseware2").setVisible(false);
      viewModel.get("courseware").setVisible(true);
    }
  });
});
viewModel.get("type") &&
  viewModel.get("type").on("afterValueChange", function (data) {
    console.log("设置属性测试");
    viewModel.get("courseware").setState("UI#format", '["pdf"]');
    // 课程类型--值改变后
    var view_data = viewModel.getData();
    var type_data = view_data.type;
    if (type_data == 1) {
      viewModel.get("courseware2").setVisible(true);
      viewModel.get("courseware").setVisible(false);
    } else {
      viewModel.get("courseware2").setVisible(false);
      viewModel.get("courseware").setVisible(true);
    }
  });
function in_array(search, array) {
  for (var i in array) {
    if (array[i] == search) {
      return true;
    }
  }
  return false;
}
function isEmpty(obj) {
  if (typeof obj == "undefined" || obj == null || obj == "") {
    return true;
  } else {
    return false;
  }
}