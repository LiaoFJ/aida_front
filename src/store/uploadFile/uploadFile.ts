import {Module} from 'vuex'
import {RootState} from '../index'

interface UploadFiles{
    moodboardFiles:any,
    printboardFiles:any,
    generatePrintFiles:any,
    colorBoards:any,
    skecthboardFiles:any,
    marketingSketchFiles:any,
    allBoardData:any, //备份的所有数据，点finish之后备份
    moodTemplateId:any,
}

const UploadFilesModule : Module<UploadFiles,RootState> = {
    state:{
        moodboardFiles:[],
        printboardFiles:[],
        generatePrintFiles:[],
        colorBoards:[],
        skecthboardFiles:[],
        marketingSketchFiles:[],
        allBoardData:{},
        moodTemplateId:'',
    },
    mutations:{
        setMoodboardFile(state,files){
            state.moodboardFiles = files
        },
        setPrintboardFile(state,files){
            state.printboardFiles = files
        },
        setGeneratePrintFile(state,files){
            state.generatePrintFiles = files
        },
        setColorboardList(state,colorBoards){
            state.colorBoards = colorBoards
        },
        setSketchboardFile(state,files){
            state.skecthboardFiles = files
        },
        setMarketingSketchFile(state,files){
            state.marketingSketchFiles = files
        },
        setAllBoardData(state){
            state.allBoardData = {
                moodboardFiles:state.moodboardFiles,
                printboardFiles:state.printboardFiles,
                generatePrintFiles:state.generatePrintFiles,
                colorBoards:state.colorBoards,
                skecthboardFiles:state.skecthboardFiles,
                marketingSketchFiles:state.marketingSketchFiles,
                moodTemplateId:state.moodTemplateId,
            }
        },
        setAllBoardDataChoose(state,data){
            state.allBoardData = data
        },
        clearAllData(state){
            state.moodboardFiles = []
            state.printboardFiles = []
            state.generatePrintFiles=[]
            state.colorBoards = []
            state.skecthboardFiles = []
            state.marketingSketchFiles = []
            state.moodTemplateId = ''
        },
        setMoodTemplateId(state,moodTemplateId){
            state.moodTemplateId = moodTemplateId
        },
        clearMoodTemplateId(state){
            state.moodTemplateId = ''
        },
    },
    actions:{

    }
}

export default UploadFilesModule