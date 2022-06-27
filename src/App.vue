<script lang="ts">
import {
  CaretDownOutlined,
  EllipsisOutlined,
  FileOutlined,
  PictureOutlined,
  PlayCircleOutlined,
  SoundOutlined,
} from '@ant-design/icons-vue';
import { Checkbox, DropdownButton, Menu, MenuItem } from 'ant-design-vue';
import { defineComponent, reactive, ref } from 'vue';
import { RouterView } from 'vue-router';
import { globalUploader } from '../src/components';
import { MenuList } from '../src/const';
import { AuthService, DictService } from '../src/service';

export default defineComponent({
  components: {
    RouterView,
    DropdownButton,
    'a-menu': Menu,
    MenuItem,
    Checkbox,
    CaretDownOutlined,
    FileOutlined,
    PlayCircleOutlined,
    SoundOutlined,
    EllipsisOutlined,
    PictureOutlined,
    globalUploader,
  },
  setup() {
    const transferState = reactive<TransferState>({
      showModal: false,
      uploadData: [],
      menuIndex: 'all',
      limitNumber: 0,
    });
    const menuList = ref<MenuType[]>(MenuList);

    const visible = ref(false);

    return {
      transferState,
      menuList,
      visible,
    };
  },
  mounted() {
    setTimeout(() => {
      if (this.$route.path === '/home') {
        this.transferState.menuIndex = this.$route.query.category
          ? `${this.$route.query.category}`
          : 'all';
      } else {
        this.transferState.menuIndex = 'recycle-bin';
      }
    });
    if (sessionStorage.getItem('menu_list')) {
      this.menuList = JSON.parse(sessionStorage.getItem('menu_list') ?? '[]');
    }
    if (!sessionStorage.getItem('exhibition_mode')) {
      sessionStorage.setItem('exhibition_mode', '1');
    }
  },
  computed: {
    isOnlyOffice(): boolean {
      return this.$route.path === '/only-office';
    },
  },
  methods: {
    updateMenu(item: Partial<MenuType>) {
      this.transferState.menuIndex = item.value!;
      this.$router.push('/home?category=' + item.value);
    },
    updateMore(item: MenuType) {
      // item.visible = !item.visible;
      sessionStorage.setItem('menu_list', JSON.stringify(this.menuList));
    },
    recycleBin() {
      this.transferState.menuIndex = 'recycle-bin';
      this.$router.push('/recycle-bin');
    },
    transferList() {
      this.transferState.showModal = true;
    },
    login() {
      let formData = new FormData();
      formData.append('username', '0012');
      formData.append('password', '123456');
      AuthService.login(formData).then((rs) => {
        if (rs.success) {
          DictService.all().then(() => window.location.reload());
        }
      });
    },
  },
});
</script>

<template>
  <div style="overflow: hidden; height: 100vh">
    <div v-if="!isOnlyOffice">
      <div class="container">
        <div class="left">
          <div class="menu">
            <div class="menu-list">
              <div
                class="menu-title"
                :class="{ active: transferState.menuIndex === 'all' }"
                @click="updateMenu({ value: 'all' })"
                style="padding-right: 0"
              >
                <div class="icon">
                  <caret-down-outlined />
                </div>
                <div class="menu-name">我的文件</div>
                <div class="more" @click.stop>
                  <dropdown-button
                    v-model:visible="visible"
                    placement="bottomLeft"
                    :trigger="['click']"
                  >
                    <template #overlay>
                      <a-menu>
                        <menu-item v-for="(item, index) in menuList" :key="index">
                          <checkbox
                            v-model:checked="item.visible"
                            @change="() => updateMore(item)"
                            >{{ item.label }}</checkbox
                          >
                        </menu-item>
                      </a-menu>
                    </template>
                  </dropdown-button>
                </div>
              </div>
              <div class="menu-children">
                <div v-for="(item, index) in menuList" :key="index">
                  <div
                    class="children-list"
                    :class="{ active: transferState.menuIndex === item.value }"
                    @click="updateMenu(item)"
                    v-if="item.visible"
                  >
                    <div class="icon">
                      <component :is="item.icon" />
                    </div>
                    <div class="menu-name">{{ item.label }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="menu-list no-open">
              <div
                class="menu-title"
                @click="recycleBin"
                :class="{ active: transferState.menuIndex === 'recycle-bin' }"
              >
                <div class="icon"></div>
                <div class="menu-name">回收站</div>
                <div class="more"></div>
              </div>
            </div>
            <div class="menu-list no-open">
              <div
                class="menu-title"
                @click="recycleBin"
                :class="{ active: transferState.menuIndex === 'share' }"
              >
                <div class="icon"></div>
                <div class="menu-name">我的分享</div>
                <div class="more"></div>
              </div>
            </div>
            <div class="menu-list no-open">
              <div class="menu-title" @click="transferList">
                <div class="icon"></div>
                <div class="menu-name">传输列表</div>
                <div class="more"></div>
              </div>
            </div>
            <div class="menu-list no-open">
              <div class="menu-title" @click="login">
                <div class="icon"></div>
                <div class="menu-name">登录</div>
                <div class="more"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <router-view v-bind="{ transferState }" />
        </div>
      </div>

      <global-uploader v-bind="{ transferState }" />
    </div>
    <div v-else style="height: 100%;">
      <router-view />
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '../src/styles/menu.less';
</style>

<style>
.ant-checkbox {
  display: block;
}
</style>
