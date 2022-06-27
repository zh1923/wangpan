<script lang="ts">
import { defineComponent } from "vue";
import { Input, Button } from "ant-design-vue";

export default defineComponent({
  components: { Input, Button },
});
</script>

<template>
  <div class="login-container">
    <div class="login-bg"></div>
    <div class="login-main">
      <div class="login-content">
        <div class="title">帐号密码登录</div>
        <div class="content">
          <Input size="large" placeholder="账号" />
          <Input size="large" placeholder="密码" type="password" />
        </div>
        <Button type="primary" style="width: 100%" @click="() => $router.push('/home')">登录</Button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login-container {
  position: relative;
  //   height: 550px;
  height: 100vh;
  width: 100%;
  min-width: 1102px;
  overflow: hidden;

  .login-bg {
    background-image: url("../../assets/login_bg.png");
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    background-size: cover;
  }

  .login-main {
    display: table;
    margin: 0 auto;
    clear: both;
    width: 1102px;
    height: 90%;
    position: relative;
    overflow: hidden;
    top: 10%;
  }

  .login-content {
    position: absolute;
    right: 3%;
    top: 50%;
    transform: translateY(-50%);
    padding: 30px 20px;
    width: 352px;
    background-color: #fff;
    .title {
      color: #333;
      font-weight: 600;
      font-size: 18px;
    }
    .content {
      margin-top: 30px;
      :deep(.ant-input) {
        margin-bottom: 16px;
      }
    }
  }
}

// @media screen and (min-width: 1400px) {
//   .login-container {
//     height: 100vh;
//     min-width: 1200px;
//   }
// }
</style>
