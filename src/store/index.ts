import { createStore } from 'vuex'
import UploadFilesModule from './uploadFile/uploadFile'
import DesignDetailModule from './Detail/designDetail'
import HomeStoreModule  from './homeStore/homeStore'
export interface RootState{

}

export default createStore<RootState>({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    UploadFilesModule,
    DesignDetailModule,
    HomeStoreModule
  }
})
