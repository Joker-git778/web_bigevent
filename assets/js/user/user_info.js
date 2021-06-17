$(function(){
  var form = layui.form;

  form.verify({
    nickname: function(val) {
      if (val.length > 6) {
        return '昵称长度必须在1 - 6个字符之间';
      }
    }
  });

  // 初始化用户基本信息
  initUserName();
  function initUserName() {
    $.ajax({
      url: '/my/userinfo',
      type: 'GET',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败!');
        }
        console.log(res);
        //给表单赋值
        form.val("formUserInfo", res.data);
      }
    })
  };

  // 重置表单数据
  $('#btnReset').on('click', function (e) {
    e.preventDefault();
    initUserName();
  });

  // 监听表单提交事件
  $('.layui-form').on('submit', function (e) {
    // 阻止表单默认提交行为
    e.preventDefault();
    // 发起ajax请求
    $.ajax({
      url: '/my/userinfo',
      type: 'POST',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！');
        }
        layer.msg('更新用户信息成功！');
        // 调用父页面的dom 渲染方法 重新渲染页面
        window.parent.getUserInfo();
      }
    })
  })
})