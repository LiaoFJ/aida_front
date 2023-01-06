<template>
     <div class="history_page">
        <div class="page_content">
            <img
                class="page_content_bg"
                src="@/assets/images/homePage/bg.png"
            />
            <div class="page_content_body">
                <HeaderComponent></HeaderComponent>
                <div class="history_page_body">
                    <div class="history_header">History</div>
                    <div class="history_table_search">
                        <a-range-picker class="range_picker" v-model:value="rangePickerValue" :placeholder="['Start Date', 'End Date']" valueFormat="YYYY-MM-DD">
                            <template #suffixIcon>
                                <span class="icon iconfont range_picker_icon icon-rili"></span>
                            </template>
                        </a-range-picker>
                        <div class="content_search_block">
                            <input class="search_input" placeholder="Search by collection name" v-model="searchCollectionName"  @keydown.enter="searchHistoryList()">
                            <div class="search_icon_block" @click="searchHistoryList()"><span class="icon iconfont icon-sousuo"></span></div>
                        </div>
                    </div>

                    <div class="history_table_content" ref="historyTable">
                         <a-table :columns="columns" :data-source="collectionList" :scroll="{ y: historyTableHeight }" @change="changePage"
                         :pagination="{
                            showSizeChanger:true,
                            current: currentPage,
                            pageSize:pageSize,
                            total: total,
                            showQuickJumper:true,
                            bordered:false
                         }">
                             <template v-slot:action="{record, index}" >
                                <div class="operate_list">
                                    <div class="operate_item" @click="turnToDetail(record)">Detail</div>
                                    <div class="operate_item" @click="renameCollection(record,index)">Rename</div>
                                    <div class="operate_item" @click="retrieveHome(record)">Retrieve</div>
                                    <div class="operate_item" @click="deleteGroup(record, index)">Delete</div>
                                </div>
                            </template>
                        </a-table>
                    </div>
                </div>
            </div>
        </div>
        <HistoryDetail ref="historyDetail" :groupDetails="groupDetails" :collectionName="collectionName"></HistoryDetail>

        <a-modal class="rename_modal_component" 
            v-model:visible="renameVisivle" 
            :footer="null" 
            :title="renameData?.name"
            width="56rem"
            :maskClosable="false"
            :centered="true"
        >
            <div class="collection_rename_content">
                <div class="rename_form_content">
                    <input class="rename_form_input" placeholder="Enter a new name" v-model="newCollectionName" @keydown.enter="confrimRename()">
                </div>
                <div class="rename_submit_button"  @click="confrimRename()">Submit</div>
            </div>
        </a-modal>
    </div>
</template>
<script lang="ts">
import { defineComponent,ref,createVNode} from 'vue'
import HeaderComponent from "@/component/HomePage/Header.vue";
import HistoryDetail from "@/component/Detail/HistoryDetail.vue";
import { Https } from "@/tool/https";
import { formatTime } from "@/tool/util"
import { Modal,message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
export default defineComponent({
    components: {
        HeaderComponent,
        HistoryDetail,
    },
    setup() {
        let rangePickerValue:any = ref([])
        let renameData:any = ref({}) //修改名字选中的数据
        const columns:any = ref([
            { title: 'Collections Name', align:'center', ellipsis: true, width: 150, dataIndex: 'name', key: 'collectionName' },
            { title: 'Uptate Time', align:'center', ellipsis: true,width: 150, dataIndex: 'updateDate', key: 'updateTime',customRender:(record:any)=>{
                let time = formatTime(record.text / 1000, 'YYYY-MM-DD hh:mm:ss')
                return time
            }},
            { title: 'Sketch Counts', align:'center', ellipsis: true, width: 150, dataIndex: 'sketchCount', key: 'sketchCounts' },
            {
                title: 'Operations',
                key: 'operation',
                align:'center', 
                fixed: 'right',
                width: 150, 
                slots:{customRender:'action'}
            },
        ]);
        let collectionList:any = ref([])
        return {
            rangePickerValue,
            columns,
            collectionList,
            renameData,
        }
    },
    data(){
        return{
            currentPage:1,
            pageSize:10,
            total:0,
            historyTableHeight:0,
            newCollectionName:'',
            renameVisivle:false,//修改名字弹窗
            groupDetails:{},//每个collection的详情
            collectionName:'',//选中的名字
            searchCollectionName:'',
        }
    },
    mounted(){
        let historyTable:any = this.$refs.historyTable
        this.historyTableHeight = historyTable.clientHeight - 130
        this.getHistoryList()
    },
    methods:{
        turnToDetail(record:any){
            this.groupDetails = record.groupDetails
            let historyDetail:any = this.$refs.historyDetail
            this.collectionName = record.name
            historyDetail.changeDetailShow()
        },


        //改变页码
        changePage(e:any){
            this.currentPage = e.current
            this.pageSize = e.pageSize
            this.getHistoryList()
        },

        //查询列表
        searchHistoryList(){
             this.currentPage = 1
             this.getHistoryList()
        },

        getHistoryList(){
            let startDate:any = this.rangePickerValue ? new Date(this.rangePickerValue[0]).getTime(): ''
            let endDate:any = this.rangePickerValue ? new Date(this.rangePickerValue[1]).getTime(): ''
            let data = {
                page:this.currentPage,
                size:this.pageSize,
                collectionName:this.searchCollectionName,
                startDate:startDate,
                endDate:endDate
            }
            Https.axiosPost( Https.httpUrls.queryUserGroup, data).then(
                (rv: any) => {
                    this.collectionList = rv.content
                    this.total = rv.total
                }
            );
        },

        //删除分组
        deleteGroup(record:any,index:number){
            let deleteGroupFun = (id:any,index:number) =>{
                let data = {
                    userGroupId:id
                }
                Https.axiosPost(Https.httpUrls.deleteUserGroup,data).then(
                    (rv: any) => {
                        message.success('Deleted successfully')
                        this.collectionList.splice(index,1)
                    }
                );
            }
            Modal.confirm({
                title: 'Do you really want to delete this collection? ',
                icon: createVNode(ExclamationCircleOutlined),
                okText: 'Yes',
                cancelText: 'No',
                onOk() {
                    deleteGroupFun(record.id,index)
                }
            });
        },

        //修改名字
        renameCollection(record:any,index:number){
            this.renameVisivle = true
            this.renameData = {
                ...record,
                index:index
            }
        },

        //确定修改名字
        confrimRename(){
            let data = {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                userGroupId: this.renameData.id,
                userGroupName: this.newCollectionName
            }
            Https.axiosPost(Https.httpUrls.updateUserGroupName,data).then(
                (rv: any) => {
                    message.success('Change successfully')
                    this.collectionList[this.renameData.index].name = this.newCollectionName
                    this.collectionList[this.renameData.index].updateDate = rv.updateDate
                    this.renameVisivle = false
                    this.newCollectionName = ''
                    this.renameData = {}
                }
            );
        },

        retrieveHome(record:any){
            this.$router.push({name:'home',params: {id:record.id}})
        }
    }
})
</script>
<style lang="less">
.history_page {
    width: 100%;
    height: 100%;

    .page_content {
        position: relative;

        .page_content_bg {
            position: absolute;
            width: 100%;
            height: 100%;
        }

        .page_content_body {
            position: absolute;
            width: 100%;
            height: 100%;
            box-sizing: border-box;

            .history_page_body{
                width: 100%;
                height: calc(100% - 7rem);
                padding: 0 2.5rem 4rem;
                box-sizing: border-box;

                .history_header{
                    font-size: 1.8rem;
                    height: 6.3rem;
                    line-height: 6.3rem;
                    font-weight: 500;
                    color: #333333;
                }

                .history_table_search{
                    display: flex;
                    align-items: center;

                    .range_picker{
                        width: 36rem;
                        height: 4.8rem;

                        .ant-picker-input > input{
                            font-size: 1.6rem;
                        }

                        .range_picker_icon{
                            font-size: 2.2rem;
                        }
                    }

                    .content_search_block{
                        margin-left: 4rem;
                        display: flex;

                        .search_input{
                            width: 32.8rem;
                            padding-left: 1.5rem;
                            height: 4.8rem;
                            line-height: 4.6rem;
                            background: #FFFFFF;
                            border: 0.1rem solid #F1F1F1;
                            font-size: 1.6rem;
                            font-weight: 400;

                            &::placeholder {
                                color: #C2C2C2;
                            }
                        }

                        .search_icon_block{
                            width: 7.2rem;
                            height: 4.8rem;
                            line-height: 4.8rem;
                            text-align: center;
                            background: #343579;
                            cursor: pointer;

                            .icon-sousuo{
                                font-size: 2rem;
                                color: #FFFFFF;
                            }
                        }
                    }
                }

                .history_table_content{
                    margin-top: 2.6rem;
                    width: 100%;
                    height: calc(100% - 13.7rem);
                    background: rgba(255, 255, 255, 0.6);
                    padding-bottom: 3rem;

                    .ant-table{
                        background: transparent;
                    }
                    
                    .ant-table-body{
                        overflow-y: auto !important;
                        -ms-overflow-style: none;
                        overflow: -moz-scrollbars-none;

                        &::-webkit-scrollbar { width: 0 !important }

                    }

                    .ant-table-thead > tr > th{
                        background: #FFFFFF;
                    }

                    .ant-table-tbody > tr > td{
                        border: none;
                        background: transparent;

                        
                    }

                     .ant-table-tbody > tr{

                         &:hover > td{
                            background: #FFFFFF;
                        }
                     }

                     .ant-table-pagination-right{
                         padding-right: 3.5rem;
                     }

                    .operate_list{
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 1rem;

                        .operate_item{
                            font-size: 1.4rem;
                            font-family: Roboto;
                            font-weight: 400;
                            color: #343579;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }

    
}

.rename_modal_component{

    .collection_rename_content{
        padding:2rem 9.2rem 3rem;


        .rename_form_content{

            .rename_form_input{
                width: 100%;
                height: 4.6rem;
                margin-top: 1rem;
                border: 0.1rem solid #B4BED7;
                padding-left: 2.1rem;
                line-height: 4.6rem;
                font-size: 1.8rem;
                box-sizing: border-box;

                &::placeholder {
                    color:#A5B0C2,
                }
            }
        }

        .rename_submit_button{
            height: 4.8rem;
            line-height: 4.8rem;
            background: #343579;
            font-size: 2.4rem;
            font-weight: 500;
            color: #FFFFFF;
            width: 16rem;
            text-align: center;
            cursor: pointer;
            margin: 4.5rem auto 0;
        }
    }
}
</style>