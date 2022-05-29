<template>
	<div class="icon-card-list selectable" :class="{ 'has-header': showHeader }">
    <template
      v-for="(item, index) in formatLinks"
      :key="index"
    >
      <a
        v-if="item.url.indexOf('http') === 0"
        class="link-item"
        :href="item.url"
        :target="item.isBlank ? '_blank' : '_self'"
      >
        <img :src="item.icon" :alt="item.title" class="icon">
        <p class="title" v-if="item.title">{{item.title}}</p>
        <p class="subtitle" v-if="item.subTitle">{{item.subTitle}}</p>
      </a>
      <div
        v-else
        class="link-item"
        @click="$router.push(item.url)"
      >
        <img :src="item.icon" :alt="item.title" class="icon">
        <p class="title" v-if="item.title">{{item.title}}</p>
        <p class="subtitle" v-if="item.subTitle">{{item.subTitle}}</p>
      </div>
    </template>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

function getRootPath() {
	const path = window.location.pathname;
	const parts = path.split('/');
	const adminIndex = parts.indexOf('admin');
	const rootPath = parts.slice(0, adminIndex).join('/') + '/';
	return rootPath;
}

function addQueryToPath(path, query) {
	const queryParams = new URLSearchParams(path.split('?')[1] || '');
	for (const [key, value] of Object.entries(query)) {
		queryParams.set(key, value);
	}
	return path.split('?')[0] + '?' + queryParams;
}

function addTokenToURL(url, token) {
	if (!token) return url;
	return addQueryToPath(url, { access_token: token });
}

export default defineComponent({
	props: {
		showHeader: {
			type: Boolean,
			default: false,
		},
    imageToken: {
      type: String,
      default: ''
    },
		linkList: {
			type: Array,
			default: () => ([]),
		}
	},
  computed: {
    formatLinks() {
      return this.linkList.map(item => {
        return {
          ...item,
          url: item.url || '',
          icon: addTokenToURL(`${getRootPath()}assets/${item.icon}`, this.imageToken)
        }
      })
    }
  }
});
</script>

<style scoped>
.icon-card-list {
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
  padding: 0 15px;
	width: 100%;
	height: 100%;
  box-sizing: border-box;
}
.icon-card-list .link-item{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-right: 15px;
}
.icon-card-list .link-item .icon{
  margin-bottom: 10px;
  display: block;
  width: 64px;
  height: 64px;
  border-radius: 10px;
  background: #f5f5f5;
}
.icon-card-list .link-item .title{
  margin-bottom: 5px;
	font-weight: bold;
	font-size: 20px;
  height: 20px;
  color: #333;
}
.icon-card-list .link-item .subtitle{
	font-size: 16px;
  height: 16px;
  color: #666;
}

.icon-card-list.has-header {
	height: calc(100% - 24px);
}
</style>
