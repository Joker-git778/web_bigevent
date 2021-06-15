$(function(){
  // 获取用户基本信息
  getUserInfo();
  function getUserInfo() {
    $.ajax({
      url: '/my/userinfo',
      type: 'GET',
      // headers: { // 请求头配置对象
      //   Authorization: localStorage.getItem('token') || ''
      // },
      success: function(res) {
        console.log(res);
        if (res.status !== 0) {
          return layui.layer.msg('获取用户信息失败！');
        }
        // 调用函数 渲染用户头像
        renderAvatar(res.data);
      },
      // 无论成功还是失败都会调用
      complete: function(res) {
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
          localStorage.removeItem('token');
          location.href = 'login.html';
        }
      }
    })
  };

  // 渲染用户头像
  function renderAvatar(user) {
    // 存在昵称渲染昵称 优先级
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic) {
      $('.layui-nav-img').prop("src", user.user_pic);
    } else {
      $('.layui-nav-img').prop("src", 'assets/images/user-logo.jpg');
    }
  };

  // 退出登录
  $('#btnLogout').on('click', function () {
    // 提示用户是否确认退出
    layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
      // 1. 清空本地存储的token
      localStorage.removeItem('token');
      // 2. 跳转到登录页
      location.href = 'login.html';
      // 关闭弹出层
      layer.close(index);
    });
  })
})