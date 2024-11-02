import {useQuery} from "@apollo/client";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {PagedResult} from "../models/common/common";

interface DataPagedHook {
    loading: boolean;
    error: any;
    dataPaged: PagedResult<any>;
    currentPage: number;
    setPageNumber: Dispatch<SetStateAction<number>>;
}

export const useDataPagedHook = (url: any, pageNumber: number, perPage: number, key: string, id?: string): DataPagedHook => {
    const dispatch = useDispatch<AppDispatch>()
    const itemsPerPage = useSelector((state: RootState | any) => state[key].itemsPerPage)
    const [dataPaged, setData] = useState<PagedResult<any>>({items: [], totalPages: 0, itemsPerPage: itemsPerPage});
    const [currentPage, setPageNumber] = useState<number>(pageNumber)

    const {loading, error, data} = useQuery(url, {
        variables: {
            id: id,
            page: currentPage - 1,
            perPage: perPage,
            hint: "",
            byEmail: false,
            sort: "ASC"
        },
    });

    useEffect(() => {
        if (data) {
            const tempData = data[key].items;
            if (tempData?.length > 0) {
                const temp = {items: tempData, totalPages: +data[key].totalPages, itemsPerPage: itemsPerPage}
                setData(temp)
                dispatch({type: `${key.toLowerCase()}/set${key}Paged`, payload: tempData})
            }
        }

    }, [dispatch, data, key, itemsPerPage])

    return {loading, error, dataPaged, currentPage, setPageNumber};
}