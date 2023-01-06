import {Module} from 'vuex'
import {RootState} from '../index'

interface DesignDetail{
    designCollectionList:any,
    likeDesignCollectionList:any,
    userGroupId:any,
    designCollectionId:any,
    templateId:any,
    templateImgUrl:any,
    designId:any,
    
}

const HomeStoreModule : Module<DesignDetail,RootState> = {
    state:{
        designCollectionList:[],
        likeDesignCollectionList:[],
        userGroupId:'',
        designCollectionId:'',
        templateId:'',
        templateImgUrl:'',
        designId:'',
        
    },
    mutations:{
        setDesignCollectionList(state,data){
            state.designCollectionList = data
        },
        setLikeDesignCollectionList(state,data){
            state.likeDesignCollectionList = data
        },
        setSingleDesignCollectionList(state,data){
            state.designCollectionList[data.index] = data.design
        },
        setSingleLikeDesignCollectionList(state,data){
            state.likeDesignCollectionList[data.index] = data.design
        },
        addDesignCollectionList(state,data){
            state.designCollectionList.push(data)
        },
        addLikeDesignCollectionList(state,data){
            state.likeDesignCollectionList.push(data)
        },
        deleteDesignCollectionList(state,index){
            state.designCollectionList.splice(index,1)
        },
        deleteLikeDesignCollectionList(state,index){
            state.likeDesignCollectionList.splice(index,1)
        },
        setUserGroupId(state,data){
            state.userGroupId = data
        },
        deleteUserGroupId(state){
            state.userGroupId = ''
        },
        setDesignCollectionId(state,data){
            state.designCollectionId = data
        },
        deleteDesignCollectionId(state,data){
            state.designCollectionId = ''
        },
        setDesignId(state,data){
            state.designId = data
        },
        deleteDesignId(state){
            state.designId = ''
        },
        clearAllCollection(state){
            state.designCollectionList=[]
            state.likeDesignCollectionList = []
            state.designCollectionId = ''
        },
        setTemplateData(state,data){
            state.templateId=data.id
            state.templateImgUrl = data.url
        },
        clearTemplateData(state){
            state.templateId= ''
            state.templateImgUrl = ''
        },

       

        
    },
    actions:{

    }
}

export default HomeStoreModule