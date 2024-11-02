import {AppService} from "../../services/AppService";
import {setGithubProfile} from "../reducers/appReducer";

export const fetchGithubUserProfile = () => async (dispatch: any) => {
    console.log('Fetching github user profile');
    const service = new AppService();
    const res = await service.getGithubUserInfo()
    dispatch(setGithubProfile(res))
};