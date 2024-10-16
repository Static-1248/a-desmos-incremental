
此仓库为一个Monorepo workspace; 

包含的两个项目/包——"exprbuild"和"desmosinc"现阶段联合开发（方便重构）。

---

稍微记录一下各配置文件的含义和作用：

- `tsconfig.json`：全局ts配置文件，其中`path`字段需要包含两个包，是联合重构的必要条件之一。
- `package.json`：可配置由npm支持的monorepo。使两个包可以依赖彼此，并在运行npm指令/运行我们自己的程序时正确使用依赖。
- `packages/ExprBuild/`:
	- `tsconfig.json`: ts语言支持必需
	- `package.json`: 
		- `bin`字段可对外提供可执行命令，此处用于提供dev server cli. 因此在隔壁项目里install好后可以通过`npx exprbuild`运行这边提供的dev server。
		- 入口点暂时设在src目录里，（照理来说对于ts项目应该设置到dist之类的输出目录里的然后通过一次tsc构建来更新dist里的代码）
			
			跳过tsc转录/项目构建步骤，这样隔壁项目的import引用的就直接是这边的源码，这是联合重构的另一必要条件。
			
			反正ExprBuild只是一个library对吧（）

- 其他关于`package.json`的：
	- `main`字段其实只影响跨包依赖解析.
	- `scripts`属性里是辅助本包开发的一些(快捷)指令；比如
		```
  		"scripts": {
      		"build": "tsc",
  		},
		```
		那么可以运行`npm run build` 等于执行`tsc`指令.
