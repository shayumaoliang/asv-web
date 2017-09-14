# asv-web

> 声纹识别运维系统前端

## Build Setup

``` bash

# Install dependencies
npm install

# 或者用淘宝源
npm install --registry=https://registry.npm.taobao.org

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

# 欢迎使用 asv-web

------

## 安装

获取压缩文件：

```bush
获取打包好的文件  web.zip
```

解压文件：

```bush
unzip web.zip
```

进入文件夹"web"：

```bush
cd web
```

安装依赖：

```bush
npm install
```

或者（强烈建议使用此命令）：

```bush
npm install --no-shrinkwrap --no-bin-links --no-optional
```

如果速度非常慢，可以换淘宝的源：

```bush
npm install --no-shrinkwrap --no-bin-links --no-optional --registry=https://registry.npm.taobao.org
```

## 设置

### api 配置

找到配置文件：

```bush
vim config/dev.env.js
```

修改字段

```bush
BASE_API：修改"192.168.1.16" 为 asvWebApi 的 ip
```

## 启动

启动前端服务：

```bush
npm run dev
```

### 启动错误

错误：

```bush
Module build failed: Error: Missing binding /home/vagrant/Code/web/node_modules/node-sass/vendor/linux-x64-57/binding.node
Node Sass could not find a binding for your current environment: Linux 64-bit with Node.js 8.x
```

解决方法：

```bush
npm rebuild node-sass --no-bin-links
```

### 启动警告：

```bush
暂忽略所有 warning
```

## 使用

浏览器打开地址:

```bush
所部属服务器的 8080 端口
```

### 现为预览版本，很多功能未能实现，仍存在少量 bug