import {Module} from 'vuex'
import {RootState} from '../index'

interface DesignDetail{
    designItemDetail:any,
   
}

const DesignDetailModule : Module<DesignDetail,RootState> = {
    state:{
        designItemDetail:{}
    },
    mutations:{
        setDesignItemDetail(state,files){
            state.designItemDetail = files
        },
        setDesignItemColthes(state,data){
            state.designItemDetail.clothes[data.index] = data.clothes
        },
        setDesignItemOthers(state,data){
            state.designItemDetail.others[data.index] = data.others
        },
        
    },
    actions:{

    }
}

export default DesignDetailModule