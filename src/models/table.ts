export interface ReusableColumn {
    header: string;
    key: string;
    style?: React.CSSProperties;
    className?: string;
    hidden?: boolean;
    cellRenderer?: (a: any) => React.ReactElement | string | number | null | undefined | boolean;
}
