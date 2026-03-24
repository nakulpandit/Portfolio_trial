import { create } from 'zustand'

const useStore = create((set) => ({
  // Scene state
  currentScene: 'landing', // 'landing' | 'universe' | 'galaxy'
  launched: false,
  
  // Galaxy state
  currentGalaxy: null,
  selectedItem: null,
  
  // Camera  
  cameraTarget: [0, 0, 0],
  cameraPosition: [0, 0, 50],
  isWarping: false,
  
  // UI
  showInfoPanel: false,
  showModal: false,
  modalContent: null,
  hudVisible: true,
  
  // Actions
  launch: () => set({ launched: true, currentScene: 'universe' }),
  
  setScene: (scene) => set({ currentScene: scene }),
  
  enterGalaxy: (galaxyId) => set({ 
    currentGalaxy: galaxyId, 
    currentScene: 'galaxy',
    isWarping: true,
    selectedItem: null,
    showInfoPanel: false,
  }),
  
  exitGalaxy: () => set({ 
    currentGalaxy: null, 
    currentScene: 'universe',
    isWarping: true,
    selectedItem: null,
    showInfoPanel: false,
  }),
  
  selectItem: (item) => set({ 
    selectedItem: item, 
    showInfoPanel: true 
  }),
  
  clearSelection: () => set({ 
    selectedItem: null, 
    showInfoPanel: false 
  }),
  
  openModal: (content) => set({ 
    showModal: true, 
    modalContent: content 
  }),
  
  closeModal: () => set({ 
    showModal: false, 
    modalContent: null 
  }),
  
  setCameraTarget: (target) => set({ cameraTarget: target }),
  setCameraPosition: (pos) => set({ cameraPosition: pos }),
  setWarping: (val) => set({ isWarping: val }),
  setHudVisible: (val) => set({ hudVisible: val }),
}))

export default useStore
