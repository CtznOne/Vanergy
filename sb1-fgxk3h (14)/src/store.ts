import { create } from 'zustand';
import { Panel, String, MPPT, Appliance, Location, Inverter } from './types';

interface State {
  roofWidth: number;
  roofHeight: number;
  mountMargin: number;
  panels: Panel[];
  selectedPanels: string[];
  strings: String[];
  mpptAssignments: Record<string, string>;
  placedMPPTs: MPPT[];
  appliances: Appliance[];
  location: Location | null;
  placedInverter: Inverter | null;
  setRoofDimensions: (width: number, height: number) => void;
  setMountMargin: (margin: number) => void;
  addPanel: (panel: Panel) => void;
  updatePanel: (id: string, updates: Partial<Panel>) => void;
  removePanel: (id: string) => void;
  togglePanelSelection: (id: string) => void;
  createString: (type: 'series' | 'parallel', recommendedMppt?: string, name?: string) => void;
  deleteString: (stringId: string) => void;
  assignMPPT: (stringId: string, mpptId: string) => void;
  addPlacedMPPT: (mppt: MPPT) => void;
  removePlacedMPPT: (mpptId: string) => void;
  addAppliance: (appliance: Appliance) => void;
  removeAppliance: (id: string) => void;
  setLocation: (location: Location) => void;
  setPlacedInverter: (inverter: Inverter | null) => void;
}

export const useStore = create<State>((set) => ({
  roofWidth: 200,
  roofHeight: 300,
  mountMargin: 5,
  panels: [],
  selectedPanels: [],
  strings: [],
  mpptAssignments: {},
  placedMPPTs: [],
  appliances: [],
  location: null,
  placedInverter: null,
  
  setRoofDimensions: (width, height) => set({ roofWidth: width, roofHeight: height }),
  
  setMountMargin: (margin) => set({ mountMargin: margin }),
  
  addPanel: (panel) => set((state) => ({
    panels: [...state.panels, panel]
  })),
  
  updatePanel: (id, updates) => set((state) => ({
    panels: state.panels.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    )
  })),
  
  removePanel: (id) => set((state) => ({
    panels: state.panels.filter((p) => p.id !== id),
    selectedPanels: state.selectedPanels.filter((pid) => pid !== id),
    strings: state.strings.map((s) => ({
      ...s,
      panels: s.panels.filter((p) => p.id !== id)
    })).filter((s) => s.panels.length >= 2)
  })),
  
  togglePanelSelection: (id) => set((state) => ({
    selectedPanels: state.selectedPanels.includes(id)
      ? state.selectedPanels.filter((pid) => pid !== id)
      : [...state.selectedPanels, id]
  })),
  
  createString: (type, recommendedMppt, name) => set((state) => {
    const selectedPanelObjects = state.panels.filter((p) =>
      state.selectedPanels.includes(p.id)
    );
    
    if (selectedPanelObjects.length < 2) return state;
    
    const stringId = crypto.randomUUID();
    
    return {
      strings: [
        ...state.strings,
        {
          id: stringId,
          name: name || `String ${stringId.slice(0, 5)}`,
          panels: selectedPanelObjects,
          type
        }
      ],
      selectedPanels: [],
      mpptAssignments: recommendedMppt
        ? { ...state.mpptAssignments, [stringId]: recommendedMppt }
        : state.mpptAssignments
    };
  }),

  deleteString: (stringId) => set((state) => ({
    strings: state.strings.filter((s) => s.id !== stringId),
    mpptAssignments: Object.fromEntries(
      Object.entries(state.mpptAssignments).filter(([id]) => id !== stringId)
    )
  })),

  assignMPPT: (stringId, mpptId) => set((state) => ({
    mpptAssignments: {
      ...state.mpptAssignments,
      [stringId]: mpptId
    }
  })),

  addPlacedMPPT: (mppt) => set((state) => ({
    placedMPPTs: [...state.placedMPPTs, mppt]
  })),

  removePlacedMPPT: (mpptId) => set((state) => ({
    placedMPPTs: state.placedMPPTs.filter((m) => m.id !== mpptId)
  })),

  addAppliance: (appliance) => set((state) => ({
    appliances: [...state.appliances, appliance]
  })),

  removeAppliance: (id) => set((state) => ({
    appliances: state.appliances.filter((a) => a.id !== id)
  })),

  setLocation: (location) => set({ location }),

  setPlacedInverter: (inverter) => set({ placedInverter: inverter })
}));