import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type ThemeType = 'dark' | 'light' | 'blue';

interface AppState {
    theme: ThemeType;
    isDarkTheme: boolean;
    toaster: {
        showToaster: boolean;
        toasterMessage: string;
    };
    githubProfile: any;
    workPhotos: string[];

}

const initialState: AppState = {
    theme: 'dark',
    isDarkTheme: true,
    toaster: {
        showToaster: false,
        toasterMessage: '',
    },
    githubProfile: null,
    workPhotos: []
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setTheme: (state: AppState, action: PayloadAction<ThemeType>) => {
            state.theme = action.payload;
            state.isDarkTheme = action.payload !== 'light';
        },
        setShowToaster: (state: AppState, action: PayloadAction<boolean>) => {
            state.toaster.showToaster = action.payload;
        },
        setToasterMessage: (state: AppState, action: PayloadAction<string>) => {
            state.toaster.toasterMessage = action.payload;
        },
        setGithubProfile(state: AppState, action: PayloadAction<any[]>) {
            state.githubProfile = action.payload
            console.log('Set github profile:', action.payload)
        },
        setWorkPhotos(state: AppState, action: PayloadAction<any[]>) {
            state.workPhotos = action.payload
            console.log('Set workPhotos:', action.payload)
        }
    },
});

export const {setTheme, setShowToaster, setToasterMessage, setGithubProfile, setWorkPhotos} = appSlice.actions;
export default appSlice.reducer;