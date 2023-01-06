<template>
    <div class="home_page">
        <div class="page_content">
            <img
                class="page_content_bg"
                src="@/assets/images/homePage/bg.png"
            />
            <div class="page_content_body">
                <HeaderComponent></HeaderComponent>
                <div class="home_page_body">
                    <div class="home_page_left">
                        <div class="home_page_left_content">
                            <!-- 空状态 start-->
                            <div class="home_left_null" v-show="!isHaveReviewCollection">
                                <div>
                                    <img
                                        class="home_null_icon"
                                        src="@/assets/images/homePage/null_img.png"
                                    />
                                    <div class="new_collection_button" @click="startNewCollection()">
                                        Start
                                    </div>
                                </div>
                                <div class="is_finish_loading" v-show="isFinishLoading">
                                    <a-spin size="large"></a-spin>
                                </div>
                            </div>
                            <!-- 空状态 end-->

                            <!-- 有图状态 start-->
                            <div class="home_left_info" v-show="isHaveReviewCollection">
								<div class="left_info_top">
									<div class="button_second" @click="startNewCollection()">Start</div>
									<div class="button_first button_margin" @click="recollection()">Edit</div>
								</div>
								<div class="left_info_content scroll_style">
									<div class="left_info_content_body" ref="collection_canvas">
                                        <NewCollectionReview id="collectionReview"></NewCollectionReview>
                                    </div>
								</div>
							</div>
                            <!-- 有图状态 end-->
                        </div>
                    </div>
                    <div class="home_page_right">
                        <div class="right_top">
                            <div class="right_top_left">
                                <div class="button_second"  @click="designNewCollection()">
                                    Design
                                </div>
                                <div class="button_first button_margin_14"  v-show="designCollectionId" @click="resDesignCollection()">
                                    Redesign
                                </div>
                                <div class="system_scale">
                                    <div class="system_silder">
                                        <a-slider
                                            id="system_silder"
                                            :tooltipVisible="true"
                                            v-model:value="system_scale_value"
                                            :tip-formatter="formatter"
                                            :getTooltipPopupContainer="(triggerNode) => triggerNode.parentNode"
                                        />
                                    </div>
                                     <div class="sacle_left_tip">
                                        Designer
                                    </div>
                                    <div class="sacle_right_tip">
                                        System
                                    </div>
                                </div>

                                <div
                                    class="switch_component_block"
                                    @click="change_switch()"
                                >
                                    <div class="switch_item">Outfit</div>
                                    <div class="switch_item">Category</div>
                                    <div
                                        :class="[
                                            'switch_white_button',
                                            switch_open
                                                ? 'switch_open_button'
                                                : '',
                                        ]"
                                    >
                                    {{switch_open ? 'Category':'Outfit'}}
                                    </div>
                                </div>
                                <div class="select_block" v-show="!switch_open">
                                    <a-select
                                        ref="select"
                                        v-model:value="designType"
                                        :options="disignTypeList"
                                    >
                                        <template #suffixIcon
                                            ><span
                                                class="icon iconfont icon-xiala"
                                                style="color: #343579"
                                            ></span
                                        ></template>
                                    </a-select>
                                </div>
                            </div>
                            <div class="right_top_right">
                                <div class="content_header_button" @click="selectModels()">
                                    <span class="content_header_button_des">Mannequins</span><span class="icon iconfont icon-xiala"></span>
                                </div>
                            </div>
                        </div>

                        <div class="right_content_block">
                            <div class="right_content_header">
                                <div class="content_header_left">
                                    <span class="icon iconfont icon-dangqianweizhi"></span><span class="content_header_des">Generated Design</span>
                                </div>
                                
                            </div>
                            
                            <div class="right_content_body">
                                <div class="right_content_img_block scroll_style">
                                    <div class="content_img_block" v-for="(design,index) in designCollectionList" :key="design?.designItemId" @click="designDetail(design,index,designCollectionList,'dislike')">
                                        <div class="content_img_flex"><img class="content_img" :src="design.designItemUrl"></div>
                                        <div class="icon iconfont icon-jushoucang icon_like" @click.stop="likeDesignCollection(design,index)"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="right_content_header">
                                <div class="content_header_left">
                                    <span class="icon iconfont icon-dangqianweizhi"></span><span class="content_header_des">Selected Design</span>
                                </div>
                                <div class="button_second" v-show="likeDesignCollectionList.length" @click="exportCanvas()">Export</div>
                            </div>
                            
                            <div class="right_content_body">
                                <div class="right_content_img_block scroll_style">
                                    <div class="content_img_block" v-for="(design,index) in likeDesignCollectionList" :key="design?.id" @click="designDetail(design,index,likeDesignCollectionList,'like')">
                                        <div class="content_img_flex"><img class="content_img" v-lazy="design.designItemUrl" :key="design.designItemUrl"></div>
                                        <div class="icon iconfont icon-jushoucanggift icon_like"  @click.stop="dislikeDesignCollection(design,index)"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <CollectionModal ref="collectionModal" @finishCollection="finishCollection()"></CollectionModal>
        <DesignDetail ref="designDetail" @finishRedesign="finishRedesign"></DesignDetail>
        <ModelsModal ref="modelsModal" @sureSelectModel="sureSelectModel"></ModelsModal>
        <ExportNewCoolection id="exportNewCoolection"></ExportNewCoolection>
        <!-- 导出缩略图的蒙层 start-->
        <div class="mark_loading" v-show="isShowMark">
            <a-spin size="large" />
        </div>
        <!-- 导出缩略图的蒙层 end-->

        <!-- design collection的进度蒙层  start-->
        <div class="progress_mark" v-show="showDesignMark">
            <div class="mark_content">
                 <a-progress type="circle" :percent="designProgress" :width="200"/>
                 <div>
                    <a-spin :indicator="indicator"/>
                 </div>
            </div>
        </div>
        <!-- design collection的进度蒙层  end-->
    </div>
</template>

<script lang="ts">
import { defineComponent,h,ref,computed} from "vue";
import HeaderComponent from "@/component/HomePage/Header.vue";
import CollectionModal from "@/component/HomePage/collectionModal.vue"
import NewCollectionReview from '@/component/HomePage/NewCollectionReview.vue'
import ExportNewCoolection from '@/component/HomePage/ExportNewCoolection.vue'
import ModelsModal from '@/component/LibraryPage/ModelsModal.vue'
import DesignDetail from '@/component/Detail/DesignDetail.vue'
import html2canvas from 'html2canvas';
import { message } from 'ant-design-vue';
import {useStore} from 'vuex'
import { Https } from "@/tool/https";
import {rgbToHsv, dataURLtoBlob} from '@/tool/util'
import { LoadingOutlined } from '@ant-design/icons-vue';
import JSZip from 'jszip'
const FileSaver = require('file-saver');

export default defineComponent({
    components: {
        HeaderComponent,
        CollectionModal,
        NewCollectionReview,
        DesignDetail,
        ModelsModal,
        ExportNewCoolection,
    },
    setup(){
        const store = useStore();
        let likeDesignCollectionList:any = computed(()=>{return store.state.HomeStoreModule.likeDesignCollectionList})
        let designCollectionList:any = computed(()=>{return store.state.HomeStoreModule.designCollectionList})
        let templateId:any = computed(()=>{return store.state.HomeStoreModule.templateId})//模特id
        let userGroupId:any = computed(()=>{return store.state.HomeStoreModule.userGroupId})//模特id //当likeDesignCollectionList长度为0时清空，startdesign时清空
        let designCollectionId:any = computed(()=>{return store.state.HomeStoreModule.designCollectionId})
        let designId:any = computed(()=>{return store.state.HomeStoreModule.designId})
        return {
            store,
            likeDesignCollectionList,
            designCollectionList,
            userGroupId,
            templateId,
            designCollectionId,
            designId
        }
    },
    data() {
        return {
            system_scale_value: 30,
            switch_open: true,
            designType: "Outwear",
            isHaveReviewCollection:false,
            isFinishLoading:false,
            isShowMark:false,//导出的loading蒙层
            disignTypeList: [
                {
                    value: "Outwear",
                    label: "Outwear",
                },
                {
                    value: "Blouse",
                    label: "Blouse",
                },
                {
                    value: "Dress",
                    label: "Dress",
                },
                {
                    value: "Trousers",
                    label: "Trousers",
                },
                {
                    value: "Skirt",
                    label: "Skirt",
                },
            ],
            indicator : h(LoadingOutlined, {
                style: {
                    fontSize: '4.8rem',
                    marginTop:'3rem',
                },
                spin: true,
            }),
            designProgress:0,
            showDesignMark:false,
            startDesignType:'design',//设计类型 design 和 resdesign
            disLikeLoading:false,//不喜欢防抖
            likeLoading:false,//喜欢防抖
        };
    },
    mounted(){
        let noRefresh = this.$route.params.noRefresh //判断是否主动刷新还是路由跳转过来的 true 路由跳转过来的
        if(noRefresh){
            let colorBoards = this.store.state.UploadFilesModule.allBoardData.colorBoards || []
            if(colorBoards.length){
                this.isHaveReviewCollection = true
            }
        }else{
            this.store.commit('setUserGroupId',this.$route.params.id)
            this.store.commit('clearAllCollection')
        }
         if(this.$route.params.id){
            this.getHistoryChoose(this.$route.params.id,'normal')
        }else{
            this.store.commit('clearAllData')
        }
    },
    methods: {
        change_switch() {
            this.switch_open = !this.switch_open;
        },

        formatter(value:number){
            return `${value}%`;
        },
        //开始设计collection
        startNewCollection(){
            let collectionModal:any = this.$refs.collectionModal
            this.store.commit('clearAllData')
            collectionModal.changeCollectionModal(true)
        },

        //recollection
        recollection(){
            let collectionModal:any = this.$refs.collectionModal
            this.store.commit('clearAllData')
            collectionModal.changeCollectionModal(true)
            collectionModal.recollection()
        },

        //完成设计
        finishCollection(){
            let _this = this
            _this.isFinishLoading = true
            this.getPantongName().then(res=>{
                _this.store.commit('setAllBoardData')
                _this.isHaveReviewCollection = true
                _this.isFinishLoading = true
            }).catch(res=>{
                _this.isFinishLoading = false
            })
            
        },

        //查询颜色的潘通值和txc
        getPantongName(){
            let colorBoards = this.store.state.UploadFilesModule.colorBoards
            let data:any = []
            for(let v of colorBoards){
                let color:any = [v.rgbValue.r,v.rgbValue.g,v.rgbValue.b]
                let hsv = rgbToHsv(color)
                v.hsv = hsv[0] + hsv[1] + hsv[2]
                data.push({
                    h:hsv[0],
                    s:hsv[1],
                    v:hsv[2],
                })
            }
            return new Promise((resolve:any, reject:any)=>{
                Https.axiosPost(Https.httpUrls.getRgbByHsvBatch, data).then(
                    (rv: any) => {
                        if (rv) {
                            rv.forEach((ele:any,index:number) => {
                                colorBoards[index].id = ele.id
                                colorBoards[index].tcx = ele.tcx
                                colorBoards[index].name = ele.name
                            });
                            this.store.commit('setColorboardList',colorBoards)
                            resolve()
                        }
                    }
                ).catch(res=>{
                    reject()
                });
            })
        },

        getContainer(){
            return document.querySelector("#system_silder")
        },

        //设计新的collection
        designNewCollection(){
            let {colorBoards} = this.store.state.UploadFilesModule.allBoardData
            if(!colorBoards  ||  colorBoards?.length < 1){
                message.error('You must choose one or more colors for further process.')
                return
            }
            let data = this.getDesignData('')
            Https.axiosPost(Https.httpUrls.designCollection, data).then(
                (rv: any) => {
                    if (rv) {
                        this.store.commit('setDesignCollectionList',rv.designCollectionItems)
                        this.store.commit('setLikeDesignCollectionList',[])
                        this.store.commit('deleteUserGroupId')
                        this.store.commit('setDesignCollectionId',rv.collectionId)
                        this.store.commit('setDesignId',rv.designId)
                        this.showDesignMark = false
                        this.designProgress = 0
                        this.startDesignType = 'design'
                    }
                }
            ).catch(res=>{
                this.showDesignMark = false
            });
            this.getDesignProcess()
        },

        //重新设计collection
        resDesignCollection(){
            let {colorBoards} = this.store.state.UploadFilesModule.allBoardData
            if(!colorBoards  ||  colorBoards?.length < 1){
                message.error('You must choose one or more colors for further process.')
                return
            }
            
            let data = this.getDesignData(this.designCollectionId)
            Https.axiosPost(Https.httpUrls.reDesignCollection, data).then(
                (rv: any) => {
                    if (rv) {
                        this.store.commit('setDesignCollectionList',rv.designCollectionItems)
                        this.showDesignMark = false
                        this.designProgress = 0,
                        this.startDesignType = 'resDesign'
                    }
                }
            ).catch(res=>{
                this.showDesignMark = false
            });
            this.getDesignProcess()
        },

        getDesignData(designCollectionId:any){
            let {moodboardFiles, printboardFiles,generatePrintFiles, colorBoards, skecthboardFiles, marketingSketchFiles,moodTemplateId} = this.store.state.UploadFilesModule.allBoardData
            let new_printboardFiles = printboardFiles.concat(generatePrintFiles)
            let data:any = {
                colorBoards:this.getColorBoard(colorBoards),
                marketingSketchs:this.getBoardId(marketingSketchFiles),
                moodBoards:this.getBoardId(moodboardFiles),
                printBoards:this.getPrintId(new_printboardFiles),
                sketchBoards:this.getSkecthBoard(skecthboardFiles),
                switchCategory:!this.switch_open ? this.designType : '',
                singleOverall:!this.switch_open ? 'single' : 'overall',
                systemScale:this.system_scale_value / 100,
                templateId:this.templateId,
                moodTemplateId:moodTemplateId ? String(moodTemplateId) : null,
                timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
            }
            if(designCollectionId){
                data.collectionId = designCollectionId
            }
            this.designProgress = 0
            this.showDesignMark = true
            return data
        },

        //deisgn的进度
        getDesignProcess(){
            Https.axiosPost(Https.httpUrls.countDesignProcess, {}).then(
                (rv: any) => {
                   if(rv < 1 && this.showDesignMark){
                       this.designProgress = rv * 100
                        setTimeout(()=>{
                            this.getDesignProcess()
                        },1000)
                   }
                }
            );
        },

        getBoardId(boardData:any){
            let dataList = boardData.map((v:any)=>{
                let data:any = {
                    id:v.resData.id,
                    designType:v.resData.designType,
                }
                return data
            })
            return dataList
        },

        getPrintId(boardData:any){
            let dataList = boardData.map((v:any)=>{
                let data:any = {
                    id:v.resData.id,
                    designType:v.resData.designType,
                    isPin:v.pin ? 1 : 0,
                }
                return data
            })
            return dataList
        },

        getSkecthBoard(boardData:any){
            let sketchBoards = boardData.map((v:any)=>{
                let data = {
                    designType:v.resData.designType,
                    isPin:v.pin ? 1 : 0,
                    level2Type:v.category,
                    sketchBoardId:v.resData.id
                }
                return data
            })
            return sketchBoards
        },

        getColorBoard(boardData:any){
            let colorBoards = boardData.map((v:any)=>{
                let data = {
                    id:v.id,
                    name:v.name,
                    tcx:v.tcx,
                    rgbValue:''
                }
                data.rgbValue = `${v.rgbValue.r} ${v.rgbValue.g} ${v.rgbValue.b}`
                return data
            })
            return colorBoards
        },

        likeDesignCollection(design:any,index:any){
            let data = {
                designItemId:design.designItemId,
                userGroupId:this.userGroupId,
                timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
            }
            if(this.likeLoading){
                return
            }
            this.likeLoading = true
            Https.axiosPost(Https.httpUrls.designLike, data).then(
                (rv: any) => {
                   if(rv){
                       this.store.commit('setUserGroupId',rv.userGroupId)
                       design.groupDetailId = rv.groupDetailId
                       this.store.commit('addLikeDesignCollectionList',design)
                       this.store.commit('deleteDesignCollectionList',index)
                       if(this.startDesignType === 'resDesign'){
                           this.getHistoryChoose(this.userGroupId,'like')
                       }
                       
                   }
                   this.likeLoading = false
                }
            ).catch(rv=>{
                this.likeLoading = false
            });
        },

        //不喜欢设计
        dislikeDesignCollection(design:any,index:any){
             let data = {
                designId:design.designId || this.designId,
                groupDetailId:design.groupDetailId,
                timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,
            }
            if(this.disLikeLoading){
                return
            }
            this.disLikeLoading = true
            Https.axiosPost(Https.httpUrls.designDislike, data).then(
                (rv: any) => {
                   if(rv){
                       this.store.commit('addDesignCollectionList',design)
                       this.store.commit('deleteLikeDesignCollectionList',index)
                       if(!this.likeDesignCollectionList.length){
                           this.store.commit('deleteUserGroupId')
                       }
                   }
                   this.disLikeLoading = false
                }
            ).catch(rv=>{
                this.disLikeLoading = false
            });
        },

        //获取选择的组
        getHistoryChoose(userGroupId:any,type:any){
            this.isShowMark = true
            let url = Https.httpUrls.historyChoose  + `?userGroupId=${userGroupId}`
            Https.axiosGet(url).then(
                (rv: any) => {
                    this.dealHistoryChooseData(rv,type)
                    this.isShowMark = false
                }
            ).catch(rv=>{
                this.isShowMark = false
            });
        },

        //处理选择组的数据
        dealHistoryChooseData(data:any,type:any){
            let collectionData = {
                moodboardFiles:this.dealViewChooseData(data.collection.moodBoards),
                printboardFiles:this.dealViewChooseData(data.collection.printBoards),
                generatePrintFiles:[],
                colorBoards:this.dealViewChooseColor(data.collection.colorBoards),
                skecthboardFiles:this.dealViewChooseData(data.collection.sketchBoards),
                marketingSketchFiles:this.dealViewChooseData(data.collection.marketingSketchs),
                moodTemplateId:data.collection.moodTemplateId
            }
            this.store.commit('setAllBoardDataChoose',collectionData)
            this.designCollectionId =  this.store.commit('setDesignCollectionId',data.collection.collectionId)
            this.isHaveReviewCollection = true
            if(type === 'normal'){
                 let likeDesignCollectionList = data.userLikeDetails.map((v:any)=>{
                    let data = {
                        ...v,
                        groupDetailId:v.id,
                        designItemUrl:v.url,
                    }
                    return data
                })
                this.store.commit('setLikeDesignCollectionList',likeDesignCollectionList)
            }
           
        },

        //统一处理选择组的渲染数据
        dealViewChooseData(data:any){
            if(!data){
                return []
            }
            let filesList = data.map((v:any)=>{
                let newData:any = {
                    imgUrl:v.url,
                    id:v.id,
                    status:'done',
                    resData:v,
                }
                if(v.level1Type === 'Sketchboard'){
                    newData.pin = v.isPin
                    newData.category = v.level2Type
                }
                if(v.level1Type === 'Printboard'){
                    newData.pin = v.isPin
                }
                return newData
            })
            return filesList
        },

         //统一处理选择组的渲染数据
        dealViewChooseColor(data:any){
            let colorList = data.map((v:any)=>{
                let rgbValue = v.rgbValue.split(' ')
                let newData:any = {
                    id:v.id,
                    name:v.name,
                    tcx:v.tcx || '',
                    rgbValue:{r:rgbValue[0],g:rgbValue[1],b:rgbValue[2],a:1}
                }
                return newData
            })
            return colorList
        },

        //导出合成图
        exportCanvas(){
            let collectionReview:any = document.querySelector("#exportNewCoolection")
            let a = document.createElement('a');
            this.isShowMark = true
            html2canvas(collectionReview,{useCORS:true,scale:3}).then((canvas) => {
                let blob:any = dataURLtoBlob(canvas.toDataURL('image/png'));
                let allBoardData:any = this.store.state.UploadFilesModule.allBoardData
                let index = 0
                let img = [
                    {
                        imgUrl:URL.createObjectURL(blob),
                        name:'collection.png'
                    }
                ]
                for(let key in allBoardData){
                    if(key !== 'colorBoards' && key !== 'moodTemplateId'){
                        for(let item of allBoardData[key]){
                            let data = {
                                imgUrl:item.imgUrl,
                                name:item.resData.name + index + '.png'
                            }
                            img.push(data)
                            index ++
                        }
                    }
                }
                this.downImg(img)
                // a.setAttribute('href', URL.createObjectURL(blob));
                // a.setAttribute('download', `collection.png`);
                // a.click();
                
            })
        },

        //打开图片详情
        designDetail(design:any,index:number,collectionList:any,type:string){
            let designDetail:any = this.$refs.designDetail
            let data = {
                design : design,
                index:index,
                collectionList:collectionList,
                type:type
            }
            designDetail.showDesignDetailModal(data)
        },

        //完成单个图片设计
        finishRedesign(event:any){
            let {design, index, type} = event
            if(type === 'dislike'){
                this.store.commit('setSingleDesignCollectionList',{index:index,design:design})
            }else{
                this.store.commit('setSingleLikeDesignCollectionList',{index:index,design:design})
            }
        },

        //选择模特
        selectModels(){
            let modelsModal:any = this.$refs.modelsModal
            modelsModal.init()
        },

        //确定选择模特
        sureSelectModel(event:any){
            this.store.commit('setTemplateData',event)
        },

        //通过url 转为blob格式的数据
        getImgArrayBuffer(url:any) {
            return new Promise((resolve, reject) => {
                //通过请求获取文件blob格式
                let xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", url, true);
                xmlhttp.responseType = "blob";
                xmlhttp.onload = function () {
                if (this.status == 200) {
                    resolve(this.response);
                } else {
                    reject(this.status);
                }
                };
                xmlhttp.send();
            });
        },
        // imgDataUrl 数据的url数组
        downImg(imagesParams:any) {
            let _this:any = this;
            let zip = new JSZip();
            let cache:any = {};
            let promises = [];

            for (let item of imagesParams) {
                const promise = _this.getImgArrayBuffer(item.imgUrl).then((data:any) => {
                // 下载文件, 并存成ArrayBuffer对象(blob)
                zip.file(item.name, data, { binary: true }); // 逐个添加文件
                cache[item.title] = data;
                });
                promises.push(promise);
            }

            Promise.all(promises)
                .then(() => {
                zip.generateAsync({ type: "blob" }).then((content:any) => {
                    // 生成二进制流
                    FileSaver.saveAs(
                    content,
                    'DesignFiles'
                    ); // 利用file-saver保存文件  自定义文件名
                    this.isShowMark = false
                });
                })
                .catch((res) => {
                    _this.message.error("Failed to export the file");
                    this.isShowMark = false
                });
        },
    },
});
</script>
<style lang="less" scoped>
.home_page {
    width: 100%;
    height: 100%;

    .page_content {
        position: relative;

        .page_content_body {
            position: absolute;
            width: 100%;
            height: 100%;
            padding-bottom: 2.1rem;
            box-sizing: border-box;

            .home_page_body {
                width: 100%;
                height: calc(100% - 7rem);
                display: flex;
                padding-left: 0.7rem;
                box-sizing: border-box;

                .home_page_left {
                    width: 44.4rem;
                    height: 100%;
                    padding: 2.3rem 0.7rem 1.7rem 1.3rem;
                    background: rgba(255, 255, 255, 0.2);

                    .home_page_left_content {
                        height: 100%;

                        .home_left_null {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            text-align: center;
                            width: 100%;
                            height: 100%;
                            position: relative;
                            background: #f7f8fa;
                            border: 1px solid #f2f2f9;
                            border-radius: 10px;
                            overflow: hidden;

                            .home_null_icon {
                                display: block;
                                width: 32.3rem;
                            }

                            .new_collection_button {
                                padding: 0 1.5rem;
                                height: 4rem;
                                line-height: 4rem;
                                background: #e0e0f6;
                                font-size: 1.3rem;
                                color: #343579;
                                margin: 1.2rem auto 0;
                                text-align: center;
                                cursor: pointer;
                                display: inline-block;
                            }

                            .is_finish_loading{
                                width: 100%;
                                height: 100%;
                                position: absolute;
                                left: 0;
                                top:0;
                                background: #ffffff;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                        }

                        .home_left_info {
                            height: 100%;

                            .left_info_top {
                                padding: 0 0 1.3rem 2rem;
                                display: flex;

                                .button_margin {
                                    margin-left: 2rem;
                                }
                            }

                            .left_info_content {
                                width: 100%;
                                height: calc(100% - 6.9rem);
                                overflow-y: auto;
                                background: #ffffff;

                                .left_info_content_body {
                                    width: 100%;
                                }
                            }
                        }
                    }
                }

                .home_page_right {
                    width: calc(100% - 44.4rem);
                    height: 100%;

                    .right_top {
                        padding: 2rem 3.2rem 2rem 1.2rem;
                        display: flex;
                        justify-content: space-between;
                        box-shadow: 0rem 0.2rem 8rem 0rem
                            rgba(238, 238, 244, 0.25);
                        background: rgba(255, 255, 255, 0.4);

                        .right_top_left {
                            display: flex;
                            align-items: center;

                            .button_margin_14 {
                                margin-left: 1.4rem;
                            }
                            .system_scale {
                                margin-left: 7rem;
                                width: 12rem;
                                position: relative;

                                .system_scale_title {
                                    font-size: 13px;
                                    font-weight: 400;
                                    color: #030303;
                                }
                                .system_silder {
                                    margin-top: 0.5rem;
                                    display: flex;
                                    align-items: center;
                                    position: absolute;

                                    .system_silder_value {
                                        font-size: 1.3rem;
                                        color: #030303;
                                        margin-left: 0.9rem;
                                    }
                                }

                                .sacle_left_tip{
                                    position: absolute;
                                    left: -2rem;
                                    bottom: -3.8rem;
                                    font-size: 1.4rem;
                                    line-height: 1.4rem;
                                    color: #030303;
                                }
                                .sacle_right_tip{
                                    position: absolute;
                                    right: -2rem;
                                    bottom: -3.8rem;
                                    font-size: 1.4rem;
                                    line-height: 1.4rem;
                                    color: #030303;
                                }
                            }

                            .switch_component_block {
                                width: 14rem;
                                height: 4rem;
                                background: #343579;
                                border: 1px solid #141533;
                                padding: 0.4rem 0.6rem;
                                margin-left: 7rem;
                                box-sizing: border-box;
                                display: flex;
                                position: relative;
                                cursor: pointer;

                                .switch_item {
                                    width: 50%;
                                    height: 100%;
                                    line-height: 3rem;
                                    font-size: 1.2rem;
                                    text-align: center;
                                    color: #ffffff;
                                }

                                .switch_white_button {
                                    position: absolute;
                                    width: calc(50% - 0.6rem);
                                    height: 3rem;
                                    left: 0.6rem;
                                    top: 0.4rem;
                                    background: #ffffff;
                                    transition-duration: 0.5s;
                                    line-height: 3rem;
                                    font-size: 1.2rem;
                                    text-align: center;
                                    color: #030303;

                                    &.switch_open_button {
                                        left: 50%;
                                    }
                                }
                            }

                            .select_block {
                                margin-left: 2rem;

                                .icon-xiala{
                                    color: #1A1A1A !important;
                                }
                            }
                        }

                        .right_top_right {
                            display: flex;
                            align-items: center;

                            .content_header_button{
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                height: 4rem;
                                border: 1px solid #000000;
                                padding: 0 1.2rem 0 0.8rem;
                                font-size: 1.3rem;
                                color: #1A1A1A;
                                cursor: pointer;

                                .content_header_button_des{
                                    margin-right: 1rem;
                                    font-weight: bold;
                                }
                                .icon-xiala{
                                    transform: rotate(-90deg);
                                    color: #1A1A1A;
                                }
                            }
                        }
                    }

                    .right_content_block{
                        height: calc(100% - 8.584rem);

                        .right_content_header{
                            display: flex;
                            justify-content: space-between;
                            height: 5.5rem;
                            align-items: center;
                            padding: 0 3.2rem 0 1.9rem;
                            background:rgba(255,255,255,0.2);

                            .content_header_left{
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                
                                .icon-dangqianweizhi{
                                    font-size: 1.6rem;
                                    color: #000;
                                }
                                .content_header_des{
                                    font-size: 1.6rem;
                                    color: #000000;
                                    margin-left: 1rem;
                                }

                            }

                            

                        }

                        .right_content_body{
                            padding: 0 1.8rem 0 1.2rem;
                            background:rgba(255,255,255,0.2);
                            height: calc(50% - 5.5rem);

                            .right_content_img_block{
                                padding: 0.6rem 2.8rem 0.6rem 0.9rem;
                                overflow-y: auto;
                                background: #F6F6FA;
                                border-radius: 1rem;
                                height: 100%;

                                .content_img_block{
                                    width: 20.1rem;
                                    height: 29.5rem;
                                    margin-right: 3rem;
                                    margin-bottom: 1rem;
                                    display: inline-block;
                                    position: relative;
                                    vertical-align: top;

                                    &:hover .icon_like{
                                        display: block;
                                    }

                                    &:nth-child(4n){
                                        margin-right: 0;
                                    }

                                    .content_img_flex{
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        width: 100%;
                                        height: 100%;
                                    }

                                    .content_img{
                                        max-width: 100%;
                                        max-height: 100%;
                                    }

                                    .icon_like{
                                        font-size: 2.4rem;
                                        top: 1rem;
                                        right: 1rem;
                                        position: absolute;
                                        cursor: pointer;
                                        display: none;
                                    }
                                    .icon-jushoucang{
                                        color: #000;
                                    }
                                    .icon-jushoucanggift{
                                        color: rgba(52, 53, 121, 1);
                                    }
                                }
                            }
                        }
                    }

                    
                }
            }
        }

        .page_content_bg {
            position: absolute;
            width: 100%;
            height: 100%;
        }
    }

    .progress_mark{
        background: #ffffff;
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;

        .mark_content{
            text-align: center;
        }
    }
}
</style>
